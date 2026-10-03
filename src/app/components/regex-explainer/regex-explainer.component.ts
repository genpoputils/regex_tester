import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegexService } from '../../services/regex.service';
import { RegexExplanationToken } from '../../models/regex.models';

@Component({
  selector: 'app-regex-explainer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden transition-all">
      
      <!-- Explainer Header -->
      <div class="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-violet-500"></div>
          <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Regex Explainer (AST Token Breakdown)
          </span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
            {{ regexService.tokenExplanations().length }} tokens
          </span>
        </div>

        <button
          type="button"
          (click)="isExpanded.set(!isExpanded())"
          class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>{{ isExpanded() ? 'Hide Breakdown' : 'Show Breakdown' }}</span>
          <svg
            class="w-3.5 h-3.5 transition-transform"
            [class.rotate-180]="isExpanded()"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Explainer Body -->
      @if (isExpanded()) {
        <div class="p-4 space-y-4">
          
          <!-- Token Strip -->
          <div class="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-zinc-100/60 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800/80 font-mono">
            @for (token of regexService.tokenExplanations(); track token.id) {
              <button
                type="button"
                (mouseenter)="selectedToken.set(token)"
                (click)="selectedToken.set(token)"
                [class]="getTokenBadgeClass(token)"
                [class.ring-2]="selectedToken()?.id === token.id"
                class="px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all hover:scale-105 active:scale-95 focus:outline-none"
                [title]="token.title"
              >
                {{ token.raw }}
              </button>
            }

            @if (regexService.tokenExplanations().length === 0) {
              <span class="text-xs font-sans text-zinc-400 dark:text-zinc-600 italic">
                Enter a pattern above to inspect token breakdown.
              </span>
            }
          </div>

          <!-- Active Token Detail Card -->
          @if (selectedToken(); as active) {
            <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 transition-all animate-fade-in">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-lg font-mono text-sm font-bold bg-zinc-900 text-white dark:bg-zinc-800">
                    {{ active.raw }}
                  </span>
                  <h4 class="text-sm font-bold text-zinc-900 dark:text-white">
                    {{ active.title }}
                  </h4>
                </div>
                <span [class]="getCategoryBadgeClass(active.type)" class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border">
                  {{ active.type }}
                </span>
              </div>

              <p class="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                {{ active.description }}
              </p>

              @if (active.example) {
                <div class="flex items-center gap-2 text-xs font-mono p-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border border-zinc-300/60 dark:border-zinc-800">
                  <span class="text-indigo-600 dark:text-indigo-400 font-bold">Example:</span>
                  <span>{{ active.example }}</span>
                </div>
              }
            </div>
          } @else if (regexService.tokenExplanations().length > 0) {
            <p class="text-xs text-zinc-500 italic text-center py-2">
              Hover or click any token above to read its explanation and example.
            </p>
          }

        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.15s ease-out forwards;
    }
  `],
})
export class RegexExplainerComponent {
  public readonly regexService = inject(RegexService);
  public readonly isExpanded = signal<boolean>(true);
  public readonly selectedToken = signal<RegexExplanationToken | null>(null);

  constructor() {
    // Automatically select first token if none selected
    const initial = this.regexService.tokenExplanations();
    if (initial.length > 0) {
      this.selectedToken.set(initial[0]);
    }
  }

  public getTokenBadgeClass(token: RegexExplanationToken): string {
    switch (token.type) {
      case 'anchor':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800 ring-amber-400';
      case 'quantifier':
        return 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/70 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 ring-cyan-400';
      case 'character-class':
        return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ring-emerald-400';
      case 'group':
        return 'bg-violet-100 text-violet-900 dark:bg-violet-950/70 dark:text-violet-300 border border-violet-300 dark:border-violet-800 ring-violet-400';
      case 'assertion':
        return 'bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950/70 dark:text-fuchsia-300 border border-fuchsia-300 dark:border-fuchsia-800 ring-fuchsia-400';
      case 'escape':
        return 'bg-rose-100 text-rose-900 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ring-rose-400';
      case 'operator':
        return 'bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800 ring-blue-400';
      default:
        return 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 ring-zinc-400';
    }
  }

  public getCategoryBadgeClass(type: RegexExplanationToken['type']): string {
    switch (type) {
      case 'anchor':
        return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'quantifier':
        return 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800';
      case 'character-class':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'group':
        return 'bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800';
      case 'assertion':
        return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-950/50 dark:text-fuchsia-300 dark:border-fuchsia-800';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  }
}
