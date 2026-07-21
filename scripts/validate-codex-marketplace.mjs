#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(repoRoot, '.agents', 'plugins', 'marketplace.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.equal(typeof manifest.name, 'string', 'marketplace.name must be a string');
assert.ok(manifest.name.length > 0, 'marketplace.name must not be empty');
assert.ok(Array.isArray(manifest.plugins), 'marketplace.plugins must be an array');
assert.ok(manifest.plugins.length > 0, 'marketplace.plugins must not be empty');

const names = new Set();
const authenticationPolicies = new Set(['ON_INSTALL', 'ON_USE']);
const sourceTypes = new Set(['git-subdir', 'local', 'npm', 'url']);

for (const plugin of manifest.plugins) {
  assert.equal(typeof plugin.name, 'string', 'every plugin must have a name');
  assert.ok(!names.has(plugin.name), `duplicate plugin name: ${plugin.name}`);
  names.add(plugin.name);

  assert.ok(
    sourceTypes.has(plugin.source?.source),
    `${plugin.name}: unsupported source type ${JSON.stringify(plugin.source?.source)}`,
  );
  if (plugin.source.source === 'url' || plugin.source.source === 'git-subdir') {
    assert.match(
      plugin.source.url,
      /^https:\/\/.+\.git$/,
      `${plugin.name}: Git source.url must be an HTTPS clone URL ending in .git`,
    );
  }
  if (plugin.source.source === 'local' || plugin.source.source === 'git-subdir') {
    assert.match(
      plugin.source.path,
      /^\.\//,
      `${plugin.name}: source.path must start with ./`,
    );
  }
  if (plugin.source.source === 'npm') {
    assert.equal(typeof plugin.source.package, 'string', `${plugin.name}: npm source needs package`);
    assert.equal(typeof plugin.source.version, 'string', `${plugin.name}: npm source needs version`);
  }
  assert.equal(
    plugin.policy?.installation,
    'AVAILABLE',
    `${plugin.name}: policy.installation must be AVAILABLE`,
  );
  assert.ok(
    authenticationPolicies.has(plugin.policy?.authentication),
    `${plugin.name}: policy.authentication must be ON_INSTALL or ON_USE`,
  );
  assert.equal(typeof plugin.category, 'string', `${plugin.name}: category must be a string`);
}

console.log(`Validated ${manifest.plugins.length} Codex marketplace entries.`);
