const {
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags,
} = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "ticket_reopen",
  async execute(interaction) {
    const ticket = db.tickets.get(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: "❌ Not a tracked ticket.", flags: [MessageFlags.Ephemeral] });
    if (!ticket.closed) return interaction.reply({ content: "⚠️ Ticket is already open.", flags: [MessageFlags.Ephemeral] });

    const cfg     = db.ticketSetup.get(interaction.guild.id);
    const isStaff = cfg && interaction.member.roles.cache.has(cfg.supportRoleId);
    if (!isStaff && !interaction.member.permissions.has("Administrator"))
      return interaction.reply({ content: "❌ Only staff can reopen tickets.", flags: [MessageFlags.Ephemeral] });

    ticket.closed = false;
    db.tickets.set(interaction.channel.id, ticket);

    await interaction.channel.permissionOverwrites.edit(ticket.userId, {
      ViewChannel: true, SendMessages: true, ReadMessageHistory: true,
    }).catch(() => {});

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🔓 Ticket Reopened\n> Reopened by ${interaction.user.tag}`));
    c.addSeparatorComponents(new SeparatorBuilder());

    const btnRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("ticket_close").setLabel("🔒 Close").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("ticket_delete").setLabel("🗑️ Delete").setStyle(ButtonStyle.Danger),
    );

    return interaction.reply({ components: [c, btnRow], flags: MessageFlags.IsComponentsV2 });
  },
};
