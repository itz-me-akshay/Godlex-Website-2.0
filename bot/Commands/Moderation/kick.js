const { SlashCommandBuilder, PermissionsBitField, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("kick").setDMPermission(false).setDescription("Kick a member from the server.")
    .addUserOption(o=>o.setName("user").setDescription("User to kick").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason").setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return interaction.reply({ content: "❌ You need **Kick Members** permission.", flags: [MessageFlags.Ephemeral] });
    const target=interaction.options.getMember("user"), user=interaction.options.getUser("user");
    const reason=interaction.options.getString("reason")??"No reason provided";
    if (!target) return interaction.reply({ content: "❌ User not in server.", flags: [MessageFlags.Ephemeral] });
    if (target.id===interaction.user.id) return interaction.reply({ content: "❌ You cannot kick yourself.", flags: [MessageFlags.Ephemeral] });
    if (!target.kickable) return interaction.reply({ content: "❌ I cannot kick this member.", flags: [MessageFlags.Ephemeral] });
    const dm=new ContainerBuilder();
    dm.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 👢 You've been Kicked\n> From **${interaction.guild.name}**`));
    dm.addSeparatorComponents(new SeparatorBuilder());
    dm.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`));
    await user.send({ components: [dm], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    await target.kick(reason);
    const c=new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 👢 User Kicked`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User:** ${user.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
