
// Generate manifest.json files for each outreach image folder.
// These manifests tell the site which image files exist in a gallery, so new photos can be added without editing HTML.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "images", "outreach");
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