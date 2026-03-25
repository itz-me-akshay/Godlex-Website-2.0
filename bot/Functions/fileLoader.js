const { glob } = require("glob");
const path = require("path");

async function loadFiles(dirName) {
  try {
    const basePath = path.join(__dirname, "..").replace(/\\/g, "/");
    const files    = await glob(`${basePath}/${dirName}/**/*.js`);
    files.forEach((f) => { try { delete require.cache[require.resolve(f)]; } catch {} });
    return files;
  } catch {
    return [];
  }
}

module.exports = { loadFiles };
