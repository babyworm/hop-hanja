// HOP fork-only checks, kept out of upstream-owned test files to keep merges clean.
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { artifactMetadata, readJson, repoRoot } from '../scripts/lib/rhwp-upstream.mjs';
import {
  buildPrivateInputBaseline,
  canonicalTextSha256,
  changedPrivateInputs,
  privateInputsConfigPath,
  studioSourceRelativePath,
} from '../scripts/lib/hop-fork-private-inputs.mjs';
import { verifyHopForkPrivateInputs } from '../scripts/verify-hop-fork-private-inputs.mjs';

test('canonicalizes tracked text hashes across LF and CRLF checkouts', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'hop-rhwp-text-hash-'));
  try {
    const lfPath = join(directory, 'lf.ts');
    const crlfPath = join(directory, 'crlf.ts');
    await writeFile(lfPath, 'const value = 1;\n');
    await writeFile(crlfPath, 'const value = 1;\r\n');

    const expected = (await artifactMetadata(lfPath)).sha256;
    assert.equal(await canonicalTextSha256(lfPath), expected);
    assert.equal(await canonicalTextSha256(crlfPath), expected);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('preserves explicit Studio source extensions for private inputs', () => {
  assert.equal(studioSourceRelativePath('engine/history'), 'engine/history.ts');
  assert.equal(studioSourceRelativePath('styles/menu-bar.css'), 'styles/menu-bar.css');
});

test('reports changed, added, and removed private inputs', () => {
  assert.deepEqual(
    changedPrivateInputs(
      { 'engine/history': 'before', 'engine/cursor': 'same', 'ui/gone': 'x' },
      { 'engine/history': 'after', 'engine/cursor': 'same', 'ui/new': 'y' },
    ),
    ['engine/history', 'ui/gone', 'ui/new'],
  );
});

test('detects a changed private input file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'hop-private-inputs-'));
  try {
    await writeFile(join(directory, 'a.ts'), 'one\n');
    const before = await buildPrivateInputBaseline(['a'], directory);
    await writeFile(join(directory, 'a.ts'), 'two\n');
    const after = await buildPrivateInputBaseline(['a'], directory);
    assert.deepEqual(changedPrivateInputs(before, after), ['a']);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('HOP fork tracks the rhwp private inputs its Hanja adapters depend on', async () => {
  const config = await readJson(privateInputsConfigPath);
  assert.deepEqual(Object.keys(config.privateInputs).sort(), [
    'engine/command',
    'engine/cursor',
    'engine/history',
    'engine/input-handler',
    'styles/dialogs.css',
    'styles/menu-bar.css',
    'ui/context-menu',
  ]);
});

test('HOP fork private input baseline matches the pinned rhwp', async () => {
  await verifyHopForkPrivateInputs();
});

test('HOP editor adapter does not expose unused upstream text command classes', async () => {
  const editorBoundary = await readFile(
    join(repoRoot, 'apps/studio-host/src/upstream/editor.ts'),
    'utf8',
  );

  assert.doesNotMatch(editorBoundary, /\b(?:DeleteTextCommand|InsertTextCommand)\b/);
});
