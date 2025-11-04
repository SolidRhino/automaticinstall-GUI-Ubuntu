/**
 * TypeScript type definitions for Ubuntu Autoinstall configuration
 */

export interface AutoinstallConfig {
  version?: number;
  locale?: string;
  keyboard?: KeyboardConfig;
  identity?: IdentityConfig;
  ssh?: SshConfig;
  network?: NetworkConfig;
  storage?: StorageConfig;
  packages?: string[];
  'user-data'?: UserDataConfig;
  'late-commands'?: string[];
  'early-commands'?: string[];
  snaps?: SnapConfig[];
  timezone?: string;
  updates?: string;
  'interactive-sections'?: string[];
  [key: string]: any;
}

export interface KeyboardConfig {
  layout?: string;
  variant?: string;
  toggle?: string;
}

export interface IdentityConfig {
  hostname?: string;
  username?: string;
  password?: string;
  realname?: string;
}

export interface SshConfig {
  'install-server'?: boolean;
  'allow-pw'?: boolean;
  'authorized-keys'?: string[];
}

export interface NetworkConfig {
  version?: number;
  ethernets?: Record<string, EthernetConfig>;
  wifis?: Record<string, WifiConfig>;
  bonds?: Record<string, BondConfig>;
  bridges?: Record<string, BridgeConfig>;
  vlans?: Record<string, VlanConfig>;
}

export interface EthernetConfig {
  dhcp4?: boolean;
  dhcp6?: boolean;
  addresses?: string[];
  gateway4?: string;
  gateway6?: string;
  nameservers?: NameserverConfig;
  'match'?: { macaddress?: string; name?: string };
  'set-name'?: string;
}

export interface WifiConfig extends EthernetConfig {
  'access-points'?: Record<string, { password?: string }>;
}

export interface BondConfig {
  interfaces?: string[];
  parameters?: Record<string, any>;
}

export interface BridgeConfig {
  interfaces?: string[];
  parameters?: Record<string, any>;
}

export interface VlanConfig {
  id?: number;
  link?: string;
}

export interface NameserverConfig {
  addresses?: string[];
  search?: string[];
}

export interface StorageConfig {
  layout?: {
    name?: string;
    'match'?: { 'size'?: string; 'path'?: string };
  };
  config?: StorageDeviceConfig[];
}

export interface StorageDeviceConfig {
  type?: string;
  id?: string;
  ptable?: string;
  path?: string;
  wipe?: string;
  grub_device?: boolean;
  size?: string | number;
  number?: number;
  flag?: string;
  device?: string;
  fstype?: string;
  volume?: string;
  name?: string;
  mount?: string;
  [key: string]: any;
}

export interface UserDataConfig {
  'package_update'?: boolean;
  'package_upgrade'?: boolean;
  packages?: string[];
  runcmd?: string[];
  'write_files'?: WriteFileConfig[];
  users?: UserConfig[];
  [key: string]: any;
}

export interface WriteFileConfig {
  path?: string;
  content?: string;
  permissions?: string;
  owner?: string;
}

export interface UserConfig {
  name?: string;
  groups?: string[];
  shell?: string;
  'sudo'?: string;
  'ssh_authorized_keys'?: string[];
}

export interface SnapConfig {
  name: string;
  channel?: string;
  classic?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  config: Partial<AutoinstallConfig>;
}
