require("dotenv").config();

const {
  Client, GatewayIntentBits, Partials, Collection,
} = require("discord.js");
const { LavalinkManager } = require("lavalink-client");

const { loadEvents }     = require("./Handlers/eventHandler");
const { loadCommands }   = require("./Handlers/commandHandler");
const { loadButtons }    = require("./Handlers/buttonHandler");
const { loadModals }     = require("./Handlers/modalHandler");
const { loadSelects }    = require("./Handlers/selectHandler");
const { prefixCommands } = require("./Handlers/prefixHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel, Partials.GuildMember,
    Partials.Message, Partials.Reaction, Partials.User,
  ],
});

client.config    = require("./config.json");
client.commands  = new Collection();
client.pcommands = new Collection();
client.aliases   = new Collection();
client.events    = new Collection();
client.buttons   = new Collection();
client.modals    = new Collection();
client.selects   = new Collection();
client.cooldowns = new Collection();

process.removeAllListeners("warning");
process.on("warning", () => {});

// ── Lavalink Music Manager ────────────────────────────────────────────────────
client.lavalink = new LavalinkManager({
  nodes: [
    {
      id:            "main",
      host:          process.env.LAVALINK_HOST || "lava-v4.ajieblogs.eu.org",
      port:          parseInt(process.env.LAVALINK_PORT || "80"),
      authorization: process.env.LAVALINK_PASS || "https://dsc.gg/ajidevserver",
      secure:        false,
    },
  ],
  sendToShard: (guildId, payload) =>
    client.guilds.cache.get(guildId)?.shard?.send(payload),
  autoSkip: true,
  client:   { id: process.env.CLIENT_ID || "", username: "MusicBot" },
  playerOptions: {
    defaultSearchPlatform: "ytsearch",
    onDisconnect: { autoReconnect: true, destroyPlayer: false },
    onEmptyQueue:  { destroyAfterMs: 300_000 },
  },
  queueOptions: { maxPreviousTracks: 20 },
});

// Forward Discord raw WS packets to Lavalink
client.on("raw", (d) => client.lavalink.sendRawData(d));

loadEvents(client);

client
  .login(process.env.TOKEN)
  .then(async () => {
    client.lavalink.init({ id: client.user.id, username: client.user.username });
    loadCommands(client);
    loadButtons(client);
    loadModals(client);
    loadSelects(client);
    prefixCommands(client);
    // Re-schedule any reminders that survived a restart
    const { restoreReminders } = require("./Commands/Utility/poll");
    restoreReminders(client);
  })
  .catch((err) => console.error("Login error:", err));

client.on("error", (err) => console.error("Discord API Error:", err));
process.on("unhandledRejection", (err) => console.error("Unhandled Rejection:", err));
process.on("uncaughtException",  (err) => console.error("Uncaught Exception:", err));

module.exports = client;
