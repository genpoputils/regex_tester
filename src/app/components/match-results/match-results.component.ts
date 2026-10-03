import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegexService } from '../../services/regex.service';
import { ExportService } from '../../services/export.service';
import { RegexMatch } from '../../models/regex.models';

type ResultViewMode = 'table' | 'json' | 'raw';

@Component({
  selector: 'app-match-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden transition-all">
      
      <!-- Results Header & View Tabs -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800">
        
        <!-- Left: Match Count & Stats -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Matches
            </span>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {{ regexService.totalMatches() }}
            </span>
          </div>

          @if (regexService.executionTimeMs() > 0) {
            <span class="text-[11px] text-zinc-500 font-mono hidden sm:inline">
              Execution: {{ regexService.executionTimeMs() }}ms
            </span>
          }
        </div>

        <!-- Center: 3 Views Switcher -->
        <div class="flex items-center bg-zinc-200/70 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-300 dark:border-zinc-700">
          <button
            type="button"
            (click)="viewMode.set('table')"
            [class.bg-white]="viewMode() === 'table'"
            [class.dark:bg-zinc-700]="viewMode() === 'table'"
            [class.text-zinc-900]="viewMode() === 'table'"
            [class.dark:text-white]="viewMode() === 'table'"
            [class.shadow-sm]="viewMode() === 'table'"
            class="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Table</span>
          </button>

          <button
            type="button"
            (click)="viewMode.set('json')"
            [class.bg-white]="viewMode() === 'json'"
            [class.dark:bg-zinc-700]="viewMode() === 'json'"
            [class.text-zinc-900]="viewMode() === 'json'"
            [class.dark:text-white]="viewMode() === 'json'"
            [class.shadow-sm]="viewMode() === 'json'"
            class="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>JSON</span>
          </button>

          <button
            type="button"
            (click)="viewMode.set('raw')"
            [class.bg-white]="viewMode() === 'raw'"
            [class.dark:bg-zinc-700]="viewMode() === 'raw'"
            [class.text-zinc-900]="viewMode() === 'raw'"
            [class.dark:text-white]="viewMode() === 'raw'"
            [class.shadow-sm]="viewMode() === 'raw'"
            class="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span>Raw</span>
          </button>
        </div>

        <!-- Right: Export Actions -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            (click)="exportService.copyResultsJson()"
            class="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Copy Results JSON"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            (click)="exportService.downloadJson()"
            class="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Download JSON file"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            type="button"
            (click)="exportService.downloadTxt()"
            class="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Download TXT file"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>

      </div>

      <!-- Results Body -->
      <div class="relative min-h-[200px] max-h-[460px] overflow-auto">
        
        <!-- Empty State -->
        @if (regexService.matches().length === 0) {
          <div class="flex flex-col items-center justify-center p-12 text-center text-zinc-500 dark:text-zinc-400">
            <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              {{ regexService.error() ? 'Invalid Pattern' : 'No Matches Found' }}
            </h3>
            <p class="text-xs max-w-sm text-zinc-500 dark:text-zinc-400">
              {{ regexService.error() ? 'Correct the syntax error above to view match results.' : 'Type a pattern and test string, or select one from the presets to see matches highlighted live.' }}
            </p>
          </div>
        }

        <!-- 1. TABLE VIEW -->
        @if (regexService.matches().length > 0 && viewMode() === 'table') {
          <div class="w-full overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-zinc-100/60 dark:bg-zinc-950/40 text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th class="py-2.5 px-3 w-12 text-center">#</th>
                  <th class="py-2.5 px-3">Matched Text</th>
                  <th class="py-2.5 px-3 w-28">Range</th>
                  <th class="py-2.5 px-3 w-16">Length</th>
                  <th class="py-2.5 px-3">Groups</th>
                  <th class="py-2.5 px-3 w-14 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-mono">
                @for (m of regexService.matches(); track m.index) {
                  <tr
                    (mouseenter)="regexService.setHoveredMatch(m.index)"
                    (mouseleave)="regexService.setHoveredMatch(null)"
                    [class.bg-indigo-50/70]="regexService.hoveredMatchIndex() === m.index"
                    [class.dark:bg-indigo-950/30]="regexService.hoveredMatchIndex() === m.index"
                    class="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <!-- Index & Color Dot -->
                    <td class="py-2.5 px-3 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <span
                          [class]="'w-2 h-2 rounded-full match-color-' + m.colorIndex"
                        ></span>
                        <span class="text-zinc-500 text-[11px]">{{ m.index + 1 }}</span>
                      </div>
                    </td>

                    <!-- Matched Text -->
                    <td class="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
                      <span class="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-700/60">
                        {{ m.match }}
                      </span>
                    </td>

                    <!-- Indices -->
                    <td class="py-2.5 px-3 text-zinc-500 text-[11px]">
                      {{ m.start }} .. {{ m.end }}
                    </td>

                    <!-- Length -->
                    <td class="py-2.5 px-3 text-zinc-500 text-[11px]">
                      {{ m.length }}
                    </td>

                    <!-- Groups & Named Groups -->
                    <td class="py-2.5 px-3">
                      <div class="flex flex-wrap gap-1">
                        @if (m.groups.length === 0 && !hasNamedGroups(m)) {
                          <span class="text-zinc-400 dark:text-zinc-600 text-[11px]">—</span>
                        }

                        @for (g of m.groups; track g.index) {
                          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-[11px]">
                            <span class="text-zinc-400 font-bold">\${{ g.index }}:</span>
                            <span class="text-zinc-800 dark:text-zinc-200 font-medium">{{ g.value }}</span>
                          </span>
                        }

                        @for (item of getNamedGroupsEntries(m); track item.key) {
                          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-100/60 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-[11px]">
                            <span class="text-violet-600 dark:text-violet-400 font-bold">&lt;{{ item.key }}&gt;:</span>
                            <span class="text-violet-900 dark:text-violet-200 font-medium">{{ item.value }}</span>
                          </span>
                        }
                      </div>
                    </td>

                    <!-- Action -->
                    <td class="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        (click)="exportService.copyToClipboard(m.match, 'Copied match #' + (m.index + 1))"
                        class="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        title="Copy match text"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- 2. JSON VIEW -->
        @if (regexService.matches().length > 0 && viewMode() === 'json') {
          <div class="p-4 bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre><code>{{ jsonStringified() }}</code></pre>
          </div>
        }

        <!-- 3. RAW VIEW -->
        @if (regexService.matches().length > 0 && viewMode() === 'raw') {
          <div class="p-4 font-mono text-xs divide-y divide-zinc-200 dark:divide-zinc-800">
            @for (m of regexService.matches(); track m.index) {
              <div
                (mouseenter)="regexService.setHoveredMatch(m.index)"
                (mouseleave)="regexService.setHoveredMatch(null)"
                class="py-2 flex items-baseline gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 px-2 rounded transition-colors"
              >
                <span class="text-zinc-400 text-[11px] w-6 text-right">{{ m.index + 1 }}.</span>
                <span class="font-semibold text-zinc-900 dark:text-zinc-100">{{ m.match }}</span>
                <span class="text-zinc-500 text-[11px] ml-auto">[{{ m.start }}..{{ m.end }}]</span>
              </div>
            }
          </div>
        }

      </div>

    </div>
  `,
})
export class MatchResultsComponent {
  public readonly regexService = inject(RegexService);
  public readonly exportService = inject(ExportService);

  public readonly viewMode = signal<ResultViewMode>('table');

  public readonly jsonStringified = computed(() => {
    const list = this.regexService.matches().map((m) => ({
      index: m.index,
      match: m.match,
      start: m.start,
      end: m.end,
      length: m.length,
      groups: m.groups.map((g) => ({ index: g.index, value: g.value })),
      namedGroups: m.namedGroups,
    }));
    return JSON.stringify(list, null, 2);
  });

  public hasNamedGroups(m: RegexMatch): boolean {
    return Object.keys(m.namedGroups || {}).length > 0;
  }

  public getNamedGroupsEntries(m: RegexMatch): { key: string; value: string }[] {
    return Object.entries(m.namedGroups || {}).map(([key, value]) => ({ key, value }));
  }
}
