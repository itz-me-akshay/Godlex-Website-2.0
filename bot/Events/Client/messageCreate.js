const {
  ContainerBuilder, TextDisplayBuilder, MessageFlags,
} = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild || message.webhookId) return;

    // ── Return from AFK ───────────────────────────────────────────────────────
    const selfKey = `${message.guild.id}:${message.author.id}`;
    if (db.afk.has(selfKey)) {
      const data = db.afk.get(selfKey);
      db.afk.delete(selfKey);
      message.member.setNickname(data.nickname).catch(() => {});
      const c = new ContainerBuilder();
      c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `✅ Welcome back, ${message.author}! Your AFK has been removed.`
        )
      );
      message.reply({
        components: [c],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      }).catch(() => {});
    }

    // ── Notify if mentioned user is AFK ───────────────────────────────────────
    for (const [, mentioned] of message.mentions.users) {
      if (mentioned.bot) continue;
      const mKey = `${message.guild.id}:${mentioned.id}`;
      if (!db.afk.has(mKey)) continue;
      const data = db.afk.get(mKey);
      const mins = Math.floor((Date.now() - data.setAt) / 60_000);
      const c = new ContainerBuilder();
      c.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `💤 **${mentioned.username}** is AFK\n> ${data.message}\n> *${mins}m ago*`
        )
      );
      message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      break;
    }

    // ── Poll auto-react ───────────────────────────────────────────────────────
    const pollCh = db.pollChannels.get(message.guild.id);
    if (pollCh && message.channel.id === pollCh) {
      message.react("👍").catch(() => {});
      message.react("👎").catch(() => {});
    }

    // ── Prefix commands ───────────────────────────────────────────────────────
    if (!message.content.startsWith(client.config.prefix)) return;
    const args    = message.content.slice(client.config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();
    if (!cmdName) return;
    let cmd = client.pcommands.get(cmdName)
           ?? client.pcommands.get(client.aliases.get(cmdName));
    if (!cmd) return;
    if (cmd.ownerOnly && message.author.id !== client.config.ownerID) return;
    try { cmd.execute(message, client, args); } catch (err) { console.error(err); }
  },
};
