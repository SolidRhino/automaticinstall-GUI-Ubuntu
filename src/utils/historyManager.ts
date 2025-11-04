/**
 * History manager for undo/redo functionality
 */

import { deepClone } from './helpers';

export interface HistoryInfo {
  total: number;
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export class HistoryManager<T = any> {
  private maxHistory: number;
  private history: T[];
  private currentIndex: number;

  constructor(maxHistory = 50) {
    this.maxHistory = maxHistory;
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Push a new state to history
   */
  push(state: T): void {
    // Remove any history after current index
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    this.history.push(deepClone(state));
    this.currentIndex++;

    // Keep only max history
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * Undo to previous state
   */
  undo(): T | null {
    if (this.canUndo()) {
      this.currentIndex--;
      return deepClone(this.history[this.currentIndex]);
    }
    return null;
  }

  /**
   * Redo to next state
   */
  redo(): T | null {
    if (this.canRedo()) {
      this.currentIndex++;
      return deepClone(this.history[this.currentIndex]);
    }
    return null;
  }

  /**
   * Check if can undo
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if can redo
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get current state
   */
  getCurrent(): T | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return deepClone(this.history[this.currentIndex]);
    }
    return null;
  }

  /**
   * Clear history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Get history info
   */
  getInfo(): HistoryInfo {
    return {
      total: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }
}
