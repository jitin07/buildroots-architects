// Converts the design bundle's source PNGs (../project/assets) into web-ready
// assets under public/assets. Geometry is never altered: photos are only
// re-encoded; the floor plan keeps its full 3625×4541 resolution.
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "..", "project", "assets");
const out = join(root, "public", "assets");

const jobs = [
  { from: "brand/mark.png", to: "brand/mark.png", copy: true },
  { from: "brand/logo-full.png", to: "brand/logo-full.png", copy: true },
  { from: "projects/buildroots-office/exterior-staircase.png", to: "projects/buildroots-office/exterior-staircase.webp", q: 82 },
  { from: "projects/buildroots-office/exterior-entrance.png", to: "projects/buildroots-office/exterior-entrance.webp", q: 82 },
  { from: "projects/buildroots-office/interior-conference.png", to: "projects/buildroots-office/interior-conference.webp", q: 82 },
  { from: "projects/buildroots-office/interior-cabin.png", to: "projects/buildroots-office/interior-cabin.webp", q: 82 },
  { from: "projects/buildroots-office/ground-floor-plan.png", to: "projects/buildroots-office/ground-floor-plan.webp", q: 90 },
];

for (const j of jobs) {
  const dest = join(out, j.to);
  await mkdir(dirname(dest), { recursive: true });
  if (j.copy) await copyFile(join(src, j.from), dest);
  else await sharp(join(src, j.from)).webp({ quality: j.q, effort: 6 }).toFile(dest);
  console.log("✓", j.to);
}
