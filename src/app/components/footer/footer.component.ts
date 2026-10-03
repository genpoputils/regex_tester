import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        <!-- Brand Info -->
        <div class="md:col-span-1 space-y-3">
          <div class="flex items-center gap-2">
            <div class="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono text-xs font-bold">
              .*
            </div>
            <span class="font-bold text-base tracking-tight text-zinc-900 dark:text-white font-['Outfit']">
              Regex<span class="text-indigo-600 dark:text-indigo-400">Tester</span> Pro
            </span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            The modern, blazing-fast, client-side Regular Expression workbench. Engineered for developers who demand instant feedback, deep AST token explanations, and strict privacy.
          </p>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-medium">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Client-Side Engine (Zero Backend)
          </div>
        </div>

        <!-- Popular Presets -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3">
            Popular Presets
          </h4>
          <ul class="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <li><a routerLink="/" fragment="tester" class="hover:text-indigo-500 transition-colors">RFC Email Validation</a></li>
            <li><a routerLink="/" fragment="tester" class="hover:text-indigo-500 transition-colors">Strong Password Policy</a></li>
            <li><a routerLink="/" fragment="tester" class="hover:text-indigo-500 transition-colors">Indian PAN, Aadhaar & GSTIN</a></li>
            <li><a routerLink="/" fragment="tester" class="hover:text-indigo-500 transition-colors">IPv4 & IPv6 Addresses</a></li>
            <li><a routerLink="/" fragment="tester" class="hover:text-indigo-500 transition-colors">UUID / GUID Formats</a></li>
          </ul>
        </div>

        <!-- Learning & Reference -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3">
            Guides & Reference
          </h4>
          <ul class="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <li><a routerLink="/cheat-sheet" class="hover:text-indigo-500 transition-colors">Regex Syntax Cheat Sheet</a></li>
            <li><a routerLink="/cheat-sheet" fragment="character-classes" class="hover:text-indigo-500 transition-colors">Character Classes & Shorthands</a></li>
            <li><a routerLink="/cheat-sheet" fragment="quantifiers" class="hover:text-indigo-500 transition-colors">Quantifiers & Repetition</a></li>
            <li><a routerLink="/cheat-sheet" fragment="groups" class="hover:text-indigo-500 transition-colors">Capture & Named Groups</a></li>
            <li><a routerLink="/cheat-sheet" fragment="lookahead" class="hover:text-indigo-500 transition-colors">Lookaround Assertions</a></li>
          </ul>
        </div>

        <!-- Hotkeys Quick Card -->
        <div class="bg-zinc-100/70 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-2">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
            Keyboard Shortcuts
          </h4>
          <div class="space-y-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div class="flex justify-between items-center">
              <span>Focus Pattern:</span>
              <kbd class="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px] text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">Ctrl + /</kbd>
            </div>
            <div class="flex justify-between items-center">
              <span>Copy Regex:</span>
              <kbd class="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px] text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">Ctrl + Shift + C</kbd>
            </div>
            <div class="flex justify-between items-center">
              <span>Reset State:</span>
              <kbd class="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px] text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">Ctrl + Shift + R</kbd>
            </div>
            <div class="flex justify-between items-center">
              <span>Clear Editor:</span>
              <kbd class="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px] text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">Ctrl + L</kbd>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="max-w-7xl mx-auto pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© 2026 Regex Tester Pro. Open source developer tool. Free forever.</p>
        <div class="flex items-center gap-4">
          <a routerLink="/cheat-sheet" class="hover:underline">Cheat Sheet</a>
          <span class="text-zinc-400 dark:text-zinc-600">•</span>
          <span>Privacy Guaranteed: No telemetry collected</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
