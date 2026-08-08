# Handling external PRs

Applies to every xiaolai plugin repo. This is the version-controlled mirror of the `## Handling external PRs` section in the plugin workspace's `CLAUDE.md` (`~/github/xiaolai/myprojects/claude-plugins/CLAUDE.md`, not itself a git repo) — when updating one copy, update both. (Precedent: cc-suite PR #3, superseded with credit in cc-suite `60b50c2`.)

**Assess soundness first, independently.** Verify each of the PR's claims against the *current* tree — does anything consume the field it removes, does the schema/convention it cites actually say that, is the change already superseded by a later release? Never take the PR body's word, and never judge against the tree it was branched from.

Then pick the resolution by freshness:

| PR state | Resolution |
|----------|------------|
| Sound + merges cleanly | Merge (or request trivial tweaks first) |
| Sound + slightly stale | Offer maintainer-edits on their branch, or invite a rebase — especially for a repeat contributor |
| Sound + badly stale, conflicting, or incomplete | **Supersede with credit** (see below) |
| Unsound | Decline with specific per-change reasons; take no code |

**Supersede with credit** means all of:

1. Apply the still-valid parts to current `main`, extended to the whole class — if the PR fixes 30 instances of a pattern and `main` now has 39, fix all 39, not the PR's stale list.
2. Drop parts made obsolete by later releases; say so rather than silently omitting them.
3. Put `Co-authored-by: <name> <commit-email>` (taken from their commits) on the superseding commit, so the author lands in the contributor graph.
4. Close the PR with a per-change accounting: what was applied, what was extended, what was superseded and why — and state explicitly that none of their work was dropped. A specific accounting proves the work was read; a bare "thanks, closing" reads as dismissal.

**Never cherry-pick their commits through heavy conflict resolution** — that attributes code to the author that they never wrote. Honest co-authorship beats fabricated sole authorship.

Known cost of superseding: the PR shows "Closed", not "Merged". The credit trailer plus a commit link in the closing comment is the compensation. If the same contributor returns, shift one notch toward the collaborative end — respond fast and merge their actual commits where possible; that is how a drive-by contributor becomes a repeat one.
