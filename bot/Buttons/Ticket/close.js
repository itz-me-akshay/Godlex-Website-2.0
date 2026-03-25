const {
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags,
} = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "ticket_close",
  async execute(interaction) {
    const ticket = db.tickets.get(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: "❌ Not a tracked ticket.", flags: [MessageFlags.Ephemeral] });
    if (ticket.closed) return interaction.reply({ content: "⚠️ Ticket is already closed.", flags: [MessageFlags.Ephemeral] });

    const cfg     = db.ticketSetup.get(interaction.guild.id);
    const isStaff = cfg && interaction.member.roles.cache.has(cfg.supportRoleId);
    const isOwner = interaction.user.id === ticket.userId;
    if (!isStaff && !isOwner && !interaction.member.permissions.has("Administrator"))
      return interaction.reply({ content: "❌ You cannot close this ticket.", flags: [MessageFlags.Ephemeral] });

    ticket.closed = true;
    db.tickets.set(interaction.channel.id, ticket);

    await interaction.channel.permissionOverwrites.edit(ticket.userId, { ViewChannel: false }).catch(() => {});

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🔒 Ticket Closed\n> Closed by ${interaction.user.tag}`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent("*Staff can reopen or delete this ticket below.*"));

    const btnRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("ticket_reopen").setLabel("🔓 Reopen").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("ticket_delete").setLabel("🗑️ Delete").setStyle(ButtonStyle.Danger),
    );

    await interaction.reply({ components: [c, btnRow], flags: MessageFlags.IsComponentsV2 });

    if (cfg?.logChannelId) {
      const logCh = interaction.guild.channels.cache.get(cfg.logChannelId);
      if (logCh) {
        const log = new ContainerBuilder();
        log.addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `🔒 **Ticket Closed**\n**Channel:** ${interaction.channel.name}\n**Closed by:** ${interaction.user.tag}\n**Ticket #:** ${ticket.number}`
        ));
        logCh.send({ components: [log], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }
    }
  },
};
