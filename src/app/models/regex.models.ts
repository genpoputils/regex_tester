export interface RegexFlags {
  global: boolean;       // g
  ignoreCase: boolean;   // i
  multiline: boolean;    // m
  unicode: boolean;      // u
  sticky: boolean;       // y
  dotAll: boolean;       // s
  hasIndices: boolean;   // d
}

export interface CaptureGroup {
  index: number;
  name?: string;
  value: string;
  start: number;
  end: number;
}

export interface RegexMatch {
  index: number;         // 0-based match index (1st match, 2nd match, etc.)
  match: string;
  start: number;
  end: number;
  length: number;
  groups: CaptureGroup[];
  namedGroups: Record<string, string>;
  colorIndex: number;
}

export interface RegexExplanationToken {
  id: string;
  raw: string;
  type: 'anchor' | 'quantifier' | 'character-class' | 'group' | 'assertion' | 'escape' | 'flag' | 'literal' | 'operator';
  title: string;
  description: string;
  example?: string;
  start: number;
  end: number;
}

export interface PresetItem {
  id: string;
  name: string;
  category: 'Web & URLs' | 'Validation' | 'Identity & Finance' | 'Formatting' | 'Programming';
  description: string;
  pattern: string;
  flags: string;
  testString: string;
  tags: string[];
}

export interface CheatSheetEntry {
  token: string;
  name: string;
  description: string;
  example: string;
  matchExample: string;
}

export interface CheatSheetSection {
  category: string;
  icon: string;
  entries: CheatSheetEntry[];
}

export interface RegexSettings {
  fontSize: number;
  wordWrap: boolean;
  theme: 'dark' | 'light' | 'system';
  editorHeight: 'compact' | 'normal' | 'large';
  autoSave: boolean;
  highlightColors: boolean;
}
