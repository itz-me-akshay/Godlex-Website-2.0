const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  id: "tvc_kick_modal",
  async execute(interaction) {
    const data = db.tempvcChannels.get(interaction.channel.id);
    if (!data || data.ownerId !== interaction.user.id)
      return interaction.reply({ content: "❌ Not authorised.", flags: [MessageFlags.Ephemeral] });

    const raw = interaction.fields.getTextInputValue("tvc_kick_id").trim().replace(/[<@!>]/g, "");
    const member = await interaction.guild.members.fetch(raw).catch(() => null);

    if (!member)
      return interaction.reply({ content: "❌ Could not find that member.", flags: [MessageFlags.Ephemeral] });
    if (member.id === interaction.user.id)
      return interaction.reply({ content: "❌ You cannot kick yourself.", flags: [MessageFlags.Ephemeral] });
    if (member.voice?.channelId !== interaction.channel.id)
      return interaction.reply({ content: "❌ That member is not in your channel.", flags: [MessageFlags.Ephemeral] });

    // Deny them from rejoining this channel
    await interaction.channel.permissionOverwrites.edit(member.id, { Connect: false });
    // Move them out of the channel
    await member.voice.disconnect().catch(() => {});

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`👢 **${member.user.tag}** was kicked from your channel.`));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
