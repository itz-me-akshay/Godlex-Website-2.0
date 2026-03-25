const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    const line = "─".repeat(48);
    console.log(`\n${line}`);
    console.log(`  ✦  ${client.user.tag}  |  Online`);
    console.log(`  Guilds   : ${client.guilds.cache.size}`);
    console.log(`  Commands : ${client.commands.size}`);
    console.log(`${line}\n`);

    const statuses = [
      { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
      { name: "Use /help",                           type: ActivityType.Playing  },
    ];
    let i = 0;

    function setStatus() {
      client.user.setPresence({
        status:     PresenceUpdateStatus.DoNotDisturb,
        activities: [{ name: statuses[i].name, type: statuses[i].type }],
      });
    }

    setStatus();
    setInterval(() => {
      i = (i + 1) % statuses.length;
      setStatus();
    }, 30_000);
  },
};
