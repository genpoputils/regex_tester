import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'dark' | 'light' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'regex_tester_theme';

  // Signals
  public readonly currentTheme = signal<ThemeMode>('dark');
  public readonly isDark = signal<boolean>(true);

  private mediaQueryList: MediaQueryList | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY) as ThemeMode | null;
      const initial: ThemeMode = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'dark';
      this.currentTheme.set(initial);

      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        this.mediaQueryList.addEventListener('change', () => {
          if (this.currentTheme() === 'system') {
            this.applyTheme('system');
          }
        });
      }

      this.applyTheme(initial);
    }
  }

  public setTheme(mode: ThemeMode): void {
    this.currentTheme.set(mode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, mode);
      this.applyTheme(mode);
    }
  }

  private applyTheme(mode: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let darkMode = true;
    if (mode === 'dark') {
      darkMode = true;
    } else if (mode === 'light') {
      darkMode = false;
    } else if (mode === 'system') {
      darkMode = this.mediaQueryList ? this.mediaQueryList.matches : true;
    }

    this.isDark.set(darkMode);
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  }
}
