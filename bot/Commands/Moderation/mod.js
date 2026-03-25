const { SlashCommandBuilder, PermissionsBitField, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");
const cv2=(t)=>{const c=new ContainerBuilder();c.addTextDisplayComponents(new TextDisplayBuilder().setContent(t));return c;};

const timeout={
  data:new SlashCommandBuilder().setName("timeout").setDMPermission(false).setDescription("Timeout a member.")
    .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
    .addIntegerOption(o=>o.setName("minutes").setDescription("Duration in minutes (1–40320)").setMinValue(1).setMaxValue(40320).setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason").setRequired(false)),
  async execute(interaction){
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))return interaction.reply({content:"❌ Missing **Moderate Members** permission.",flags:[MessageFlags.Ephemeral]});
    const target=interaction.options.getMember("user"),mins=interaction.options.getInteger("minutes"),reason=interaction.options.getString("reason")??"No reason provided";
    if(!target)return interaction.reply({content:"❌ User not found.",flags:[MessageFlags.Ephemeral]});
    if(!target.moderatable)return interaction.reply({content:"❌ Cannot moderate this member.",flags:[MessageFlags.Ephemeral]});
    await target.timeout(mins*60_000,reason);
    const c=cv2(`# ⏱️ Member Timed Out\n\n**User:** ${target.user.tag}\n**Duration:** ${mins} minute(s)\n**Reason:** ${reason}\n\n⏱️ Expires <t:${Math.floor((Date.now()+mins*60_000)/1000)}:R>`);
    return interaction.reply({components:[c],flags:MessageFlags.IsComponentsV2});
  },
};
const untimeout={
  data:new SlashCommandBuilder().setName("untimeout").setDMPermission(false).setDescription("Remove a timeout.")
    .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true)),
  async execute(interaction){
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))return interaction.reply({content:"❌ Missing **Moderate Members** permission.",flags:[MessageFlags.Ephemeral]});
    const target=interaction.options.getMember("user");
    if(!target)return interaction.reply({content:"❌ User not found.",flags:[MessageFlags.Ephemeral]});
    await target.timeout(null);
    return interaction.reply({components:[cv2(`✅ Removed timeout for **${target.user.tag}**.`)],flags:MessageFlags.IsComponentsV2});
  },
};
const unban={
  data:new SlashCommandBuilder().setName("unban").setDMPermission(false).setDescription("Unban a user by ID.")
    .addStringOption(o=>o.setName("userid").setDescription("User ID").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Reason").setRequired(false)),
  async execute(interaction){
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))return interaction.reply({content:"❌ Missing **Ban Members** permission.",flags:[MessageFlags.Ephemeral]});
    const id=interaction.options.getString("userid"),reason=interaction.options.getString("reason")??"No reason provided";
    const result=await interaction.guild.bans.remove(id,reason).catch(()=>null);
    if(!result)return interaction.reply({content:"❌ Could not unban. Check the ID or user may not be banned.",flags:[MessageFlags.Ephemeral]});
    return interaction.reply({components:[cv2(`✅ Unbanned \`${id}\`.\n**Reason:** ${reason}`)],flags:MessageFlags.IsComponentsV2});
  },
};
const purge={
  data:new SlashCommandBuilder().setName("purge").setDMPermission(false).setDescription("Bulk delete messages (2–100).")
    .addIntegerOption(o=>o.setName("amount").setDescription("Number of messages").setMinValue(2).setMaxValue(100).setRequired(true))
    .addUserOption(o=>o.setName("user").setDescription("Only delete from this user").setRequired(false)),
  async execute(interaction){
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return interaction.reply({content:"❌ Missing **Manage Messages** permission.",flags:[MessageFlags.Ephemeral]});
    const amount=interaction.options.getInteger("amount"),target=interaction.options.getUser("user");
    let fetched=await interaction.channel.messages.fetch({limit:amount});
    if(target)fetched=fetched.filter(m=>m.author.id===target.id);
    const deleted=await interaction.channel.bulkDelete(fetched,true);
    const reply=await interaction.reply({components:[cv2(`🗑️ Deleted **${deleted.size}** message(s)${target?` from **${target.tag}**`:"."} `)],flags:MessageFlags.IsComponentsV2});
    setTimeout(()=>reply.delete().catch(()=>{}),5_000);
  },
};
const slowmode={
  data:new SlashCommandBuilder().setName("slowmode").setDMPermission(false).setDescription("Set channel slowmode.")
    .addIntegerOption(o=>o.setName("seconds").setDescription("Cooldown in seconds (0 = off)").setMinValue(0).setMaxValue(21600).setRequired(true)),
  async execute(interaction){
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))return interaction.reply({content:"❌ Missing **Manage Channels** permission.",flags:[MessageFlags.Ephemeral]});
    const secs=interaction.options.getInteger("seconds");
    await interaction.channel.setRateLimitPerUser(secs);
    return interaction.reply({components:[cv2(secs===0?"✅ Slowmode **disabled**.":`✅ Slowmode set to **${secs}s**.`)],flags:MessageFlags.IsComponentsV2});
  },
};
const nick={
  data:new SlashCommandBuilder().setName("nick").setDMPermission(false).setDescription("Change a member's nickname.")
    .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
    .addStringOption(o=>o.setName("nickname").setDescription("New nickname (leave blank to reset)").setRequired(false)),
  async execute(interaction){
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames))return interaction.reply({content:"❌ Missing **Manage Nicknames** permission.",flags:[MessageFlags.Ephemeral]});
    const target=interaction.options.getMember("user"),nick_=interaction.options.getString("nickname")??null;
    if(!target)return interaction.reply({content:"❌ User not found.",flags:[MessageFlags.Ephemeral]});
    await target.setNickname(nick_);
    return interaction.reply({components:[cv2(nick_?`✅ Nickname set to **${nick_}** for **${target.user.tag}**`:`✅ Reset nickname for **${target.user.tag}**`)],flags:MessageFlags.IsComponentsV2});
  },
};
const role={
  data:new SlashCommandBuilder().setName("role").setDMPermission(false).setDescription("Add or remove a role from a member.")
    .addSubcommand(s=>s.setName("add").setDescription("Add a role.")
      .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
      .addRoleOption(o=>o.setName("role").setDescription("Role").setRequired(true)))
    .addSubcommand(s=>s.setName("remove").setDescription("Remove a role.")
      .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
      .addRoleOption(o=>o.setName("role").setDescription("Role").setRequired(true))),
  async execute(interaction){
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles))return interaction.reply({content:"❌ Missing **Manage Roles** permission.",flags:[MessageFlags.Ephemeral]});
    const sub=interaction.options.getSubcommand(),target=interaction.options.getMember("user"),r=interaction.options.getRole("role");
    if(!target)return interaction.reply({content:"❌ User not found.",flags:[MessageFlags.Ephemeral]});
    if(r.managed)return interaction.reply({content:"❌ That role is managed by an integration.",flags:[MessageFlags.Ephemeral]});
    if(sub==="add"){await target.roles.add(r);return interaction.reply({components:[cv2(`✅ Added **${r.name}** to **${target.user.tag}**`)],flags:MessageFlags.IsComponentsV2});}
    else{await target.roles.remove(r);return interaction.reply({components:[cv2(`✅ Removed **${r.name}** from **${target.user.tag}**`)],flags:MessageFlags.IsComponentsV2});}
  },
};
module.exports=[timeout,untimeout,unban,purge,slowmode,nick,role];
