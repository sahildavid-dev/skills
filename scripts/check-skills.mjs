#!/usr/bin/env node
// Checks that every skill is wired up and released properly.
// Run it locally before every commit:
//
//   node scripts/check-skills.mjs                  # structure checks only
//   BASE_SHA=origin/main node scripts/check-skills.mjs  # plus the version bump check
//
// No dependencies, Node 18 or later.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const PROMOTED = ["engineering", "productivity"];
const BUCKETS = [...PROMOTED, "misc", "in-progress", "deprecated"];

const errors = [];
const fail = (msg) => errors.push(msg);
const read = (p) => readFileSync(p, "utf8");
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

const plugin = JSON.parse(read(".claude-plugin/plugin.json"));
const marketplace = JSON.parse(read(".claude-plugin/marketplace.json"));
const readme = read("README.md");
const shipped = new Set(plugin.skills ?? []);

// 1. Manifests agree with each other.
const listed = marketplace.plugins?.map((p) => p.name) ?? [];
if (!listed.includes(plugin.name)) {
  fail(`marketplace.json does not list the plugin "${plugin.name}" from plugin.json`);
}

// 2. Every skill folder is complete and in the right places.
for (const bucket of readdirSync("skills")) {
  const bucketDir = join("skills", bucket);
  if (!isDir(bucketDir)) continue;
  if (!BUCKETS.includes(bucket)) {
    fail(`skills/${bucket}/ is not a known bucket (${BUCKETS.join(", ")})`);
    continue;
  }
  if (!existsSync(join(bucketDir, "README.md"))) fail(`${bucketDir}/README.md is missing`);
  const bucketReadme = existsSync(join(bucketDir, "README.md")) ? read(join(bucketDir, "README.md")) : "";
  const promoted = PROMOTED.includes(bucket);

  for (const name of readdirSync(bucketDir)) {
    const dir = join(bucketDir, name);
    if (!isDir(dir) || !hasFiles(dir)) continue; // git never tracks empty folders
    const where = `skills/${bucket}/${name}`;
    const skillMd = join(dir, "SKILL.md");
    if (!existsSync(skillMd)) {
      fail(`${where}/ has no SKILL.md`);
      continue;
    }

    const fm = frontmatter(read(skillMd));
    if (fm.name !== name) fail(`${where}/SKILL.md: frontmatter name "${fm.name ?? ""}" must match the folder name "${name}"`);
    if (!fm.description) fail(`${where}/SKILL.md: frontmatter needs a description`);

    const yamlPath = join(dir, "agents", "openai.yaml");
    if (!existsSync(yamlPath)) {
      fail(`${where}/agents/openai.yaml is missing`);
    } else {
      const userInvoked = fm["disable-model-invocation"] === "true";
      const codexBlocked = /allow_implicit_invocation:\s*false/.test(read(yamlPath));
      if (userInvoked !== codexBlocked) {
        fail(`${where}: disable-model-invocation in SKILL.md and allow_implicit_invocation in agents/openai.yaml disagree`);
      }
    }

    if (!bucketReadme.includes(`./${name}/SKILL.md`)) fail(`skills/${bucket}/README.md does not link ./${name}/SKILL.md`);

    const entry = `./${where}`;
    if (promoted) {
      if (!shipped.has(entry)) fail(`plugin.json "skills" is missing "${entry}"`);
      if (!readme.includes(`${entry}/SKILL.md`)) fail(`README.md does not link ${entry}/SKILL.md`);
      if (!existsSync(join("docs", bucket, `${name}.md`))) fail(`docs/${bucket}/${name}.md is missing`);
    } else {
      if (shipped.has(entry)) fail(`plugin.json "skills" lists "${entry}", but ${bucket}/ skills must not ship`);
    }
  }
}

// 3. Everything the plugin ships actually exists.
for (const entry of shipped) {
  if (!existsSync(join(entry, "SKILL.md"))) fail(`plugin.json "skills" lists "${entry}", which has no SKILL.md`);
}

// 4. No em or en dashes in the repo's prose.
for (const file of git("ls-files", "*.md").split("\n").filter(Boolean)) {
  read(file).split("\n").forEach((line, i) => {
    if (/[–—]/.test(line)) fail(`${file}:${i + 1}: em or en dash; rewrite the sentence (see CLAUDE.md)`);
  });
}

// 5. A change to a shipped skill comes with a version bump and a changelog entry.
const base = process.env.BASE_SHA;
if (base && !/^0+$/.test(base)) {
  const changed = git("diff", "--name-only", base, "HEAD").split("\n").filter(Boolean);
  const touchesShipped = changed.some(
    (f) => PROMOTED.some((b) => f.startsWith(`skills/${b}/`)) || f === ".claude-plugin/plugin.json",
  );
  if (touchesShipped) {
    let before = "0.0.0";
    try {
      before = JSON.parse(git("show", `${base}:.claude-plugin/plugin.json`)).version;
    } catch {}
    if (compare(plugin.version, before) <= 0) {
      fail(`shipped skills changed, but plugin.json version is ${plugin.version} (was ${before}). Bump it so installs pick up the change.`);
    }
    if (!new RegExp(`^## ${escape(plugin.version)}\\s*$`, "m").test(read("CHANGELOG.md"))) {
      fail(`CHANGELOG.md has no "## ${plugin.version}" section`);
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ ${shipped.size} shipped skill${shipped.size === 1 ? "" : "s"}, all wired up (plugin ${plugin.name} ${plugin.version})`);

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

function hasFiles(dir) {
  return readdirSync(dir).some((f) => {
    const p = join(dir, f);
    return isDir(p) ? hasFiles(p) : true;
  });
}

function compare(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  return 0;
}

function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
