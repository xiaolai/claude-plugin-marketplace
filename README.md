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
| [cc-suite](https://github.com/xiaolai/cc-suite) | CC Suite — one plugin to bridge and delegate across Claude Code, Codex CLI, and Gemini CLI: single-source AGENTS.md, shared skills, mirrored hooks and MCP servers, full Claude↔Codex bidirectional delegation (including Codex reading Claude's session history), a Claude→Grok Build delegation lane over ACP, project-scoped advisor agents, and opt-in bridging to more coding agents (Grok Build, opencode, Qwen Code, Kimi CLI). Supersedes cc-bridge and codex-toolkit. | 0.11.0 |
| [tdd-guardian](https://github.com/xiaolai/tdd-guardian-for-claude) | TDD Guardian — test-first workflow, coverage gates, mutation testing, test quality audits | 0.7.2 |
| [echo-sleuth](https://github.com/xiaolai/echo-sleuth-for-claude) | Echo Sleuth — mine past conversations, manage memory lifecycle, extract knowledge | 0.4.0 |
| [loc-guardian](https://github.com/xiaolai/loc-guardian-for-claude) | LOC Guardian — enforce per-file pure LOC limits with automated optimization strategies | 0.1.5 |
| [grill](https://github.com/xiaolai/grill-for-claude) | Grill — deep codebase interrogation with 6 specialized agents, 5 review styles, and 8 add-on pressure tests | 1.3.0 |
| [reason-grill](https://github.com/xiaolai/reason-grill-for-claude) | reason-grill — deep argument interrogation: map a claim, then attack it from five adversarial angles (logic, evidence, counter, assumptions, integrity); a six-check calibration gate refuses to manufacture objections; returns a calibrated verdict (HOLDS / HOLDS-IF-NARROWED / WOUNDED / DEFEATED) | 0.3.0 |
| [docs-guardian](https://github.com/xiaolai/docs-guardian-for-claude) | Docs Guardian — documentation quality and freshness enforcer with staleness detection, accuracy checking, and auto-generation | 0.1.8 |
| [nlpm](https://github.com/xiaolai/nlpm) | NLPM — score, check, fix, and test NL artifacts across **Claude Code, Codex CLI, and Antigravity**; tier-aware scoring with per-tool overlays (universal `nlpm:conventions` floor + `conventions-claude`, `conventions-codex`, `conventions-antigravity` overlays); per-tool Hooks tables (the three event vocabularies aren't 1:1 mappable); standalone Python validator (`bin/nlpm-check`) remains tool-agnostic for pre-commit hooks and CI; manifest-vs-disk consistency check still the differentiator in the Claude ecosystem | 1.1.2 |
| [claude-english-buddy](https://github.com/xiaolai/claude-english-buddy-for-claude) | English language coach — auto-corrects prompts, translates non-English, tracks improvement over time | 0.5.1 |
| [mermaid-preview](https://github.com/xiaolai/mermaid-preview-for-claude) | Mermaid Preview — auto-preview diagrams in the browser on Write/Edit, offline-safe, dark-mode aware; opens the tab once per file | 0.1.4 |
| [ui-tokenize](https://github.com/xiaolai/ui-tokenize) | UI Tokenize — block hardcoded UI values; rewrite-first PreToolUse hook corrects literals to design-token references on the way to disk; configurable `strict` / `advisory` strictness; per-project `surfaces` allowlist narrows scanning; `/tokenize:review` dispatches the `token-reviewer` agent for semantic mis-pick review | 0.4.0 |
| [ui-responsive](https://github.com/xiaolai/ui-responsive) | UI Responsive — advisory responsive-design coach; flags off-catalog breakpoints, bare 100vh, fixed widths without max-width via PostToolUse additionalContext | 0.1.0 |
| [north-star](https://github.com/xiaolai/north-star-system-prompt) | North Star — 260-token system prompt overriding three RLHF-inherited presumptions (independence, calibration, first-principles); ambient + slash command + subagent layered delivery | 0.1.1 |
| [anthropic-docs](https://github.com/xiaolai/anthropic-docs) | Auto-updated Anthropic docs — 8 skills covering claude-code, claude-agent-sdk, anthropic-api, anthropic-platform-features, claude-connectors, claude-cowork, mcp-spec, plus anthropic-pulse (news + research digest); GitHub Actions pipeline refreshes daily from upstream docs + HTML feeds; supersedes the archived single-skill predecessor `claude-agent-sdk-skill-autoupdated` | 1.0.0 |
| [eou-foundry](https://github.com/xiaolai/eou-foundry) | EOU Foundry — recursive governance for Executable Operating Units (EOUs): faceted classification, generating-EOU constraints, ECP-governed change, no-self-approval. 12 skills covering candidate generation, audit, specify, refactor, promote, foundry-wide audit, ECP authoring, init scaffolding, Stage 0 capture, and judgment audit. | 0.8.1 |
| [bureau](https://github.com/xiaolai/bureau) | Bureau — turn AI sessions into a maintained, human-reviewed knowledge base: capture → compile → review → query, gated by trust tiers (proposed → verified → canonical), with a BUREAU.md instruction (imported by CLAUDE.md) that makes every session honor them; renders to an offline gazette (built by the bundled press). A deterministic recursion engine tracks claim-level dependencies (rests_on + author-anchored spans) so changing an upstream claim flags every downstream page for review; a live Engine view (bureau:serve) shows three signals as you edit — dependency freshness (needs-review/stale), artifact currency (a verified file that drifted out from under a claim), and a convergence trend — and git-backed versioning renders any past board, diffs two versions, and pins named snapshots. Enables a crew of specialized agents. Self-contained. | 0.13.1 |
| [xros](https://github.com/xiaolai/xros) | XROS — executable research operating system. Four commands: **compile** a long-horizon investigation into a verifiable methodology spec; **sharpen** an un-checkable question (orient a newcomer in a field's vocabulary → falsifiable claim → best-available check, with its ceiling); **run** the Tier-A/B multi-agent engine (diverse routes, adversarial refutation) gated on a real oracle's exit code; or **reason** through a no-oracle Tier-C claim with premises, pre-mortem, and dated tripwires. Founding rule: no verification, no claim. Ships a bundled dependency-free validator + conformance suite. | 0.3.0 |
| ~~[cc-bridge](https://github.com/xiaolai/cc-bridge-for-claude)~~ | **DEPRECATED** — use `cc-suite` instead | 0.1.0 |

## Available Plugins (Codex CLI)

Codex ports are added incrementally as each plugin is converted. Status table — entries are removed from "pending" and added here once their `.codex-plugin/` artifacts are committed and smoke-tested.

Most ports keep their skills under `codex/skills/`. `xros` instead ships a **single root `skills/` tree** shared by Codex, Google Antigravity, and xAI Grok (all three implement the same `skills/<name>/SKILL.md` contract), with its `.codex-plugin/plugin.json` pointing at `./skills/`. Antigravity and Grok are installed directly from the plugin repo (`agy plugin install <git-url>` / `grok plugin install xiaolai/xros --trust`), not through this marketplace — though Grok also reads Claude Code marketplaces automatically, so `grok plugin install xros --trust` works once this marketplace is registered.

| Plugin | Description | Version | Status |
|--------|-------------|---------|--------|
| [grill](https://github.com/xiaolai/grill-for-claude) | Grill — deep codebase interrogation with 7 specialized analysis skills, 5 review styles, and 8 add-on pressure tests | 1.3.0 | Layout committed; install-side smoke test pending |
| [reason-grill](https://github.com/xiaolai/reason-grill-for-claude) | reason-grill — deep argument interrogation: map a claim, attack it from five adversarial angles (logic, evidence, counter, assumptions, integrity) via $reason-grill-roast; a calibration gate refuses to manufacture objections; returns a calibrated verdict | 0.3.0 | Layout committed; install-side smoke test pending |
| [eou-foundry](https://github.com/xiaolai/eou-foundry) | EOU Foundry — turn messy workflows into auditable Executable Operating Units with recursive governance (12 skills: candidate generation, audit, specify, refactor, promote, foundry-wide audit, ECP authoring, init scaffolding, Stage 0 capture, judgment audit). v0.7.0 ships Stage 0 (captured_workflow + per-app domain_values constitutional layer + Rule 96 consumption). v0.8.0 ships agentic judgment (judgment_authorized flag, value_invocations trace, F14–F17 taxonomy, judgment_maturity J0–J4 axis, $audit-judgment skill, Rule 97, counterfactual-swap audit). | 0.8.1 | |
| [nlpm](https://github.com/xiaolai/nlpm) | NLPM — reference-knowledge skills (17): the 50 Rules, the 100-point scoring rubric, per-tool conventions (Claude Code / Codex CLI / Antigravity), anti-patterns, vocabulary discipline, and authoring guides. Knowledge skills, not commands — `$nlpm-rules` + `$nlpm-scoring` to score an artifact, `$nlpm-conventions-codex` for the Codex layout. The interactive `/nlpm:*` linting commands stay a Claude Code plugin (they orchestrate sub-agents); cross-tool deterministic checks use the standalone `bin/nlpm-check`. | 1.1.2 | Reference-knowledge port; the command/agent orchestration stays Claude-only by design |
| [xros](https://github.com/xiaolai/xros) | XROS — an eXecutable Research Operating System. Four skills (`$xros-compile`, `$xros-sharpen`, `$xros-run`, `$xros-reason`): turn an investigation into a verifiable methodology spec, then gate the verdict on a real oracle's exit code. Founding rule: no verification, no claim. Ships a dependency-free validator + conformance suite. | 0.3.0 | Layout committed; install-side smoke test pending |

**Pending ports**: tdd-guardian, loc-guardian, docs-guardian, echo-sleuth, claude-english-buddy. The Claude↔Codex delegation lane is now handled by [`cc-suite`](https://github.com/xiaolai/cc-suite) (single plugin, bidirectional). `codex-guardian` (Codex-artifact auditor) remains a planned future addition for the Codex-only audit niche.

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
