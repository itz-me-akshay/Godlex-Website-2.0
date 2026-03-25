const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_limit",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data) return interaction.reply({ content: "❌ Not a temp voice channel.", flags: [MessageFlags.Ephemeral] });
    if (data.ownerId !== interaction.user.id) return interaction.reply({ content: "❌ Only the channel owner can set the limit.", flags: [MessageFlags.Ephemeral] });

    const modal = new ModalBuilder()
      .setCustomId("tvc_limit_modal")
      .setTitle("Set User Limit");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("tvc_limit_value")
          .setLabel("User limit (0 = unlimited, max 99)")
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(2)
          .setPlaceholder("e.g. 5")
          .setRequired(true)
      )
    );

    return interaction.showModal(modal);
  },
};
