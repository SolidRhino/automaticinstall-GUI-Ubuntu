/**
 * Diff calculator for YAML highlighting
 */

export interface DiffLine {
  type: 'unchanged' | 'added' | 'removed' | 'modified';
  line: string;
  oldLine?: string;
  lineNumber: number;
}

export interface DiffSegment {
  type: 'unchanged' | 'changed';
  text: string;
  oldText?: string;
}

export class DiffCalculator {
  /**
   * Calculate diff between two strings
   */
  static calculateLineDiff(oldText: string, newText: string): DiffLine[] {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const diff: DiffLine[] = [];

    const maxLength = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLength; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';

      if (oldLine === newLine) {
        diff.push({ type: 'unchanged', line: newLine, lineNumber: i + 1 });
      } else if (oldLines[i] === undefined) {
        diff.push({ type: 'added', line: newLine, lineNumber: i + 1 });
      } else if (newLines[i] === undefined) {
        diff.push({ type: 'removed', line: oldLine, lineNumber: i + 1 });
      } else {
        diff.push({ type: 'modified', line: newLine, oldLine, lineNumber: i + 1 });
      }
    }

    return diff;
  }

  /**
   * Highlight changes within a line
   */
  static highlightLineChanges(oldLine: string, newLine: string): DiffSegment[] {
    // Simple word-level diff
    const oldWords = oldLine.split(/(\s+)/);
    const newWords = newLine.split(/(\s+)/);

    const segments: DiffSegment[] = [];
    const maxLength = Math.max(oldWords.length, newWords.length);

    for (let i = 0; i < maxLength; i++) {
      if (oldWords[i] === newWords[i]) {
        segments.push({ type: 'unchanged', text: newWords[i] || '' });
      } else {
        segments.push({ type: 'changed', text: newWords[i] || '', oldText: oldWords[i] || '' });
      }
    }

    return segments;
  }
}
