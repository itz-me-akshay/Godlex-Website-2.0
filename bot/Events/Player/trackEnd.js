module.exports = {
  name: "trackEnd",
  async execute(player, track, payload, client) {
    const reason = payload?.reason ?? "FINISHED";
    const msgId  = player.get("npMsgId");
    const chId   = player.get("npChId");
    if (!msgId || !chId) return;

    const ch  = client.channels.cache.get(chId);
    const msg = await ch?.messages.fetch(msgId).catch(() => null);
    if (!msg) return;

    if (reason === "REPLACED") {
      msg.delete().catch(() => {});
    } else {
      msg.edit({ content: `✅ Finished: ~~**${track.info.title}**~~`, components: [], flags: [] }).catch(() => {});
      setTimeout(() => msg.delete().catch(() => {}), 6_000);
    }

    player.set("npMsgId", null);
    player.set("npChId",  null);
  },
};
