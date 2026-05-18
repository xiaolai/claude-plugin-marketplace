#!/usr/bin/env node
// Bootstrap converter: Claude Code plugin layout → Codex plugin layout.
//
// Usage:
//   node scripts/build-codex.mjs <plugin-dir>
//
// What it does:
//   1. Reads <plugin-dir>/.claude-plugin/plugin.json
//   2. Reads <plugin-dir>/codex-config.json (per-plugin overrides) if present
//   3. Writes <plugin-dir>/.codex-plugin/plugin.json with merged `interface` block
//   4. Copies <plugin-dir>/skills/*/SKILL.md → <plugin-dir>/codex/skills/*/SKILL.md
//      (strips Claude-specific frontmatter fields)
//   5. Converts <plugin-dir>/agents/*.md → <plugin-dir>/codex/skills/<prefix>-<name>/SKILL.md
//      (strips model/color/tools, replaces "## [Agent: …] Findings" with "## [Skill: …] Findings")
//   6. Converts <plugin-dir>/commands/*.md → <plugin-dir>/codex/skills/<prefix>-<name>/SKILL.md
//      (strips allowed-tools)
//   7. Synthesizes <plugin-dir>/CLAUDE.md → <plugin-dir>/codex/AGENTS.md (CLAUDE.md → AGENTS.md,
//      "agents" → "skills" terminology, comments out Claude-specific tool/model references)
//
// What it does NOT do:
//   - Validate Codex schema correctness (no published schema yet)
//   - Translate Task() calls inside command bodies — these need human review
//   - Generate skill cross-references ($skill-name syntax) — left to the author
//   - Handle hook config (hooks/hooks.json is byte-compatible per research; copy verbatim)
//
// After running this script, hand-review every generated SKILL.md and the AGENTS.md.

import fs from 'node:fs';
import path from 'node:path';

const pluginDir = path.resolve(process.argv[2] || process.cwd());
const codexConfigPath = path.join(pluginDir, 'codex-config.json');
const codexConfig = fs.existsSync(codexConfigPath)
  ? JSON.parse(fs.readFileSync(codexConfigPath, 'utf8'))
  : {};

const codexDir = path.join(pluginDir, 'codex');
const codexSkillsDir = path.join(codexDir, 'skills');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readClaudeManifest() {
  const manifestPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`No Claude manifest at ${manifestPath}`);
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function writeCodexManifest(claudeManifest) {
  const codexManifest = {
    name: claudeManifest.name,
    version: claudeManifest.version,
    description: claudeManifest.description,
    author: claudeManifest.author,
    homepage: claudeManifest.homepage || claudeManifest.repository,
    repository: claudeManifest.repository,
    license: claudeManifest.license,
    keywords: claudeManifest.keywords,
    skills: './codex/skills/',
    interface: {
      displayName: codexConfig.interface?.displayName || claudeManifest.name,
      shortDescription: codexConfig.interface?.shortDescription || claudeManifest.description,
      longDescription: codexConfig.interface?.longDescription || claudeManifest.description,
      developerName: claudeManifest.author?.name || 'unknown',
      category: codexConfig.interface?.category || 'Coding',
      capabilities: codexConfig.interface?.capabilities || ['Read'],
      defaultPrompt: codexConfig.interface?.defaultPrompt || [`Use ${claudeManifest.name}.`],
      websiteURL: claudeManifest.repository,
      screenshots: [],
    },
  };
  const codexPluginDir = path.join(pluginDir, '.codex-plugin');
  ensureDir(codexPluginDir);
  fs.writeFileSync(
    path.join(codexPluginDir, 'plugin.json'),
    JSON.stringify(codexManifest, null, 2) + '\n',
  );
  console.log(`  ✓ Wrote .codex-plugin/plugin.json`);
}

