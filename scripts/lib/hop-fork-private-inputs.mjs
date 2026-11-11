// HOP fork: drift guard for upstream rhwp-studio files whose private fields or
// DOM/CSS structure the Hanja adapters depend on. Kept out of rhwp-upstream.mjs
// so upstream merges do not conflict with fork-only checks.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readJson, repoRoot, upstreamDir, writeJson } from './rhwp-upstream.mjs';

export const privateInputsConfigPath = join(repoRoot, 'config/hop-fork-private-inputs.json');

// LF-canonical so Windows CRLF checkouts of the submodule hash identically.
export async function canonicalTextSha256(path) {
  const text = (await readFile(path, 'utf8')).replaceAll('\r\n', '\n');
  return createHash('sha256').update(text).digest('hex');
}

export function studioSourceRelativePath(id) {
  return id.endsWith('.css') ? id : `${id}.ts`;
}

export async function buildPrivateInputBaseline(ids, studioDir = join(upstreamDir, 'rhwp-studio/src')) {
  const privateInputs = {};
  for (const id of [...ids].sort()) {
    privateInputs[id] = await canonicalTextSha256(join(studioDir, studioSourceRelativePath(id)));
  }
  return privateInputs;
}

export function changedPrivateInputs(before, after) {
  const ids = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...ids].filter((id) => before[id] !== after[id]).sort();
}

export async function checkPrivateInputs({ rebaseline = false } = {}) {
  const config = await readJson(privateInputsConfigPath);
  const actual = await buildPrivateInputBaseline(Object.keys(config.privateInputs));
  const changed = changedPrivateInputs(config.privateInputs, actual);
  if (rebaseline && changed.length > 0) {
    await writeJson(privateInputsConfigPath, { ...config, privateInputs: actual });
  }
  return changed;
}
