import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-zinc-200 dark:border-zinc-800/80">
      
      <!-- Subtle Background Glow Orbs -->
      <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-transparent blur-3xl rounded-full"></div>
      
      <div class="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        
        <!-- Live Pill Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
          <span class="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
          <span>Zero-Latency Client-Side JavaScript RegExp Engine</span>
        </div>

        <!-- Main Title -->
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Outfit'] text-zinc-900 dark:text-white mb-5">
          Regex <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-400">Tester</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Test regular expressions, explore presets, learn regex syntax, and use our handy regex cheat sheet.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            type="button"
            (click)="scrollToTester()"
            class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
          >
            <span>Start Testing</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          <a
            routerLink="/cheat-sheet"
            class="px-6 py-3 rounded-xl bg-white dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white font-semibold text-sm sm:text-base border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-700/70 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Regex Cheat Sheet</span>
          </a>
        </div>

        <!-- Highlight Metric Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div class="p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
            <div class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Latency</div>
            <div class="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              0ms (Client-Side)
            </div>
          </div>
          <div class="p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
            <div class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Privacy</div>
            <div class="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              No Data Sent to Server
            </div>
          </div>
          <div class="p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
            <div class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Explainer</div>
            <div class="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              AST Token Breakdown
            </div>
          </div>
          <div class="p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
            <div class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Presets</div>
            <div class="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              22+ One-Click Patterns
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
})
export class HeroComponent {
  public scrollToTester(): void {
    const el = document.getElementById('tester');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
