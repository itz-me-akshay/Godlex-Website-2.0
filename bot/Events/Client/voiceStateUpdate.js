const {
  ChannelType, PermissionsBitField,
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  MessageFlags, SeparatorSpacingSize,
} = require("discord.js");
const db = require("../../Database/db");

const aloneTimeouts = new Map();

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    const guild   = newState.guild;
    const guildId = guild.id;

    // ── Music alone-timeout ──────────────────────────────────────────────────
    const player = client.lavalink.getPlayer(guildId);
    if (player) {
      if (newState.id === client.user.id) {
        if (oldState.channelId && !newState.channelId) {
          clearTimeout(aloneTimeouts.get(guildId));
          aloneTimeouts.delete(guildId);
          await player.destroy().catch(() => {});
        }
      } else {
        const botCh = guild.members.me?.voice?.channel;
        if (botCh) {
          const humans = botCh.members.filter(m => !m.user.bot).size;
          if (humans === 0 && !aloneTimeouts.has(guildId)) {
            const t = setTimeout(async () => {
              const p = client.lavalink.getPlayer(guildId);
              if (p) {
                client.channels.cache.get(p.textChannelId)
                  ?.send("👋 Left — no one in the channel.").catch(() => {});
                await p.destroy().catch(() => {});
              }
              aloneTimeouts.delete(guildId);
            }, 2 * 60_000);
            aloneTimeouts.set(guildId, t);
          } else if (humans > 0) {
            clearTimeout(aloneTimeouts.get(guildId));
            aloneTimeouts.delete(guildId);
          }
        }
      }
    }

    // ── TempVC: create on trigger join ───────────────────────────────────────
    const cfg = db.tempvcSetup.get(guildId);
    if (cfg && newState.channelId === cfg.triggerChannelId && newState.member) {
      const member = newState.member;
      const name   = (cfg.nameTemplate || "{user}'s Channel")
        .replace("{user}", member.displayName);

      try {
        const vc = await guild.channels.create({
          name,
          type:   ChannelType.GuildVoice,
          parent: cfg.categoryId ?? null,
          permissionOverwrites: [
            { id: guild.id, allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel] },
            {
              id: member.id,
              allow: [
                PermissionsBitField.Flags.Connect,
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.ManageChannels,
                PermissionsBitField.Flags.MuteMembers,
                PermissionsBitField.Flags.DeafenMembers,
                PermissionsBitField.Flags.MoveMembers,
              ],
            },
          ],
        });

        await member.voice.setChannel(vc).catch(() => {});

        db.tempvcChannels.set(vc.id, { guildId, ownerId: member.id, createdAt: Date.now() });

        // Send control panel to the VC text area
        await sendControlPanel(vc, member.id);

      } catch (err) {
        console.error("[TempVC] Create error:", err.message);
      }
    }

    // ── TempVC: auto-delete when empty ───────────────────────────────────────
    if (oldState.channelId) {
      const data = db.tempvcChannels.get(oldState.channelId);
      if (data) {
        const ch = guild.channels.cache.get(oldState.channelId);
        if (ch && ch.members.size === 0) {
          db.tempvcChannels.delete(oldState.channelId);
          await ch.delete("TempVC empty").catch(() => {});
        }
      }
    }
  },
};

async function sendControlPanel(vc, ownerId) {
  const container = new ContainerBuilder();
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent("# 🎙️ Voice Channel Controls")
  );
  container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `> You own this channel — only you can use these buttons.\n`+
      `> Channel auto-deletes when empty.`
    )
  );
  container.addSeparatorComponents(new SeparatorBuilder());
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `🔒 **Lock** — prevent others from joining\n`+
      `🔓 **Unlock** — allow everyone to join\n`+
      `✏️ **Rename** — change the channel name\n`+
      `👥 **Limit** — set a user limit\n`+
      `👢 **Kick** — remove someone from the channel\n`+
      `🔑 **Transfer** — give ownership to someone else\n`+
      `👁️ **Hide** — make channel invisible to others\n`+
      `🗑️ **Delete** — delete this channel now`
    )
  );

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("tvc_lock").setLabel("🔒 Lock").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("tvc_unlock").setLabel("🔓 Unlock").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("tvc_rename").setLabel("✏️ Rename").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("tvc_limit").setLabel("👥 Limit").setStyle(ButtonStyle.Primary),
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("tvc_kick").setLabel("👢 Kick").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("tvc_transfer").setLabel("🔑 Transfer").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("tvc_hide").setLabel("👁️ Hide").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("tvc_delete").setLabel("🗑️ Delete").setStyle(ButtonStyle.Danger),
  );

  await vc.send({
    content: `<@${ownerId}>`,
    components: [container, row1, row2],
    flags: MessageFlags.IsComponentsV2,
  }).catch(() => {});
}
