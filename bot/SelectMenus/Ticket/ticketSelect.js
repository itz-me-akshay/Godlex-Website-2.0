const {
  ChannelType, PermissionsBitField,
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags,
} = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "ticket_type_select",
  async execute(interaction, client) {
    const cfg = db.ticketSetup.get(interaction.guild.id);
    if (!cfg) return interaction.reply({ content: "❌ Ticket system not configured.", flags: [MessageFlags.Ephemeral] });

    const type    = interaction.values[0];
    const typeObj = cfg.types?.find(t => t.value === type);
    const label   = typeObj?.label ?? type;

    // One open ticket per user check
    for (const [chId, ticket] of db.tickets.entries()) {
      if (ticket.guildId === interaction.guild.id && ticket.userId === interaction.user.id && !ticket.closed)
        return interaction.reply({ content: `❌ You already have an open ticket: <#${chId}>`, flags: [MessageFlags.Ephemeral] });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const num = (db.ticketCount.get(interaction.guild.id) ?? 0) + 1;
    db.ticketCount.set(interaction.guild.id, num);

    const safeName = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) || "user";
    const channelName = `ticket-${String(num).padStart(4, "0")}-${safeName}`;

    const channel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: cfg.categoryId ?? undefined,
      topic: `Ticket #${num} | ${label} | ${interaction.user.tag}`,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: cfg.supportRoleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: client.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageChannels,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    db.tickets.set(channel.id, {
      guildId:   interaction.guild.id,
      userId:    interaction.user.id,
      type:      label,
      number:    num,
      closed:    false,
      createdAt: Date.now(),
    });

    // Welcome message in ticket channel
    const welcome = new ContainerBuilder();
    welcome.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `# 🎫 Ticket #${num} — ${label}\n> Welcome ${interaction.user}, our support team will be with you shortly.`
    ));
    welcome.addSeparatorComponents(new SeparatorBuilder());
    welcome.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Opened by:** ${interaction.user.tag}\n**Category:** ${typeObj?.emoji ?? ""} ${label}\n**Opened:** <t:${Math.floor(Date.now()/1000)}:R>`
    ));
    welcome.addSeparatorComponents(new SeparatorBuilder());
    welcome.addTextDisplayComponents(new TextDisplayBuilder().setContent("*Describe your issue and a staff member will assist you.*"));

    const btnRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("ticket_close").setLabel("🔒 Close").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("ticket_delete").setLabel("🗑️ Delete").setStyle(ButtonStyle.Danger),
    );

    await channel.send({
      content: `<@${interaction.user.id}> | <@&${cfg.supportRoleId}>`,
      components: [welcome, btnRow],
      flags: MessageFlags.IsComponentsV2,
    });

    // Log
    if (cfg.logChannelId) {
      const logCh = interaction.guild.channels.cache.get(cfg.logChannelId);
      if (logCh) {
        const log = new ContainerBuilder();
        log.addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `📥 **Ticket Opened**\n**User:** ${interaction.user.tag} (\`${interaction.user.id}\`)\n**Category:** ${label}\n**Channel:** ${channel}\n**Ticket #:** ${num}`
        ));
        logCh.send({ components: [log], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }
    }

    return interaction.editReply({ content: `✅ Your ticket has been created: ${channel}` });
  },
};
