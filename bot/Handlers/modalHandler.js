const { loadFiles } = require("../Functions/fileLoader");

async function loadModals(client) {
  const files = await loadFiles("Modals");
  for (const file of files) {
    const m = require(file);
    if (!m?.id) continue;
    client.modals.set(m.id, m);
  }
  console.log(`✓ Loaded ${client.modals.size} modal handlers`);
}

module.exports = { loadModals };
