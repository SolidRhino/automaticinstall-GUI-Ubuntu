/**
 * Configuration version manager
 */

import { storage } from './storage';
import { deepClone, generateId, formatDate } from './helpers';

export interface ConfigVersion {
  id: string;
  name: string;
  config: any;
  timestamp: number;
  date: string;
}

export class VersionManager {
  private maxVersions: number;
  private versions: ConfigVersion[];

  constructor(maxVersions = 50) {
    this.maxVersions = maxVersions;
    this.versions = storage.get<ConfigVersion[]>('config-versions', []) || [];
  }

  /**
   * Save a version
   */
  save(config: any, name: string | null = null): ConfigVersion {
    const version: ConfigVersion = {
      id: generateId(),
      name: name || `Version ${this.versions.length + 1}`,
      config: deepClone(config),
      timestamp: Date.now(),
      date: formatDate(new Date())
    };

    this.versions.unshift(version);

    // Keep only max versions
    if (this.versions.length > this.maxVersions) {
      this.versions = this.versions.slice(0, this.maxVersions);
    }

    storage.set('config-versions', this.versions);
    return version;
  }

  /**
   * Get all versions
   */
  getAll(): ConfigVersion[] {
    return this.versions;
  }

  /**
   * Get a specific version
   */
  get(id: string): ConfigVersion | null {
    return this.versions.find(v => v.id === id) || null;
  }

  /**
   * Delete a version
   */
  delete(id: string): boolean {
    const index = this.versions.findIndex(v => v.id === id);
    if (index > -1) {
      this.versions.splice(index, 1);
      storage.set('config-versions', this.versions);
      return true;
    }
    return false;
  }

  /**
   * Rename a version
   */
  rename(id: string, name: string): boolean {
    const version = this.get(id);
    if (version) {
      version.name = name;
      storage.set('config-versions', this.versions);
      return true;
    }
    return false;
  }

  /**
   * Clear all versions
   */
  clear(): void {
    this.versions = [];
    storage.remove('config-versions');
  }

  /**
   * Export versions as JSON
   */
  export(): string {
    return JSON.stringify(this.versions, null, 2);
  }

  /**
   * Import versions from JSON
   */
  import(json: string): boolean {
    try {
      const imported = JSON.parse(json);
      if (Array.isArray(imported)) {
        this.versions = imported;
        storage.set('config-versions', this.versions);
        return true;
      }
    } catch (e) {
      console.error('Error importing versions:', e);
    }
    return false;
  }
}
