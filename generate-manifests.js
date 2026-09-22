
// Generate manifest.json files for each outreach image folder.
// These manifests tell the site which image files exist in a gallery, so new photos can be added without editing HTML.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "images", "outreach");
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

if (!fs.existsSync(ROOT)) {
  console.log(`no ${ROOT} directory — skipping manifest generation`);
  process.exit(0);
}

fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .forEach((entry) => {
    const folder = path.join(ROOT, entry.name);
    const files = fs
      .readdirSync(folder)
      .filter((f) => IMAGE_EXT.test(f))
      .sort();

    fs.writeFileSync(
      path.join(folder, "manifest.json"),
      JSON.stringify(files, null, 2)
    );
    console.log(`${entry.name}: ${files.length} image(s)`);
  });