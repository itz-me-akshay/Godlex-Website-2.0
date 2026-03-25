const db = require("../../Database/db");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    if (message.author?.bot || !message.guild) return;
    if (!message.content && !message.attachments.size) return;
    db.snipeCache.set(message.channel.id, {
      content:      message.content || "*[attachment]*",
      authorTag:    message.author.tag,
      authorAvatar: message.author.displayAvatarURL({ size: 128 }),
      deletedAt:    Date.now(),
    });
    setTimeout(() => db.snipeCache.delete(message.channel.id), 5 * 60_000);
  },
};
