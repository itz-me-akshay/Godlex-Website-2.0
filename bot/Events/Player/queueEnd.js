module.exports = {
  name: "queueEnd",
  async execute(player, _track, _payload, client) {
    const ch = client.channels.cache.get(player.textChannelId);
    if (ch) ch.send("🏁 Queue finished — use `/play` to add more tracks!").catch(() => {});
  },
};
