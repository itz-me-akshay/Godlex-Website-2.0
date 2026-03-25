const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");

const MUSIC_IDS = ["music_previous","music_pause","music_skip","music_stop","music_controls_select"];

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {

    // ── Slash / Context Menu ─────────────────────────────────────────────────
    if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return interaction.reply({ content: "❌ Unknown command.", flags: [MessageFlags.Ephemeral] });

      if (command.ownerOnly && interaction.user.id !== client.config.ownerID) {
        const c = new ContainerBuilder();
        c.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ This command is restricted to the bot owner."));
        return interaction.reply({ components: [c], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] });
      }

      const cdKey = `${interaction.user.id}:${interaction.commandName}`;
      if (client.cooldowns.has(cdKey)) {
        return interaction.reply({ content: "⏱️ Please wait before using this command again.", flags: [MessageFlags.Ephemeral] });
      }
      client.cooldowns.set(cdKey, Date.now());
      setTimeout(() => client.cooldowns.delete(cdKey), (command.cooldown ?? 3) * 1000);

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(`[Command] ${interaction.commandName}:`, err);
        const payload = { content: "❌ An error occurred.", flags: [MessageFlags.Ephemeral] };
        if (interaction.replied || interaction.deferred) interaction.followUp(payload).catch(() => {});
        else interaction.reply(payload).catch(() => {});
      }
      return;
    }

    // ── Music buttons / select ───────────────────────────────────────────────
    if ((interaction.isButton() || interaction.isStringSelectMenu()) && MUSIC_IDS.includes(interaction.customId)) {
      if (!interaction.member?.voice?.channel)
        return interaction.reply({ content: "❌ Join a voice channel first.", flags: [MessageFlags.Ephemeral] });
      const player = client.lavalink.getPlayer(interaction.guild.id);
      if (!player) return interaction.reply({ content: "❌ Nothing is playing.", flags: [MessageFlags.Ephemeral] });
      if (interaction.member.voice.channelId !== player.voiceChannelId)
        return interaction.reply({ content: "❌ You must be in the same channel as the bot.", flags: [MessageFlags.Ephemeral] });

      await interaction.deferReply({ ephemeral: true });

      if (interaction.isButton()) {
        let resp = "";
        switch (interaction.customId) {
          case "music_previous":
            const prev = await player.queue.shiftPrevious();
            if (prev) { await player.play({ clientTrack: prev }); resp = "⏮️ Playing previous track."; }
            else resp = "❌ No previous track.";
            break;
          case "music_pause":
            if (player.paused) { await player.resume(); resp = "▶️ Resumed."; }
            else { await player.pause(); resp = "⏸️ Paused."; }
            break;
          case "music_skip":
            const t = player.queue.current?.info?.title ?? "Unknown";
            await player.skip(); resp = `⏭️ Skipped: **${t}**`; break;
          case "music_stop":
            await player.destroy(); resp = "⏹️ Stopped."; break;
        }
        return interaction.editReply({ content: resp });
      }

      if (interaction.isStringSelectMenu()) {
        const val = interaction.values[0]; let resp = "";
        switch (val) {
          case "shuffle":    player.queue.shuffle(); resp = `🔀 Shuffled ${player.queue.tracks.length} tracks.`; break;
          case "loop_off":   await player.setRepeatMode("off");   resp = "🔁 Loop off."; break;
          case "loop_track": await player.setRepeatMode("track"); resp = "🔂 Looping track."; break;
          case "loop_queue": await player.setRepeatMode("queue"); resp = "🔁 Looping queue."; break;
          case "volume_down": { const v=Math.max(0,(player.volume??100)-20); await player.setVolume(v); resp=`🔉 Volume → ${v}%`; break; }
          case "volume_up":   { const v=Math.min(100,(player.volume??100)+20); await player.setVolume(v); resp=`🔊 Volume → ${v}%`; break; }
          default: resp = "❌ Unknown option.";
        }
        return interaction.editReply({ content: resp });
      }
    }

    // ── Regular buttons ──────────────────────────────────────────────────────
    if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      try { await button.execute(interaction, client); }
      catch (err) { console.error(`[Button] ${interaction.customId}:`, err); }
      return;
    }

    // ── Select menus ─────────────────────────────────────────────────────────
    if (interaction.isAnySelectMenu()) {
      const select = client.selects.get(interaction.customId);
      if (!select) return;
      try { await select.execute(interaction, client); }
      catch (err) { console.error(`[Select] ${interaction.customId}:`, err); }
      return;
    }

    // ── Modals ───────────────────────────────────────────────────────────────
    if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId);
      if (!modal) return;
      try { await modal.execute(interaction, client); }
      catch (err) { console.error(`[Modal] ${interaction.customId}:`, err); }
      return;
    }
  },
};
