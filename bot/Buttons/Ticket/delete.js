const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "ticket_delete",
  async execute(interaction) {
    const ticket = db.tickets.get(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: "❌ Not a tracked ticket.", flags: [MessageFlags.Ephemeral] });

    const cfg     = db.ticketSetup.get(interaction.guild.id);
    const isStaff = cfg && interaction.member.roles.cache.has(cfg.supportRoleId);
    if (!isStaff && !interaction.member.permissions.has("Administrator"))
      return interaction.reply({ content: "❌ Only staff can delete tickets.", flags: [MessageFlags.Ephemeral] });

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent("🗑️ Deleting this ticket in **5 seconds**…"));
    await interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });

    if (cfg?.logChannelId) {
      const logCh = interaction.guild.channels.cache.get(cfg.logChannelId);
      if (logCh) {
        const log = new ContainerBuilder();
        log.addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `🗑️ **Ticket Deleted**\n**Channel:** ${interaction.channel.name}\n**Deleted by:** ${interaction.user.tag}\n**Ticket #:** ${ticket.number}\n**Opener:** <@${ticket.userId}>`
        ));
        logCh.send({ components: [log], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }
    }

    db.tickets.delete(interaction.channel.id);
    setTimeout(() => interaction.channel.delete("Ticket deleted by staff").catch(() => {}), 5_000);
  },
};
