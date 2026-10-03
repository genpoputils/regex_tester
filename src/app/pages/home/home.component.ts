import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { EditorComponent } from '../../components/editor/editor.component';
import { FlagsPanelComponent } from '../../components/flags-panel/flags-panel.component';
import { TestStringEditorComponent } from '../../components/test-string-editor/test-string-editor.component';
import { MatchResultsComponent } from '../../components/match-results/match-results.component';
import { RegexExplainerComponent } from '../../components/regex-explainer/regex-explainer.component';
import { PresetLibraryModalComponent } from '../../components/preset-library/preset-library-modal.component';
import { CheatSheetDrawerComponent } from '../../components/cheat-sheet-drawer/cheat-sheet-drawer.component';
import { SettingsModalComponent } from '../../components/settings-modal/settings-modal.component';
import { ShareModalComponent } from '../../components/share-modal/share-modal.component';
import { ShortcutsModalComponent } from '../../components/shortcuts-modal/shortcuts-modal.component';
import { AdBannerComponent } from '../../components/ad-banner/ad-banner.component';
import { RegexService } from '../../services/regex.service';
import { SeoService } from '../../services/seo.service';
import { REGEX_PRESETS } from '../../utils/regex-presets';
import { PresetItem } from '../../models/regex.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    EditorComponent,
    FlagsPanelComponent,
    TestStringEditorComponent,
    MatchResultsComponent,
    RegexExplainerComponent,
    PresetLibraryModalComponent,
    CheatSheetDrawerComponent,
    SettingsModalComponent,
    ShareModalComponent,
    ShortcutsModalComponent,
    AdBannerComponent,
  ],
  template: `
    <main class="w-full">
      <!-- 1. Hero Section -->
      <app-hero></app-hero>

      <!-- 2. Main Workbench Section -->
      <section id="tester" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        
        <!-- Quick Preset Badges Bar -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5 mr-1">
            <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Presets:
          </span>

          @for (preset of quickPresets; track preset.id) {
            <button
              type="button"
              (click)="onSelectQuickPreset(preset)"
              [class.bg-indigo-600]="regexService.activePresetId() === preset.id"
              [class.text-white]="regexService.activePresetId() === preset.id"
              [class.border-indigo-600]="regexService.activePresetId() === preset.id"
              [class.bg-white]="regexService.activePresetId() !== preset.id"
              [class.dark:bg-zinc-900]="regexService.activePresetId() !== preset.id"
              [class.text-zinc-700]="regexService.activePresetId() !== preset.id"
              [class.dark:text-zinc-300]="regexService.activePresetId() !== preset.id"
              class="px-3 py-1 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex-shrink-0 shadow-sm"
            >
              {{ preset.name }}
            </button>
          }

          <button
            type="button"
            (click)="isPresetsModalOpen.set(true)"
            class="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex-shrink-0"
          >
            + All 22 Presets
          </button>
        </div>

        <!-- Pattern Editor & Flags Panel Container -->
        <div class="space-y-3">
          <app-editor></app-editor>
          <app-flags-panel></app-flags-panel>
        </div>

        <!-- Responsive Split Layout:
             Desktop: Regex Pattern & Test String | Results Panel
             Mobile: Pattern -> Test String -> Results
        -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          <!-- Left Column: Test String Editor -->
          <div class="w-full flex flex-col space-y-6">
            <app-test-string-editor></app-test-string-editor>
            <app-regex-explainer></app-regex-explainer>
          </div>

          <!-- Right Column: Match Results Panel -->
          <div class="w-full">
            <app-match-results></app-match-results>
          </div>

        </div>

        <!-- Google AdSense Ad Slot -->
        <app-ad-banner></app-ad-banner>

      </section>

      <!-- Modals & Drawers -->
      @if (isPresetsModalOpen()) {
        <app-preset-library-modal (closeModal)="isPresetsModalOpen.set(false)"></app-preset-library-modal>
      }

      @if (isCheatSheetOpen()) {
        <app-cheat-sheet-drawer (closeDrawer)="isCheatSheetOpen.set(false)"></app-cheat-sheet-drawer>
      }

      @if (isSettingsOpen()) {
        <app-settings-modal (closeModal)="isSettingsOpen.set(false)"></app-settings-modal>
      }

      @if (isShareOpen()) {
        <app-share-modal (closeModal)="isShareOpen.set(false)"></app-share-modal>
      }

      <app-shortcuts-modal></app-shortcuts-modal>
    </main>
  `,
})
export class HomeComponent implements OnInit {
  public readonly regexService = inject(RegexService);
  private readonly seoService = inject(SeoService);

  public readonly isPresetsModalOpen = signal<boolean>(false);
  public readonly isCheatSheetOpen = signal<boolean>(false);
  public readonly isSettingsOpen = signal<boolean>(false);
  public readonly isShareOpen = signal<boolean>(false);

  public readonly quickPresets: PresetItem[] = [
    REGEX_PRESETS[0], // Email
    REGEX_PRESETS[1], // Phone
    REGEX_PRESETS[2], // URL
    REGEX_PRESETS[8], // Password
    REGEX_PRESETS[5], // UUID
    REGEX_PRESETS[12], // Indian PAN
    REGEX_PRESETS[3], // IPv4
    REGEX_PRESETS[6], // Hex Color
    REGEX_PRESETS[9], // JWT
  ];

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Regex Tester Pro — Online Regular Expression Debugger & Explainer',
      description:
        'Fast, private, client-side Regular Expression tester and AST explainer. Real-time match highlighting, capture group extraction, and 20+ production presets.',
      canonicalUrl: 'https://genpoputils.github.io/regex_tester/',
    });
  }

  public onSelectQuickPreset(preset: PresetItem): void {
    this.regexService.applyPreset(preset);
  }
}
