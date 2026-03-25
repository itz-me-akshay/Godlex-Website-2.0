const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags, SeparatorSpacingSize } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("botinfo").setDescription("Display information about the bot."),
  async execute(interaction, client) {
    const up   = process.uptime();
    const d    = Math.floor(up/86400), h = Math.floor((up%86400)/3600), m = Math.floor((up%3600)/60);
    const mem  = (process.memoryUsage().heapUsed/1024/1024).toFixed(1);
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🤖 ${client.user.username}`));
    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Statistics**\n🏠 Servers: **${client.guilds.cache.size}**\n👥 Users: **${client.guilds.cache.reduce((a,g)=>a+g.memberCount,0)}**\n⚡ Commands: **${client.commands.size}**\n📡 Ping: **${Math.round(client.ws.ping)}ms**`
    ));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**System**\n⏱️ Uptime: **${d}d ${h}h ${m}m**\n🧠 Memory: **${mem} MB**\n📦 discord.js: **v${require("discord.js").version}**\n🟢 Node.js: **${process.version}**`
    ));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`🆔 Bot ID: \`${client.user.id}\``));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
