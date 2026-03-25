const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_delete",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data) return interaction.reply({ content: "❌ Not a temp voice channel.", flags: [MessageFlags.Ephemeral] });
    if (data.ownerId !== interaction.user.id) return interaction.reply({ content: "❌ Only the channel owner can delete it.", flags: [MessageFlags.Ephemeral] });

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent("🗑️ Deleting this channel in **5 seconds**…"));
    await interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });

    db.tempvcChannels.delete(interaction.channel.id);
    setTimeout(() => interaction.channel.delete("TempVC deleted by owner").catch(() => {}), 5_000);
  },
};
