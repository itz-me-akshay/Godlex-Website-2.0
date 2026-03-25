/**
 * Database/db.js
 *
 * JSON file-based persistence layer.
 * Each collection maps to its own file under Databases/.
 * Reads are done from an in-memory cache; writes flush to disk immediately.
 *
 * API is intentionally Map-compatible so the rest of the codebase stays clean.
 */

"use strict";

const fs   = require("fs");
const path = require("path");

const DB_DIR = path.join(__dirname, "..", "Databases");

// Ensure the Databases folder exists at startup
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

class JsonDB {
  /**
   * @param {string} name  Collection name (maps to Databases/<name>.json)
   */
  constructor(name) {
    this.name     = name;
    this.filePath = path.join(DB_DIR, `${name}.json`);
    this._cache   = {};
    this._load();
  }

  // ── Internal ────────────────────────────────────────────────────────────────

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf8").trim();
        this._cache = raw ? JSON.parse(raw) : {};
      } else {
        this._cache = {};
        this._flush();
      }
    } catch (err) {
      console.error(`[DB] Failed to load ${this.name}.json:`, err.message);
      this._cache = {};
    }
  }

  _flush() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this._cache, null, 2), "utf8");
    } catch (err) {
      console.error(`[DB] Failed to save ${this.name}.json:`, err.message);
    }
  }

  // ── Public API (Map-compatible) ─────────────────────────────────────────────

  /** Get a value by key. Returns undefined if not found. */
  get(key) {
    return this._cache[String(key)];
  }

  /** Set a value. Immediately flushes to disk. */
  set(key, value) {
    this._cache[String(key)] = value;
    this._flush();
    return this;
  }

  /** Delete a key. Immediately flushes to disk. */
  delete(key) {
    delete this._cache[String(key)];
    this._flush();
    return this;
  }

  /** Check if a key exists. */
  has(key) {
    return Object.prototype.hasOwnProperty.call(this._cache, String(key));
  }

  /** Number of entries. */
  get size() {
    return Object.keys(this._cache).length;
  }

  /** Clear all entries. */
  clear() {
    this._cache = {};
    this._flush();
  }

  /** Iterate over [key, value] pairs. */
  entries() {
    return Object.entries(this._cache);
  }

  /** Iterate over keys. */
  keys() {
    return Object.keys(this._cache);
  }

  /** Iterate over values. */
  values() {
    return Object.values(this._cache);
  }

  /** forEach support. */
  forEach(cb) {
    for (const [k, v] of this.entries()) cb(v, k, this);
  }

  /** for...of support. */
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}

// ── Export one instance per collection ─────────────────────────────────────────

module.exports = {
  warnings:     new JsonDB("warnings"),     // "guildId:userId" → [{ reason, moderator, date }]
  ticketSetup:  new JsonDB("ticketSetup"),  // guildId          → { channelId, logChannelId, supportRoleId, categoryId, types }
  tickets:      new JsonDB("tickets"),      // channelId        → { guildId, userId, type, number, closed, createdAt }
  ticketCount:  new JsonDB("ticketCount"),  // guildId          → number
  welcomeConfig:new JsonDB("welcomeConfig"),// guildId          → { channelId, message }
  leaveConfig:  new JsonDB("leaveConfig"),  // guildId          → { channelId, message }
  logConfig:    new JsonDB("logConfig"),    // guildId          → { channelId }
  autoRole:     new JsonDB("autoRole"),     // guildId          → roleId
  afk:          new JsonDB("afk"),          // "guildId:userId" → { message, nickname, setAt }
  reminders:    new JsonDB("reminders"),    // id               → { userId, channelId, text, fireAt }
  pollChannels: new JsonDB("pollChannels"), // guildId          → channelId

  // tempvcSetup: guildId → { triggerChannelId, categoryId, nameTemplate }
  tempvcSetup:   new JsonDB("tempvcSetup"),
  // tempvcChannels: channelId → { guildId, ownerId, createdAt }
  tempvcChannels: new JsonDB("tempvcChannels"),

  // snipeCache is intentionally NOT persisted (ephemeral, expires in 5 min)
  snipeCache:   new Map(),
};
