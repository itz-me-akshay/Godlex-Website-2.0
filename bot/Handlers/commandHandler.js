const { loadFiles } = require("../Functions/fileLoader");

async function loadCommands(client) {
  await client.commands.clear();
  const files = await loadFiles("Commands");
  const arr   = [];

  for (const file of files) {
    try {
      const exported = require(file);
      const cmds = Array.isArray(exported) ? exported : [exported];
      for (const cmd of cmds) {
        if (!cmd?.data?.name || !cmd?.execute) continue;
        client.commands.set(cmd.data.name, cmd);
        arr.push(cmd.data.toJSON());
      }
    } catch (err) {
      console.error(`[Commands] Error loading ${file}:`, err.message);
    }
  }

  try {
    await client.application.commands.set(arr);
    console.log(`✓ Registered ${arr.length} slash commands`);
  } catch (err) {
    console.error("[Commands] Registration failed:", err.message);
  }
}

module.exports = { loadCommands };
