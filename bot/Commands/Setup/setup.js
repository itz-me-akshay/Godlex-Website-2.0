const { SlashCommandBuilder, PermissionsBitField, ChannelType, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");
const cv2 = t => { const c = new ContainerBuilder(); c.addTextDisplayComponents(new TextDisplayBuilder().setContent(t)); return c; };
const adm = i => i.member.permissions.has(PermissionsBitField.Flags.Administrator);

const setupWelcome = {
  data: new SlashCommandBuilder().setName("setup-welcome").setDMPermission(false).setDescription("Configure welcome messages.")
    .addSubcommand(s=>s.setName("set").setDescription("Set welcome channel and message.")
      .addChannelOption(o=>o.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption(o=>o.setName("message").setDescription("Message — use {user} {server} {membercount}").setRequired(false)))
    .addSubcommand(s=>s.setName("disable").setDescription("Disable welcome messages.")),
  async execute(interaction) {
    if (!adm(interaction)) return interaction.reply({ content:"❌ Administrator required.", flags:[MessageFlags.Ephemeral] });
    if (interaction.options.getSubcommand()==="set") {
      const ch  = interaction.options.getChannel("channel");
      const msg = interaction.options.getString("message")??"Welcome {user} to **{server}**! 🎉";
      db.welcomeConfig.set(interaction.guild.id,{channelId:ch.id,message:msg});
      const c=new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ✅ Welcome System Set`));
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Channel:** ${ch}\n**Message:** ${msg}\n\n*Placeholders: \`{user}\` \`{server}\` \`{membercount}\`*`));
      return interaction.reply({components:[c],flags:MessageFlags.IsComponentsV2});
    }
    db.welcomeConfig.delete(interaction.guild.id);
    return interaction.reply({components:[cv2("✅ Welcome messages **disabled**.")],flags:MessageFlags.IsComponentsV2});
  },
};

const setupLeave = {
  data: new SlashCommandBuilder().setName("setup-leave").setDMPermission(false).setDescription("Configure leave messages.")
    .addSubcommand(s=>s.setName("set").setDescription("Set leave channel and message.")
      .addChannelOption(o=>o.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption(o=>o.setName("message").setDescription("Message — use {user} {server} {membercount}").setRequired(false)))
    .addSubcommand(s=>s.setName("disable").setDescription("Disable leave messages.")),
  async execute(interaction) {
    if (!adm(interaction)) return interaction.reply({ content:"❌ Administrator required.", flags:[MessageFlags.Ephemeral] });
    if (interaction.options.getSubcommand()==="set") {
      const ch  = interaction.options.getChannel("channel");
      const msg = interaction.options.getString("message")??"**{user}** has left **{server}**. Goodbye!";
      db.leaveConfig.set(interaction.guild.id,{channelId:ch.id,message:msg});
      const c=new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ✅ Leave System Set`));
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Channel:** ${ch}\n**Message:** ${msg}`));
      return interaction.reply({components:[c],flags:MessageFlags.IsComponentsV2});
    }
    db.leaveConfig.delete(interaction.guild.id);
    return interaction.reply({components:[cv2("✅ Leave messages **disabled**.")],flags:MessageFlags.IsComponentsV2});
  },
};

const setupLogging = {
  data: new SlashCommandBuilder().setName("setup-logging").setDMPermission(false).setDescription("Set the mod log channel.")
    .addSubcommand(s=>s.setName("set").setDescription("Set a log channel.").addChannelOption(o=>o.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(s=>s.setName("disable").setDescription("Disable logging.")),
  async execute(interaction) {
    if (!adm(interaction)) return interaction.reply({ content:"❌ Administrator required.", flags:[MessageFlags.Ephemeral] });
    if (interaction.options.getSubcommand()==="set") {
      const ch = interaction.options.getChannel("channel");
      db.logConfig.set(interaction.guild.id,{channelId:ch.id});
      return interaction.reply({components:[cv2(`# ✅ Log Channel Set\n\nMod logs will be sent to ${ch}.`)],flags:MessageFlags.IsComponentsV2});
    }
    db.logConfig.delete(interaction.guild.id);
    return interaction.reply({components:[cv2("✅ Mod logging **disabled**.")],flags:MessageFlags.IsComponentsV2});
  },
};

const setupAutorole = {
  data: new SlashCommandBuilder().setName("setup-autorole").setDMPermission(false).setDescription("Configure auto-role on join.")
    .addSubcommand(s=>s.setName("set").setDescription("Set a role.").addRoleOption(o=>o.setName("role").setDescription("Role to assign").setRequired(true)))
    .addSubcommand(s=>s.setName("disable").setDescription("Disable auto-role.")),
  async execute(interaction) {
    if (!adm(interaction)) return interaction.reply({ content:"❌ Administrator required.", flags:[MessageFlags.Ephemeral] });
    if (interaction.options.getSubcommand()==="set") {
      const role = interaction.options.getRole("role");
      if (role.managed) return interaction.reply({ content:"❌ Cannot use a managed role.", flags:[MessageFlags.Ephemeral] });
      db.autoRole.set(interaction.guild.id,role.id);
      return interaction.reply({components:[cv2(`# ✅ Auto-Role Set\n\nNew members will receive **${role.name}**.`)],flags:MessageFlags.IsComponentsV2});
    }
    db.autoRole.delete(interaction.guild.id);
    return interaction.reply({components:[cv2("✅ Auto-role **disabled**.")],flags:MessageFlags.IsComponentsV2});
  },
};

module.exports = [setupWelcome, setupLeave, setupLogging, setupAutorole];
