// HOP fork: document replacement generation tests for TauriBridge, kept out of
// the upstream-owned tauri-bridge.test.ts to keep merges clean.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { currentDocumentGeneration } from './document-generation';
import { TauriBridge } from './tauri-bridge';

vi.mock('@/upstream/ui', () => ({ showHwpPasswordDialog: vi.fn() }));

const invokeMock = vi.hoisted(() => vi.fn());
const fsOpenMock = vi.hoisted(() => vi.fn());
const statMock = vi.hoisted(() => vi.fn());
const removeMock = vi.hoisted(() => vi.fn());
const setTitleMock = vi.hoisted(() => vi.fn());

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => ({ setTitle: setTitleMock }),
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: invokeMock,
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
  save: vi.fn(),
  message: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
  open: fsOpenMock,
  stat: statMock,
  remove: removeMock,
}));

vi.mock('@/core/wasm-bridge', () => ({
  WasmBridge: class {
    fileName = 'document.hwp';
    loadDocumentMock = vi.fn((_bytes: Uint8Array, _fileName: string) => ({ pageCount: 2, fontsUsed: [] }));
    createNewDocumentMock = vi.fn(() => ({ pageCount: 1, fontsUsed: [] }));

    loadDocument(bytes: Uint8Array, fileName: string) {
      return this.loadDocumentMock(bytes, fileName);
    }

    createNewDocument() {
      return this.createNewDocumentMock();
    }

    getSourceFormat() {
      return 'hwp';
    }
  },
}));

describe('TauriBridge document generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setTitleMock.mockReset().mockResolvedValue(undefined);
    (globalThis as { document?: { title: string } }).document = { title: '' };
    statMock.mockResolvedValue({ size: 3, isFile: true, mtime: new Date('2026-04-23T00:00:00.000Z') });
    removeMock.mockResolvedValue(undefined);
  });

  it('advances generation before native open bookkeeping finishes', async () => {
    const bridge = new TauriBridge();
    const inputLease = { active: true };
    const getCommandInput = () => inputLease.active ? inputLease : null;
    bridge.setBeforeDocumentReplacement(() => {
      inputLease.active = false;
    });
    let releaseFinderRecent: () => void = () => undefined;
    const finderRecentPending = new Promise<void>((resolve) => {
      releaseFinderRecent = resolve;
    });
    fsOpenMock.mockResolvedValue(readHandle([1]));
    invokeMock.mockImplementation(async (command: string) => {
      if (command === 'prepare_document_open') return undefined;
      if (command === 'open_document_tracking') {
        return nativeOpenResult({ docId: 'next-doc', fileName: 'next.hwp' });
      }
      if (command === 'note_finder_recent_document') return finderRecentPending;
      if (command === 'record_recent_document') return undefined;
      throw new Error(`unexpected command ${command}`);
    });
    const before = currentDocumentGeneration();

    const opening = bridge.openDocumentByPath('/tmp/next.hwp');
    let openingFinished = false;
    void opening.then(
      () => { openingFinished = true; },
      () => { openingFinished = true; },
    );
    await vi.waitFor(() => expect(getWasmMock(bridge, 'loadDocumentMock')).toHaveBeenCalledOnce());

    expect(currentDocumentGeneration()).toBe(before + 1);
    expect(inputLease.active).toBe(false);
    expect(getCommandInput()).toBeNull();
    expect(openingFinished).toBe(false);
    expect(invokeMock).not.toHaveBeenCalledWith('record_recent_document', expect.anything());

    releaseFinderRecent();
    await opening;
    expect(inputLease.active).toBe(false);
    expect(getCommandInput()).toBeNull();
  });

  it('advances generation before replaced native document cleanup finishes', async () => {
    const bridge = new TauriBridge();
    const inputLease = { active: true };
    const getCommandInput = () => inputLease.active ? inputLease : null;
    bridge.setBeforeDocumentReplacement(() => {
      inputLease.active = false;
    });
    let releaseClose: () => void = () => undefined;
    const closePending = new Promise<void>((resolve) => {
      releaseClose = resolve;
    });
    applyOpenResult(bridge, nativeOpenResult({ docId: 'old-doc' }));
    invokeMock.mockImplementation(async (command: string) => {
      if (command === 'create_document') {
        return nativeOpenResult({ docId: 'new-doc', sourcePath: null });
      }
      if (command === 'close_document') return closePending;
      throw new Error(`unexpected command ${command}`);
    });
    const before = currentDocumentGeneration();

    const creating = bridge.createNewDocumentAsync();
    let creatingFinished = false;
    void creating.then(
      () => { creatingFinished = true; },
      () => { creatingFinished = true; },
    );
    await vi.waitFor(() => expect(getWasmMock(bridge, 'createNewDocumentMock')).toHaveBeenCalledOnce());

    expect(currentDocumentGeneration()).toBe(before + 1);
    expect(inputLease.active).toBe(false);
    expect(getCommandInput()).toBeNull();
    expect(creatingFinished).toBe(false);

    releaseClose();
    await creating;
    expect(inputLease.active).toBe(false);
    expect(getCommandInput()).toBeNull();
  });
});

function readHandle(bytes: ArrayLike<number>) {
  const data = Uint8Array.from(bytes);
  let offset = 0;
  return {
    read: vi.fn(async (buffer: Uint8Array) => {
      if (offset >= data.length) return null;
      const count = Math.min(buffer.byteLength, data.length - offset);
      buffer.set(data.subarray(offset, offset + count));
      offset += count;
      return count;
    }),
    close: vi.fn(async () => undefined),
  };
}

function applyOpenResult(bridge: TauriBridge, result: Record<string, unknown>) {
  (bridge as unknown as { applyNativeOpenResult(result: Record<string, unknown>): void })
    .applyNativeOpenResult(result);
}

function nativeOpenResult(overrides: Record<string, unknown> = {}) {
  return {
    docId: 'doc-1',
    fileName: 'source.hwp',
    sourcePath: '/tmp/source.hwp',
    format: 'hwp',
    pageCount: 1,
    revision: 1,
    dirty: false,
    warnings: [],
    ...overrides,
  };
}

function getWasmMock(bridge: TauriBridge, name: 'loadDocumentMock' | 'createNewDocumentMock') {
  return (bridge as unknown as Record<typeof name, ReturnType<typeof vi.fn>>)[name];
}
