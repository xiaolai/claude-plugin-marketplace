#!/usr/bin/env bash
# Coordinated release of the cc-suite ↔ claude-octopus bridge.
#
# Run this from the marketplace repo after a new claude-octopus version
# is published to npm. It:
#   1. verifies the new claude-octopus version is reachable on npm
#   2. updates cc-suite's scripts/lib/claude-octopus-pin.txt
#   3. runs cc-suite's integration suite — T39 actually boots the pin and
#      handshakes it over MCP, so a broken upstream release fails the
#      script before any version gets bumped
#   4. bumps cc-suite's .claude-plugin/plugin.json (patch / minor / major)
#   5. updates the marketplace's .claude-plugin/marketplace.json + README
#
# The script never publishes, never commits, never pushes. It prepares
# every file change and prints the exact git/marketplace-push commands
# the human should run after eyeballing the diffs. The two repos
# (cc-suite, marketplace) remain independent; this just enforces that
# they move together when the bridge moves.
#
# Usage:
#   scripts/release-claude-bridge.sh <new-claude-octopus-version> [patch|minor|major]
#
# Example:
#   scripts/release-claude-bridge.sh 1.1.11 patch
#
# Environment overrides (rarely needed):
#   CC_SUITE_REPO=/path/to/cc-suite        # default: ../../../../github/xiaolai/myprojects/claude-plugins/cc-suite
#   SKIP_NPM_VERIFY=1                      # skip the `npm view` reachability check
#   SKIP_INTEGRATION=1                     # skip running cc-suite's tests/integration.sh

set -euo pipefail

# ── arg parsing ──────────────────────────────────────────────────────────────
if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  cat >&2 <<USAGE
usage: $0 <new-claude-octopus-version> [patch|minor|major]
example: $0 1.1.11 patch
USAGE
  exit 2
fi

NEW_OCTOPUS_VERSION="$1"
BUMP_KIND="${2:-patch}"

case "$BUMP_KIND" in
  patch|minor|major) ;;
  *) echo "! second arg must be patch|minor|major (got '$BUMP_KIND')" >&2; exit 2 ;;
esac

