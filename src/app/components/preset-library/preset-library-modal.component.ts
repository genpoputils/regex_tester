import { Component, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { REGEX_PRESETS } from '../../utils/regex-presets';
import { PresetItem } from '../../models/regex.models';
import { RegexService } from '../../services/regex.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-preset-library-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      (click)="closeModal.emit()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preset-modal-title"
    >
      <div
        class="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 id="preset-modal-title" class="text-lg font-bold text-zinc-900 dark:text-white font-['Outfit']">
              Regular Expression Presets
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              One-click production-ready patterns for web, security, finance, and regional IDs.
            </p>
          </div>

          <button
            type="button"
            (click)="closeModal.emit()"
            class="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close presets modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search & Filter Controls -->
        <div class="p-6 border-b border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50 dark:bg-zinc-950/40">
          
          <!-- Search Input -->
          <div class="relative">
            <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Search by preset name, category, or tag (e.g. email, pan, uuid)..."
              class="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Category Chips -->
          <div class="flex flex-wrap items-center gap-1.5">
            @for (cat of categories; track cat) {
              <button
                type="button"
                (click)="selectedCategory.set(cat)"
                [class.bg-indigo-600]="selectedCategory() === cat"
                [class.text-white]="selectedCategory() === cat"
                [class.border-indigo-600]="selectedCategory() === cat"
                [class.bg-white]="selectedCategory() !== cat"
                [class.dark:bg-zinc-900]="selectedCategory() !== cat"
                [class.text-zinc-600]="selectedCategory() !== cat"
                [class.dark:text-zinc-400]="selectedCategory() !== cat"
                class="px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-all"
              >
                {{ cat }}
              </button>
            }
          </div>

        </div>

        <!-- Presets Grid -->
        <div class="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (preset of filteredPresets(); track preset.id) {
            <div
              class="flex flex-col justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 transition-all hover:shadow-md group"
            >
              <div>
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <h4 class="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {{ preset.name }}
                  </h4>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {{ preset.category }}
                  </span>
                </div>

                <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                  {{ preset.description }}
                </p>

                <!-- Monospace pattern snippet -->
                <div class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-950 font-mono text-[11px] text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800/80 truncate mb-3 select-all">
                  /{{ preset.pattern }}/{{ preset.flags }}
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <div class="flex flex-wrap gap-1">
                  @for (t of preset.tags.slice(0, 3); track t) {
                    <span class="text-[10px] text-zinc-400">#{{ t }}</span>
                  }
                </div>

                <button
                  type="button"
                  (click)="onSelectPreset(preset)"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
                >
                  Use Preset
                </button>
              </div>

            </div>
          }
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
export class PresetLibraryModalComponent {
  public readonly regexService = inject(RegexService);
  public readonly exportService = inject(ExportService);
  public readonly closeModal = output<void>();

  public readonly searchQuery = signal<string>('');
  public readonly selectedCategory = signal<string>('All');

  public readonly categories = [
    'All',
    'Web & URLs',
    'Validation',
    'Identity & Finance',
    'Formatting',
    'Programming',
  ];

  public readonly filteredPresets = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return REGEX_PRESETS.filter((p) => {
      const matchCat = cat === 'All' || p.category === cat;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.pattern.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });
  });

  public onSelectPreset(preset: PresetItem): void {
    this.regexService.applyPreset(preset);
    this.exportService.showToast(`Applied preset: ${preset.name}`);
    this.closeModal.emit();
  }
}
