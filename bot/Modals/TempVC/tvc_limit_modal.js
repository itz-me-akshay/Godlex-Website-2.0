const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_limit_modal",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data || data.ownerId !== interaction.user.id)
      return interaction.reply({ content: "❌ Not authorised.", flags: [MessageFlags.Ephemeral] });

    const raw   = interaction.fields.getTextInputValue("tvc_limit_value").trim();
    const limit = parseInt(raw);
    if (isNaN(limit) || limit < 0 || limit > 99)
      return interaction.reply({ content: "❌ Enter a number between 0 and 99 (0 = unlimited).", flags: [MessageFlags.Ephemeral] });

    await interaction.channel.setUserLimit(limit);

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      limit === 0 ? "👥 User limit **removed** — unlimited members can join." : `👥 User limit set to **${limit}**.`
    ));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
