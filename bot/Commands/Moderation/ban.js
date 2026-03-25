const { SlashCommandBuilder, PermissionsBitField, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ban").setDMPermission(false).setDescription("Ban a member from the server.")
    .addUserOption(o=>o.setName("user").setDescription("User to ban").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason").setRequired(false))
    .addIntegerOption(o=>o.setName("days").setDescription("Delete message history (0–7 days)").setMinValue(0).setMaxValue(7).setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return interaction.reply({ content: "❌ You need **Ban Members** permission.", flags: [MessageFlags.Ephemeral] });
    const target=interaction.options.getMember("user"), user=interaction.options.getUser("user");
    const reason=interaction.options.getString("reason")??"No reason provided";
    const days=interaction.options.getInteger("days")??0;
    if (!target) return interaction.reply({ content: "❌ User not in server.", flags: [MessageFlags.Ephemeral] });
    if (target.id===interaction.user.id) return interaction.reply({ content: "❌ You cannot ban yourself.", flags: [MessageFlags.Ephemeral] });
    if (!target.bannable) return interaction.reply({ content: "❌ I cannot ban this member — check role hierarchy.", flags: [MessageFlags.Ephemeral] });
    const dm=new ContainerBuilder();
    dm.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🔨 You've been Banned\n> From **${interaction.guild.name}**`));
    dm.addSeparatorComponents(new SeparatorBuilder());
    dm.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`));
    await user.send({ components: [dm], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    await interaction.guild.bans.create(user.id, { reason, deleteMessageDays: days });
    const c=new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🔨 User Banned`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User:** ${user.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}\n**Msg Deletion:** ${days} day(s)`));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
