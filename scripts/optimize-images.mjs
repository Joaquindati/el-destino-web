// Optimiza las imágenes de /public/assets:
//   • JPG/JPEG/PNG  → WebP (calidad 80, borde máx. 1600px), borra el original
//   • WebP          → recomprime in-place (calidad 80, borde máx. 1600px)
//   • AVIF          → se deja como está (ya es eficiente)
//
// Corré:  node scripts/optimize-images.mjs
// Idempotente: volver a correrlo sobre WebP ya optimizados casi no cambia nada.
import { readdir, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "assets");
const MAX_EDGE = 1600; // borde más largo permitido (retina para slots <= 800px)
const QUALITY = 80;

const kb = (b) => (b / 1024).toFixed(0) + " KB";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

let before = 0;
let after = 0;
let converted = 0;
let recompressed = 0;

for (const file of await walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

  const origSize = (await stat(file)).size;
  const img = sharp(file, { failOn: "none" });
  const meta = await img.metadata();

  const longest = Math.max(meta.width || 0, meta.height || 0);
  if (longest > MAX_EDGE) {
    if ((meta.width || 0) >= (meta.height || 0)) img.resize({ width: MAX_EDGE, withoutEnlargement: true });
    else img.resize({ height: MAX_EDGE, withoutEnlargement: true });
  }

  const buf = await img.webp({ quality: QUALITY, effort: 6 }).toBuffer();

  const target = file.slice(0, -ext.length) + ".webp";
  const tmp = target + ".tmp";
  await sharp(buf).toFile(tmp);
  const newSize = (await stat(tmp)).size;

  // Para WebP ya existentes, no reemplaces si no achicamos (evita degradar).
  if (ext === ".webp" && newSize >= origSize) {
    await unlink(tmp);
    before += origSize;
    after += origSize;
    console.log(`= ${path.relative(ROOT, file)}  ${kb(origSize)} (sin cambios)`);
    continue;
  }

  await rename(tmp, target);
  if (ext !== ".webp") await unlink(file); // borra el JPG/PNG original

  before += origSize;
  after += newSize;
  if (ext === ".webp") recompressed++;
  else converted++;

  const pct = (100 * (1 - newSize / origSize)).toFixed(0);
  console.log(`${ext === ".webp" ? "~" : "→"} ${path.relative(ROOT, target)}  ${kb(origSize)} → ${kb(newSize)}  (-${pct}%)`);
}

console.log("\n────────────────────────────────────────");
console.log(`Convertidas a WebP : ${converted}`);
console.log(`Recomprimidas      : ${recompressed}`);
console.log(`Total antes        : ${kb(before)}  (${(before / 1048576).toFixed(1)} MB)`);
console.log(`Total después      : ${kb(after)}  (${(after / 1048576).toFixed(1)} MB)`);
console.log(`Ahorro             : ${kb(before - after)}  (-${(100 * (1 - after / before)).toFixed(0)}%)`);
