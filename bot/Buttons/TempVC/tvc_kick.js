const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_kick",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data) return interaction.reply({ content: "❌ Not a temp voice channel.", flags: [MessageFlags.Ephemeral] });
    if (data.ownerId !== interaction.user.id) return interaction.reply({ content: "❌ Only the channel owner can kick members.", flags: [MessageFlags.Ephemeral] });

    const modal = new ModalBuilder()
      .setCustomId("tvc_kick_modal")
      .setTitle("Kick Member from Channel");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("tvc_kick_id")
          .setLabel("User ID or @mention to kick")
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
