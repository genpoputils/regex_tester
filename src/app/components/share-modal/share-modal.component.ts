import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../services/export.service';
import { RegexService } from '../../services/regex.service';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      (click)="closeModal.emit()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        class="w-full max-w-lg flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
          <div>
            <h3 id="share-modal-title" class="text-base font-bold text-zinc-900 dark:text-white font-['Outfit']">
              Share Regex State
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Share your pattern, flags, and test string with anyone via a persistent link.
            </p>
          </div>

          <button
            type="button"
            (click)="closeModal.emit()"
            class="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5">
          
          <!-- Summary Pill -->
          <div class="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
            <span class="text-zinc-400">Regex: </span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">
              /{{ regexService.pattern() }}/{{ regexService.flagsString() }}
            </span>
          </div>

          <!-- URL Input Box with Copy Button -->
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Shareable Web Link
            </label>
            <div class="flex items-center gap-2">
              <input
                type="text"
                readonly
                [value]="shareUrl"
                class="flex-1 px-3 py-2 text-xs font-mono bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
              <button
                type="button"
                (click)="exportService.copyShareUrl()"
                class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Link</span>
              </button>
            </div>
          </div>

          <!-- Social Share Links -->
          <div>
            <label class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Share Directly
            </label>
            <div class="flex items-center gap-2">
              <a
                [href]="twitterShareUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Twitter / X
              </a>
              <a
                [href]="whatsAppShareUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                WhatsApp
              </a>
              <a
                [href]="linkedInShareUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
          <button
            type="button"
            (click)="closeModal.emit()"
            class="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.15s ease-out forwards;
    }
  `],
})
export class ShareModalComponent {
  public readonly exportService = inject(ExportService);
  public readonly regexService = inject(RegexService);
  public readonly closeModal = output<void>();

  public get shareUrl(): string {
    return this.exportService.generateShareUrl();
  }

  public get twitterShareUrl(): string {
    const text = encodeURIComponent(`Check out this regular expression on Regex Tester Pro:\n/${this.regexService.pattern()}/${this.regexService.flagsString()}\n`);
    return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(this.shareUrl)}`;
  }

  public get whatsAppShareUrl(): string {
    const text = encodeURIComponent(`Regex Tester: /${this.regexService.pattern()}/${this.regexService.flagsString()}\n${this.shareUrl}`);
    return `https://api.whatsapp.com/send?text=${text}`;
  }

  public get linkedInShareUrl(): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareUrl)}`;
  }
}
