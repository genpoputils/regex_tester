import { RegexExplainer } from './regex-explainer';

describe('RegexExplainer', () => {
  it('should return empty token array for empty pattern', () => {
    expect(RegexExplainer.explain('')).toEqual([]);
  });

  it('should explain anchors ^ and $', () => {
    const tokens = RegexExplainer.explain('^abc$');
    expect(tokens.length).toBe(3);
    expect(tokens[0].type).toBe('anchor');
    expect(tokens[0].title).toContain('Start of String');
    expect(tokens[1].type).toBe('literal');
    expect(tokens[2].type).toBe('anchor');
    expect(tokens[2].title).toContain('End of String');
  });

  it('should explain character classes like \\d and custom [a-z]', () => {
    const tokens = RegexExplainer.explain('\\d+[a-z]');
    expect(tokens.some((t) => t.raw === '\\d' && t.type === 'character-class')).toBe(true);
    expect(tokens.some((t) => t.raw === '+' && t.type === 'quantifier')).toBe(true);
    expect(tokens.some((t) => t.raw === '[a-z]' && t.type === 'character-class')).toBe(true);
  });

  it('should explain lookaheads and lookbehinds', () => {
    const tokens = RegexExplainer.explain('(?<=@)[a-z]+(?=\\.com)');
    expect(tokens.some((t) => t.raw === '(?<=' && t.type === 'assertion')).toBe(true);
    expect(tokens.some((t) => t.raw === '(?=' && t.type === 'assertion')).toBe(true);
  });

  it('should explain named capture groups', () => {
    const tokens = RegexExplainer.explain('(?<year>\\d{4})');
    const namedGroup = tokens.find((t) => t.type === 'group' && t.title.includes('Named Capture Group'));
    expect(namedGroup).toBeDefined();
    expect(namedGroup?.title).toContain('year');
  });
});
