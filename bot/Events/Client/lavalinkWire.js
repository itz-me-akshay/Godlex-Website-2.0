// Wires lavalink player events into the bot's event system.
// Runs once after clientReady.

module.exports = {
  name: "clientReady",
  once: false,
  async execute(client) {
    if (client._lavalinkWired) return;
    client._lavalinkWired = true;

    client.lavalink.on("trackStart", (player, track, payload) =>
      client.emit("trackStart", player, track, payload));
    client.lavalink.on("trackEnd",   (player, track, payload) =>
      client.emit("trackEnd",   player, track, payload));
    client.lavalink.on("queueEnd",   (player, track, payload) =>
      client.emit("queueEnd",   player, track, payload));

    const { loadFiles } = require("../../Functions/fileLoader");
    const files = await loadFiles("Events/Player");
    for (const file of files) {
      const ev = require(file);
      if (!ev?.name || !ev?.execute) continue;
      client.on(ev.name, (...args) => ev.execute(...args, client));
    }
  },
};
