const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, MessageFlags, SeparatorSpacingSize } = require("discord.js");

const CATEGORIES = {
  "🎵 Music":       ["/play","/search","/skip","/pause","/resume","/stop","/disconnect","/volume","/loop","/shuffle","/queue","/nowplaying"],
  "🛡️ Moderation":  ["/ban","/kick","/warn add/list/clear","/timeout","/untimeout","/unban","/purge","/slowmode","/nick","/role add/remove"],
  "ℹ️ Information":  ["/botinfo","/serverinfo","/userinfo","/help"],
  "🔧 Utility":     ["/afk set/remove","/snipe","/avatar","/ping","/poll setup/disable","/reminder"],
  "🎮 Fun":         ["/8ball","/coinflip","/joke","/roll","/reverse"],
  "⚙️ Setup":       ["/setup-ticket","/setup-welcome","/setup-leave","/setup-logging","/setup-autorole"],
  "🎙️ Temp VC":     ["/tempvoice set","/tempvoice remove"],
};

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Browse all bot commands by category."),
  async execute(interaction) {
    const overview = new ContainerBuilder();
    overview.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 📖 Help Menu\nSelect a category below to view its commands.`));
    overview.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    overview.addTextDisplayComponents(new TextDisplayBuilder().setContent(Object.keys(CATEGORIES).join("  •  ")));

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder().setCustomId("help_category").setPlaceholder("Pick a category…")
        .addOptions(Object.keys(CATEGORIES).map(cat => ({
          label: cat.replace(/^\S+\s/,""),
          description: `View ${cat.replace(/^\S+\s/,"")} commands`,
          value: cat,
          emoji: cat.split(" ")[0],
        })))
    );

    const reply = await interaction.reply({ components: [overview, selectRow], flags: MessageFlags.IsComponentsV2 });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: i => i.user.id === interaction.user.id && i.customId === "help_category",
      time: 60_000,
    });

    collector.on("collect", async i => {
      const cat = i.values[0];
      const c = new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${cat}`));
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(CATEGORIES[cat].map(cmd => `• ${cmd}`).join("\n")));
      await i.update({ components: [c, selectRow], flags: MessageFlags.IsComponentsV2 });
    });

    collector.on("end", () => {
      reply.edit({ components: [overview], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    });
  },
};
