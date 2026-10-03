import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { ShortcutsService } from '../../services/shortcuts.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Logo & Brand -->
        <a routerLink="/" class="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-mono font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            .*
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white font-['Outfit']">
                Regex<span class="text-indigo-600 dark:text-indigo-400">Tester</span>
              </span>
              <span class="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                PRO
              </span>
            </div>
            <span class="text-[11px] text-zinc-500 dark:text-zinc-400 -mt-1 hidden sm:inline">Client-Side RegExp Engine</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <a
            routerLink="/"
            routerLinkActive="text-indigo-600 dark:text-indigo-400 bg-zinc-100 dark:bg-zinc-800/60"
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-3 py-1.5 rounded-md hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            Tester
          </a>
          <button
            type="button"
            (click)="openPresetsModal.emit()"
            class="px-3 py-1.5 rounded-md hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors flex items-center gap-1.5"
          >
            Presets
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">22+</span>
          </button>
          <a
            routerLink="/cheat-sheet"
            routerLinkActive="text-indigo-600 dark:text-indigo-400 bg-zinc-100 dark:bg-zinc-800/60"
            class="px-3 py-1.5 rounded-md hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            Cheat Sheet
          </a>
        </nav>

        <!-- Action Tools Right -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          
          <!-- Share URL -->
          <button
            type="button"
            (click)="openShareModal.emit()"
            class="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Share Regex State"
            aria-label="Share Regex State"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>

          <!-- Shortcuts -->
          <button
            type="button"
            (click)="shortcutsService.openShortcutsModal()"
            class="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Keyboard Shortcuts (Ctrl + /)"
            aria-label="Keyboard Shortcuts"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>

          <!-- Settings -->
          <button
            type="button"
            (click)="openSettingsModal.emit()"
            class="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Preferences & Settings"
            aria-label="Preferences & Settings"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <!-- Theme Toggle (Day / Night) -->
          <div class="relative flex items-center bg-zinc-100 dark:bg-zinc-800/90 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700/60 shadow-inner">
            <button
              type="button"
              (click)="themeService.setTheme('light')"
              [class.bg-white]="!themeService.isDark()"
              [class.text-amber-500]="!themeService.isDark()"
              [class.shadow-sm]="!themeService.isDark()"
              [class.text-zinc-400]="themeService.isDark()"
              class="p-1.5 rounded-md hover:text-zinc-900 dark:hover:text-white transition-all flex items-center justify-center cursor-pointer"
              title="Day Mode (Light)"
              aria-label="Switch to Day Mode"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <button
              type="button"
              (click)="themeService.setTheme('dark')"
              [class.bg-zinc-700]="themeService.isDark()"
              [class.text-indigo-400]="themeService.isDark()"
              [class.shadow-sm]="themeService.isDark()"
              [class.text-zinc-500]="!themeService.isDark()"
              class="p-1.5 rounded-md hover:text-zinc-900 dark:hover:text-white transition-all flex items-center justify-center cursor-pointer"
              title="Night Mode (Dark)"
              aria-label="Switch to Night Mode"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>

        </div>

      </div>
    </header>
  `,
})
export class NavbarComponent {
  public readonly themeService = inject(ThemeService);
  public readonly shortcutsService = inject(ShortcutsService);
  public readonly exportService = inject(ExportService);

  public readonly openPresetsModal = output<void>();
  public readonly openShareModal = output<void>();
  public readonly openSettingsModal = output<void>();
}
