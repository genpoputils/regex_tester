import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RegexService } from './regex.service';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root',
})
export class ShortcutsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly regexService = inject(RegexService);
  private readonly exportService = inject(ExportService);

  public readonly focusPatternTrigger = signal<number>(0);
  public readonly isShortcutsModalOpen = signal<boolean>(false);

  public initListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      // Ctrl + / or Cmd + / -> Focus Pattern Editor
      if (isCmdOrCtrl && event.key === '/') {
        event.preventDefault();
        this.focusPatternTrigger.update((n) => n + 1);
        return;
      }

      // Ctrl + Shift + C -> Copy Regex
      if (isCmdOrCtrl && event.shiftKey && (event.key === 'c' || event.key === 'C')) {
        event.preventDefault();
        this.exportService.copyRegexLiteral();
        return;
      }

      // Ctrl + Shift + R -> Reset
      if (isCmdOrCtrl && event.shiftKey && (event.key === 'r' || event.key === 'R')) {
        event.preventDefault();
        this.regexService.reset();
        this.exportService.showToast('Reset pattern and test string to default');
        return;
      }

      // Ctrl + L (without shift) -> Clear
      if (isCmdOrCtrl && !event.shiftKey && (event.key === 'l' || event.key === 'L')) {
        event.preventDefault();
        this.regexService.clear();
        this.exportService.showToast('Cleared pattern and test string');
        return;
      }

      // Escape -> Close any modal
      if (event.key === 'Escape') {
        this.isShortcutsModalOpen.set(false);
      }
    });
  }

  public openShortcutsModal(): void {
    this.isShortcutsModalOpen.set(true);
  }

  public closeShortcutsModal(): void {
    this.isShortcutsModalOpen.set(false);
  }
}
