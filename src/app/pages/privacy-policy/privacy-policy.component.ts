import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8 text-zinc-800 dark:text-zinc-200">
      
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <a routerLink="/" class="hover:underline">Home</a>
        <span>/</span>
        <span class="text-zinc-900 dark:text-white font-medium">Privacy Policy</span>
      </nav>

      <header class="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Outfit'] text-zinc-900 dark:text-white">
          Privacy Policy
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Last updated: October 2026 • Effective immediately
        </p>
      </header>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          1. 100% Client-Side Architecture & Zero Data Collection
        </h2>
        <p>
          At <strong>Regex Tester Pro</strong>, the privacy of our visitors is of paramount importance.
          Our regular expression testing and evaluation engine operates <strong>100% client-side inside your browser</strong> using native JavaScript RegExp APIs.
        </p>
        <p>
          Neither your regular expression patterns nor your test strings are ever transmitted, saved, logged, or processed by any external server or backend database. Everything you type remains solely within your browser session.
        </p>
      </section>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          2. Local Storage
        </h2>
        <p>
          We use browser <code>localStorage</code> solely to remember your user preferences (such as Dark/Light theme, editor font size, and word-wrap preferences). You can clear this data at any time via your browser settings or using the in-app Reset option.
        </p>
      </section>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          3. Google AdSense & Third-Party Cookies
        </h2>
        <p>
          We may display advertisements provided by Google AdSense and other third-party advertising networks to support the maintenance of this free utility.
        </p>
        <ul class="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
          </li>
          <li>
            Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
          </li>
          <li>
            Users may opt out of personalized advertising by visiting
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline">Google Ads Settings</a>
            or by visiting
            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline">aboutads.info</a>.
          </li>
        </ul>
      </section>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          4. GDPR and CCPA / CPRA Rights
        </h2>
        <p>
          Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to request information regarding any personal data collected. Because we do not collect or store personal identifiable information, your data remains in your control.
        </p>
      </section>

      <section class="space-y-4 text-sm sm:text-base leading-relaxed">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-white font-['Outfit']">
          5. Contact Information
        </h2>
        <p>
          If you have any questions, feedback, or concerns regarding this Privacy Policy, please open an issue or discussion on our GitHub repository.
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
export class PrivacyPolicyComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Privacy Policy',
      description: 'Learn how Regex Tester Pro respects user privacy with 100% client-side regular expression execution and transparency on cookies.',
      canonicalUrl: 'https://regex.genpoputils.com/privacy-policy',
    });
  }
}
