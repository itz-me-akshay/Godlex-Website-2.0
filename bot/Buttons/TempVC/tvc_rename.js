const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_rename",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data) return interaction.reply({ content: "❌ Not a temp voice channel.", flags: [MessageFlags.Ephemeral] });
    if (data.ownerId !== interaction.user.id) return interaction.reply({ content: "❌ Only the channel owner can rename it.", flags: [MessageFlags.Ephemeral] });

    const modal = new ModalBuilder()
      .setCustomId("tvc_rename_modal")
      .setTitle("Rename Your Channel");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("tvc_new_name")
          .setLabel("New channel name")
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(100)
          .setPlaceholder("e.g. Chill Zone")
          .setRequired(true)
      )
    );

    return interaction.showModal(modal);
  },
};
