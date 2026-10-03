import { RegexExplanationToken } from '../models/regex.models';

/**
 * Client-side Regex Explainer Parser (Zero AI, deterministic, instant).
 * Parses ECMAScript regular expressions into structured tokens with human-readable explanations.
 */
export class RegexExplainer {
  public static explain(pattern: string, flags = ''): RegexExplanationToken[] {
    if (!pattern) return [];

    const tokens: RegexExplanationToken[] = [];
    const len = pattern.length;
    let i = 0;
    let groupCounter = 1;

    while (i < len) {
      const char = pattern[i];

      // 1. Anchors ^ and $
      if (char === '^') {
        tokens.push({
          id: `anchor-start-${i}`,
          raw: '^',
          type: 'anchor',
          title: 'Start of String / Line',
          description: flags.includes('m')
            ? 'Asserts the start of a line (multiline mode enabled).'
            : 'Asserts the position at the very beginning of the string.',
          example: '^abc matches "abc" only at the start',
          start: i,
          end: i + 1,
        });
        i++;
        continue;
      }

      if (char === '$') {
        tokens.push({
          id: `anchor-end-${i}`,
          raw: '$',
          type: 'anchor',
          title: 'End of String / Line',
          description: flags.includes('m')
            ? 'Asserts the end of a line (multiline mode enabled).'
            : 'Asserts the position at the very end of the string.',
          example: 'xyz$ matches "xyz" only at the end',
          start: i,
          end: i + 1,
        });
        i++;
        continue;
      }

      // 2. Alternation |
      if (char === '|') {
        tokens.push({
          id: `alternation-${i}`,
          raw: '|',
          type: 'operator',
          title: 'Alternation (OR)',
          description: 'Matches either the expression before or the expression after the pipe character.',
          example: 'cat|dog matches "cat" or "dog"',
          start: i,
          end: i + 1,
        });
        i++;
        continue;
      }

      // 3. Dot (Any Character)
      if (char === '.') {
        tokens.push({
          id: `dot-${i}`,
          raw: '.',
          type: 'character-class',
          title: 'Wildcard (Any character)',
          description: flags.includes('s')
            ? 'Matches any character including line breaks (\n, \r) because the dotAll (s) flag is active.'
            : 'Matches any single character EXCEPT newline characters (\n, \r).',
          example: 'a.c matches "abc", "a-c", "a9c"',
          start: i,
          end: i + 1,
        });
        i++;
        continue;
      }

      // 4. Escapes \
      if (char === '\\' && i + 1 < len) {
        const next = pattern[i + 1];
        const escapeRaw = pattern.slice(i, i + 2);

        // Word boundary \b, \B
        if (next === 'b') {
          tokens.push({
            id: `bound-${i}`,
            raw: escapeRaw,
            type: 'anchor',
            title: 'Word Boundary',
            description: 'Asserts position at a word boundary (between a word character \\w and a non-word character \\W, or string edges).',
            example: '\\bword\\b matches "word" but not "password"',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        if (next === 'B') {
          tokens.push({
            id: `non-bound-${i}`,
            raw: escapeRaw,
            type: 'anchor',
            title: 'Non-Word Boundary',
            description: 'Asserts position where NOT at a word boundary (inside a word or between two non-words).',
            example: '\\Bcat matches "scatter" but not "cat"',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        // Common shorthand character classes
        if (next === 'd') {
          tokens.push({
            id: `digit-${i}`,
            raw: escapeRaw,
            type: 'character-class',
            title: 'Digit character [0-9]',
            description: 'Matches any ASCII digit from 0 to 9.',
            example: '\\d matches "4", "7"',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        if (next === 'D') {
          tokens.push({
            id: `non-digit-${i}`,
            raw: escapeRaw,
            type: 'character-class',
            title: 'Non-digit character [^0-9]',
            description: 'Matches any character that is NOT a decimal digit.',
            example: '\\D matches "a", "!", " "',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        if (next === 'w') {
          tokens.push({
            id: `word-${i}`,
            raw: escapeRaw,
            type: 'character-class',
            title: 'Word character [a-zA-Z0-9_]',
            description: 'Matches alphanumeric characters (letters, digits) plus underscore.',
            example: '\\w matches "A", "z", "8", "_"',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        if (next === 'W') {
          tokens.push({
            id: `non-word-${i}`,
            raw: escapeRaw,
            type: 'character-class',
            title: 'Non-word character [^a-zA-Z0-9_]',
            description: 'Matches any character that is NOT an alphanumeric character or underscore.',
            example: '\\W matches "@", "#", " ", "-"',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        if (next === 's') {
          tokens.push({
            id: `space-${i}`,
            raw: escapeRaw,
            type: 'character-class',
            title: 'Whitespace character',
            description: 'Matches spaces, tabs (\\t), line feeds (\\n), carriage returns (\\r), and form feeds.',
            example: '\\s matches " " or "\\t"',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        if (next === 'S') {
          tokens.push({
            id: `non-space-${i}`,
            raw: escapeRaw,
            type: 'character-class',
            title: 'Non-whitespace character',
            description: 'Matches any character that is NOT a whitespace.',
            example: '\\S matches "x", "1", "@"',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        // Special control escapes
        if (next === 'n' || next === 'r' || next === 't' || next === 'v' || next === 'f' || next === '0') {
          const names: Record<string, string> = {
            n: 'Newline (LF)',
            r: 'Carriage return (CR)',
            t: 'Tab character (TAB)',
            v: 'Vertical tab',
            f: 'Form feed',
            0: 'Null character',
          };
          tokens.push({
            id: `ctrl-${i}`,
            raw: escapeRaw,
            type: 'escape',
            title: names[next] || 'Escaped Control Character',
            description: `Matches the literal ${names[next] || next} control character.`,
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        // Backreferences (\1, \2, ...)
        if (/^[1-9]$/.test(next)) {
          tokens.push({
            id: `backref-${i}`,
            raw: escapeRaw,
            type: 'group',
            title: `Backreference to Group #${next}`,
            description: `Matches the exact same text previously captured by capture group #${next}.`,
            example: '(\\w+)\\s+\\1 matches "hello hello"',
            start: i,
            end: i + 2,
          });
          i += 2;
          continue;
        }

        // Literal escaped punctuation (e.g. \., \/, \[, \+, etc.)
        tokens.push({
          id: `esc-${i}`,
          raw: escapeRaw,
          type: 'escape',
          title: `Escaped Literal: "${next}"`,
          description: `Escapes the special character "${next}" so it matches as a literal character rather than regex syntax.`,
          start: i,
          end: i + 2,
        });
        i += 2;
        continue;
      }

      // 5. Character Set [...]
      if (char === '[') {
        let j = i + 1;
        let isNegated = false;
        if (j < len && pattern[j] === '^') {
          isNegated = true;
          j++;
        }
        // Handle escaped brackets or immediate ]
        let closed = false;
        while (j < len) {
          if (pattern[j] === '\\' && j + 1 < len) {
            j += 2;
          } else if (pattern[j] === ']') {
            closed = true;
            j++;
            break;
          } else {
            j++;
          }
        }

        const classRaw = pattern.slice(i, closed ? j : len);
        const inner = classRaw.slice(isNegated ? 2 : 1, closed ? classRaw.length - 1 : classRaw.length);

        tokens.push({
          id: `charset-${i}`,
          raw: classRaw,
          type: 'character-class',
          title: isNegated ? 'Negated Character Class [^...]' : 'Character Class [...]',
          description: isNegated
            ? `Matches any character NOT listed in the set "${inner}".`
            : `Matches any single character that matches the set "${inner}".`,
          example: isNegated ? '[^0-9] matches non-digits' : '[a-z0-9] matches any lowercase letter or digit',
          start: i,
          end: closed ? j : len,
        });

        i = closed ? j : len;
        continue;
      }

      // 6. Groups and Assertions (...)
      if (char === '(') {
        // Lookaheads, lookbehinds, non-capturing, named groups
        if (pattern.startsWith('(?=', i)) {
          tokens.push({
            id: `pos-lookahead-${i}`,
            raw: '(?=',
            type: 'assertion',
            title: 'Positive Lookahead (?=...)',
            description: 'Asserts that the given sub-expression matches ahead without consuming any characters in the match.',
            example: 'q(?=u) matches "q" only if followed by "u"',
            start: i,
            end: i + 3,
          });
          i += 3;
          continue;
        }

        if (pattern.startsWith('(?!', i)) {
          tokens.push({
            id: `neg-lookahead-${i}`,
            raw: '(?!',
            type: 'assertion',
            title: 'Negative Lookahead (?!...)',
            description: 'Asserts that the given sub-expression does NOT match ahead without consuming characters.',
            example: 'q(?!u) matches "q" only if NOT followed by "u"',
            start: i,
            end: i + 3,
          });
          i += 3;
          continue;
        }

        if (pattern.startsWith('(?<=', i)) {
          tokens.push({
            id: `pos-lookbehind-${i}`,
            raw: '(?<=',
            type: 'assertion',
            title: 'Positive Lookbehind (?<=...)',
            description: 'Asserts that the given sub-expression matches immediately behind the current position.',
            example: '(?<=\\$)\\d+ matches numbers preceded by "$"',
            start: i,
            end: i + 4,
          });
          i += 4;
          continue;
        }

        if (pattern.startsWith('(?<!', i)) {
          tokens.push({
            id: `neg-lookbehind-${i}`,
            raw: '(?<!',
            type: 'assertion',
            title: 'Negative Lookbehind (?<!...)',
            description: 'Asserts that the given sub-expression does NOT match immediately behind the current position.',
            example: '(?<!\\$)\\d+ matches numbers NOT preceded by "$"',
            start: i,
            end: i + 4,
          });
          i += 4;
          continue;
        }

        if (pattern.startsWith('(?:', i)) {
          tokens.push({
            id: `non-cap-group-${i}`,
            raw: '(?:',
            type: 'group',
            title: 'Non-Capturing Group (?:...)',
            description: 'Groups sub-expressions for quantifiers or alternation without storing the captured text.',
            example: '(?:https?|ftp):// matches protocol without storing group',
            start: i,
            end: i + 3,
          });
          i += 3;
          continue;
        }

        // Named Capture Group (?<name>...)
        const namedMatch = pattern.slice(i).match(/^\(\?<([a-zA-Z0-9_]+)>/);
        if (namedMatch) {
          const groupName = namedMatch[1];
          const rawMatch = namedMatch[0];
          tokens.push({
            id: `named-group-${i}`,
            raw: rawMatch,
            type: 'group',
            title: `Named Capture Group: <${groupName}>`,
            description: `Captures the matched text and stores it in the groups object under key "${groupName}".`,
            example: `(?<year>\\d{4}) accesses match.groups.year`,
            start: i,
            end: i + rawMatch.length,
          });
          i += rawMatch.length;
          continue;
        }

        // Regular Capture Group
        const currGrp = groupCounter++;
        tokens.push({
          id: `cap-group-open-${i}`,
          raw: '(',
          type: 'group',
          title: `Capture Group #${currGrp} Start`,
          description: `Captures whatever matched text is inside this parenthesized expression as Group #${currGrp}.`,
          example: '(\\w+) captures first word in $1',
          start: i,
          end: i + 1,
        });
        i++;
        continue;
      }

      if (char === ')') {
        tokens.push({
          id: `group-close-${i}`,
          raw: ')',
          type: 'group',
          title: 'Group End',
          description: 'Closes the preceding group or assertion expression.',
          start: i,
          end: i + 1,
        });
        i++;
        continue;
      }

      // 7. Quantifiers *, +, ?, {n,m}
      if (char === '*' || char === '+' || char === '?') {
        const isLazy = i + 1 < len && pattern[i + 1] === '?';
        const raw = isLazy ? pattern.slice(i, i + 2) : char;

        let title = '';
        let description = '';

        if (char === '*') {
          title = isLazy ? 'Zero or More (Lazy *?)' : 'Zero or More (Greedy *)';
          description = isLazy
            ? 'Matches 0 or more occurrences of the preceding token, matching as few characters as possible.'
            : 'Matches 0 or more occurrences of the preceding token, matching as many characters as possible.';
        } else if (char === '+') {
          title = isLazy ? 'One or More (Lazy +?)' : 'One or More (Greedy +)';
          description = isLazy
            ? 'Matches 1 or more occurrences of the preceding token, matching as few characters as possible.'
            : 'Matches 1 or more occurrences of the preceding token, matching as many characters as possible.';
        } else {
          title = isLazy ? 'Zero or One (Lazy ??)' : 'Zero or One (Optional ?)';
          description = isLazy
            ? 'Matches 0 or 1 occurrence of the preceding token (lazy: prefers 0).'
            : 'Matches 0 or 1 occurrence of the preceding token (greedy: prefers 1).';
        }

        tokens.push({
          id: `quant-${i}`,
          raw,
          type: 'quantifier',
          title,
          description,
          start: i,
          end: i + raw.length,
        });

        i += raw.length;
        continue;
      }

      // Explicit range quantifier {n}, {n,}, {n,m}
      if (char === '{') {
        const rangeMatch = pattern.slice(i).match(/^\{(\d+)(,(\d*))?\}(\??)/);
        if (rangeMatch) {
          const raw = rangeMatch[0];
          const min = rangeMatch[1];
          const hasComma = rangeMatch[2] !== undefined;
          const max = rangeMatch[3];
          const isLazy = rangeMatch[4] === '?';

          let rangeDesc = '';
          if (!hasComma) {
            rangeDesc = `exactly ${min} times`;
          } else if (!max) {
            rangeDesc = `${min} or more times`;
          } else {
            rangeDesc = `between ${min} and ${max} times`;
          }

          tokens.push({
            id: `range-${i}`,
            raw,
            type: 'quantifier',
            title: `Repetition Range: ${raw}`,
            description: `Repeats the preceding token ${rangeDesc} (${isLazy ? 'lazy' : 'greedy'}).`,
            example: `\\d{2,4} matches 2 to 4 digits`,
            start: i,
            end: i + raw.length,
          });

          i += raw.length;
          continue;
        }
      }

      // 8. Literal sequence (consecutive literal characters)
      let litStart = i;
      while (
        i < len &&
        !['^', '$', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(pattern[i])
      ) {
        i++;
      }

      if (i > litStart) {
        const literalText = pattern.slice(litStart, i);
        tokens.push({
          id: `lit-${litStart}`,
          raw: literalText,
          type: 'literal',
          title: `Literal: "${literalText}"`,
          description: `Matches the exact string "${literalText}" case-${flags.includes('i') ? 'insensitively' : 'sensitively'}.`,
          start: litStart,
          end: i,
        });
      } else {
        // Fallback single character
        tokens.push({
          id: `char-${i}`,
          raw: pattern[i],
          type: 'literal',
          title: `Literal: "${pattern[i]}"`,
          description: `Matches the character "${pattern[i]}".`,
          start: i,
          end: i + 1,
        });
        i++;
      }
    }

    return tokens;
  }
}
