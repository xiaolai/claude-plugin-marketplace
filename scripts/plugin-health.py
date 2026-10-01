#!/usr/bin/env python3
"""Read-only local plugin inventory. Never equates registration with enforcement."""
import argparse
import json
from pathlib import Path


def read(path, default=None):
    try:
        return json.loads(path.read_text())
    except (OSError, ValueError):
        return default


def inventory(workspace, project, home):
    registry = read(home / '.claude/plugins/installed_plugins.json', {}).get('plugins', {})
    enabled = {}
    for directory in [home, *reversed(project.parents), project]:
        for name in ['settings.json', 'settings.local.json']:
            enabled.update(read(directory / '.claude' / name, {}).get('enabledPlugins', {}))
    initialization = {
        'tdd-guardian': '.claude/tdd-guardian/config.json',
        'docs-guardian': '.claude/docs-guardian/config.json',
        'loc-guardian': '.claude/loc-guardian.local.md',
        'dev-team': '.claude/dev-team.md',
        'ui-tokenize': '.tokenize/config.json',
        'ui-responsive': '.responsive/config.json',
    }
    rows = []
    directories = sorted(workspace.iterdir())
    for directory in directories:
        manifest = read(directory / '.claude-plugin/plugin.json')
        if not manifest:
            continue
        name = manifest['name']
        if directory.name == 'nlpm' and (workspace / 'nlpm-current').is_dir():
            continue  # The original dirty checkout is preserved, not the maintenance source.
        records = []
        for key, values in registry.items():
            if key.split('@')[0] != name:
                continue
            for entry in values:
                applicable = entry.get('scope') == 'user' or entry.get('projectPath') == str(project)
                records.append({
                    'id': key, 'scope': entry.get('scope'), 'project': entry.get('projectPath'),
                    'version': entry.get('version'), 'cache_exists': Path(entry['installPath']).is_dir(),
                    'applicable': applicable, 'enabled_setting': enabled.get(key),
                    'local_snapshot': read(Path(entry['installPath']) / '.local-source.json'),
                })
        config = initialization.get(name)
        rows.append({
            'name': name, 'source': str(directory), 'source_version': manifest.get('version'),
            'registrations': records,
            'applicable_installed': any(r['applicable'] and r['cache_exists'] for r in records),
            'enabled_without_registration': any(v and k.split('@')[0] == name for k, v in enabled.items())
                and not any(r['applicable'] and r['cache_exists'] for r in records),
            'initialization_file': str(project / config) if config else None,
            'initialized': (project / config).exists() if config else 'plugin-specific/defaults',
            'loaded': 'unknown: requires a fresh runtime load',
            'exercised': 'unknown: requires a behavior probe; see verification report',
        })
    return {'project': str(project), 'git_boundary': (project / '.git').exists(), 'plugins': rows}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('workspace', type=Path)
    parser.add_argument('--project', type=Path)
    args = parser.parse_args()
    print(json.dumps(inventory(args.workspace.resolve(), (args.project or args.workspace).resolve(), Path.home()), indent=2))
