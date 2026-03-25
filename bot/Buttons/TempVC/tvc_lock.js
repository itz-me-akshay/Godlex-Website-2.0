const { PermissionsBitField, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_lock",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data) return interaction.reply({ content: "❌ This is not a temp voice channel.", flags: [MessageFlags.Ephemeral] });
    if (data.ownerId !== interaction.user.id) return interaction.reply({ content: "❌ Only the channel owner can do this.", flags: [MessageFlags.Ephemeral] });

    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
      Connect: false,
    });

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent("🔒 **Channel locked** — no new members can join."));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
