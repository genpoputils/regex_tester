import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  computed,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegexService } from '../../services/regex.service';
import { ExportService } from '../../services/export.service';
import { SettingsService } from '../../services/settings.service';

interface TextSegment {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
  colorIndex?: number;
}

@Component({
  selector: 'app-test-string-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col w-full h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden transition-all">
      
      <!-- Header Bar -->
      <div class="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Test String
          </span>
          <span class="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            {{ textStats() }}
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Copy Test String -->
          <button
            type="button"
            (click)="exportService.copyTestString()"
            class="px-2 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
            title="Copy test string"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span class="hidden sm:inline">Copy</span>
          </button>

          <!-- Clear Test String -->
          <button
            type="button"
            (click)="regexService.setTestString('')"
            class="px-2 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Clear test text"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Editor Container with Overlay Highlighting -->
      <div
        class="relative flex-1 min-h-[220px] sm:min-h-[260px] max-h-[460px] overflow-hidden bg-zinc-900/5 dark:bg-black/30 font-mono"
        [style.font-size.px]="settingsService.settings().fontSize"
      >
        
        <!-- Highlight Backdrop Layer -->
        <div
          #backdrop
          class="absolute inset-0 p-4 font-mono pointer-events-none whitespace-pre-wrap break-words overflow-hidden text-transparent select-none leading-relaxed"
          [style.white-space]="settingsService.settings().wordWrap ? 'pre-wrap' : 'pre'"
          aria-hidden="true"
        >
          @for (seg of highlightedSegments(); track $index) {
            @if (seg.isMatch) {
              <mark
                [class]="'match-color-' + seg.colorIndex"
                [class.match-hover-active]="regexService.hoveredMatchIndex() === seg.matchIndex"
                class="rounded-sm transition-all duration-150 inline cursor-pointer pointer-events-auto"
                (mouseenter)="onHoverMatch(seg.matchIndex)"
                (mouseleave)="onLeaveMatch()"
              >{{ seg.text }}</mark>
            } @else {
              <span>{{ seg.text }}</span>
            }
          }
        </div>

        <!-- Interactive Textarea Layer -->
        <textarea
          #textarea
          [ngModel]="regexService.testString()"
          (ngModelChange)="regexService.setTestString($event)"
          (scroll)="syncScroll()"
          placeholder="Paste or write your test string here..."
          class="absolute inset-0 w-full h-full p-4 font-mono leading-relaxed bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border-0 focus:outline-none focus:ring-0 resize-none z-10"
          [style.white-space]="settingsService.settings().wordWrap ? 'pre-wrap' : 'pre'"
          spellcheck="false"
          aria-label="Test String Input"
        ></textarea>

      </div>

      <!-- Footer Info -->
      <div class="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="regexService.totalMatches() > 0" [class.bg-zinc-400]="regexService.totalMatches() === 0"></span>
            {{ regexService.totalMatches() }} {{ regexService.totalMatches() === 1 ? 'match' : 'matches' }} found
          </span>
          @if (regexService.executionTimeMs() > 0) {
            <span>• in {{ regexService.executionTimeMs() }}ms</span>
          }
        </div>

        <div class="flex items-center gap-2">
          <span class="hidden sm:inline">Wrap:</span>
          <button
            type="button"
            (click)="toggleWordWrap()"
            class="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {{ settingsService.settings().wordWrap ? 'On' : 'Off' }}
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    textarea {
      caret-color: #6366f1;
    }
  `],
})
export class TestStringEditorComponent {
  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('backdrop') backdropRef!: ElementRef<HTMLDivElement>;

  public readonly regexService = inject(RegexService);
  public readonly exportService = inject(ExportService);
  public readonly settingsService = inject(SettingsService);

  public readonly textStats = computed(() => {
    const text = this.regexService.testString();
    const chars = text.length;
    const lines = text ? text.split('\n').length : 0;
    return `${lines} lines, ${chars} chars`;
  });

  /**
   * Pre-calculates non-overlapping text segments for live highlighting with 6 curated colors.
   */
  public readonly highlightedSegments = computed<TextSegment[]>(() => {
    const text = this.regexService.testString();
    const matches = this.regexService.matches();

    if (!text) return [];
    if (!matches || matches.length === 0) {
      return [{ text, isMatch: false }];
    }

    const segments: TextSegment[] = [];
    let currentIndex = 0;

    // Filter valid matches and sort by start index
    const sorted = [...matches]
      .filter((m) => m.length > 0 && m.start >= 0 && m.end <= text.length)
      .sort((a, b) => a.start - b.start);

    for (let i = 0; i < sorted.length; i++) {
      const m = sorted[i];

      // If there's non-matching text before this match
      if (m.start > currentIndex) {
        segments.push({
          text: text.slice(currentIndex, m.start),
          isMatch: false,
        });
      }

      // Add the matched text
      if (m.end > currentIndex) {
        const segStart = Math.max(currentIndex, m.start);
        segments.push({
          text: text.slice(segStart, m.end),
          isMatch: true,
          matchIndex: m.index,
          colorIndex: m.colorIndex,
        });
        currentIndex = m.end;
      }
    }

    // Add any remaining text
    if (currentIndex < text.length) {
      segments.push({
        text: text.slice(currentIndex),
        isMatch: false,
      });
    }

    return segments;
  });

  public syncScroll(): void {
    if (this.textareaRef && this.backdropRef) {
      this.backdropRef.nativeElement.scrollTop = this.textareaRef.nativeElement.scrollTop;
      this.backdropRef.nativeElement.scrollLeft = this.textareaRef.nativeElement.scrollLeft;
    }
  }

  public onHoverMatch(index?: number): void {
    if (index !== undefined) {
      this.regexService.setHoveredMatch(index);
    }
  }

  public onLeaveMatch(): void {
    this.regexService.setHoveredMatch(null);
  }

  public toggleWordWrap(): void {
    const curr = this.settingsService.settings().wordWrap;
    this.settingsService.updateSetting('wordWrap', !curr);
  }
}
