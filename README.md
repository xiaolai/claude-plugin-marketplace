# claude-plugin-marketplace

Central marketplace for Claude Code plugins by xiaolai.

## Installation

```bash
claude plugin marketplace add xiaolai/claude-plugin-marketplace
```

## Available Plugins

| Plugin | Description | Version |
|--------|-------------|---------|
| [codex-toolkit](https://github.com/xiaolai/codex-toolkit-for-claude) | OpenAI Codex MCP integration — audit, implement, verify, review, and debug | 0.8.2 |
| [tdd-guardian](https://github.com/xiaolai/tdd-guardian-for-claude) | TDD Guardian — test-first workflow, coverage gates, mutation testing, test quality audits | 0.7.1 |
| [echo-sleuth](https://github.com/xiaolai/echo-sleuth-for-claude) | Echo Sleuth — mine past conversations, manage memory lifecycle, extract knowledge | 0.3.4 |
| [loc-guardian](https://github.com/xiaolai/loc-guardian-for-claude) | LOC Guardian — enforce per-file pure LOC limits with automated optimization strategies | 0.1.4 |
| [grill](https://github.com/xiaolai/grill-for-claude) | Grill — deep codebase interrogation with 6 specialized agents, 5 review styles, and 8 add-on pressure tests | 1.2.3 |
| [docs-guardian](https://github.com/xiaolai/docs-guardian-for-claude) | Docs Guardian — documentation quality and freshness enforcer with staleness detection, accuracy checking, and auto-generation | 0.1.6 |
| [nlpm](https://github.com/xiaolai/nlpm-for-claude) | NLPM — scan, score, check, fix, test, security-scan, and trend-track NL artifacts with focused agents, working hooks, and the 50 Rules | 0.7.9 |
| [claude-english-buddy](https://github.com/xiaolai/claude-english-buddy-for-claude) | English language coach — auto-corrects prompts, translates non-English, tracks improvement over time | 0.3.0 |
| [awful](https://github.com/xiaolai/awful-for-claude) | awful — design, generate, and audit agent workflows driven by GitHub events using labels as routing | 0.1.2 |

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