# Basic semver shape check on the new claude-octopus version.
if ! [[ "$NEW_OCTOPUS_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-+].*)?$ ]]; then
  echo "! claude-octopus version doesn't look like semver: '$NEW_OCTOPUS_VERSION'" >&2
  exit 2
fi

# ── locate the repos ─────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MARKETPLACE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# cc-suite lives in the user's workspace, alongside other plugin repos.
# Default path covers the standard xiaolai workspace layout.
DEFAULT_CC_SUITE="${HOME}/github/xiaolai/myprojects/claude-plugins/cc-suite"
CC_SUITE_REPO="${CC_SUITE_REPO:-$DEFAULT_CC_SUITE}"

if [ ! -d "$CC_SUITE_REPO" ]; then
  echo "! cc-suite repo not found at: $CC_SUITE_REPO" >&2
  echo "  set CC_SUITE_REPO=<path> if it lives elsewhere" >&2
  exit 1
fi
if [ ! -f "$CC_SUITE_REPO/.claude-plugin/plugin.json" ]; then
  echo "! $CC_SUITE_REPO doesn't look like the cc-suite repo (no .claude-plugin/plugin.json)" >&2
  exit 1
fi

PIN_FILE="$CC_SUITE_REPO/scripts/lib/claude-octopus-pin.txt"
PLUGIN_JSON="$CC_SUITE_REPO/.claude-plugin/plugin.json"
MARKETPLACE_JSON="$MARKETPLACE_DIR/.claude-plugin/marketplace.json"
MARKETPLACE_README="$MARKETPLACE_DIR/README.md"

# ── helper: read current values ──────────────────────────────────────────────
read_pin() { tr -d '[:space:]' < "$PIN_FILE" 2>/dev/null || true; }
read_cc_suite_version() {
  node -p "require('$PLUGIN_JSON').version" 2>/dev/null || true
}
bump_semver() {
  # $1 = current version, $2 = patch|minor|major
  node -e "
    const v = process.argv[1].split('.').map(Number);
    const k = process.argv[2];
    if (k === 'patch') v[2]++;
    else if (k === 'minor') { v[1]++; v[2] = 0; }
    else if (k === 'major') { v[0]++; v[1] = 0; v[2] = 0; }
    console.log(v.join('.'));
  " "$1" "$2"
}

CURRENT_PIN="$(read_pin)"
CURRENT_CC_SUITE="$(read_cc_suite_version)"
if [ -z "$CURRENT_CC_SUITE" ]; then
  echo "! could not read current cc-suite version from $PLUGIN_JSON" >&2
  exit 1
fi
NEW_CC_SUITE="$(bump_semver "$CURRENT_CC_SUITE" "$BUMP_KIND")"

echo "── coordinated bridge release ──────────────────────────────────────────"
echo "  claude-octopus pin:  ${CURRENT_PIN:-<none>}  →  ${NEW_OCTOPUS_VERSION}"
echo "  cc-suite version:    ${CURRENT_CC_SUITE}  →  ${NEW_CC_SUITE}  (${BUMP_KIND} bump)"
echo "  cc-suite repo:       ${CC_SUITE_REPO}"
echo "  marketplace repo:    ${MARKETPLACE_DIR}"
echo

# ── step 1: verify claude-octopus is reachable on npm ───────────────────────
if [ "${SKIP_NPM_VERIFY:-0}" != "1" ]; then
  echo "→ Step 1: verifying claude-octopus@${NEW_OCTOPUS_VERSION} is published to npm"
  if ! npm view "claude-octopus@${NEW_OCTOPUS_VERSION}" version >/dev/null 2>&1; then
    echo "! npm has no claude-octopus@${NEW_OCTOPUS_VERSION} — publish it first" >&2
    exit 1
  fi
  echo "  ✓ npm has claude-octopus@${NEW_OCTOPUS_VERSION}"
else
  echo "→ Step 1: skipped (SKIP_NPM_VERIFY=1)"
fi

# ── step 2: update the pin in cc-suite ──────────────────────────────────────
echo "→ Step 2: writing new pin into ${PIN_FILE}"
printf '%s\n' "$NEW_OCTOPUS_VERSION" > "$PIN_FILE"
echo "  ✓ pin file updated"

# ── step 3: run the cc-suite integration suite ──────────────────────────────
if [ "${SKIP_INTEGRATION:-0}" != "1" ]; then
  echo "→ Step 3: running cc-suite integration suite (T39 will boot+handshake the new pin)"
  if ! ( cd "$CC_SUITE_REPO" && bash tests/integration.sh >/tmp/cc-suite-release.log 2>&1 ); then
    echo "! integration suite FAILED — reverting pin to ${CURRENT_PIN:-<none>}" >&2
    if [ -n "$CURRENT_PIN" ]; then
      printf '%s\n' "$CURRENT_PIN" > "$PIN_FILE"
    fi
    echo "  see /tmp/cc-suite-release.log for details" >&2
    tail -30 /tmp/cc-suite-release.log >&2
    exit 1
  fi
  _passed=$(grep -oE 'Results: [0-9]+ passed' /tmp/cc-suite-release.log | tail -1 || true)
  echo "  ✓ ${_passed:-integration suite passed}"
else
  echo "→ Step 3: skipped (SKIP_INTEGRATION=1) — DANGEROUS, the pin is now unverified"
fi

# ── step 4: bump cc-suite's plugin.json ────────────────────────────────────
echo "→ Step 4: bumping cc-suite to ${NEW_CC_SUITE}"
node -e "
  const fs = require('fs');
  const p = '$PLUGIN_JSON';
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.version = '$NEW_CC_SUITE';
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
"
echo "  ✓ ${PLUGIN_JSON} updated"

# ── step 5: update marketplace manifests + README ──────────────────────────
echo "→ Step 5: updating marketplace manifest + README"

# .claude-plugin/marketplace.json — find the cc-suite entry and bump its version.
node -e "
  const fs = require('fs');
  const p = '$MARKETPLACE_JSON';
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const entry = (j.plugins || []).find(x => x.name === 'cc-suite');
  if (!entry) { console.error('! no cc-suite entry in ' + p); process.exit(1); }
  entry.version = '$NEW_CC_SUITE';
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
"
echo "  ✓ ${MARKETPLACE_JSON} updated"

# README.md — bump the cc-suite row's version column. Match on the cc-suite
# repo URL to avoid touching unrelated lines.
if grep -q 'cc-suite' "$MARKETPLACE_README"; then
  # Use a node one-liner so we don't fight sed's BSD/GNU split.
  node -e "
    const fs = require('fs');
    const p = '$MARKETPLACE_README';
    let t = fs.readFileSync(p, 'utf8');
    const re = /(\| \[cc-suite\]\(https:\/\/github\.com\/xiaolai\/cc-suite\)[^|]*\|[^|]*\| )([0-9][^ |]*)( \|)/;
    if (!re.test(t)) { console.error('! could not find cc-suite version cell in README'); process.exit(1); }
    t = t.replace(re, '\$1$NEW_CC_SUITE\$3');
    fs.writeFileSync(p, t);
  "
  echo "  ✓ ${MARKETPLACE_README} version cell updated"
else
  echo "  · README has no cc-suite mention — skipping README bump"
fi

# ── done — print the commands the human runs ────────────────────────────────
cat <<EOF

── coordinated release prepared ───────────────────────────────────────────
The two repos now have matching versions. Inspect the diffs, then push.

# cc-suite — verify and push
cd "$CC_SUITE_REPO"
git diff
git add scripts/lib/claude-octopus-pin.txt .claude-plugin/plugin.json
git commit -m "v${NEW_CC_SUITE}: bump claude-octopus pin to ${NEW_OCTOPUS_VERSION}"
git push

# marketplace — verify and push
cd "$MARKETPLACE_DIR"
git diff
git add .claude-plugin/marketplace.json README.md
git commit -m "Update cc-suite to v${NEW_CC_SUITE} — claude-octopus pin → ${NEW_OCTOPUS_VERSION}"
git push
EOF
