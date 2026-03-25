/**
 * store.js — All bot data, persisted to Databases/*.json via JsonDB.
 *
 * Every module imports from here.  The API is identical to the old in-memory
 * Map version, so no other file needed to change.
 *
 * JSON files live in:  Databases/<name>.json
 */

const JsonDB = require("../Databases/db.js");

// ── Moderation ────────────────────────────────────────────────────────────────
// Key: "guildId:userId"  →  Array<{ reason, moderator, date }>
const warnings = new JsonDB("warnings");

// ── Tickets ───────────────────────────────────────────────────────────────────
// Key: guildId  →  { channelId, logChannelId, supportRoleId, categoryId, types[] }
const ticketSetup = new JsonDB("ticketSetup");
// Key: channelId  →  { guildId, userId, type, number, closed, createdAt }
const tickets     = new JsonDB("tickets");
// Key: guildId  →  number
const ticketCount = new JsonDB("ticketCount");

// ── Welcome / Leave ───────────────────────────────────────────────────────────
// Key: guildId  →  { channelId, message }
const welcomeConfig = new JsonDB("welcomeConfig");
const leaveConfig   = new JsonDB("leaveConfig");

// ── Logging ───────────────────────────────────────────────────────────────────
// Key: guildId  →  { channelId }
const logConfig = new JsonDB("logConfig");

// ── Auto-role ─────────────────────────────────────────────────────────────────
// Key: guildId  →  roleId (string)
const autoRole = new JsonDB("autoRole");

// ── AFK ───────────────────────────────────────────────────────────────────────
// Key: "guildId:userId"  →  { message, nickname, setAt }
const afk = new JsonDB("afk");

// ── Reminders ─────────────────────────────────────────────────────────────────
// Key: unique id (timestamp string)  →  { userId, channelId, text, fireAt }
const reminders = new JsonDB("reminders");

function nextReminderId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── Poll channels ─────────────────────────────────────────────────────────────
// Key: guildId  →  channelId (string)
const pollChannels = new JsonDB("pollChannels");

// ── Snipe cache (intentionally volatile — no persistence) ─────────────────────
// Key: channelId  →  { content, authorTag, authorAvatar, deletedAt }
const snipeCache = new Map();

// ── Giveaways ─────────────────────────────────────────────────────────────────
// Key: messageId  →  { guildId, channelId, prize, winnersCount, endsAt, entries[], ended }
const giveaways = new JsonDB("giveaways");

module.exports = {
  warnings,
  ticketSetup, tickets, ticketCount,
  welcomeConfig, leaveConfig,
  logConfig,
  autoRole,
  afk,
  reminders, nextReminderId,
  pollChannels,
  snipeCache,
  giveaways,
};
