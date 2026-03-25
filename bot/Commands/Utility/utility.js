const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags } = require("discord.js");
const db = require("../../Database/db");
const cv2 = t => { const c = new ContainerBuilder(); c.addTextDisplayComponents(new TextDisplayBuilder().setContent(t)); return c; };

const afkCmd = {
  data: new SlashCommandBuilder().setName("afk").setDMPermission(false).setDescription("Manage your AFK status.")
    .addSubcommand(s=>s.setName("set").setDescription("Go AFK.").addStringOption(o=>o.setName("message").setDescription("AFK reason").setRequired(false)))
    .addSubcommand(s=>s.setName("remove").setDescription("Remove your AFK.")),
  async execute(interaction) {
    const key = `${interaction.guild.id}:${interaction.user.id}`;
    const sub = interaction.options.getSubcommand();
    if (sub === "set") {
      if (db.afk.has(key)) return interaction.reply({ components:[cv2("⚠️ You are already AFK.")], flags:[MessageFlags.IsComponentsV2,MessageFlags.Ephemeral] });
      const message  = interaction.options.getString("message") ?? "AFK";
      const nickname = interaction.member.nickname ?? interaction.user.username;
      db.afk.set(key, { message, nickname, setAt: Date.now() });
      await interaction.member.setNickname(`[AFK] ${nickname}`).catch(() => {});
      return interaction.reply({ components:[cv2(`💤 You are now AFK.\n> **${message}**`)], flags:MessageFlags.IsComponentsV2 });
    }
    if (!db.afk.has(key)) return interaction.reply({ components:[cv2("⚠️ You are not AFK.")], flags:[MessageFlags.IsComponentsV2,MessageFlags.Ephemeral] });
    const data = db.afk.get(key);
    db.afk.delete(key);
    await interaction.member.setNickname(data.nickname).catch(() => {});
    return interaction.reply({ components:[cv2("✅ AFK removed.")], flags:MessageFlags.IsComponentsV2 });
  },
};

const snipe = {
  data: new SlashCommandBuilder().setName("snipe").setDMPermission(false).setDescription("Retrieve the last deleted message in this channel."),
  async execute(interaction) {
    const cached = db.snipeCache.get(interaction.channel.id);
    if (!cached) return interaction.reply({ components:[cv2("❌ Nothing to snipe — cache is empty for this channel.")], flags:[MessageFlags.IsComponentsV2,MessageFlags.Ephemeral] });
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🔍 Sniped Message`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Author:** ${cached.authorTag}\n**Content:** ${cached.content}\n**Deleted:** <t:${Math.floor(cached.deletedAt/1000)}:R>`));
    return interaction.reply({ components:[c], flags:MessageFlags.IsComponentsV2 });
  },
};

const avatar = {
  data: new SlashCommandBuilder().setName("avatar").setDescription("View a user's avatar.").addUserOption(o=>o.setName("user").setDescription("User").setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const url  = user.displayAvatarURL({ size:1024, extension:"png" });
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🖼️ ${user.tag}'s Avatar`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(url)));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`🔗 [Open full size](${url})`));
    return interaction.reply({ components:[c], flags:MessageFlags.IsComponentsV2 });
  },
};

const ping = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Check the bot's latency."),
  async execute(interaction, client) {
    const sent = await interaction.reply({ content:"Pinging…", fetchReply:true });
    const rt   = sent.createdTimestamp - interaction.createdTimestamp;
    return interaction.editReply({ components:[cv2(`# 🏓 Pong!\n\n⚡ Roundtrip: **${rt}ms**\n📡 WebSocket: **${Math.round(client.ws.ping)}ms**`)], flags:MessageFlags.IsComponentsV2, content:"" });
  },
};

module.exports = [afkCmd, snipe, avatar, ping];
