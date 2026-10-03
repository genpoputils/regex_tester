import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RegexService } from './regex.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly regexService = inject(RegexService);
  private readonly storage = inject(StorageService);

  public readonly toastMessage = signal<string | null>(null);
  private toastTimer: any = null;

  public showToast(message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMessage.set(message);
    this.toastTimer = setTimeout(() => {
      this.toastMessage.set(null);
    }, 2800);
  }

  public async copyToClipboard(text: string, successMessage = 'Copied to clipboard!'): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      this.showToast(successMessage);
      return true;
    } catch {
      this.showToast('Failed to copy text');
      return false;
    }
  }

  public copyRegexLiteral(): Promise<boolean> {
    const p = this.regexService.pattern();
    const f = this.regexService.flagsString();
    return this.copyToClipboard(`/${p}/${f}`, 'Copied regular expression /.../');
  }

  public copyTestString(): Promise<boolean> {
    return this.copyToClipboard(this.regexService.testString(), 'Copied test string');
  }

  public copyResultsJson(): Promise<boolean> {
    const data = this.buildExportData();
    return this.copyToClipboard(JSON.stringify(data, null, 2), 'Copied matches as JSON');
  }

  public copyResultsText(): Promise<boolean> {
    const matches = this.regexService.matches().map((m) => m.match).join('\n');
    return this.copyToClipboard(matches, 'Copied matched texts list');
  }

  public generateShareUrl(): string {
    const p = this.regexService.pattern();
    const f = this.regexService.flagsString();
    const t = this.regexService.testString();
    return this.storage.encodeShareUrl(p, f, t);
  }

  public async copyShareUrl(): Promise<boolean> {
    const url = this.generateShareUrl();
    return this.copyToClipboard(url, 'Shareable link copied to clipboard!');
  }

  public downloadJson(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = this.buildExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this.triggerDownload(blob, `regex-matches-${Date.now()}.json`);
    this.showToast('Exported matches as JSON file');
  }

  public downloadTxt(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const matches = this.regexService.matches();
    let content = `# Regex Tester Matches Export\n# Pattern: /${this.regexService.pattern()}/${this.regexService.flagsString()}\n# Total: ${matches.length}\n# Date: ${new Date().toISOString()}\n\n`;

    matches.forEach((m, idx) => {
      content += `[Match #${idx + 1}] (Index: ${m.start}..${m.end}, Length: ${m.length})\n${m.match}\n`;
      if (m.groups.length > 0) {
        content += '  Capture Groups:\n';
        m.groups.forEach((g) => {
          content += `    - Group ${g.index}: ${g.value}\n`;
        });
      }
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    this.triggerDownload(blob, `regex-matches-${Date.now()}.txt`);
    this.showToast('Exported matches as TXT file');
  }

  private buildExportData(): Record<string, any> {
    return {
      generator: 'Regex Tester Pro',
      timestamp: new Date().toISOString(),
      pattern: this.regexService.pattern(),
      flags: this.regexService.flagsString(),
      executionTimeMs: this.regexService.executionTimeMs(),
      totalMatches: this.regexService.totalMatches(),
      matches: this.regexService.matches().map((m) => ({
        index: m.index,
        match: m.match,
        start: m.start,
        end: m.end,
        length: m.length,
        groups: m.groups,
        namedGroups: m.namedGroups,
      })),
    };
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
