const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_hide",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data) return interaction.reply({ content: "❌ Not a temp voice channel.", flags: [MessageFlags.Ephemeral] });
    if (data.ownerId !== interaction.user.id) return interaction.reply({ content: "❌ Only the channel owner can do this.", flags: [MessageFlags.Ephemeral] });

    const isHidden = !interaction.channel.permissionOverwrites.cache.get(interaction.guild.id)?.allow?.has("ViewChannel");
    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
      ViewChannel: isHidden ? true : false,
    });

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(isHidden ? "👁️ **Channel is now visible**." : "👁️ **Channel hidden** — only current members can see it."));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
