import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (exportService.toastMessage(); as msg) {
      <div
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/95 dark:bg-zinc-800/95 text-white border border-zinc-700 shadow-2xl backdrop-blur-md animate-fade-in text-sm font-medium"
        role="status"
        aria-live="polite"
      >
        <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{{ msg }}</span>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `],
})
export class ToastComponent {
  public readonly exportService = inject(ExportService);
}
