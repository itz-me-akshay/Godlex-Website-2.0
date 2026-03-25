const fs   = require("fs");
const path = require("path");

function prefixCommands(client) {
  const dir = path.join(__dirname, "..", "pCommands");
  if (!fs.existsSync(dir)) return;
  for (const folder of fs.readdirSync(dir)) {
    const fp = path.join(dir, folder);
    if (!fs.statSync(fp).isDirectory()) continue;
    for (const file of fs.readdirSync(fp).filter(f => f.endsWith(".js"))) {
      const cmd = require(path.join(fp, file));
      if (!cmd?.name) continue;
      client.pcommands.set(cmd.name, cmd);
      if (Array.isArray(cmd.aliases))
        cmd.aliases.forEach(a => client.aliases.set(a, cmd.name));
    }
  }
  console.log(`✓ Loaded ${client.pcommands.size} prefix commands`);
}

module.exports = { prefixCommands };
