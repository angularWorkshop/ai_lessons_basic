import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { labs } from '../lib/labs.mjs';
import { branchName, createProject } from '../lib/project.mjs';

function git(args, input) {
  const { status, stdout, stderr } = spawnSync('git', args, { input, encoding: 'utf8' });
  assert.equal(status, 0, stderr || args.join(' '));
  return stdout.trim();
}

function treeFor(files) {
  const root = {};
  for (const [path, contents] of Object.entries(files)) {
    const names = path.split('/');
    const file = names.pop();
    const folder = names.reduce((tree, name) => tree[name] ??= {}, root);
    folder[file] = git(['hash-object', '-w', '--stdin'], contents);
  }
  function write(tree) {
    const entries = Object.entries(tree).map(([name, item]) =>
      typeof item === 'string' ? '100644 blob ' + item + '\t' + name : '040000 tree ' + write(item) + '\t' + name);
    return git(['mktree'], entries.join('\n') + '\n');
  }
  return write(root);
}

const parent = git(['rev-parse', 'refs/heads/main']);
const allowUpdate = process.argv.includes('--update');
for (const id of labs.keys()) {
  for (const mode of ['lesson', 'answer']) {
    const name = branchName(id, mode);
    const ref = 'refs/heads/' + name;
    const tree = treeFor(createProject(id, mode));
    const current = git(['for-each-ref', '--format=%(objectname)', ref]);
    if (!current || git(['rev-parse', current + '^{tree}']) !== tree) {
      assert.ok(!current || allowUpdate, 'Ref already has different contents: ' + name + '. Use --update to append a commit.');
      const commit = git(['commit-tree', tree, '-p', current || parent, '-m', 'AI Basic ' + id + ' ' + mode]);
      git(['update-ref', ref, commit, current || '0000000000000000000000000000000000000000']);
    }
    console.log(name);
  }
}
