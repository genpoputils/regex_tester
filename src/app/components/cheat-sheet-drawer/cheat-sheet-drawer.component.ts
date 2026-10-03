import { Component, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CHEAT_SHEET_DATA } from '../../utils/cheat-sheet-data';
import { CheatSheetEntry, CheatSheetSection } from '../../models/regex.models';
import { RegexService } from '../../services/regex.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-cheat-sheet-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in"
      (click)="closeDrawer.emit()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cheat-sheet-title"
    >
      <div
        class="w-full max-w-xl h-full flex flex-col bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-slide-left"
        (click)="$event.stopPropagation()"
      >
        
        <!-- Drawer Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
          <div>
            <h3 id="cheat-sheet-title" class="text-base font-bold text-zinc-900 dark:text-white font-['Outfit']">
              Interactive Regex Cheat Sheet
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Click "Insert" to add tokens into your current pattern.
            </p>
          </div>

          <button
            type="button"
            (click)="closeDrawer.emit()"
            class="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close cheat sheet drawer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div class="relative">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              [ngModel]="filterQuery()"
              (ngModelChange)="filterQuery.set($event)"
              placeholder="Search cheat sheet (e.g. lookbehind, \\b, quantifier)..."
              class="w-full pl-9 pr-4 py-2 text-xs bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Category Chips -->
          <div class="flex flex-wrap items-center gap-1 mt-3">
            @for (sec of sections; track sec.category) {
              <button
                type="button"
                (click)="selectedCategory.set(selectedCategory() === sec.category ? null : sec.category)"
                [class.bg-indigo-600]="selectedCategory() === sec.category"
                [class.text-white]="selectedCategory() === sec.category"
                [class.bg-zinc-100]="selectedCategory() !== sec.category"
                [class.dark:bg-zinc-800]="selectedCategory() !== sec.category"
                [class.text-zinc-600]="selectedCategory() !== sec.category"
                [class.dark:text-zinc-400]="selectedCategory() !== sec.category"
                class="px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 hover:border-indigo-400 transition-colors"
              >
                {{ sec.category }}
              </button>
            }
          </div>
        </div>

        <!-- Cheat Sheet Sections List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-6">
          @for (sec of filteredSections(); track sec.category) {
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                {{ sec.category }}
              </h4>

              <div class="space-y-2">
                @for (entry of sec.entries; track entry.token) {
                  <div class="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col gap-2">
                    
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs border border-zinc-300 dark:border-zinc-700">
                          {{ entry.token }}
                        </span>
                        <span class="text-xs font-semibold text-zinc-900 dark:text-white">
                          {{ entry.name }}
                        </span>
                      </div>

                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          (click)="onInsert(entry.token)"
                          class="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold shadow-sm transition-all"
                          title="Insert token into pattern"
                        >
                          Insert
                        </button>
                        <button
                          type="button"
                          (click)="exportService.copyToClipboard(entry.token, 'Copied ' + entry.token)"
                          class="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                          title="Copy token"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p class="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {{ entry.description }}
                    </p>

                    <div class="flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/50 dark:border-zinc-800/60">
                      <span>Ex: <code class="text-zinc-800 dark:text-zinc-200">{{ entry.example }}</code></span>
                      <span>•</span>
                      <span>Matches: <code class="text-emerald-600 dark:text-emerald-400">{{ entry.matchExample }}</code></span>
                    </div>

                  </div>
                }
              </div>

            </div>
          }
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes slideLeft {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .animate-slide-left {
      animation: slideLeft 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.15s ease-out forwards;
    }
  `],
})
export class CheatSheetDrawerComponent {
  public readonly regexService = inject(RegexService);
  public readonly exportService = inject(ExportService);
  public readonly closeDrawer = output<void>();

  public readonly sections = CHEAT_SHEET_DATA;
  public readonly filterQuery = signal<string>('');
  public readonly selectedCategory = signal<string | null>(null);

  public readonly filteredSections = computed(() => {
    const q = this.filterQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.sections
      .map((sec) => {
        if (cat && sec.category !== cat) return null;

        const entries = sec.entries.filter((e) => {
          if (!q) return true;
          return (
            e.token.toLowerCase().includes(q) ||
            e.name.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.example.toLowerCase().includes(q)
          );
        });

        if (entries.length === 0) return null;
        return { ...sec, entries };
      })
      .filter((s): s is CheatSheetSection => s !== null);
  });

  public onInsert(token: string): void {
    this.regexService.insertToken(token);
    this.exportService.showToast(`Inserted "${token}" into regex`);
  }
}
