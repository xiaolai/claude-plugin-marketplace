# claude-plugin-marketplace

Central marketplace for Claude Code plugins by xiaolai.

## Installation

```bash
claude plugin marketplace add xiaolai/claude-plugin-marketplace
```

## Available Plugins

| Plugin | Description | Version |
|--------|-------------|---------|
| [codex-toolkit](https://github.com/xiaolai/codex-toolkit-for-claude) | OpenAI Codex MCP integration — audit, implement, verify, review, and debug | 0.8.3 |
| [tdd-guardian](https://github.com/xiaolai/tdd-guardian-for-claude) | TDD Guardian — test-first workflow, coverage gates, mutation testing, test quality audits | 0.7.2 |
| [echo-sleuth](https://github.com/xiaolai/echo-sleuth-for-claude) | Echo Sleuth — mine past conversations, manage memory lifecycle, extract knowledge | 0.3.6 |
| [loc-guardian](https://github.com/xiaolai/loc-guardian-for-claude) | LOC Guardian — enforce per-file pure LOC limits with automated optimization strategies | 0.1.5 |
| [grill](https://github.com/xiaolai/grill-for-claude) | Grill — deep codebase interrogation with 6 specialized agents, 5 review styles, and 8 add-on pressure tests | 1.2.4 |
| [docs-guardian](https://github.com/xiaolai/docs-guardian-for-claude) | Docs Guardian — documentation quality and freshness enforcer with staleness detection, accuracy checking, and auto-generation | 0.1.8 |
| [nlpm](https://github.com/xiaolai/nlpm-for-claude) | NLPM — scan, score, check, fix, test, security-scan, and trend-track NL artifacts via focused agents and the 50 Rules; v0.8.0+ adds a standalone Python validator and a shields.io "Validated by NLPM" badge for pre-commit / CI that catches manifest-vs-disk inconsistency (the bug class no other ecosystem tool checks) | 0.8.4 |
| [claude-english-buddy](https://github.com/xiaolai/claude-english-buddy-for-claude) | English language coach — auto-corrects prompts, translates non-English, tracks improvement over time | 0.3.1 |
| [mermaid-preview](https://github.com/xiaolai/mermaid-preview-for-claude) | Mermaid Preview — auto-preview diagrams in the browser on Write/Edit, offline-safe, dark-mode aware | 0.1.3 |
| [ui-tokenize](https://github.com/xiaolai/ui-tokenize) | UI Tokenize — block hardcoded UI values; rewrite-first PreToolUse hook corrects literals to design-token references on the way to disk; configurable `strict` / `advisory` strictness; per-project `surfaces` allowlist narrows scanning; `/tokenize:review` dispatches the `token-reviewer` agent for semantic mis-pick review | 0.4.0 |
| [ui-responsive](https://github.com/xiaolai/ui-responsive) | UI Responsive — advisory responsive-design coach; flags off-catalog breakpoints, bare 100vh, fixed widths without max-width via PostToolUse additionalContext | 0.1.0 |
| [north-star](https://github.com/xiaolai/north-star-system-prompt) | North Star — 260-token system prompt overriding three RLHF-inherited presumptions (independence, calibration, first-principles); ambient + slash command + subagent layered delivery | 0.1.1 |

## Installing Plugins

### Global (all projects)

```bash
claude plugin install codex-toolkit@xiaolai --scope user
claude plugin install tdd-guardian@xiaolai --scope user
claude plugin install echo-sleuth@xiaolai --scope user
claude plugin install loc-guardian@xiaolai --scope user
claude plugin install grill@xiaolai --scope user
claude plugin install docs-guardian@xiaolai --scope user
```

### Project only (current project)

```bash
claude plugin install codex-toolkit@xiaolai --scope project
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