// Parse YAML frontmatter (minimal — handles key: value, quoted strings, simple lists).
// Returns { frontmatter: object, body: string } or null if no frontmatter.
function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) return null;
  const endIdx = content.indexOf('\n---\n', 4);
  if (endIdx === -1) return null;
  const fmText = content.slice(4, endIdx);
  const body = content.slice(endIdx + 5);
  const frontmatter = {};
  let currentKey = null;
  for (const line of fmText.split('\n')) {
    if (line.match(/^[a-zA-Z][a-zA-Z0-9_-]*:/)) {
      const colonIdx = line.indexOf(':');
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      if (value === '' || value === '|' || value === '>') {
        frontmatter[key] = '';
        currentKey = key;
      } else {
        frontmatter[key] = value.replace(/^["']|["']$/g, '');
        currentKey = key;
      }
    } else if (line.startsWith('  ') && currentKey) {
      frontmatter[currentKey] = (frontmatter[currentKey] || '') + '\n' + line.trim();
    }
  }
  return { frontmatter, body };
}

function serializeFrontmatter(fm) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (v.includes('\n')) {
      lines.push(`${k}: |`);
      for (const subline of v.split('\n')) {
        lines.push(`  ${subline}`);
      }
    } else if (v.includes(':') || v.includes('#') || v.startsWith('-')) {
      lines.push(`${k}: "${v.replace(/"/g, '\\"')}"`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

// Copy a SKILL.md, stripping Claude-specific frontmatter fields.
function copySkill(srcPath, destPath) {
  const content = fs.readFileSync(srcPath, 'utf8');
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    fs.writeFileSync(destPath, content);
    return;
  }
  const { frontmatter, body } = parsed;
  // Strip Claude-specific fields that Codex either ignores or doesn't honor
  delete frontmatter.globs;
  delete frontmatter.model;
  delete frontmatter.color;
  delete frontmatter.tools;
  delete frontmatter['allowed-tools'];
  delete frontmatter['argument-hint'];
  delete frontmatter.arguments;
  ensureDir(path.dirname(destPath));
  fs.writeFileSync(destPath, serializeFrontmatter(frontmatter) + '\n' + body);
}

// Convert an agent/command MD file to a Codex skill.
function convertAgentOrCommand(srcPath, destDir, skillPrefix) {
  const content = fs.readFileSync(srcPath, 'utf8');
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    console.warn(`  ! ${srcPath} has no frontmatter — copying body only`);
    fs.writeFileSync(path.join(destDir, 'SKILL.md'), content);
    return;
  }
  const { frontmatter, body } = parsed;
  const originalName = frontmatter.name || path.basename(srcPath, '.md');
  const newName = `${skillPrefix}-${originalName}`;

  // Build Codex-compatible frontmatter
  const codexFm = {
    name: newName,
    description: frontmatter.description || `Use for ${originalName}.`,
  };

  // Rewrite body: replace "## [Agent: <orig>] Findings" with "## [Skill: <new>] Findings"
  let newBody = body
    .replace(/## \[Agent: ([^\]]+)\] Findings/g, `## [Skill: ${newName}] Findings`)
    .replace(/grill-core skill/g, '$grill-core'); // legacy reference fixup

  // Strip embedded <example> blocks from description-style frontmatter remnants
  // (these are Claude-specific and confuse Codex skill auto-match)
  codexFm.description = codexFm.description.split('<example>')[0].trim();

  ensureDir(destDir);
  fs.writeFileSync(
    path.join(destDir, 'SKILL.md'),
    serializeFrontmatter(codexFm) + '\n' + newBody,
  );
}

function synthesizeAgentsMd() {
  const claudeMdPath = path.join(pluginDir, 'CLAUDE.md');
  if (!fs.existsSync(claudeMdPath)) {
    console.warn(`  ! No CLAUDE.md to synthesize from`);
    return;
  }
  let content = fs.readFileSync(claudeMdPath, 'utf8');
  // Light terminology shift for Codex audience
  content = content
    .replace(/CLAUDE\.md/g, 'AGENTS.md')
    .replace(/Claude Code/g, 'Codex CLI')
    .replace(/`Task` tool/g, '`$skill-name` invocation');
  ensureDir(codexDir);
  fs.writeFileSync(path.join(codexDir, 'AGENTS.md'), content);
  console.log(`  ✓ Wrote codex/AGENTS.md`);
}

function copyHooks() {
  const hooksDir = path.join(pluginDir, 'hooks');
  if (!fs.existsSync(hooksDir)) return;
  const destHooksDir = path.join(codexDir, 'hooks');
  ensureDir(destHooksDir);
  for (const file of fs.readdirSync(hooksDir)) {
    const src = path.join(hooksDir, file);
    const dest = path.join(destHooksDir, file);
    let content = fs.readFileSync(src, 'utf8');
    // Shim env vars: ${CLAUDE_PLUGIN_ROOT} → ${PLUGIN_ROOT} (with Claude fallback)
    content = content.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, '${PLUGIN_ROOT}');
    content = content.replace(/\$\{CLAUDE_PLUGIN_DATA\}/g, '${PLUGIN_DATA}');
    fs.writeFileSync(dest, content);
  }
  console.log(`  ✓ Copied hooks/ with env-var shim`);
}

// ---- Main ----

console.log(`Building Codex layout for ${pluginDir}`);

const claudeManifest = readClaudeManifest();
const skillPrefix = codexConfig.skillPrefix || claudeManifest.name;
writeCodexManifest(claudeManifest);

// Refuse to overwrite an existing hand-built codex/ tree unless --force is given
if (fs.existsSync(codexDir) && !process.argv.includes('--force')) {
  console.error(`\nRefusing to clobber existing ${codexDir}. Pass --force to overwrite.`);
  process.exit(1);
}

// Copy existing skills — walks any depth, copies every SKILL.md it finds
function walkSkills(dir, relativeFrom = dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSkills(fullPath, relativeFrom);
    } else if (entry.name === 'SKILL.md') {
      // Take the parent dir's name as the skill name; flatten nested groups
      const parentName = path.basename(path.dirname(fullPath));
      const destSkill = path.join(codexSkillsDir, parentName, 'SKILL.md');
      copySkill(fullPath, destSkill);
      console.log(`  ✓ Skill ${parentName} → codex/skills/${parentName}/`);
    }
  }
}
walkSkills(path.join(pluginDir, 'skills'));

