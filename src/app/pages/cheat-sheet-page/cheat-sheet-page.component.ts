import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdBannerComponent } from '../../components/ad-banner/ad-banner.component';
import { CHEAT_SHEET_DATA } from '../../utils/cheat-sheet-data';
import { CheatSheetSection } from '../../models/regex.models';
import { RegexService } from '../../services/regex.service';
import { ExportService } from '../../services/export.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-cheat-sheet-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdBannerComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      <!-- Breadcrumb & Header -->
      <div class="space-y-4">
        <nav class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <a routerLink="/" class="hover:underline">Home</a>
          <span>/</span>
          <span class="text-zinc-900 dark:text-white font-medium">Cheat Sheet</span>
        </nav>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] text-zinc-900 dark:text-white">
              Regular Expression <span class="text-indigo-600 dark:text-indigo-400">Cheat Sheet</span>
            </h1>
            <p class="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              A comprehensive reference guide for modern ECMAScript regular expression syntax, quantifiers, lookaround assertions, and flags.
            </p>
          </div>

          <a
            routerLink="/"
            class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <span>Launch Regex Tester</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Search & Quick Filter Bar -->
      <div class="p-4 sm:p-6 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div class="relative">
          <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search tokens, symbols, descriptions, or syntax (e.g. lookbehind, boundary, range)..."
            class="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mr-1">Categories:</span>
          @for (sec of sections; track sec.category) {
            <button
              type="button"
              (click)="selectedCategory.set(selectedCategory() === sec.category ? null : sec.category)"
              [class.bg-indigo-600]="selectedCategory() === sec.category"
              [class.text-white]="selectedCategory() === sec.category"
              [class.bg-white]="selectedCategory() !== sec.category"
              [class.dark:bg-zinc-800]="selectedCategory() !== sec.category"
              [class.text-zinc-700]="selectedCategory() !== sec.category"
              [class.dark:text-zinc-300]="selectedCategory() !== sec.category"
              class="px-3 py-1 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 transition-colors"
            >
              {{ sec.category }}
            </button>
          }
        </div>
      </div>

      <!-- Categories & Cards Grid -->
      <div class="space-y-12">
        @for (sec of filteredSections(); track sec.category) {
          <section [id]="sec.category.toLowerCase()" class="space-y-4">
            
            <div class="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <h2 class="text-xl sm:text-2xl font-bold font-['Outfit'] text-zinc-900 dark:text-white">
                {{ sec.category }}
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (entry of sec.entries; track entry.token) {
                <div class="flex flex-col justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-indigo-500/50 transition-all shadow-sm group">
                  
                  <div>
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <span class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm border border-indigo-200 dark:border-indigo-800">
                        {{ entry.token }}
                      </span>
                      <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {{ entry.name }}
                      </span>
                    </div>

                    <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      {{ entry.description }}
                    </p>
                  </div>

                  <div class="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <div class="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 space-y-1">
                      <div>Pattern: <code class="text-zinc-800 dark:text-zinc-200">{{ entry.example }}</code></div>
                      <div>Matches: <code class="text-emerald-600 dark:text-emerald-400">{{ entry.matchExample }}</code></div>
                    </div>

                    <div class="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        (click)="onInsertAndTest(entry.example)"
                        class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Test Pattern
                      </button>

                      <button
                        type="button"
                        (click)="exportService.copyToClipboard(entry.token, 'Copied ' + entry.token)"
                        class="px-2 py-1 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                </div>
              }
            </div>

          </section>
        }
      </div>

      <!-- Google AdSense Ad Slot -->
      <app-ad-banner></app-ad-banner>

    </div>
  `,
})
export class CheatSheetPageComponent implements OnInit {
  public readonly regexService = inject(RegexService);
  public readonly exportService = inject(ExportService);
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);

  public readonly sections = CHEAT_SHEET_DATA;
  public readonly searchQuery = signal<string>('');
  public readonly selectedCategory = signal<string | null>(null);

  public readonly filteredSections = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
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

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Regex Cheat Sheet — Modern ECMAScript Regular Expression Reference',
      description:
        'Complete interactive Regex Cheat Sheet: anchors, character classes, lookaheads, lookbehinds, quantifiers, capture groups, and JavaScript RegExp flags.',
      canonicalUrl: 'https://regex.genpoputils.com/cheat-sheet',
      type: 'article',
    });
  }

  public onInsertAndTest(examplePattern: string): void {
    this.regexService.setPattern(examplePattern);
    this.router.navigate(['/'], { fragment: 'tester' });
  }
}
