const {
  SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder,
  SeparatorBuilder, ActionRowBuilder, StringSelectMenuBuilder,
  ComponentType, MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDMPermission(false)
    .setDescription("Search for tracks and pick one to play.")
    .addStringOption(o => o.setName("query").setDescription("Song name to search").setRequired(true)),

  async execute(interaction, client) {
    await interaction.deferReply({ flags: MessageFlags.IsComponentsV2 });

    const vc = interaction.member.voice?.channel;
    if (!vc) {
      const c = new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ Join a voice channel first."));
      return interaction.editReply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }

    const query  = interaction.options.getString("query");
    const tmpPlayer = client.lavalink.getPlayer(interaction.guild.id) ??
      await client.lavalink.createPlayer({
        guildId: interaction.guild.id, voiceChannelId: vc.id,
        textChannelId: interaction.channel.id, selfDeaf: true,
      });

    const result = await tmpPlayer.search({ query, source: "ytsearch" }, interaction.user);
    if (!result?.tracks?.length) {
      const c = new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ No results found."));
      return interaction.editReply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }

    const top5 = result.tracks.slice(0, 5);

    function formatMS(ms) {
      if (!ms) return "0:00";
      const s = Math.floor(ms / 1000), m = Math.floor(s / 60), sec = s % 60;
      return `${m}:${String(sec).padStart(2,"0")}`;
    }

    const listText = top5.map((t, i) =>
      `**${i + 1}.** ${t.info.title} — by ${t.info.author} [\`${formatMS(t.info.duration)}\`]`
    ).join("\n");

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🔍 Search Results`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(listText));

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("search_pick")
        .setPlaceholder("Pick a track to play…")
        .addOptions(top5.map((t, i) => ({
          label: t.info.title.slice(0, 100),
          description: `by ${t.info.author.slice(0, 50)}`,
          value: String(i),
        })))
    );

    const reply = await interaction.editReply({
      components: [c, selectRow],
      flags: MessageFlags.IsComponentsV2,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) => i.user.id === interaction.user.id && i.customId === "search_pick",
      time: 30_000,
      max: 1,
    });

    collector.on("collect", async (i) => {
      const track = top5[parseInt(i.values[0])];
      await i.deferUpdate();

      let player = client.lavalink.getPlayer(interaction.guild.id);
      if (!player) {
        player = await client.lavalink.createPlayer({
          guildId: interaction.guild.id, voiceChannelId: vc.id,
          textChannelId: interaction.channel.id, selfDeaf: true,
        });
      }
      if (!player.connected) await player.connect();

      await player.queue.add(track);

      const done = new ContainerBuilder();
      done.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `✅ Added **${track.info.title}** to the queue.`
        )
      );
      await interaction.editReply({ components: [done], flags: MessageFlags.IsComponentsV2 });
      if (!player.playing && !player.paused) await player.play();
    });

    collector.on("end", (collected) => {
      if (!collected.size) {
        const expired = new ContainerBuilder();
        expired.addTextDisplayComponents(new TextDisplayBuilder().setContent("⏱️ Search timed out."));
        interaction.editReply({ components: [expired], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }
    });
  },
};
