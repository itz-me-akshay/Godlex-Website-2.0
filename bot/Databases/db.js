/**
 * JsonDB — a Map-compatible in-memory cache backed by a JSON file.
 *
 * Every .set() / .delete() immediately writes the full JSON to disk so
 * data survives restarts. Reads come from the in-memory cache so they
 * are instant with no disk I/O.
 *
 * Usage:
 *   const db = new JsonDB("warnings");
 *   db.set("guildId:userId", [...warns]);
 *   db.get("guildId:userId");  // → array
 *   db.has("guildId:userId");  // → true/false
 *   db.delete("guildId:userId");
 *   for (const [key, value] of db) { ... }  // iterable like Map
 */

const fs   = require("fs");
const path = require("path");

// Ensure the Databases directory exists next to this file
const DB_DIR = path.join(__dirname);

class JsonDB {
  /**
   * @param {string} name - filename without .json extension
   */
  constructor(name) {
    this._name     = name;
    this._filepath = path.join(DB_DIR, `${name}.json`);
    this._cache    = {};
    this._load();
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  _load() {
    try {
      if (fs.existsSync(this._filepath)) {
        const raw = fs.readFileSync(this._filepath, "utf8");
        this._cache = JSON.parse(raw);
      } else {
        this._cache = {};
        this._save();
      }
    } catch (err) {
      console.error(`[JsonDB] Failed to load ${this._name}.json:`, err.message);
      this._cache = {};
    }
  }

  _save() {
    try {
      fs.writeFileSync(this._filepath, JSON.stringify(this._cache, null, 2), "utf8");
    } catch (err) {
      console.error(`[JsonDB] Failed to save ${this._name}.json:`, err.message);
    }
  }

  // ── Map-compatible API ────────────────────────────────────────────────────

  /** Get a value by key. Returns null if not found (like Map returns undefined). */
  get(key) {
    return Object.prototype.hasOwnProperty.call(this._cache, key)
      ? this._cache[key]
      : null;
  }

  /** Set a key-value pair and persist immediately. */
  set(key, value) {
    this._cache[key] = value;
    this._save();
    return this;
  }

  /** Check if a key exists. */
  has(key) {
    return Object.prototype.hasOwnProperty.call(this._cache, key);
  }

  /** Delete a key and persist. Returns true if the key existed. */
  delete(key) {
    if (!this.has(key)) return false;
    delete this._cache[key];
    this._save();
    return true;
  }

  /** Remove all entries and persist. */
  clear() {
    this._cache = {};
    this._save();
  }

  /** Number of stored entries. */
  get size() {
    return Object.keys(this._cache).length;
  }

  /** Iterate over [key, value] pairs — makes `for (const [k, v] of db)` work. */
  [Symbol.iterator]() {
    return Object.entries(this._cache)[Symbol.iterator]();
  }

  /** Returns an iterator of [key, value] pairs (same as Map.entries()). */
  entries() {
    return Object.entries(this._cache);
  }

  /** Returns all keys. */
  keys() {
    return Object.keys(this._cache);
  }

  /** Returns all values. */
  values() {
    return Object.values(this._cache);
  }

  /** Run a function for each entry. */
  forEach(fn) {
    for (const [key, value] of this) {
      fn(value, key, this);
    }
  }

  /** Dump the entire cache (read-only copy). */
  toJSON() {
    return { ...this._cache };
  }
}

module.exports = JsonDB;
