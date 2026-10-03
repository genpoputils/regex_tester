import { TestBed } from '@angular/core/testing';
import { RegexService } from './regex.service';
import { REGEX_PRESETS } from '../utils/regex-presets';

describe('RegexService', () => {
  let service: RegexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegexService);
  });

  it('should be created with valid default state', () => {
    expect(service).toBeTruthy();
    expect(service.pattern()).toBeTruthy();
    expect(service.isValid()).toBe(true);
  });

  it('should match multiple email addresses globally', () => {
    service.setPattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
    service.applyFlagsFromString('gm');
    service.setTestString('Contact us at dev@example.com and team@startup.io');

    const matches = service.matches();
    expect(matches.length).toBe(2);
    expect(matches[0].match).toBe('dev@example.com');
    expect(matches[0].start).toBe(14);
    expect(matches[0].end).toBe(29);
    expect(matches[1].match).toBe('team@startup.io');
  });

  it('should extract capture groups and named groups correctly', () => {
    service.setPattern('(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})');
    service.applyFlagsFromString('gm');
    service.setTestString('Date is 2026-10-03');

    const matches = service.matches();
    expect(matches.length).toBe(1);
    expect(matches[0].namedGroups['year']).toBe('2026');
    expect(matches[0].namedGroups['month']).toBe('10');
    expect(matches[0].namedGroups['day']).toBe('03');
    expect(matches[0].groups.length).toBe(3);
    expect(matches[0].groups[0].value).toBe('2026');
  });

  it('should format syntax errors nicely without crashing', () => {
    service.setPattern('[a-z0-9'); // Missing closing bracket
    service.applyFlagsFromString('g');
    service.setTestString('test string');

    expect(service.isValid()).toBe(false);
    expect(service.error()).toContain('Missing closing bracket');
    expect(service.matches().length).toBe(0);
  });

  it('should apply preset patterns properly', () => {
    const panPreset = REGEX_PRESETS.find((p) => p.id === 'indian-pan');
    expect(panPreset).toBeDefined();

    service.applyPreset(panPreset!);
    expect(service.pattern()).toBe(panPreset!.pattern);
    expect(service.activePresetId()).toBe('indian-pan');
    expect(service.matches().length).toBeGreaterThan(0);
  });

  it('should clear and reset properly', () => {
    service.clear();
    expect(service.pattern()).toBe('');
    expect(service.testString()).toBe('');
    expect(service.matches().length).toBe(0);

    service.reset();
    expect(service.pattern()).toBeTruthy();
    expect(service.testString()).toBeTruthy();
    expect(service.activePresetId()).toBe('email');
  });
});
