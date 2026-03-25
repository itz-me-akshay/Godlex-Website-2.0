const { SlashCommandBuilder, PermissionsBitField, ChannelType, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

const TYPES = [
  { label:"General Support",   value:"general",   emoji:"💬" },
  { label:"Technical Issue",   value:"technical", emoji:"🔧" },
  { label:"Billing / Purchase",value:"billing",   emoji:"💳" },
  { label:"Report a User",     value:"report",    emoji:"🚨" },
  { label:"Other",             value:"other",     emoji:"📋" },
];

module.exports = {
  data: new SlashCommandBuilder().setName("setup-ticket").setDMPermission(false).setDescription("Configure the ticket system.")
    .addSubcommand(s=>s.setName("create").setDescription("Create a ticket panel.")
      .addChannelOption(o=>o.setName("panel-channel").setDescription("Where to post the panel").addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addRoleOption(o=>o.setName("support-role").setDescription("Role that can see tickets").setRequired(true))
      .addChannelOption(o=>o.setName("log-channel").setDescription("Ticket log channel").addChannelTypes(ChannelType.GuildText).setRequired(false))
      .addChannelOption(o=>o.setName("category").setDescription("Category for ticket channels").addChannelTypes(ChannelType.GuildCategory).setRequired(false)))
    .addSubcommand(s=>s.setName("disable").setDescription("Remove ticket configuration.")),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content:"❌ Administrator required.", flags:[MessageFlags.Ephemeral] });

    if (interaction.options.getSubcommand()==="disable") {
      db.ticketSetup.delete(interaction.guild.id);
      const c=new ContainerBuilder();c.addTextDisplayComponents(new TextDisplayBuilder().setContent("✅ Ticket system **disabled**."));
      return interaction.reply({components:[c],flags:MessageFlags.IsComponentsV2});
    }

    const panelCh     = interaction.options.getChannel("panel-channel");
    const supportRole = interaction.options.getRole("support-role");
    const logCh       = interaction.options.getChannel("log-channel");
    const category    = interaction.options.getChannel("category");

    db.ticketSetup.set(interaction.guild.id, {
      channelId:     panelCh.id,
      logChannelId:  logCh?.id ?? null,
      supportRoleId: supportRole.id,
      categoryId:    category?.id ?? null,
      types:         TYPES,
    });

    // Build panel
    const panel = new ContainerBuilder();
    panel.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🎫 Support Tickets\n> Open a ticket and our team will assist you.`));
    panel.addSeparatorComponents(new SeparatorBuilder());
    panel.addTextDisplayComponents(new TextDisplayBuilder().setContent(TYPES.map(t=>`${t.emoji} **${t.label}**`).join("\n")));
    panel.addSeparatorComponents(new SeparatorBuilder());
    panel.addTextDisplayComponents(new TextDisplayBuilder().setContent("*Select a category below to open a ticket.*"));

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder().setCustomId("ticket_type_select").setPlaceholder("Select ticket category…")
        .addOptions(TYPES.map(t=>({label:t.label,value:t.value,emoji:t.emoji})))
    );

    await panelCh.send({ components:[panel,selectRow], flags:MessageFlags.IsComponentsV2 });

    const confirm = new ContainerBuilder();
    confirm.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ✅ Ticket System Configured`));
    confirm.addSeparatorComponents(new SeparatorBuilder());
    confirm.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Panel:** ${panelCh}\n**Support Role:** ${supportRole}\n**Logs:** ${logCh??"Not set"}\n**Category:** ${category?.name??"Root"}`));
    return interaction.reply({components:[confirm],flags:MessageFlags.IsComponentsV2});
  },
};
