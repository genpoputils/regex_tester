import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'cheat-sheet',
    loadComponent: () =>
      import('./pages/cheat-sheet-page/cheat-sheet-page.component').then(
        (m) => m.CheatSheetPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
