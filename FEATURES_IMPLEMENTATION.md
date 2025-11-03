# Advanced Features Implementation Guide

## Overview
This document outlines the three advanced features being added to the Ubuntu Autoinstall Configuration Builder.

## 1. YAML Validation Against Schema ✅

### Purpose
Validate the generated configuration against the official Ubuntu autoinstall schema to catch errors before deployment.

### Implementation
- **Validation Engine**: Comprehensive schema definition covering all autoinstall fields
- **Validation Button**: In toolbar next to "Load Template"
- **Validation Modal**: Shows errors and warnings with field paths
- **Real-time Indicators**: Green checkmark when valid, red X when invalid

### Schema Coverage
- Required fields (version, identity)
- Field types (string, number, boolean, array, object)
- Format validation (hostnames, usernames, etc.)
- Nested object validation (keyboard, identity, ssh, etc.)
- Array validation (packages, snaps, authorized-keys)

### Error Types
- **Errors**: Critical issues that will cause installation failure
- **Warnings**: Best practice violations or potential issues

### Example Errors
```
❌ identity.username: Invalid username format (must be lowercase)
❌ version: Must be 1
⚠️  ssh: No SSH server configured - remote access may not work
⚠️  identity.password: Plain text password detected - use hash for production
```

## 2. Configuration Diff Tool 📊

### Purpose
Compare two autoinstall configurations side-by-side to understand differences.

### Implementation
- **Compare Button**: In toolbar
- **Diff Modal**: Two-column layout with comparison
- **Input Methods**:
  - Upload YAML files
  - Paste YAML text
  - Compare current config with saved/loaded config
- **Difference Highlighting**:
  - Green: Added fields
  - Red: Removed fields
  - Yellow: Modified values

### Features
- Side-by-side comparison
- Line-by-line diff view
- Field path navigation
- Export diff report
- Unified or split view toggle

### Use Cases
- Compare before/after template application
- Review changes before saving
- Compare production vs development configs
- Audit configuration changes

### Example Output
```
identity:
  hostname: ubuntu-server (unchanged)
- username: admin (removed)
+ username: ubuntu (added)
~ password: *** (modified)

packages:
+ nginx (added)
+ mysql-server (added)
- apache2 (removed)
```

## 3. Storage & Network Wizards 🧙

### Storage Wizard

#### Purpose
Visual interface for creating storage configurations without writing YAML.

#### Steps
1. **Disk Selection**
   - Choose target disk (/dev/sda, /dev/nvme0n1, etc.)
   - Show disk size and model
   - Multi-disk selection for RAID

2. **Partition Scheme**
   - Simple (direct): Entire disk
   - LVM: Logical Volume Manager
   - Custom: Manual partitioning

3. **LVM Configuration** (if selected)
   - Volume group name
   - Logical volumes:
     - Name, size, mount point
     - File system type (ext4, xfs, btrfs)

4. **Custom Partitions** (if selected)
   - Partition list editor
   - Add/Remove partitions
   - For each partition:
     - Size (MB/GB or percentage)
     - Mount point (/, /home, /var, etc.)
     - File system type
     - Flags (boot, swap)

5. **Review & Generate**
   - Preview generated YAML
   - Apply to storage configuration

#### Presets
- **Minimal**: Single root partition
- **Recommended**: Root + swap + home
- **Server**: Root + swap + var + home
- **LVM Standard**: PV + VG + LVs

### Network Wizard

#### Purpose
Visual interface for creating Netplan network configurations.

#### Steps
1. **Interface Selection**
   - List available interfaces (eth0, ens33, enp0s3, etc.)
   - Manual interface name input
   - Multiple interface selection

2. **Configuration Type**
   - DHCP (automatic)
   - Static IP (manual)
   - No configuration (leave unconfigured)

3. **Static IP Configuration** (if selected)
   - IP Address with CIDR (e.g., 192.168.1.100/24)
   - Gateway (e.g., 192.168.1.1)
   - DNS Servers (comma-separated)
   - Search domains (optional)

4. **Advanced Options** (collapsible)
   - MTU size
   - MAC address override
   - Wake-on-LAN
   - IPv6 configuration

5. **Bond Configuration** (advanced)
   - Bond name
   - Bond mode (balance-rr, active-backup, etc.)
   - Slave interfaces
   - Bond options

6. **Bridge Configuration** (advanced)
   - Bridge name
   - Bridge interfaces
   - STP settings

7. **Review & Generate**
   - Preview generated Netplan YAML
   - Apply to network configuration

#### Presets
- **DHCP Single Interface**: Most common setup
- **Static IP**: Manual IP configuration
- **Dual NIC Failover**: Active-backup bond
- **Bridge for VMs**: Bridge interface

## UI Integration

### Toolbar Layout
```
[📋 Load Template] [✅ Validate Config] [📊 Compare Configs] [🌙 Dark Mode]
```

### Tab Integration
- **Storage Tab**: Add "🧙 Storage Wizard" button at top
- **Network Tab**: Add "🧙 Network Wizard" button at top

### Modal Structure
All new modals follow the same pattern:
- Full-screen overlay with backdrop
- Centered content area
- Header with title and close button
- Main content area with steps/tabs
- Footer with action buttons
- Keyboard accessible (ESC to close, Tab navigation)

## Technical Implementation

### Components Added
```javascript
// Validation
const SchemaValidator = () => { /* ... */ }
const ValidationModal = ({ isOpen, onClose, results }) => { /* ... */ }

// Diff Tool
const DiffComparator = () => { /* ... */ }
const DiffModal = ({ isOpen, onClose }) => { /* ... */ }

// Storage Wizard
const StorageWizard = ({ isOpen, onClose, onApply }) => { /* ... */ }
const DiskSelector = ({ onSelect }) => { /* ... */ }
const PartitionEditor = ({ partitions, onChange }) => { /* ... */ }

// Network Wizard
const NetworkWizard = ({ isOpen, onClose, onApply }) => { /* ... */ }
const InterfaceConfig = ({ interface, onChange }) => { /* ... */ }
const BondConfig = ({ bond, onChange }) => { /* ... */ }
```

### State Management
```javascript
const [showValidation, setShowValidation] = useState(false);
const [validationResults, setValidationResults] = useState(null);
const [showDiff, setShowDiff] = useState(false);
const [showStorageWizard, setShowStorageWizard] = useState(false);
const [showNetworkWizard, setShowNetworkWizard] = useState(false);
```

### Helper Functions
```javascript
validateAgainstSchema(config)  // Returns { valid, errors, warnings }
computeDiff(config1, config2)  // Returns array of diffs
generateStorageYAML(wizardData) // Returns storage config object
generateNetworkYAML(wizardData) // Returns network config object
```

## Benefits

### Schema Validation
- ✅ Catch errors before deployment
- ✅ Learn correct configuration format
- ✅ Improve configuration quality
- ✅ Reduce failed installations

### Diff Tool
- ✅ Understand configuration changes
- ✅ Review template modifications
- ✅ Audit configuration versions
- ✅ Share change summaries

### Wizards
- ✅ No YAML knowledge required
- ✅ Visual interface for complex configs
- ✅ Reduced syntax errors
- ✅ Faster configuration creation
- ✅ Guided best practices

## File Size Impact
- Current: ~1,488 lines
- With features: ~2,800 lines
- Still single HTML file
- No build process
- All CDN dependencies

## Browser Compatibility
Same as before:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Accessibility
All new features maintain WCAG 2.1 compliance:
- Keyboard navigation for wizards
- Screen reader announcements
- ARIA labels on all controls
- Focus management in modals
- High contrast validation indicators
