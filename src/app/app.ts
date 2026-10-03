import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';
import { PresetLibraryModalComponent } from './components/preset-library/preset-library-modal.component';
import { ShareModalComponent } from './components/share-modal/share-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { ShortcutsModalComponent } from './components/shortcuts-modal/shortcuts-modal.component';
import { ThemeService } from './services/theme.service';
import { ShortcutsService } from './services/shortcuts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    PresetLibraryModalComponent,
    ShareModalComponent,
    SettingsModalComponent,
    ShortcutsModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  public readonly themeService = inject(ThemeService);
  public readonly shortcutsService = inject(ShortcutsService);

  public readonly isPresetsModalOpen = signal<boolean>(false);
  public readonly isShareModalOpen = signal<boolean>(false);
  public readonly isSettingsModalOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.shortcutsService.initListeners();
  }
}
