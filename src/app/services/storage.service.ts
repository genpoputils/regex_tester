import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RegexFlags, RegexSettings } from '../models/regex.models';

export interface PersistedRegexState {
  pattern: string;
  flags: RegexFlags;
  testString: string;
  updatedAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STATE_KEY = 'regex_tester_state';
  private readonly SETTINGS_KEY = 'regex_tester_settings';

  public saveState(state: { pattern: string; flags: RegexFlags; testString: string }): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const payload: PersistedRegexState = {
        ...state,
        updatedAt: Date.now(),
      };
      localStorage.setItem(this.STATE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors in restricted browser modes
    }
  }

  public loadState(): PersistedRegexState | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = localStorage.getItem(this.STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PersistedRegexState;
    } catch {
      return null;
    }
  }

  public saveSettings(settings: RegexSettings): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }

  public loadSettings(): RegexSettings | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = localStorage.getItem(this.SETTINGS_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as RegexSettings;
    } catch {
      return null;
    }
  }

  /**
   * Encodes pattern, flags string, and test text into a compact URL-safe base64 string.
   */
  public encodeShareUrl(pattern: string, flagsStr: string, testString: string): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    try {
      const data = {
        p: pattern,
        f: flagsStr,
        t: testString,
      };
      const json = JSON.stringify(data);
      const encoded = btoa(encodeURIComponent(json));
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('share', encoded);
      return url.toString();
    } catch {
      return window.location.href;
    }
  }

  /**
   * Decodes shared state from current URL if present.
   */
  public decodeShareUrl(): { pattern: string; flags: string; testString: string } | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const share = params.get('share');
      if (!share) return null;

      const decoded = decodeURIComponent(atob(share));
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed.p === 'string') {
        return {
          pattern: parsed.p,
          flags: parsed.f || 'gm',
          testString: parsed.t || '',
        };
      }
    } catch {
      // Malformed share URL
    }
    return null;
  }
}
