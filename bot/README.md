# Multipurpose Discord Bot

A fully featured multipurpose Discord bot built with **discord.js v14** using **Components V2** throughout, **Lavalink v4** for music, and **JSON file persistence** so all data survives restarts.

---

## Features

| Category      | Commands |
|---------------|----------|
| 🎵 Music      | `/play` `/search` `/skip` `/pause` `/resume` `/stop` `/disconnect` `/volume` `/loop` `/shuffle` `/queue` `/nowplaying` |
| 🛡️ Moderation  | `/ban` `/kick` `/warn` `/timeout` `/untimeout` `/unban` `/purge` `/slowmode` `/nick` `/role` |
| ℹ️ Information  | `/botinfo` `/serverinfo` `/userinfo` `/help` |
| 🔧 Utility    | `/afk` `/snipe` `/avatar` `/ping` `/poll` `/reminder` |
| 🎮 Fun        | `/8ball` `/coinflip` `/joke` `/roll` `/reverse` |
| ⚙️ Setup      | `/setup-ticket` `/setup-welcome` `/setup-leave` `/setup-logging` `/setup-autorole` |
| 🎙️ Temp VC   | `/tempvoice set` `/tempvoice remove` |

### Temp VC Control Panel
When a member joins the trigger channel, a private voice channel is created for them with a full control panel in the channel chat:
- 🔒 Lock / 🔓 Unlock — prevent or allow others from joining
- ✏️ Rename — rename the channel
- 👥 Limit — set a user limit
- 👢 Kick — remove someone from the channel
- 🔑 Transfer — hand ownership to another member
- 👁️ Hide — make the channel invisible
- 🗑️ Delete — delete the channel immediately

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Fill in your values in `.env`:

| Variable | Description |
|---|---|
| `TOKEN` | Bot token from [Discord Developer Portal](https://discord.com/developers/applications) |
| `CLIENT_ID` | Your bot's application ID |
| `OWNER_ID` | Your Discord user ID |
| `LAVALINK_HOST` | Lavalink node hostname |
| `LAVALINK_PORT` | Lavalink node port |
| `LAVALINK_PASS` | Lavalink node password |

### 3. Set your owner ID in config
Open `config.json` and set `ownerID` to your Discord user ID.

### 4. Start the bot
```bash
npm start
```

---

## Data Persistence

All data is stored as JSON files inside the `Databases/` folder:

| File | Contents |
|---|---|
| `warnings.json` | Member warnings per guild |
| `tickets.json` | Open/closed ticket records |
| `ticketSetup.json` | Ticket system configuration per guild |
| `ticketCount.json` | Ticket number counter per guild |
| `welcomeConfig.json` | Welcome message settings |
| `leaveConfig.json` | Leave message settings |
| `logConfig.json` | Mod log channel settings |
| `autoRole.json` | Auto-role on join settings |
| `afk.json` | Active AFK statuses |
| `reminders.json` | Pending reminders (re-scheduled on restart) |
| `pollChannels.json` | Poll channel settings |
| `tempvcSetup.json` | Temp VC trigger channel settings |
| `tempvcChannels.json` | Active temp VC channel records |

> Snipe cache is the only in-memory-only data (intentional — expires after 5 minutes).

---

## Lavalink

Music requires a running **Lavalink v4** node.

- **Self-host:** Download from [lavalink.dev](https://lavalink.dev)
- **Public node (default):** The `.env.example` includes a public node — not recommended for production

---

## Project Structure

```
bot/
├── index.js
├── config.json
├── .env.example
├── package.json
├── README.md
│
├── Database/
│   └── db.js               ← JsonDB persistence manager
│
├── Databases/              ← Auto-managed JSON data files
│   ├── warnings.json
│   ├── tickets.json
│   └── ... (13 files total)
│
├── Commands/
│   ├── Fun/        fun.js
│   ├── Information/ botinfo.js  help.js  serverinfo.js  userinfo.js
│   ├── Moderation/  ban.js  kick.js  warn.js  mod.js
│   ├── Music/       play.js  controls.js  queue.js
│   ├── Setup/       setup.js  ticket.js
│   ├── TempVC/      tempvoice.js
│   └── Utility/     utility.js  poll.js
│
├── Events/
│   ├── Client/      ready.js  guildMemberAdd.js  guildMemberRemove.js
│   │                messageCreate.js  messageDelete.js
│   │                voiceStateUpdate.js  lavalinkWire.js
│   ├── Interactions/ interactionCreate.js
│   └── Player/      trackStart.js  trackEnd.js  queueEnd.js
│
├── Buttons/
│   ├── Ticket/      close.js  reopen.js  delete.js
│   └── TempVC/      tvc_lock.js  tvc_unlock.js  tvc_rename.js
│                    tvc_limit.js  tvc_kick.js  tvc_transfer.js
│                    tvc_hide.js  tvc_delete.js
│
├── Modals/
│   └── TempVC/      tvc_rename_modal.js  tvc_limit_modal.js
│                    tvc_kick_modal.js  tvc_transfer_modal.js
│
├── SelectMenus/
│   └── Ticket/      ticketSelect.js
│
├── Handlers/        commandHandler.js  eventHandler.js  buttonHandler.js
│                    modalHandler.js  selectHandler.js  prefixHandler.js
│
└── Functions/       fileLoader.js
```

---

## Bot Permissions Required

When inviting the bot, grant these permissions (or just `Administrator`):
- Manage Channels, Manage Roles, Manage Messages
- Kick Members, Ban Members, Moderate Members
- Send Messages, Embed Links, Read Message History
- Connect, Speak, Move Members, Mute Members
