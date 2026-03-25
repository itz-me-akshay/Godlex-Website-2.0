const { loadFiles } = require("../Functions/fileLoader");

async function loadEvents(client) {
  await client.events.clear();
  const files = await loadFiles("Events");
  for (const file of files) {
    const event   = require(file);
    const execute = (...args) => event.execute(...args, client);
    client.events.set(event.name, execute);
    if (event.once) client.once(event.name, execute);
    else            client.on(event.name, execute);
  }
  console.log(`✓ Loaded ${client.events.size} event listeners`);
}

module.exports = { loadEvents };
