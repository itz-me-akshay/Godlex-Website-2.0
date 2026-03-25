const { ContainerBuilder, TextDisplayBuilder, PermissionsBitField, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

// ── Rename Modal ─────────────────────────────────────────────────────────────
module.exports = {
  id: "tvc_rename_modal",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data || data.ownerId !== interaction.user.id)
      return interaction.reply({ content: "❌ Not authorised.", flags: [MessageFlags.Ephemeral] });

    const newName = interaction.fields.getTextInputValue("tvc_new_name").trim();
    await interaction.channel.setName(newName);

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`✏️ Channel renamed to **${newName}**.`));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
