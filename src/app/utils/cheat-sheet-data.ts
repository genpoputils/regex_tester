import { CheatSheetSection } from '../models/regex.models';

export const CHEAT_SHEET_DATA: CheatSheetSection[] = [
  {
    category: 'Anchors',
    icon: 'anchor',
    entries: [
      { token: '^', name: 'Start of String/Line', description: 'Matches the beginning of string or line (with m flag)', example: '^The', matchExample: 'The quick brown fox' },
      { token: '$', name: 'End of String/Line', description: 'Matches the end of string or line (with m flag)', example: 'end$', matchExample: 'This is the end' },
      { token: '\\b', name: 'Word Boundary', description: 'Matches at the beginning or end of a word (\\w)', example: '\\bcat\\b', matchExample: 'the cat sat' },
      { token: '\\B', name: 'Non-Word Boundary', description: 'Matches inside a word or between two non-words', example: '\\Bcat', matchExample: 'scattered' },
    ],
  },
  {
    category: 'Character Classes',
    icon: 'brackets',
    entries: [
      { token: '.', name: 'Wildcard (Any Char)', description: 'Matches any character except line break (or any char with s flag)', example: 'h.t', matchExample: 'hat, hot, h#t' },
      { token: '\\d', name: 'Digit [0-9]', description: 'Matches any decimal digit', example: '\\d{3}', matchExample: '123' },
      { token: '\\D', name: 'Non-Digit [^0-9]', description: 'Matches any character that is not a digit', example: '\\D+', matchExample: 'hello world' },
      { token: '\\w', name: 'Word Char [a-zA-Z0-9_]', description: 'Matches alphanumeric characters and underscore', example: '\\w+', matchExample: 'variable_123' },
      { token: '\\W', name: 'Non-Word Char', description: 'Matches any non-alphanumeric character', example: '\\W', matchExample: '@ or # or space' },
      { token: '\\s', name: 'Whitespace', description: 'Matches spaces, tabs, line breaks', example: '\\s+', matchExample: '  \\t\\n' },
      { token: '\\S', name: 'Non-Whitespace', description: 'Matches any non-whitespace character', example: '\\S+', matchExample: 'non-space' },
      { token: '[abc]', name: 'Character Set', description: 'Matches any character in the brackets', example: '[aeiou]', matchExample: 'e' },
      { token: '[^abc]', name: 'Negated Character Set', description: 'Matches any character NOT in the brackets', example: '[^0-9]', matchExample: 'A' },
      { token: '[a-z]', name: 'Character Range', description: 'Matches any character within specified range', example: '[0-9a-fA-F]', matchExample: '7 or f' },
    ],
  },
  {
    category: 'Quantifiers',
    icon: 'asterisk',
    entries: [
      { token: '*', name: 'Zero or More (Greedy)', description: 'Matches 0 or more occurrences of the preceding token', example: 'ab*c', matchExample: 'ac, abc, abbbc' },
      { token: '+', name: 'One or More (Greedy)', description: 'Matches 1 or more occurrences of the preceding token', example: 'ab+c', matchExample: 'abc, abbc' },
      { token: '?', name: 'Zero or One (Optional)', description: 'Matches 0 or 1 occurrence (makes token optional)', example: 'colou?r', matchExample: 'color, colour' },
      { token: '{n}', name: 'Exact Count', description: 'Matches exactly n occurrences', example: '\\d{4}', matchExample: '2026' },
      { token: '{n,}', name: 'Minimum Count', description: 'Matches n or more occurrences', example: '\\d{2,}', matchExample: '12, 12345' },
      { token: '{n,m}', name: 'Bounded Range', description: 'Matches between n and m occurrences', example: '\\d{2,4}', matchExample: '12, 123, 1234' },
      { token: '*?', name: 'Zero or More (Lazy)', description: 'Matches as few occurrences as possible', example: '<.*?>', matchExample: '<div>' },
      { token: '+?', name: 'One or More (Lazy)', description: 'Matches 1 or more, as few characters as possible', example: 'a+?', matchExample: 'a in aaaaa' },
    ],
  },
  {
    category: 'Groups',
    icon: 'parentheses',
    entries: [
      { token: '(abc)', name: 'Capture Group', description: 'Captures matched text as group accessible by index $1, $2', example: '(\\d{4})-(\\d{2})', matchExample: '2026-10' },
      { token: '(?:abc)', name: 'Non-Capturing Group', description: 'Groups subpattern without saving the captured match', example: '(?:https|ftp):\\/\\/', matchExample: 'https://' },
      { token: '(?<name>abc)', name: 'Named Capture Group', description: 'Captures match under named key in groups object', example: '(?<year>\\d{4})', matchExample: 'groups.year = 2026' },
      { token: '\\1', name: 'Backreference', description: 'Matches the exact content captured by group 1', example: '([\'"])(.*?)\\1', matchExample: '"quoted" or \'quoted\'' },
      { token: 'a|b', name: 'Alternation (OR)', description: 'Matches either subexpression a OR subexpression b', example: 'cat|dog', matchExample: 'cat or dog' },
    ],
  },
  {
    category: 'Lookahead',
    icon: 'arrow-right',
    entries: [
      { token: '(?=...)', name: 'Positive Lookahead', description: 'Matches if followed by subpattern, without consuming text', example: '\\d+(?=px)', matchExample: '100 in 100px' },
      { token: '(?!...)', name: 'Negative Lookahead', description: 'Matches if NOT followed by subpattern, without consuming text', example: '\\d+(?!px)', matchExample: '100 in 100em' },
    ],
  },
  {
    category: 'Lookbehind',
    icon: 'arrow-left',
    entries: [
      { token: '(?<=...)', name: 'Positive Lookbehind', description: 'Matches if preceded by subpattern, without consuming text', example: '(?<=\\$)\\d+', matchExample: '50 in $50' },
      { token: '(?<!...)', name: 'Negative Lookbehind', description: 'Matches if NOT preceded by subpattern, without consuming text', example: '(?<!\\$)\\d+', matchExample: '50 in €50' },
    ],
  },
  {
    category: 'Escaping',
    icon: 'slash',
    entries: [
      { token: '\\.', name: 'Escaped Dot', description: 'Matches literal dot character rather than wildcard', example: 'example\\.com', matchExample: 'example.com' },
      { token: '\\\\', name: 'Escaped Backslash', description: 'Matches literal backslash character', example: 'C:\\\\path', matchExample: 'C:\\path' },
      { token: '\\[ \\] \\( \\)', name: 'Escaped Brackets', description: 'Escapes brackets and parentheses for literal matching', example: '\\[link\\]', matchExample: '[link]' },
      { token: '\\n', name: 'Newline', description: 'Matches line feed character (ASCII 10)', example: '\\n', matchExample: 'newline' },
      { token: '\\t', name: 'Tab', description: 'Matches horizontal tab (ASCII 9)', example: '\\t', matchExample: 'tab character' },
    ],
  },
  {
    category: 'Flags',
    icon: 'flag',
    entries: [
      { token: 'g', name: 'Global', description: 'Find all matches rather than stopping after first match', example: '/abc/g', matchExample: 'Finds every "abc"' },
      { token: 'i', name: 'Ignore Case', description: 'Case-insensitive matching (A matches a)', example: '/abc/i', matchExample: 'Matches ABC, abc, Abc' },
      { token: 'm', name: 'Multiline', description: '^ and $ match start and end of each line, not whole string', example: '/^# /m', matchExample: 'Matches Markdown headers per line' },
      { token: 's', name: 'DotAll', description: 'Allows dot (.) to match newline characters as well', example: '/<p>.*<\\/p>/s', matchExample: 'Matches across multiple lines' },
      { token: 'u', name: 'Unicode', description: 'Enables full Unicode support and \\p{...} property escapes', example: '/\\p{Emoji}/u', matchExample: 'Matches Unicode emojis' },
      { token: 'y', name: 'Sticky', description: 'Matches only from the exact position indicated by lastIndex', example: '/abc/y', matchExample: 'Strict parsing workflows' },
      { token: 'd', name: 'Has Indices', description: 'Generates start and end indices for captured substrings', example: '/(a)(b)/d', matchExample: 'match.indices array populated' },
    ],
  },
];
