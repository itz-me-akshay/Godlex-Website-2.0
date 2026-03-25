const { SlashCommandBuilder, PermissionsBitField, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  data: new SlashCommandBuilder().setName("warn").setDMPermission(false).setDescription("Manage member warnings.")
    .addSubcommand(s=>s.setName("add").setDescription("Warn a member.")
      .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
      .addStringOption(o=>o.setName("reason").setDescription("Reason").setRequired(false)))
    .addSubcommand(s=>s.setName("list").setDescription("View warnings.")
      .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true)))
    .addSubcommand(s=>s.setName("clear").setDescription("Clear warnings.")
      .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return interaction.reply({ content: "❌ You need **Moderate Members** permission.", flags: [MessageFlags.Ephemeral] });
    const sub=interaction.options.getSubcommand(), target=interaction.options.getUser("user");
    const key=`${interaction.guild.id}:${target.id}`;
    if (sub==="add") {
      const reason=interaction.options.getString("reason")??"No reason provided";
      const list=db.warnings.get(key)??[];
      list.push({reason,moderator:interaction.user.tag,date:new Date().toISOString()});
      db.warnings.set(key,list);
      const dm=new ContainerBuilder();
      dm.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ⚠️ Warning Received\n> In **${interaction.guild.name}**`));
      dm.addSeparatorComponents(new SeparatorBuilder());
      dm.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}\n**Total:** ${list.length}`));
      await target.send({ components: [dm], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      const c=new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ⚠️ Warning Issued`));
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User:** ${target.tag}\n**Reason:** ${reason}\n**Total Warnings:** ${list.length}`));
      return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }
    if (sub==="list") {
      const list=db.warnings.get(key)??[];
      const c=new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ⚠️ Warnings — ${target.tag}`));
      c.addSeparatorComponents(new SeparatorBuilder());
      if (!list.length) {
        c.addTextDisplayComponents(new TextDisplayBuilder().setContent("✅ No warnings on record."));
      } else {
        c.addTextDisplayComponents(new TextDisplayBuilder().setContent(list.map((w,i)=>`**${i+1}.** ${w.reason}\n> By ${w.moderator} • <t:${Math.floor(new Date(w.date).getTime()/1000)}:R>`).join("\n\n")));
      }
      return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }
    if (sub==="clear") {
      db.warnings.delete(key);
      const c=new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`✅ Cleared all warnings for **${target.tag}**.`));
      return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }
  },
};
