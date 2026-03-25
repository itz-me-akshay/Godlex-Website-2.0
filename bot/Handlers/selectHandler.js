const { loadFiles } = require("../Functions/fileLoader");

async function loadSelects(client) {
  const files = await loadFiles("SelectMenus");
  for (const file of files) {
    const s = require(file);
    if (!s?.id) continue;
    client.selects.set(s.id, s);
  }
  console.log(`✓ Loaded ${client.selects.size} select menu handlers`);
}

module.exports = { loadSelects };
