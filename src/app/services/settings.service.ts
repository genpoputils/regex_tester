import { Injectable, signal, effect, inject } from '@angular/core';
import { RegexSettings } from '../models/regex.models';
import { StorageService } from './storage.service';
import { ThemeService, ThemeMode } from './theme.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly storage = inject(StorageService);
  private readonly themeService = inject(ThemeService);

  private readonly defaultSettings: RegexSettings = {
    fontSize: 14,
    wordWrap: true,
    theme: 'dark',
    editorHeight: 'normal',
    autoSave: true,
    highlightColors: true,
  };

  public readonly settings = signal<RegexSettings>(this.defaultSettings);

  constructor() {
    const saved = this.storage.loadSettings();
    const currentTheme = this.themeService.currentTheme();
    if (saved) {
      this.settings.set({ ...this.defaultSettings, ...saved, theme: currentTheme });
    } else {
      this.settings.update((s) => ({ ...s, theme: currentTheme }));
    }

    effect(() => {
      const activeTheme = this.themeService.currentTheme();
      if (this.settings().theme !== activeTheme) {
        this.settings.update((s) => ({ ...s, theme: activeTheme }));
        this.storage.saveSettings(this.settings());
      }
    });
  }

  public updateSetting<K extends keyof RegexSettings>(key: K, value: RegexSettings[K]): void {
    const updated = { ...this.settings(), [key]: value };
    this.settings.set(updated);
    this.storage.saveSettings(updated);

    if (key === 'theme') {
      this.themeService.setTheme(value as ThemeMode);
    }
  }

  public resetDefaults(): void {
    this.settings.set(this.defaultSettings);
    this.storage.saveSettings(this.defaultSettings);
    this.themeService.setTheme(this.defaultSettings.theme);
  }
}
