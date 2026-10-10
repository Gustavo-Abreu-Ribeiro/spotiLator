import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

if (existsSync(dist)) {
  rmSync(dist, { recursive: true, force: true });
}

mkdirSync(dist, { recursive: true });
copyFileSync(join(root, "index.html"), join(dist, "index.html"));
copyFileSync(join(root, "styles.css"), join(dist, "styles.css"));
cpSync(join(root, "src"), join(dist, "src"), { recursive: true });

console.log("build ok: dist/");
