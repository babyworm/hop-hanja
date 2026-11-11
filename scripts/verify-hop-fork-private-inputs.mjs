import { pathToFileURL } from 'node:url';
import { checkPrivateInputs } from './lib/hop-fork-private-inputs.mjs';

export async function verifyHopForkPrivateInputs() {
  const changed = await checkPrivateInputs();
  if (changed.length > 0) {
    throw new Error(
      `rhwp private inputs changed: ${changed.join(', ')}. Review the Hanja adapters `
      + '(apps/studio-host/src/upstream/editor.ts, ui/hanja-context-menu.ts, hanja CSS), '
      + 'then run pnpm hop-fork:rebaseline.',
    );
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--rebaseline')) {
    const changed = await checkPrivateInputs({ rebaseline: true });
    console.log(changed.length > 0 ? `Rebaselined: ${changed.join(', ')}` : 'Private inputs already match.');
  } else {
    await verifyHopForkPrivateInputs();
    console.log('HOP fork private inputs match the pinned rhwp.');
  }
}
