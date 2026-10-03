import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { RegexFlags, RegexMatch, CaptureGroup, PresetItem } from '../models/regex.models';
import { RegexExplainer } from '../utils/regex-explainer';
import { REGEX_PRESETS } from '../utils/regex-presets';
import { StorageService } from './storage.service';
import { SettingsService } from './settings.service';

const DEFAULT_PATTERN = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
const DEFAULT_TEST_STRING = `Welcome to the Regex Tester Pro!
Try testing some email addresses:
- contact: support@example.com
- personal: dev.lead+filter@startup.io
- invalid format: missing-at-domain.com

You can hover over matches below or in the text to inspect capture groups!`;

@Injectable({
  providedIn: 'root',
})
export class RegexService {
  private readonly storage = inject(StorageService);
  private readonly settingsService = inject(SettingsService);

  // Core State Signals
  public readonly pattern = signal<string>(DEFAULT_PATTERN);
  public readonly testString = signal<string>(DEFAULT_TEST_STRING);
  public readonly flags = signal<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: true,
    unicode: false,
    sticky: false,
    dotAll: false,
    hasIndices: true,
  });

  // Derived & Results Signals
  public readonly matches = signal<RegexMatch[]>([]);
  public readonly error = signal<string | null>(null);
  public readonly executionTimeMs = signal<number>(0);
  public readonly hoveredMatchIndex = signal<number | null>(null);
  public readonly activePresetId = signal<string | null>('email');

  // Computed Flags String (e.g. "gm" or "gimsud")
  public readonly flagsString = computed(() => {
    const f = this.flags();
    let str = '';
    if (f.hasIndices) str += 'd';
    if (f.global) str += 'g';
    if (f.ignoreCase) str += 'i';
    if (f.multiline) str += 'm';
    if (f.dotAll) str += 's';
    if (f.unicode) str += 'u';
    if (f.sticky) str += 'y';
    return str;
  });

  // Computed Regex Explainer Tokens
  public readonly tokenExplanations = computed(() => {
    return RegexExplainer.explain(this.pattern(), this.flagsString());
  });

  public readonly totalMatches = computed(() => this.matches().length);
  public readonly isValid = computed(() => this.error() === null);

  private saveTimeout: any = null;

  constructor() {
    this.restoreInitialState();

    // Re-run compilation whenever pattern, flags, or test string changes
    effect(() => {
      const p = this.pattern();
      const fs = this.flagsString();
      const t = this.testString();
      this.compileAndMatch(p, fs, t);

      // Auto-save debounced
      if (this.settingsService.settings().autoSave) {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          this.storage.saveState({
            pattern: this.pattern(),
            flags: this.flags(),
            testString: this.testString(),
          });
        }, 500);
      }
    });
  }

  public recompile(): void {
    this.compileAndMatch(this.pattern(), this.flagsString(), this.testString());
  }

  private restoreInitialState(): void {
    // 1. Check if shared via URL parameters
    const shared = this.storage.decodeShareUrl();
    if (shared) {
      this.pattern.set(shared.pattern);
      this.testString.set(shared.testString);
      this.applyFlagsFromString(shared.flags);
      this.activePresetId.set(null);
      this.recompile();
      return;
    }

    // 2. Otherwise restore from LocalStorage
    const saved = this.storage.loadState();
    if (saved) {
      this.pattern.set(saved.pattern ?? DEFAULT_PATTERN);
      this.testString.set(saved.testString ?? DEFAULT_TEST_STRING);
      if (saved.flags) {
        this.flags.set(saved.flags);
      }
    }
    this.recompile();
  }

  public setPattern(pattern: string): void {
    this.pattern.set(pattern);
    this.recompile();
  }

  public setTestString(text: string): void {
    this.testString.set(text);
    this.recompile();
  }

  public toggleFlag(flag: keyof RegexFlags): void {
    this.flags.update((f) => ({ ...f, [flag]: !f[flag] }));
    this.recompile();
  }

  public setFlag(flag: keyof RegexFlags, value: boolean): void {
    this.flags.update((f) => ({ ...f, [flag]: value }));
    this.recompile();
  }

  public applyFlagsFromString(flagsStr: string): void {
    this.flags.set({
      hasIndices: flagsStr.includes('d'),
      global: flagsStr.includes('g'),
      ignoreCase: flagsStr.includes('i'),
      multiline: flagsStr.includes('m'),
      dotAll: flagsStr.includes('s'),
      unicode: flagsStr.includes('u'),
      sticky: flagsStr.includes('y'),
    });
    this.recompile();
  }

  public applyPreset(preset: PresetItem): void {
    this.pattern.set(preset.pattern);
    this.testString.set(preset.testString);
    this.applyFlagsFromString(preset.flags);
    this.activePresetId.set(preset.id);
    this.recompile();
  }

  public insertToken(tokenText: string): void {
    this.pattern.update((prev) => prev + tokenText);
    this.recompile();
  }

  public clear(): void {
    this.pattern.set('');
    this.testString.set('');
    this.matches.set([]);
    this.error.set(null);
    this.activePresetId.set(null);
  }

  public reset(): void {
    this.pattern.set(DEFAULT_PATTERN);
    this.testString.set(DEFAULT_TEST_STRING);
    this.flags.set({
      global: true,
      ignoreCase: false,
      multiline: true,
      unicode: false,
      sticky: false,
      dotAll: false,
      hasIndices: true,
    });
    this.activePresetId.set('email');
    this.recompile();
  }

  public setHoveredMatch(index: number | null): void {
    this.hoveredMatchIndex.set(index);
  }

  /**
   * Safely compiles and executes RegExp against the test string.
   * Handles errors gracefully with user-friendly error translations.
   */
  public compileAndMatch(pattern: string, flags: string, testString: string): void {
    if (!pattern) {
      this.matches.set([]);
      this.error.set(null);
      this.executionTimeMs.set(0);
      return;
    }

    const startTime = performance.now();

    try {
      // Test compilation first
      const regex = new RegExp(pattern, flags);
      this.error.set(null);

      if (!testString) {
        this.matches.set([]);
        this.executionTimeMs.set(0);
        return;
      }

      const results: RegexMatch[] = [];
      const MAX_MATCHES = 5000;
      let matchCount = 0;

      if (flags.includes('g')) {
        let match: RegExpExecArray | null;
        let lastIndex = -1;

        while ((match = regex.exec(testString)) !== null) {
          matchCount++;
          if (matchCount > MAX_MATCHES) {
            break;
          }

          const matchStart = match.index;
          const matchStr = match[0];
          const matchEnd = matchStart + matchStr.length;

          // Capture groups
          const groups: CaptureGroup[] = [];
          if (match.length > 1) {
            for (let i = 1; i < match.length; i++) {
              if (match[i] !== undefined) {
                // If hasIndices (d flag) supported
                const indices = (match as any).indices;
                const gStart = indices && indices[i] ? indices[i][0] : matchStart;
                const gEnd = indices && indices[i] ? indices[i][1] : matchStart + (match[i]?.length || 0);

                groups.push({
                  index: i,
                  value: match[i],
                  start: gStart,
                  end: gEnd,
                });
              }
            }
          }

          // Named groups
          const namedGroups: Record<string, string> = {};
          if (match.groups) {
            Object.assign(namedGroups, match.groups);
          }

          results.push({
            index: results.length,
            match: matchStr,
            start: matchStart,
            end: matchEnd,
            length: matchStr.length,
            groups,
            namedGroups,
            colorIndex: results.length % 6,
          });

          // Prevent infinite loop on zero-width matches (e.g. ^ or \b or empty groups)
          if (regex.lastIndex === lastIndex) {
            regex.lastIndex++;
          }
          lastIndex = regex.lastIndex;

          if (regex.lastIndex > testString.length) {
            break;
          }
        }
      } else {
        // Single match mode (without 'g' flag)
        const match = regex.exec(testString);
        if (match) {
          const matchStart = match.index;
          const matchStr = match[0];
          const matchEnd = matchStart + matchStr.length;

          const groups: CaptureGroup[] = [];
          if (match.length > 1) {
            for (let i = 1; i < match.length; i++) {
              if (match[i] !== undefined) {
                const indices = (match as any).indices;
                const gStart = indices && indices[i] ? indices[i][0] : matchStart;
                const gEnd = indices && indices[i] ? indices[i][1] : matchStart + (match[i]?.length || 0);
                groups.push({
                  index: i,
                  value: match[i],
                  start: gStart,
                  end: gEnd,
                });
              }
            }
          }

          const namedGroups: Record<string, string> = {};
          if (match.groups) {
            Object.assign(namedGroups, match.groups);
          }

          results.push({
            index: 0,
            match: matchStr,
            start: matchStart,
            end: matchEnd,
            length: matchStr.length,
            groups,
            namedGroups,
            colorIndex: 0,
          });
        }
      }

      const elapsed = performance.now() - startTime;
      this.executionTimeMs.set(Number(elapsed.toFixed(2)));
      this.matches.set(results);
    } catch (err: any) {
      const formatted = this.formatErrorMessage(err?.message || 'Invalid regular expression');
      this.error.set(formatted);
      this.matches.set([]);
      this.executionTimeMs.set(0);
    }
  }

  /**
   * Formats raw JavaScript RegExp error messages into friendly, actionable advice.
   */
  private formatErrorMessage(rawMessage: string): string {
    if (rawMessage.includes('Invalid regular expression')) {
      const detail = rawMessage.replace(/^Invalid regular expression:\s*/, '');
      if (detail.includes('Unterminated character class') || detail.includes('missing ]')) {
        return 'Syntax Error: Missing closing bracket "]" in character class.';
      }
      if (detail.includes('Unterminated group') || detail.includes('missing )')) {
        return 'Syntax Error: Missing closing parenthesis ")" in group.';
      }
      if (detail.includes('nothing to repeat')) {
        return 'Syntax Error: Quantifier (*, +, ?, {}) has no preceding token to repeat.';
      }
      if (detail.includes('numbers out of order in {} quantifier')) {
        return 'Syntax Error: Quantifier range is invalid. Minimum cannot be greater than maximum {min,max}.';
      }
      if (detail.includes('Range out of order in character class')) {
        return 'Syntax Error: Character range [a-z] is out of order (e.g. [z-a]).';
      }
      if (detail.includes('Invalid escape')) {
        return 'Syntax Error: Invalid or unrecognized escape sequence.';
      }
      return `Syntax Error: ${detail}`;
    }
    return rawMessage;
  }
}
