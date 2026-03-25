const { ContainerBuilder, TextDisplayBuilder, PermissionsBitField, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_transfer_modal",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data || data.ownerId !== interaction.user.id)
      return interaction.reply({ content: "❌ Not authorised.", flags: [MessageFlags.Ephemeral] });

    const raw    = interaction.fields.getTextInputValue("tvc_transfer_id").trim().replace(/[<@!>]/g, "");
    const member = await interaction.guild.members.fetch(raw).catch(() => null);

    if (!member)
      return interaction.reply({ content: "❌ Could not find that member.", flags: [MessageFlags.Ephemeral] });
    if (member.id === interaction.user.id)
      return interaction.reply({ content: "❌ You already own this channel.", flags: [MessageFlags.Ephemeral] });
    if (member.voice?.channelId !== interaction.channel.id)
      return interaction.reply({ content: "❌ That member must be in your channel to receive ownership.", flags: [MessageFlags.Ephemeral] });

    const oldOwnerId = data.ownerId;

    // Remove owner permissions from old owner
    await interaction.channel.permissionOverwrites.edit(oldOwnerId, {
      ManageChannels: false, MuteMembers: false, DeafenMembers: false, MoveMembers: false,
    }).catch(() => {});

    // Grant owner permissions to new owner
    await interaction.channel.permissionOverwrites.edit(member.id, {
      Connect: true, ViewChannel: true,
      ManageChannels: true, MuteMembers: true, DeafenMembers: true, MoveMembers: true,
    }).catch(() => {});

    // Update DB
    data.ownerId = member.id;
    db.tempvcChannels.set(interaction.channel.id, data);

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `🔑 Channel ownership transferred to **${member.user.tag}**.\nThey now have full control of this channel.`
    ));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
