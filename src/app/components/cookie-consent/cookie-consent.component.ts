import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

declare const window: any;

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (isVisible()) {
      <div
        class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/20 animate-fade-in"
        role="region"
        aria-label="Cookie consent banner"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-lg flex-shrink-0">
            🍪
          </div>

          <div class="space-y-2 flex-1">
            <h4 class="text-sm font-bold text-zinc-900 dark:text-white font-['Outfit']">
              We Value Your Privacy
            </h4>
            <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We use client-side storage for editor preferences and request consent for analytics and advertising under EU/EEA GDPR guidelines. Regular expressions are always evaluated 100% locally on your machine.
            </p>

            <div class="text-[11px] text-zinc-500">
              Read our
              <a
                routerLink="/privacy-policy"
                (click)="closeBanner()"
                class="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700"
              >
                Privacy Policy
              </a>.
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-2">
              <button
                type="button"
                (click)="acceptAll()"
                class="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors cursor-pointer text-center"
              >
                Accept All
              </button>

              <button
                type="button"
                (click)="rejectNonEssential()"
                class="flex-1 py-2 px-3 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer text-center border border-zinc-200 dark:border-zinc-700"
              >
                Essential Only
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class CookieConsentComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'regex_cookie_consent';

  public readonly isVisible = signal<boolean>(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
          // Show banner after brief delay so initial page loads smoothly
          setTimeout(() => {
            this.isVisible.set(true);
          }, 800);
        }
      } catch (e) {
        // Storage disabled
      }
    }
  }

  public acceptAll(): void {
    this.saveConsent('granted');
    this.updateGtagConsent('granted');
    this.isVisible.set(false);
  }

  public rejectNonEssential(): void {
    this.saveConsent('denied');
    this.updateGtagConsent('denied');
    this.isVisible.set(false);
  }

  public closeBanner(): void {
    this.isVisible.set(false);
  }

  private saveConsent(state: 'granted' | 'denied'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, state);
    } catch (e) {}
  }

  private updateGtagConsent(state: 'granted' | 'denied'): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: state,
        ad_user_data: state,
        ad_personalization: state,
        analytics_storage: state,
      });
    }
  }
}
