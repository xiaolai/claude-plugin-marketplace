# claude-plugin-marketplace

Central marketplace for **Claude Code** and **OpenAI Codex CLI** plugins by xiaolai.

Two manifest files live in this repo:

- `.claude-plugin/marketplace.json` — Claude Code entries (read by `claude plugin install`)
- `.agents/plugins/marketplace.json` — Codex CLI entries (read by `codex plugin install`)

Each plugin repo can ship both layouts in parallel: `.claude-plugin/` for Claude Code, `.codex-plugin/` + `codex/` tree for Codex. The two ecosystems coexist in one source repo per plugin.

## Installation

For Claude Code:

```bash
claude plugin marketplace add xiaolai/claude-plugin-marketplace
```

For Codex CLI:

```bash
codex plugin marketplace add xiaolai/claude-plugin-marketplace
```

## Available Plugins (Claude Code)

| Plugin | Description | Version |
|--------|-------------|---------|
| [cc-suite](https://github.com/xiaolai/cc-suite) | CC Suite — one plugin to bridge and delegate across Claude Code, Codex CLI, and Gemini CLI: single-source AGENTS.md, shared skills, mirrored hooks and MCP servers, full Claude↔Codex bidirectional delegation. Supersedes cc-bridge and codex-toolkit. | 0.2.7 |
| [tdd-guardian](https://github.com/xiaolai/tdd-guardian-for-claude) | TDD Guardian — test-first workflow, coverage gates, mutation testing, test quality audits | 0.7.2 |
| [echo-sleuth](https://github.com/xiaolai/echo-sleuth-for-claude) | Echo Sleuth — mine past conversations, manage memory lifecycle, extract knowledge | 0.4.0 |
| [loc-guardian](https://github.com/xiaolai/loc-guardian-for-claude) | LOC Guardian — enforce per-file pure LOC limits with automated optimization strategies | 0.1.5 |
| [grill](https://github.com/xiaolai/grill-for-claude) | Grill — deep codebase interrogation with 6 specialized agents, 5 review styles, and 8 add-on pressure tests | 1.2.5 |
| [docs-guardian](https://github.com/xiaolai/docs-guardian-for-claude) | Docs Guardian — documentation quality and freshness enforcer with staleness detection, accuracy checking, and auto-generation | 0.1.8 |
| [nlpm](https://github.com/xiaolai/nlpm-for-claude) | NLPM — scan, score, check, fix, test, security-scan, and trend-track NL artifacts via focused agents and the 50 Rules; v0.8.0+ adds a standalone Python validator and a shields.io "Validated by NLPM" badge for pre-commit / CI that catches manifest-vs-disk inconsistency; v0.8.5 adds multi-plugin monorepo support; v0.8.15–v0.8.16 add a two-stage rubric-vs-findings drift detector; v0.8.17 adds an exemplar pipeline; v0.8.18 adds an auto-generated exemplar gallery and a human-gated PR pipeline that cites exemplars from the rules file | 0.8.18 |
| [claude-english-buddy](https://github.com/xiaolai/claude-english-buddy-for-claude) | English language coach — auto-corrects prompts, translates non-English, tracks improvement over time | 0.4.0 |
| [mermaid-preview](https://github.com/xiaolai/mermaid-preview-for-claude) | Mermaid Preview — auto-preview diagrams in the browser on Write/Edit, offline-safe, dark-mode aware | 0.1.3 |
| [ui-tokenize](https://github.com/xiaolai/ui-tokenize) | UI Tokenize — block hardcoded UI values; rewrite-first PreToolUse hook corrects literals to design-token references on the way to disk; configurable `strict` / `advisory` strictness; per-project `surfaces` allowlist narrows scanning; `/tokenize:review` dispatches the `token-reviewer` agent for semantic mis-pick review | 0.4.0 |
| [ui-responsive](https://github.com/xiaolai/ui-responsive) | UI Responsive — advisory responsive-design coach; flags off-catalog breakpoints, bare 100vh, fixed widths without max-width via PostToolUse additionalContext | 0.1.0 |
| [north-star](https://github.com/xiaolai/north-star-system-prompt) | North Star — 260-token system prompt overriding three RLHF-inherited presumptions (independence, calibration, first-principles); ambient + slash command + subagent layered delivery | 0.1.1 |
| [anthropic-docs](https://github.com/xiaolai/anthropic-docs) | Auto-updated Anthropic docs — 8 skills covering claude-code, claude-agent-sdk, anthropic-api, anthropic-platform-features, claude-connectors, claude-cowork, mcp-spec, plus anthropic-pulse (news + research digest); GitHub Actions pipeline refreshes every 30 minutes from upstream docs + HTML feeds; supersedes the archived single-skill predecessor `claude-agent-sdk-skill-autoupdated` | 1.0.0 |
| ~~[cc-bridge](https://github.com/xiaolai/cc-bridge-for-claude)~~ | **DEPRECATED** — use `cc-suite` instead | 0.1.0 |
| ~~[codex-toolkit](https://github.com/xiaolai/codex-toolkit-for-claude)~~ | **DEPRECATED** — use `cc-suite` instead | 0.8.4 |

## Available Plugins (Codex CLI)

Codex ports are added incrementally as each plugin is converted. Status table — entries are removed from "pending" and added here once their `.codex-plugin/` and `codex/skills/` artifacts are committed and smoke-tested.

| Plugin | Description | Version | Status |
|--------|-------------|---------|--------|
| [grill](https://github.com/xiaolai/grill-for-claude) | Grill — deep codebase interrogation with 7 specialized analysis skills, 5 review styles, and 8 add-on pressure tests | 1.2.5 | Layout committed; install-side smoke test pending |

**Pending ports**: tdd-guardian, loc-guardian, docs-guardian, echo-sleuth, nlpm, claude-english-buddy. `codex-toolkit` is intentionally not ported — Sendbird's [cc-plugin-codex](https://github.com/sendbird/cc-plugin-codex) covers the Codex→Claude delegation lane; xiaolai's plan is to ship `codex-guardian` (Codex-artifact auditor) in that niche instead.

## Installing Plugins

### Global (all projects)

```bash
claude plugin install cc-suite@xiaolai --scope user
claude plugin install tdd-guardian@xiaolai --scope user
claude plugin install echo-sleuth@xiaolai --scope user
claude plugin install loc-guardian@xiaolai --scope user
claude plugin install grill@xiaolai --scope user
claude plugin install docs-guardian@xiaolai --scope user
```

### Codex installs

Codex installs plugins from a marketplace via the **in-session `/plugins` TUI**, not a shell command. The shell `codex plugin` subcommand only manages marketplaces (no `install` verb exists).

**One-time setup** (shell):

```bash
codex plugin marketplace add xiaolai/claude-plugin-marketplace
```

Codex registers this as marketplace name `xiaolai` (flattened from the GitHub URL — the `name` field inside `.agents/plugins/marketplace.json` is ignored at registration).

**Per-plugin install** (inside a Codex session):

1. Start a session: `codex` (in your project directory)
2. Type `/plugins` — opens the plugin TUI
3. Find grill in the xiaolai marketplace, install/enable it

**Invoking a plugin** (inside a Codex session):

Codex uses the **skill** prefix `$`, not slash commands. Type:

```
$grill-roast
```

Or just describe the task in natural language ("do a multi-angle audit of this codebase") and Codex's auto-match will load the skill from its description.

(More entries to come as Codex ports land.)

### Project only (current project)

```bash
claude plugin install cc-suite@xiaolai --scope project
claude plugin install tdd-guardian@xiaolai --scope project
claude plugin install echo-sleuth@xiaolai --scope project
claude plugin install loc-guardian@xiaolai --scope project
claude plugin install grill@xiaolai --scope project
claude plugin install docs-guardian@xiaolai --scope project
```

### Scope reference

| Scope | Flag | Effect |
|-------|------|--------|
| User (global) | `--scope user` | Available in all projects (default) |
| Project | `--scope project` | Shared with team via `.claude/plugins.json` |
| Local | `--scope local` | Local only, not committed to git |

## Managing Plugins

```bash
claude plugin list                           # List installed plugins
claude plugin update grill@xiaolai           # Update to latest version
claude plugin disable grill@xiaolai          # Temporarily disable
claude plugin enable grill@xiaolai           # Re-enable
claude plugin uninstall grill@xiaolai        # Remove
```

## Troubleshooting

### `plugin install` says "Plugin not found in marketplace 'xiaolai'"

The marketplace is a local git clone, and `claude plugin install` does **not** auto-refresh it before resolving the plugin name. If a plugin was added to the marketplace after your local clone was last updated, install will fail with a misleading "not found" error.

Refresh the marketplace, then retry:

```bash
claude plugin marketplace update xiaolai
claude plugin install <plugin-name>@xiaolai --scope user
```

This is a Claude Code CLI limitation, not a marketplace configuration issue. The plugin is genuinely listed in `marketplace.json`; your local copy is just stale.
