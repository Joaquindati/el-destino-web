// Genera app/eventPhotos.json con la lista de fotos de /public/assets/eventos.
// Corre solo (predev / prebuild): dejás las fotos en la carpeta y el slider las levanta.
// Cualquier nombre sirve; se ordenan de forma natural (e-1, e-2, e-10…).
import { readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "assets", "eventos");
const out = path.join(process.cwd(), "app", "eventPhotos.json");
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

let files = [];
if (existsSync(dir)) {
  const entries = await readdir(dir);
  files = entries
    .filter((f) => !f.startsWith(".") && exts.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
    .map((f) => `/assets/eventos/${f}`);
}

await writeFile(out, JSON.stringify(files, null, 2) + "\n");
console.log(`[eventos] ${files.length} foto(s) → app/eventPhotos.json`);
