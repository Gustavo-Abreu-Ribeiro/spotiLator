import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "AGENTS.md",
  "DOING.md",
  "README.md",
  "docs/vision.md",
  "docs/architecture.md",
  "docs/modules.md",
  "docs/roadmap.md",
  "docs/status.md",
  "docs/activity-log/README.md",
  "docs/bugs-and-gaps/known-bugs.md",
  ".codex/skills/spotilator-development/SKILL.md",
  "index.html",
  "styles.css",
  "src/main.js"
];

for (const file of required) {
  assert.ok(existsSync(join(root, file)), `missing required file: ${file}`);
}

const sourceFiles = walk(root).filter((file) => /\.(js|mjs|css|html|md)$/.test(file));
for (const file of sourceFiles) {
  const relative = file.slice(root.length + 1).replaceAll("\\", "/");
  if (relative.startsWith("dist/") || relative.startsWith(".git/")) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  assert.ok(lines.length <= 500, `${relative} exceeds 500 lines`);
}

const repoText = sourceFiles
  .filter((file) => !file.includes(`${join(root, "dist")}`))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

assert.ok(!/spotify_[A-Za-z0-9_]{20,}/.test(repoText), "possible Spotify secret committed");
assert.ok(!/-----BEGIN (RSA |OPENSSH )?PRIVATE KEY-----/.test(repoText), "private key committed");

console.log("verify ok");

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (["node_modules", ".git"].includes(entry)) return [];
      return walk(fullPath);
    }
    return [fullPath];
  });
}
