import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      (click)="closeModal.emit()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        class="w-full max-w-lg flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
          <div>
            <h3 id="settings-modal-title" class="text-base font-bold text-zinc-900 dark:text-white font-['Outfit']">
              Editor Preferences & Settings
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Customize typography, theme, and workspace behavior.
            </p>
          </div>

          <button
            type="button"
            (click)="closeModal.emit()"
            class="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6 overflow-y-auto">
          
          <!-- 1. Theme Selection -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
              Appearance Theme
            </label>
            <div class="grid grid-cols-3 gap-2">
              @for (mode of themeModes; track mode) {
                <button
                  type="button"
                  (click)="settingsService.updateSetting('theme', mode)"
                  [class.border-indigo-600]="settingsService.settings().theme === mode"
                  [class.bg-indigo-50]="settingsService.settings().theme === mode"
                  [class.dark:bg-indigo-950/50]="settingsService.settings().theme === mode"
                  [class.text-indigo-600]="settingsService.settings().theme === mode"
                  [class.dark:text-indigo-400]="settingsService.settings().theme === mode"
                  class="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold capitalize transition-all hover:border-indigo-400 text-center"
                >
                  {{ mode }}
                </button>
              }
            </div>
          </div>

          <!-- 2. Font Size -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Font Size
              </label>
              <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {{ settingsService.settings().fontSize }}px
              </span>
            </div>
            <div class="flex items-center gap-2">
              @for (size of [12, 14, 16, 18]; track size) {
                <button
                  type="button"
                  (click)="settingsService.updateSetting('fontSize', size)"
                  [class.bg-indigo-600]="settingsService.settings().fontSize === size"
                  [class.text-white]="settingsService.settings().fontSize === size"
                  [class.bg-zinc-100]="settingsService.settings().fontSize !== size"
                  [class.dark:bg-zinc-800]="settingsService.settings().fontSize !== size"
                  [class.text-zinc-700]="settingsService.settings().fontSize !== size"
                  [class.dark:text-zinc-300]="settingsService.settings().fontSize !== size"
                  class="flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border border-zinc-200 dark:border-zinc-700 transition-all"
                >
                  {{ size }}px
                </button>
              }
            </div>
          </div>

          <!-- 3. Word Wrap -->
          <div class="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <div class="text-xs font-bold text-zinc-900 dark:text-white">Editor Word Wrap</div>
              <div class="text-[11px] text-zinc-500">Wrap long lines in test string editor</div>
            </div>
            <button
              type="button"
              (click)="settingsService.updateSetting('wordWrap', !settingsService.settings().wordWrap)"
              [class.bg-indigo-600]="settingsService.settings().wordWrap"
              [class.bg-zinc-300]="!settingsService.settings().wordWrap"
              [class.dark:bg-zinc-700]="!settingsService.settings().wordWrap"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                [class.translate-x-5]="settingsService.settings().wordWrap"
                [class.translate-x-0]="!settingsService.settings().wordWrap"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              ></span>
            </button>
          </div>

          <!-- 4. Auto Save State -->
          <div class="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <div class="text-xs font-bold text-zinc-900 dark:text-white">Auto Save to LocalStorage</div>
              <div class="text-[11px] text-zinc-500">Persist pattern and flags between reloads</div>
            </div>
            <button
              type="button"
              (click)="settingsService.updateSetting('autoSave', !settingsService.settings().autoSave)"
              [class.bg-indigo-600]="settingsService.settings().autoSave"
              [class.bg-zinc-300]="!settingsService.settings().autoSave"
              [class.dark:bg-zinc-700]="!settingsService.settings().autoSave"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                [class.translate-x-5]="settingsService.settings().autoSave"
                [class.translate-x-0]="!settingsService.settings().autoSave"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              ></span>
            </button>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
          <button
            type="button"
            (click)="onResetDefaults()"
            class="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            (click)="closeModal.emit()"
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
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
export class SettingsModalComponent {
  public readonly settingsService = inject(SettingsService);
  public readonly themeService = inject(ThemeService);
  public readonly exportService = inject(ExportService);
  public readonly closeModal = output<void>();

  public readonly themeModes: ThemeMode[] = ['dark', 'light', 'system'];

  public onResetDefaults(): void {
    this.settingsService.resetDefaults();
    this.exportService.showToast('Reset settings to default');
  }
}
