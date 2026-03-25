const { SlashCommandBuilder, PermissionsBitField, ChannelType, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tempvoice")
    .setDMPermission(false)
    .setDescription("Configure the Temp VC system.")
    .addSubcommand(s => s
      .setName("set")
      .setDescription("Set a trigger voice channel that creates temp channels.")
      .addChannelOption(o => o.setName("channel").setDescription("The trigger voice channel users join to get a temp VC").addChannelTypes(ChannelType.GuildVoice).setRequired(true))
      .addChannelOption(o => o.setName("category").setDescription("Category to create temp VCs under").addChannelTypes(ChannelType.GuildCategory).setRequired(true))
      .addStringOption(o => o.setName("name").setDescription("Name template for created channels. Use {user} for display name").setRequired(true))
    )
    .addSubcommand(s => s
      .setName("remove")
      .setDescription("Remove the Temp VC trigger from a channel.")
      .addChannelOption(o => o.setName("channel").setDescription("The trigger channel to remove").addChannelTypes(ChannelType.GuildVoice).setRequired(true))
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: "❌ Administrator permission required.", flags: [MessageFlags.Ephemeral] });

    const sub = interaction.options.getSubcommand();

    if (sub === "set") {
      const triggerCh  = interaction.options.getChannel("channel");
      const category   = interaction.options.getChannel("category");
      const nameTemplate = interaction.options.getString("name");

      db.tempvcSetup.set(interaction.guild.id, {
        triggerChannelId: triggerCh.id,
        categoryId:       category.id,
        nameTemplate,
      });

      const c = new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ✅ Temp VC Configured`));
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `**Trigger Channel:** ${triggerCh}\n` +
        `**Category:** ${category.name}\n` +
        `**Name Template:** \`${nameTemplate}\`\n\n` +
        `*Users who join **${triggerCh.name}** will get their own private voice channel.*\n` +
        `*Use \`{user}\` in the name to insert the member's display name.*`
      ));
      return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }

    if (sub === "remove") {
      const triggerCh = interaction.options.getChannel("channel");
      const cfg = db.tempvcSetup.get(interaction.guild.id);

      if (!cfg || cfg.triggerChannelId !== triggerCh.id) {
        return interaction.reply({
          content: `❌ **${triggerCh.name}** is not set as a Temp VC trigger channel.`,
          flags: [MessageFlags.Ephemeral],
        });
      }

      db.tempvcSetup.delete(interaction.guild.id);
      const c = new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `✅ Temp VC trigger removed from **${triggerCh.name}**.\nNew temp channels will no longer be created.`
      ));
      return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }
  },
};
