const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_unlock",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data) return interaction.reply({ content: "❌ Not a temp voice channel.", flags: [MessageFlags.Ephemeral] });
    if (data.ownerId !== interaction.user.id) return interaction.reply({ content: "❌ Only the channel owner can do this.", flags: [MessageFlags.Ephemeral] });

    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
      Connect: true,
    });

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent("🔓 **Channel unlocked** — everyone can join."));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
