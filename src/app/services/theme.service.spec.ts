import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.body.className = '';
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.body.className = '';
  });

  it('should be created and default to dark mode', () => {
    expect(service).toBeTruthy();
    expect(service.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should switch to light day mode when requested', () => {
    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
    expect(service.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.body.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('regex_tester_theme')).toBe('light');
  });

  it('should switch back to dark night mode when requested', () => {
    service.setTheme('light');
    expect(service.isDark()).toBe(false);

    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
    expect(service.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(localStorage.getItem('regex_tester_theme')).toBe('dark');
  });

  it('should toggle between day and night mode using toggleTheme()', () => {
    service.setTheme('dark');
    expect(service.isDark()).toBe(true);

    service.toggleTheme();
    expect(service.isDark()).toBe(false);
    expect(service.currentTheme()).toBe('light');

    service.toggleTheme();
    expect(service.isDark()).toBe(true);
    expect(service.currentTheme()).toBe('dark');
  });
});