// Convert agents → skills
const agentsDir = path.join(pluginDir, 'agents');
if (fs.existsSync(agentsDir)) {
  for (const file of fs.readdirSync(agentsDir)) {
    if (!file.endsWith('.md')) continue;
    const srcPath = path.join(agentsDir, file);
    const originalName = path.basename(file, '.md');
    const newSkillName = `${skillPrefix}-${originalName}`;
    const destDir = path.join(codexSkillsDir, newSkillName);
    convertAgentOrCommand(srcPath, destDir, skillPrefix);
    console.log(`  ✓ Agent ${originalName} → codex/skills/${newSkillName}/`);
  }
}

// Convert commands → skills
const commandsDir = path.join(pluginDir, 'commands');
if (fs.existsSync(commandsDir)) {
  for (const file of fs.readdirSync(commandsDir)) {
    if (!file.endsWith('.md')) continue;
    const srcPath = path.join(commandsDir, file);
    const originalName = path.basename(file, '.md');
    const newSkillName = `${skillPrefix}-${originalName}`;
    const destDir = path.join(codexSkillsDir, newSkillName);
    convertAgentOrCommand(srcPath, destDir, skillPrefix);
    console.log(`  ✓ Command ${originalName} → codex/skills/${newSkillName}/`);
  }
}

synthesizeAgentsMd();
copyHooks();

// Warn about features the converter can't translate
const warnings = [];
if (fs.existsSync(path.join(pluginDir, '.claude/rules'))) {
  warnings.push('.claude/rules/ has no Codex equivalent — fold rules into AGENTS.md or per-skill SKILL.md bodies');
}
if (fs.existsSync(path.join(pluginDir, 'hooks/hooks.json'))) {
  const hookContent = fs.readFileSync(path.join(pluginDir, 'hooks/hooks.json'), 'utf8');
  if (hookContent.includes('SessionEnd')) {
    warnings.push('hooks.json references SessionEnd — Codex has no SessionEnd event. Migrate logic to Stop or out-of-band trigger');
  }
  if (hookContent.includes('SubagentStop') || hookContent.includes('PreCompact') || hookContent.includes('Notification')) {
    warnings.push('hooks.json uses an event Codex does not support (SubagentStop / PreCompact / Notification)');
  }
}
const commandsSharedDir = path.join(pluginDir, 'commands/shared');
if (fs.existsSync(commandsSharedDir)) {
  warnings.push('commands/shared/ partials were skipped — inline them into the parent skill bodies or convert to reference skills');
}

console.log('\nDone. Hand-review every generated SKILL.md before release.');
console.log('Specifically check:');
console.log('  - .codex-plugin/plugin.json interface block (displayName, longDescription, etc.)');
console.log('  - $skill-name cross-references in skill bodies');
console.log('  - Task() calls or "agent" references that should now read as "skill" invocations');
console.log('  - AGENTS.md terminology and Claude-specific instructions');

if (warnings.length > 0) {
  console.log('\nManual intervention required:');
  for (const w of warnings) console.log(`  ! ${w}`);
}
