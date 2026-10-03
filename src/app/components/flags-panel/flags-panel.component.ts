import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegexService } from '../../services/regex.service';
import { RegexFlags } from '../../models/regex.models';

interface FlagConfig {
  key: keyof RegexFlags;
  letter: string;
  name: string;
  tooltip: string;
}

@Component({
  selector: 'app-flags-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800">
      
      <!-- Flags Toggle Buttons -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mr-1 hidden sm:inline">
          Flags:
        </span>

        @for (f of availableFlags; track f.key) {
          <button
            type="button"
            (click)="regexService.toggleFlag(f.key)"
            [class.bg-indigo-600]="regexService.flags()[f.key]"
            [class.text-white]="regexService.flags()[f.key]"
            [class.border-indigo-600]="regexService.flags()[f.key]"
            [class.shadow-sm]="regexService.flags()[f.key]"
            [class.bg-white]="!regexService.flags()[f.key]"
            [class.dark:bg-zinc-800]="!regexService.flags()[f.key]"
            [class.text-zinc-700]="!regexService.flags()[f.key]"
            [class.dark:text-zinc-300]="!regexService.flags()[f.key]"
            [class.border-zinc-300]="!regexService.flags()[f.key]"
            [class.dark:border-zinc-700]="!regexService.flags()[f.key]"
            class="px-2.5 py-1 rounded-lg text-xs font-mono font-medium border hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 group relative"
            [title]="f.tooltip"
            [attr.aria-pressed]="regexService.flags()[f.key]"
          >
            <span class="font-bold">{{ f.letter }}</span>
            <span class="text-[11px] font-sans opacity-90 hidden md:inline">{{ f.name }}</span>
          </button>
        }
      </div>

      <!-- Flag Summary Pill -->
      <div class="flex items-center gap-2">
        <div class="px-2.5 py-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
          <span class="text-zinc-400 dark:text-zinc-500">flags:</span>
          <span class="text-indigo-600 dark:text-indigo-400 font-bold ml-1">
            {{ regexService.flagsString() || 'none' }}
          </span>
        </div>
      </div>

    </div>
  `,
})
export class FlagsPanelComponent {
  public readonly regexService = inject(RegexService);

  public readonly availableFlags: FlagConfig[] = [
    { key: 'global', letter: 'g', name: 'Global', tooltip: 'Global match: Find all matches rather than stopping after first' },
    { key: 'ignoreCase', letter: 'i', name: 'Ignore Case', tooltip: 'Case-insensitive matching (A equals a)' },
    { key: 'multiline', letter: 'm', name: 'Multiline', tooltip: '^ and $ match start and end of each line' },
    { key: 'dotAll', letter: 's', name: 'DotAll', tooltip: 'Dot (.) matches any character including newlines' },
    { key: 'unicode', letter: 'u', name: 'Unicode', tooltip: 'Treat pattern as a sequence of Unicode code points' },
    { key: 'sticky', letter: 'y', name: 'Sticky', tooltip: 'Matches only from the index indicated by lastIndex' },
    { key: 'hasIndices', letter: 'd', name: 'Has Indices', tooltip: 'Generate start and end indices for substring matches' },
  ];
}
