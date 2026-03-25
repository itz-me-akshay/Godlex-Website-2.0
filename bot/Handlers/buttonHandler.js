const { loadFiles } = require("../Functions/fileLoader");

async function loadButtons(client) {
  const files = await loadFiles("Buttons");
  for (const file of files) {
    const btn = require(file);
    if (!btn?.id) continue;
    client.buttons.set(btn.id, btn);
  }
  console.log(`✓ Loaded ${client.buttons.size} button handlers`);
}

module.exports = { loadButtons };
