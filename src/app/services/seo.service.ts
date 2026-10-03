import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  schema?: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly DEFAULT_TITLE = 'Regex Tester Pro — Online Regular Expression Debugger & Explainer';
  private readonly DEFAULT_DESC =
    'The ultimate free, client-side Regular Expression Tester and Explainer. Real-time syntax highlighting, group capture inspection, 20+ presets, and zero-latency RegExp execution.';
  private readonly BASE_URL = 'https://regex.genpoputils.com';

  public updateSeo(config: Partial<SeoConfig>): void {
    const fullTitle = config.title ? `${config.title} | Regex Tester Pro` : this.DEFAULT_TITLE;
    const desc = config.description || this.DEFAULT_DESC;
    const url = config.canonicalUrl || (isPlatformBrowser(this.platformId) ? window.location.href : `${this.BASE_URL}/`);
    const ogImage = config.ogImage || `${this.BASE_URL}/og-image.png`;
    const type = config.type || 'website';

    this.titleService.setTitle(fullTitle);

    // Primary Meta Tags
    this.meta.updateTag({ name: 'description', content: desc });
    if (config.keywords && config.keywords.length > 0) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    }

    // OpenGraph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:site_name', content: 'Regex Tester Pro' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    // Canonical link
    this.updateCanonicalLink(url);

    // Schema.org Structured Data
    if (config.schema) {
      this.setStructuredData(config.schema);
    } else {
      this.setDefaultAppSchema();
    }
  }

  private updateCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  public setStructuredData(schemaData: Record<string, any>): void {
    let script: HTMLScriptElement | null = this.doc.getElementById('structured-data') as HTMLScriptElement;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.text = JSON.stringify(schemaData);
  }

  public setDefaultAppSchema(): void {
    this.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Regex Tester Pro',
      url: this.BASE_URL,
      description: this.DEFAULT_DESC,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      featureList: [
        'Real-time JavaScript RegExp evaluation',
        'Capture group & named group inspection',
        'Client-side Regex Explainer parser',
        'Interactive Cheat Sheet and 20+ production presets',
        'Table, JSON, and Raw match results views',
        'Bidirectional match highlighting',
      ],
    });
  }
}
