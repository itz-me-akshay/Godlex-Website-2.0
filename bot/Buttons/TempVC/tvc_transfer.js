const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_transfer",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data) return interaction.reply({ content: "❌ Not a temp voice channel.", flags: [MessageFlags.Ephemeral] });
    if (data.ownerId !== interaction.user.id) return interaction.reply({ content: "❌ Only the channel owner can transfer ownership.", flags: [MessageFlags.Ephemeral] });

    const modal = new ModalBuilder()
      .setCustomId("tvc_transfer_modal")
      .setTitle("Transfer Channel Ownership");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("tvc_transfer_id")
          .setLabel("User ID to transfer ownership to")
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(100)
          .setPlaceholder("e.g. 123456789012345678")
          .setRequired(true)
      )
    );

    return interaction.showModal(modal);
  },
};
