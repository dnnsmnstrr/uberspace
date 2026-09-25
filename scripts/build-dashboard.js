// Builds the Homer dashboard into build/dashboard/.
// Downloads the pinned Homer release (cached in build/) and writes
// dashboard/config.yml into it with all `hidden: true` entries removed.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const YAML = require("yaml");

const HOMER_VERSION = "v26.08.3";
const root = path.join(__dirname, "..");
const buildDir = path.join(root, "build");
const outDir = path.join(buildDir, "dashboard");
const zipPath = path.join(buildDir, `homer-${HOMER_VERSION}.zip`);

fs.mkdirSync(buildDir, { recursive: true });
if (!fs.existsSync(zipPath)) {
  const url = `https://github.com/bastienwirtz/homer/releases/download/${HOMER_VERSION}/homer.zip`;
  execSync(`curl -fsSL -o "${zipPath}" "${url}"`, { stdio: "inherit" });
}
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir);
execSync(`unzip -q "${zipPath}" -d "${outDir}"`, { stdio: "inherit" });

const config = YAML.parse(fs.readFileSync(path.join(root, "dashboard/config.yml"), "utf8"));
const visible = (entry) => !entry.hidden;
config.services = (config.services || [])
  .filter(visible)
  .map((group) => ({ ...group, items: (group.items || []).filter(visible) }))
  .filter((group) => group.items.length > 0);
config.links = (config.links || []).filter(visible);

fs.writeFileSync(path.join(outDir, "assets/config.yml"), YAML.stringify(config));
console.log(`Dashboard built in ${path.relative(root, outDir)}`);
