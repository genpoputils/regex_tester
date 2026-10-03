import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8 text-zinc-800 dark:text-zinc-200">
      
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <a routerLink="/" class="hover:underline">Home</a>
        <span>/</span>
        <span class="text-zinc-900 dark:text-white font-medium">Terms of Service</span>
      </nav>

      <header class="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Outfit'] text-zinc-900 dark:text-white">
          Terms of Service
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Last updated: October 2026 • Effective immediately
        </p>
      </header>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing and using <strong>Regex Tester Pro</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use this application.
        </p>
      </section>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          2. Use of Service
        </h2>
        <p>
          Regex Tester Pro provides client-side regular expression testing, debugging, and visualization tools free of charge. You may use this service for personal, academic, or commercial software development purposes.
        </p>
      </section>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          3. Disclaimer of Warranties
        </h2>
        <p>
          The service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. While we strive for accuracy, regular expression matching depends on the host browser's JavaScript engine implementation.
        </p>
      </section>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          4. Advertisements and External Links
        </h2>
        <p>
          This website may display third-party advertisements served by Google AdSense and links to external websites. We do not endorse or assume responsibility for the content, privacy practices, or goods offered by third parties.
        </p>
      </section>

      <div class="pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <a routerLink="/" class="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Regex Tester
        </a>
      </div>

    </main>
  `,
})
export class TermsComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Terms of Service',
      description: 'Terms of Service and usage conditions for Regex Tester Pro.',
      canonicalUrl: 'https://regex.genpoputils.com/terms',
    });
  }
}
