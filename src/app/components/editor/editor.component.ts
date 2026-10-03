import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
  effect,
  signal,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegexService } from '../../services/regex.service';
import { ExportService } from '../../services/export.service';
import { ShortcutsService } from '../../services/shortcuts.service';
import { SettingsService } from '../../services/settings.service';
import { ThemeService } from '../../services/theme.service';

declare const window: any;

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden transition-all">
      
      <!-- Editor Header Bar -->
      <div class="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Regular Expression
          </span>
          <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            ECMAScript
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Copy Regex Button -->
          <button
            type="button"
            (click)="exportService.copyRegexLiteral()"
            class="px-2 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
            title="Copy /regex/flags (Ctrl + Shift + C)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span class="hidden sm:inline">Copy</span>
          </button>

          <!-- Clear Pattern Button -->
          <button
            type="button"
            (click)="regexService.setPattern('')"
            class="px-2 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Clear pattern"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Regex Input Area -->
      <div class="relative flex items-center px-4 py-3 bg-zinc-900/5 dark:bg-black/30 font-mono text-base sm:text-lg">
        
        <!-- Opening slash -->
        <span class="text-zinc-400 dark:text-zinc-500 font-bold select-none text-xl mr-2">
          /
        </span>

        <!-- Pattern Input (Supports Monaco container or high-speed responsive input) -->
        <div class="flex-1 relative flex items-center">
          <input
            #patternInput
            type="text"
            [ngModel]="regexService.pattern()"
            (ngModelChange)="onPatternChange($event)"
            placeholder="Type your regular expression (e.g. [a-zA-Z0-9]+)..."
            class="w-full bg-transparent border-0 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 font-mono focus:outline-none focus:ring-0 text-base sm:text-lg tracking-wide py-1"
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            aria-label="Regular Expression Pattern"
          />

          @if (isMonacoLoaded()) {
            <div #monacoContainer class="absolute inset-0 hidden"></div>
          }
        </div>

        <!-- Closing slash & Flags -->
        <div class="flex items-center gap-1.5 ml-2 select-none">
          <span class="text-zinc-400 dark:text-zinc-500 font-bold text-xl">
            /
          </span>
          <span
            class="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/50"
            title="Active flags"
          >
            {{ regexService.flagsString() || '∅' }}
          </span>
        </div>

      </div>

      <!-- Real-time Validation Error Banner -->
      @if (regexService.error(); as err) {
        <div
          class="flex items-start gap-2.5 px-4 py-2.5 bg-rose-500/10 border-t border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono"
          role="alert"
        >
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="flex-1 font-sans">
            <span class="font-semibold text-rose-700 dark:text-rose-300">Invalid Pattern:</span>
            <span class="ml-1 font-mono">{{ err }}</span>
          </div>
        </div>
      }

    </div>
  `,
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('patternInput') patternInput!: ElementRef<HTMLInputElement>;
  @ViewChild('monacoContainer') monacoContainer?: ElementRef<HTMLDivElement>;

  public readonly regexService = inject(RegexService);
  public readonly exportService = inject(ExportService);
  public readonly shortcutsService = inject(ShortcutsService);
  public readonly settingsService = inject(SettingsService);
  public readonly themeService = inject(ThemeService);

  private readonly platformId = inject(PLATFORM_ID);
  public readonly isMonacoLoaded = signal<boolean>(false);

  private monacoEditorInstance: any = null;

  constructor() {
    // Listen for Focus Pattern shortcut (Ctrl + /)
    effect(() => {
      const trigger = this.shortcutsService.focusPatternTrigger();
      if (trigger > 0 && this.patternInput) {
        this.patternInput.nativeElement.focus();
        this.patternInput.nativeElement.select();
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMonacoLoader();
    }
  }

  ngOnDestroy(): void {
    if (this.monacoEditorInstance) {
      this.monacoEditorInstance.dispose();
    }
  }

  public onPatternChange(newPattern: string): void {
    this.regexService.setPattern(newPattern);
  }

  /**
   * Initializes Monaco Editor dynamically when supported in client browser.
   */
  private initMonacoLoader(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.monaco) {
      this.isMonacoLoaded.set(true);
      return;
    }

    // Load Monaco loader script from local assets
    const script = document.createElement('script');
    script.src = '/assets/monaco/vs/loader.js';
    script.async = true;
    script.onload = () => {
      if (window.require) {
        window.require.config({ paths: { vs: '/assets/monaco/vs' } });
        window.require(['vs/editor/editor.main'], () => {
          this.isMonacoLoaded.set(true);
        });
      }
    };
    script.onerror = () => {
      // Gracefully continue with high-speed accessible input
      this.isMonacoLoaded.set(false);
    };
    document.body.appendChild(script);
  }
}
