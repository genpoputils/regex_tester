import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortcutsService } from '../../services/shortcuts.service';

@Component({
  selector: 'app-shortcuts-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shortcutsService.isShortcutsModalOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        (click)="shortcutsService.closeShortcutsModal()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div
          class="w-full max-w-md flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
          (click)="$event.stopPropagation()"
        >
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
            <div>
              <h3 id="shortcuts-title" class="text-base font-bold text-zinc-900 dark:text-white font-['Outfit']">
                Keyboard Shortcuts
              </h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">
                Speed up your regex workflow with hotkeys.
              </p>
            </div>

            <button
              type="button"
              (click)="shortcutsService.closeShortcutsModal()"
              class="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Shortcuts List -->
          <div class="p-6 space-y-3 font-sans">
            
            <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
              <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Focus Pattern Editor</span>
              <kbd class="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-sm">
                Ctrl + /
              </kbd>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
              <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Copy Regex /pattern/flags</span>
              <kbd class="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-sm">
                Ctrl + Shift + C
              </kbd>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
              <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Reset to Defaults</span>
              <kbd class="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-sm">
                Ctrl + Shift + R
              </kbd>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
              <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Clear Pattern & Text</span>
              <kbd class="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-sm">
                Ctrl + L
              </kbd>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
              <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Close Dialogs / Modals</span>
              <kbd class="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-sm">
                Esc
              </kbd>
            </div>

          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
            <button
              type="button"
              (click)="shortcutsService.closeShortcutsModal()"
              class="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm"
            >
              Got it
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.15s ease-out forwards;
    }
  `],
})
export class ShortcutsModalComponent {
  public readonly shortcutsService = inject(ShortcutsService);
}
