import { Component, input, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (adClient()) {
      <div
        class="w-full my-6 flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/60 overflow-hidden"
      >
        <span class="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1 select-none">
          Advertisement
        </span>

        <!-- AdSense Container -->
        <div class="w-full flex items-center justify-center min-h-[90px]">
          <ins
            class="adsbygoogle"
            style="display:block; text-align:center;"
            [attr.data-ad-layout]="adLayout() || null"
            [attr.data-ad-format]="adFormat() || 'auto'"
            [attr.data-full-width-responsive]="'true'"
            [attr.data-ad-client]="adClient()"
            [attr.data-ad-slot]="adSlot()"
          ></ins>
        </div>
      </div>
    } @else if (showPlaceholder()) {
      <div
        class="w-full my-6 flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/60 overflow-hidden"
      >
        <span class="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1 select-none">
          Advertisement
        </span>

        <div class="w-full flex items-center justify-center min-h-[90px]">
          <div class="w-full max-w-2xl py-4 px-6 text-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700/60 text-xs text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center gap-1">
            <span class="font-medium text-zinc-700 dark:text-zinc-300">Responsive Display Ad Slot</span>
            <span class="text-[11px] text-zinc-400 dark:text-zinc-500">
              Ready for Google AdSense • Replace with your Publisher ID once approved
            </span>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdBannerComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  public readonly adClient = input<string>('');
  public readonly adSlot = input<string>('');
  public readonly adFormat = input<string>('auto');
  public readonly adLayout = input<string>('');
  public readonly showPlaceholder = input<boolean>(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.adClient()) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ignore ad blocker errors
      }
    }
  }
}
