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
| [cc-suite](https://github.com/xiaolai/cc-suite) | CC Suite — one plugin to bridge and delegate across Claude Code, Codex CLI, and Antigravity: single-source AGENTS.md, shared skills, mirrored hooks and MCP servers, full Claude↔Codex bidirectional delegation (including Codex reading Claude's session history), a Claude→Grok Build delegation lane over ACP, a bounded read-only Claude→Qwen Code review lane, project-scoped advisor agents, opt-in bridging to more coding agents (Grok Build, opencode, Qwen Code, Kimi CLI), and a cross-repo sweep that repairs bridge leftovers in every bridged project at once (dead MCP registrations, and skills symlinks left pointing at a pruned plugin version). Supersedes cc-bridge and codex-toolkit. | 2.3.5 |
| [tdd-guardian](https://github.com/xiaolai/tdd-guardian-for-claude) | TDD Guardian — per-lane gates (unit/integration/e2e/contract), spec-strength S1-S6, adversarial spec review, red receipts, per-path critical thresholds, 9-format coverage merging | 0.10.2 |
| [echo-sleuth](https://github.com/xiaolai/echo-sleuth-for-claude) | Echo Sleuth — mine past conversations, manage memory lifecycle, extract knowledge | 0.4.4 |
| [loc-guardian](https://github.com/xiaolai/loc-guardian-for-claude) | LOC Guardian — enforce per-file pure LOC limits; deterministic counting, per-file ceilings and exemptions, extraction plans measured in pure LOC, and a `--check` exit-code mode for CI and hooks | 0.4.2 |
| [grill](https://github.com/xiaolai/grill-for-claude) | Deep codebase interrogation: a bounded three-finding quick review by default, with explicit full multi-agent reviews, five review styles and eight pressure tests. | 1.4.0 |
| [reason-grill](https://github.com/xiaolai/reason-grill-for-claude) | Deep argument interrogation: a bounded quick review by default, with an explicit full adversarial panel and evidence-grounded verdicts. | 0.4.0 |
| [docs-guardian](https://github.com/xiaolai/docs-guardian-for-claude) | Documentation freshness, accuracy and coverage checks, plus commit and push guards that resolve the target repository and map outgoing source changes to documentation. | 0.3.0 |
| [nlpm](https://github.com/xiaolai/nlpm) | NLPM — score, check, fix, and test NL artifacts across **Claude Code, Codex CLI, and Antigravity**; tier-aware scoring with per-tool overlays (universal `nlpm:conventions` floor + `conventions-claude`, `conventions-codex`, `conventions-antigravity` overlays); per-tool Hooks tables (the three event vocabularies aren't 1:1 mappable); standalone Python validator (`bin/nlpm-check`) remains tool-agnostic for pre-commit hooks and CI; manifest-vs-disk consistency check still the differentiator in the Claude ecosystem | 1.4.3 |
| [english-buddy](https://github.com/xiaolai/english-buddy-for-claude) | English coaching with configurable on-demand and sampled modes, bounded provider calls, literal-preservation checks and progress reports; the original user prompt remains authoritative. | 0.8.0 |
| [rich-terminal](https://github.com/xiaolai/claude-rich-terminal) | Rich Terminal — Mermaid diagrams drawn inside Claude Code replies: terminal art fitted to the window, optional images in Ghostty and kitty, and an offline browser view; replaces mermaid-preview | 0.2.0 |
| [ui-tokenize](https://github.com/xiaolai/ui-tokenize) | UI Tokenize — block hardcoded UI values; rewrite-first PreToolUse hook corrects literals to design-token references on the way to disk; configurable `strict` / `advisory` strictness; per-project `surfaces` (by file kind) and `ignore` (by path) exclusion honored by hooks and audit; `/ui-tokenize:review` dispatches the `token-reviewer` agent for semantic mis-pick review | 0.4.6 |
| [ui-responsive](https://github.com/xiaolai/ui-responsive) | UI Responsive — advisory responsive-design coach; flags off-catalog breakpoints, bare 100vh, fixed widths without max-width via PostToolUse additionalContext | 0.1.4 |
| [north-star](https://github.com/xiaolai/north-star-system-prompt) | North Star — 260-token system prompt overriding three RLHF-inherited presumptions (independence, calibration, first-principles); ambient + slash command + subagent layered delivery | 0.1.5 |
| [mac-it-guy-pro](https://github.com/xiaolai/mac-it-guy-pro) | Personal IT guy for non-technical macOS users — checkups, safe cleanup, undoable file organising, evidence-first diagnosis, backups with a restore drill, home network, private internet access, automation that leaves reusable tools behind, and a tutor grounded in your machine's own numbers; memory that retires stale beliefs by retesting them; 162 test assertions | 1.9.6 |
| [eou-foundry](https://github.com/xiaolai/eou-foundry) | EOU Foundry — recursive governance for Executable Operating Units (EOUs): faceted classification, generating-EOU constraints, ECP-governed change, no-self-approval. 12 skills covering candidate generation, audit, specify, refactor, promote, foundry-wide audit, ECP authoring, init scaffolding, Stage 0 capture, and judgment audit. | 0.8.4 |
| [bureau](https://github.com/xiaolai/bureau) | Bureau — turn AI sessions into a maintained, human-reviewed knowledge base: capture → compile → review → query, gated by trust tiers (proposed → verified → canonical), with a BUREAU.md instruction (imported by CLAUDE.md) that makes every session honor them; renders to an offline gazette (built by the bundled press). A typed review queue (bureau:review) orders the backlog upstream-first and names the action per page; a human applies decisions per-page or as a reviewed, content-bound, commit-gated batch (approve --from / --all). A deterministic recursion engine tracks claim-level dependencies (rests_on + author-anchored spans) so changing an upstream claim flags every downstream page for review; a live Engine view (bureau:serve) shows three signals as you edit — dependency freshness (needs-review/stale), artifact currency (a verified file that drifted out from under a claim), and a convergence trend — and git-backed versioning renders any past board, diffs two versions, and pins named snapshots. Records architecture decisions as MADR ADR pages (bureau:adr) with typed supersedes edges — superseded only once the superseding ADR is approved (ADR-0006). Delegate the review queue to Codex as your representative (bureau:codex-review) — it advises, or, where a workspace opts the codex authority in, commits under --by codex (ADR-0007). Bulk-approve the whole backlog in one confirmation (bureau:approve-all) — the AI prepares and confirms, you fire the single --by human line. Enables a crew of specialized agents. Self-contained. | 1.0.6 |
| [xros](https://github.com/xiaolai/xros) | XROS — executable research operating system. Four commands: **compile** a long-horizon investigation into a verifiable methodology spec; **sharpen** an un-checkable question (orient a newcomer in a field's vocabulary → falsifiable claim → best-available check, with its ceiling); **run** the Tier-A/B multi-agent engine (diverse routes, adversarial refutation) gated on a real oracle's exit code; or **reason** through a no-oracle Tier-C claim with premises, pre-mortem, and dated tripwires. Founding rule: no verification, no claim. Ships a bundled dependency-free validator + conformance suite. | 0.3.4 |
| [compute-ladder](https://github.com/xiaolai/compute-ladder-for-claude) | Compute routing with guarded effort requests, a measured cheap-model worker and reports of observed main-agent and subagent effort; runtime escalation must be verified. | 0.2.0 |

## Available Plugins (Codex CLI)

Codex ports are added incrementally as each plugin is converted. Status table — entries are removed from "pending" and added here once their `.codex-plugin/` artifacts are committed and smoke-tested.

Most ports keep their skills under `codex/skills/`. `xros` instead ships a **single root `skills/` tree** shared by Codex, Google Antigravity, and xAI Grok (all three implement the same `skills/<name>/SKILL.md` contract), with its `.codex-plugin/plugin.json` pointing at `./skills/`. Antigravity and Grok are installed directly from the plugin repo (`agy plugin install <git-url>` / `grok plugin install xiaolai/xros --trust`), not through this marketplace — though Grok also reads Claude Code marketplaces automatically, so `grok plugin install xros --trust` works once this marketplace is registered.

| Plugin | Description | Version | Status |
|--------|-------------|---------|--------|
| [grill](https://github.com/xiaolai/grill-for-claude) | Deep codebase interrogation: a bounded three-finding quick review by default, with explicit full multi-agent reviews, five review styles and eight pressure tests. | 1.4.0 | Install smoke-tested with Codex CLI 0.144.3 |
| [reason-grill](https://github.com/xiaolai/reason-grill-for-claude) | Deep argument interrogation: a bounded quick review by default, with an explicit full adversarial panel and evidence-grounded verdicts. | 0.4.0 | Install smoke-tested with Codex CLI 0.144.3 |
| [eou-foundry](https://github.com/xiaolai/eou-foundry) | EOU Foundry — turn messy workflows into auditable Executable Operating Units with recursive governance (12 skills: candidate generation, audit, specify, refactor, promote, foundry-wide audit, ECP authoring, init scaffolding, Stage 0 capture, judgment audit). v0.7.0 ships Stage 0 (captured_workflow + per-app domain_values constitutional layer + Rule 96 consumption). v0.8.0 ships agentic judgment (judgment_authorized flag, value_invocations trace, F14–F17 taxonomy, judgment_maturity J0–J4 axis, $audit-judgment skill, Rule 97, counterfactual-swap audit). | 0.8.4 | Install smoke-tested with Codex CLI 0.144.3 |
| [nlpm](https://github.com/xiaolai/nlpm) | NLPM — reference-knowledge skills (17): the 50 Rules, the 100-point scoring rubric, per-tool conventions (Claude Code / Codex CLI / Antigravity), anti-patterns, vocabulary discipline, and authoring guides. Knowledge skills, not commands — `$nlpm-rules` + `$nlpm-scoring` to score an artifact, `$nlpm-conventions-codex` for the Codex layout. The interactive `/nlpm:*` linting commands stay a Claude Code plugin (they orchestrate sub-agents); cross-tool deterministic checks use the standalone `bin/nlpm-check`. | 1.4.3 | Install smoke-tested with Codex CLI 0.159.2 (GitHub source, temporary `CODEX_HOME`): 17 skills, no `source-command-*` duplicates, no hooks; command/agent orchestration stays Claude-only |
| [xros](https://github.com/xiaolai/xros) | XROS — an eXecutable Research Operating System. Four skills (`$xros-compile`, `$xros-sharpen`, `$xros-run`, `$xros-reason`): turn an investigation into a verifiable methodology spec, then gate the verdict on a real oracle's exit code. Founding rule: no verification, no claim. Ships a dependency-free validator + conformance suite. | 0.3.4 | Install smoke-tested with Codex CLI 0.144.3 |
| [mac-it-guy-pro](https://github.com/xiaolai/mac-it-guy-pro) | Personal IT guy for non-technical macOS users — checkups, safe cleanup, undoable file organising, evidence-first diagnosis, backups with a restore drill, home network, automation that leaves reusable tools behind, and a tutor grounded in your machine's own numbers. PreToolUse guard and SessionStart digest both run under Codex. macOS only. | 1.9.6 | Install smoke-tested with Codex CLI 0.159.2 (GitHub source, temporary `CODEX_HOME`; 8 skills and both hooks listed); hook firing inside a live session not yet exercised |
| [tdd-guardian](https://github.com/xiaolai/tdd-guardian-for-claude) | TDD Guardian — per-lane gates, spec-strength S1-S6, adversarial spec review, red receipts, critical-path thresholds, coverage merging and mutation testing as 11 workflow skills (`$tdd-guardian-workflow`, `$tdd-guardian-gate`, ...). PreToolUse commit/push freshness hook runs under Codex; Claude Code's TaskCompleted auto-gate has no Codex event, so `$tdd-guardian-gate` runs those lanes. | 0.10.2 | Install smoke-tested with Codex CLI 0.159.2 (GitHub source, temporary `CODEX_HOME`; skill listing checked); hook firing inside a live session not yet exercised |
| [loc-guardian](https://github.com/xiaolai/loc-guardian-for-claude) | LOC Guardian — `$loc-guardian-scan` counts pure LOC through a tested reducer (no model arithmetic), flags files over the limit, and proposes extractions measured with tokei; `$loc-guardian-init` sets the limit and rules. | 0.4.2 | Install smoke-tested with Codex CLI 0.159.2 (GitHub source, temporary `CODEX_HOME`; skill listing checked) |
| [docs-guardian](https://github.com/xiaolai/docs-guardian-for-claude) | Documentation freshness, accuracy and coverage checks, plus commit and push guards that resolve the target repository and map outgoing source changes to documentation. | 0.3.0 | Install smoke-tested with Codex CLI 0.159.2 (GitHub source, temporary `CODEX_HOME`; skill listing checked); hook firing inside a live session not yet exercised |
| [english-buddy](https://github.com/xiaolai/english-buddy-for-claude) | English coaching with configurable on-demand and sampled modes, bounded provider calls, literal-preservation checks and progress reports; the original user prompt remains authoritative. | 0.7.0 | Smoke-tested with Codex CLI 0.159.2 (GitHub source, temporary `CODEX_HOME`): 17 skills listed, the hook corrected a prompt and logged it, and the report skills read that history; trust was bypassed for the run, and `systemMessage` display in the TUI is unverified |

**Pending ports**: none. echo-sleuth is not ported: it mines and manages Claude Code's own transcripts and memory files, so under Codex it would be blind to Codex's sessions, and [`cc-suite`](https://github.com/xiaolai/cc-suite) already gives Codex read access to Claude history. The Claude↔Codex delegation lane is now handled by [`cc-suite`](https://github.com/xiaolai/cc-suite) (single plugin, bidirectional). `codex-guardian` (Codex-artifact auditor) remains a planned future addition for the Codex-only audit niche.

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

**One-time setup** (shell):

```bash
codex plugin marketplace add xiaolai/claude-plugin-marketplace
```

Codex registers this as marketplace name `xiaolai`.

**Per-plugin install** (shell):

```bash
codex plugin list --marketplace xiaolai --available
codex plugin add grill@xiaolai
```

You can also install from inside a Codex session:

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

## Local installation health

`python3 scripts/plugin-health.py /path/to/claude-plugins` inventories source versions, cached installations, scope and initialization evidence. It is read-only. Registration does not prove a plugin loaded or that its gate was exercised; those require a fresh runtime load and behavior checks.
