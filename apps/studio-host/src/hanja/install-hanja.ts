// HOP fork: single entry point for the Hanja wiring main.ts needs, so the
// upstream-owned main.ts only carries one-line hooks at fixed positions.
import type { CommandDispatcher, CommandRegistry, CommandServices } from '@/upstream/commands';
import {
  getInputHandlerShortcutCaptureState,
  installRecoveredCommandHistoryGuard,
  type InputHandler,
} from '@/upstream/editor';
import { handleHanjaShortcutCapture } from '@/command/shortcut-map';
import type { PrimaryDocumentWasmBridge } from '../core/document-wasm-bridge';
import { createDocumentReplacementInputGuard } from '../host/document-replacement-guard';
import { HanjaContextMenu } from '../ui/hanja-context-menu';

interface HanjaInstallDependencies {
  wasm: PrimaryDocumentWasmBridge;
  /** Must read the live `let` binding; main.ts reassigns it during initialize(). */
  getInputHandler: () => InputHandler | null;
  getToolbar: () => { setEnabled(enabled: boolean): void } | null;
}

/** Call once main.ts has declared its inputHandler/toolbar bindings. */
export function installHanja(deps: HanjaInstallDependencies) {
  const replacementGuard = createDocumentReplacementInputGuard({
    getInputHandler: deps.getInputHandler,
    getToolbar: deps.getToolbar,
    hasLoadedDocument: () => deps.wasm.pageCount > 0,
  });
  deps.wasm.setBeforeDocumentReplacement(replacementGuard.beforeReplacement);

  return {
    /** Command-runtime input handler: withheld while a document replacement is in flight. */
    getCommandInputHandler: (): InputHandler | null => {
      const inputHandler = deps.getInputHandler();
      return !replacementGuard.isReplacing() && inputHandler?.isActive() ? inputHandler : null;
    },
    /** Capture-phase F9 listener; register before upstream document keydown listeners. */
    installShortcutCapture(dispatcher: CommandDispatcher): void {
      document.addEventListener('keydown', (event) => {
        handleHanjaShortcutCapture(event, dispatcher, {
          ...getInputHandlerShortcutCaptureState(deps.getInputHandler()),
          hasActiveModal: document.querySelector('.modal-overlay') !== null,
        });
      }, true);
    },
    /** Call immediately after constructing the InputHandler. */
    attachInputHandler(inputHandler: InputHandler): void {
      installRecoveredCommandHistoryGuard(inputHandler);
    },
    createContextMenu(
      dispatcher: CommandDispatcher,
      registry: CommandRegistry,
      services: CommandServices,
    ): HanjaContextMenu {
      return new HanjaContextMenu(dispatcher, registry, services);
    },
  };
}
