# Ubuntu Autoinstall Configuration Builder

A web-based GUI for creating and managing Ubuntu autoinstall configurations. This tool provides an intuitive interface for generating `autoinstall.yaml` files used for automated Ubuntu Server installations.

![Ubuntu Autoinstall GUI](https://img.shields.io/badge/Ubuntu-Autoinstall-E95420?style=for-the-badge&logo=ubuntu)

## Features

### Core Functionality
- **Modern React Architecture**: Built with React 18 and Hooks for optimal performance
- **Component-Based Design**: Reusable, maintainable components with clean separation of concerns
- **User-Friendly Interface**: Organized tabs for different configuration sections, built with Tailwind CSS
- **Complete Coverage**: Supports all major autoinstall schema fields
- **Real-Time YAML Generation**: Automatic YAML preview as you configure
- **Save & Load**: Import existing autoinstall.yaml files or export new ones
- **Bookmark Support**: Save your configuration in the URL for easy sharing and bookmarking

### Advanced Features
- **✅ Form Validation**: Real-time validation for hostnames, usernames, URLs, SSH keys, YAML syntax, and Ubuntu Pro tokens
- **🔒 Password Hashing**: Built-in SHA-512 password hash generator for secure password storage
- **📋 Configuration Templates**: 6 pre-configured templates for common server setups (Web Server, Database, Docker, Kubernetes, Development, Minimal)
- **🌙 Dark Mode**: Toggle between light and dark themes with preference persistence
- **🔍 Schema Validation**: Validate your configuration against the official Ubuntu autoinstall schema with detailed error and warning messages
- **📊 Configuration Diff Tool**: Compare two autoinstall configurations side-by-side to see additions, removals, and modifications
- **🧙 Storage Wizard**: Visual 3-step wizard for creating disk partitioning configurations without writing YAML
- **🧙 Network Wizard**: Visual 3-step wizard for creating Netplan network configurations with guided setup
- **☁️ Cloud-Init Export**: Convert your autoinstall configuration to cloud-init user-data format for use with cloud providers
- **🔍 Configuration Simulator**: Preview and analyze your system configuration before deployment with issue detection
- **📥 System Importer**: Import configuration from existing systems using command outputs
- **🌐 Multi-Language Support**: Full UI translation in English, Spanish, French, German, and Dutch

### Technical
- **Modern Build System**: TypeScript + Vite for optimal performance and developer experience
- **GitHub Pages Ready**: Automated deployment with GitHub Actions
- **Fully Accessible**: WCAG 2.1 compliant with comprehensive accessibility features
- **Progressive Web App**: Offline support with service worker caching

## Accessibility Features

This application is designed to be fully accessible for users with disabilities:

### Screen Reader Support
- **ARIA Labels**: All form inputs have proper ARIA labels and descriptions
- **ARIA Live Regions**: Dynamic updates are announced to screen readers
- **Semantic HTML**: Proper use of semantic elements (header, main, nav, section, footer)
- **Role Attributes**: Correct ARIA roles for tabs, tabpanels, and other interactive elements

### Keyboard Navigation
- **Tab Navigation**: Full keyboard support for all interactive elements
- **Arrow Key Navigation**: Use Left/Right arrows to navigate between tabs
- **Home/End Keys**: Jump to first/last tab quickly
- **Skip Links**: "Skip to main content" link for keyboard users
- **Focus Indicators**: Clear, visible focus outlines on all interactive elements

### Visual Accessibility
- **High Contrast**: Sufficient color contrast ratios for text readability
- **Focus Styles**: Enhanced 3px outline for focus visibility
- **Responsive Design**: Works on all screen sizes and zoom levels
- **Clear Labels**: All form fields have visible labels and help text

### Other Accessibility Features
- **Autocomplete Attributes**: Proper autocomplete for username, password, and name fields
- **Required Field Indicators**: Visual and screen reader indicators for required fields
- **Error Announcements**: Screen reader announcements for validation errors
- **Status Messages**: Live region announcements for actions (save, load, generate)
- **Keyboard-Accessible File Upload**: File input button is fully keyboard accessible

## Configuration Sections

The GUI is organized into the following sections:

### Basic
- Version (required)
- Locale
- Timezone
- Keyboard layout and variant
- Update policy

### Identity
- Hostname
- Username and password
- Real name

### Network
- Netplan v2 configuration
- HTTP proxy settings

### Storage
- Disk partitioning and layout
- LVM and other storage configurations

### Software
- APT packages
- Snap packages
- Kernel selection
- Proprietary drivers and codecs

### SSH
- OpenSSH server installation
- Password authentication settings
- Authorized SSH keys

### Advanced
- Early commands (pre-installation)
- Late commands (post-installation)
- Error commands
- Cloud-init user-data
- Shutdown actions
- Kernel crash dumps
- Ubuntu Pro integration

## Usage

### Online (GitHub Pages)

Visit the hosted version: [Your GitHub Pages URL]

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/SolidRhino/automaticinstall-GUI-Ubuntu.git
   cd automaticinstall-GUI-Ubuntu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

4. Build for production:
   ```bash
   npm run build
   ```
   Production files will be in the `dist/` directory

5. Preview production build:
   ```bash
   npm run preview
   ```

### Additional Commands

- **Type check**: `npm run type-check` - Check TypeScript errors without building
- **Lint**: `npm run lint` - Run ESLint on TypeScript files

### Creating a Configuration

1. Navigate through the tabs and fill in your desired configuration
2. Click **"Generate YAML"** to see the preview
3. Click **"Download autoinstall.yaml"** to save the file
4. Use the downloaded file in your Ubuntu installation media

### Loading an Existing Configuration

1. Click **"Load YAML File"**
2. Select your existing `autoinstall.yaml` file
3. The form will be populated with the configuration values
4. Make any desired changes and regenerate

### Saving Configuration to Bookmark

1. Configure your settings
2. Click **"Save to Bookmark"**
3. Bookmark the page - your configuration is saved in the URL
4. Share the URL or return to it later to restore the configuration

### Using Templates

1. Click **"📋 Load Template"** in the toolbar
2. Choose from 6 pre-configured templates:
   - **Web Server**: LAMP/LEMP stack with nginx, PHP, MySQL, certbot, and firewall
   - **Database Server**: PostgreSQL with backup tools
   - **Docker Host**: Docker and Docker Compose setup
   - **Kubernetes Node**: K8s node with kubectl and containerd
   - **Development Workstation**: Dev tools, editors (VS Code, vim, emacs), build tools
   - **Minimal Server**: Bare minimum with SSH only
3. Template will populate relevant fields automatically
4. Customize as needed for your specific requirements

### Password Hashing

1. Go to the **Identity** tab
2. Click the **"🔒 Hash"** button next to the password field
3. Enter your plain text password in the modal
4. Click **"Generate SHA-512 Hash"**
5. Click **"Use This Hash"** to insert it into the configuration
6. The hash is Linux-compatible and much more secure than plain text

**Important**: Always use hashed passwords in production! Plain text passwords in configuration files are a security risk.

### Form Validation

The application automatically validates:
- **Hostnames**: RFC-compliant hostname format
- **Usernames**: Linux username requirements (lowercase, starts with letter/underscore)
- **URLs**: Valid URL format for proxy settings
- **SSH Keys**: Validates SSH public key format (rsa, ed25519, ecdsa)
- **YAML**: Syntax validation for network and storage configurations
- **Ubuntu Pro Tokens**: Base58 format starting with 'C'

Invalid fields will show red borders and error messages below the field.

### Dark Mode

- Click the **☀️/🌙** button in the top-right corner
- Your preference is saved to localStorage
- Dark mode applies to all UI elements including modals and validation messages

### Schema Validation

1. Configure your autoinstall settings
2. Click **"✅ Validate Config"** in the toolbar
3. View validation results showing:
   - **Errors**: Critical issues that must be fixed (red)
   - **Warnings**: Best practice recommendations (yellow)
   - **Summary**: Quick overview of validation status
4. Fix any errors or warnings and validate again

**What gets validated:**
- Required fields (version, identity fields if present)
- Hostname format (RFC-compliant)
- Username format (Linux requirements)
- Package names and format
- SSH key format
- Ubuntu Pro token format
- YAML syntax

### Configuration Diff Tool

1. Click **"📊 Compare Configs"** in the toolbar
2. Load or paste two configurations to compare:
   - **Upload YAML files** using the file buttons
   - **Paste YAML** directly into the text areas
3. Click **"Compare"** to see the differences
4. View color-coded changes:
   - **Green**: Values only in Config 2 (additions)
   - **Red**: Values only in Config 1 (removals)
   - **Yellow**: Values that differ (modifications)
5. Export the comparison as a text report

**Use cases:**
- Compare different versions of your configuration
- See what changed between templates
- Audit configuration differences before deployment

### Storage Wizard

1. Go to the **Storage** tab
2. Click **"🧙 Storage Wizard"**
3. Follow the 3-step wizard:
   - **Step 1: Select Target Disk**
     - Choose from common disk paths (/dev/sda, /dev/nvme0n1, /dev/vda, etc.)
   - **Step 2: Choose Partition Scheme**
     - **Simple (Direct)**: Use entire disk with default partitioning
     - **LVM**: Logical Volume Manager for flexible resizing
     - **Custom Partitions**: Define your own partition layout with visual editor
   - **Step 3: Review Configuration**
     - See the generated YAML before applying
4. Click **"Apply Configuration"** to insert into your config

**Custom Partition Editor:**
- Add/remove partitions
- Configure size, mount point, and filesystem for each
- Supports ext4, xfs, btrfs, and swap
- Real-time YAML generation

### Network Wizard

1. Go to the **Network** tab
2. Click **"🧙 Network Wizard"**
3. Follow the 3-step wizard:
   - **Step 1: Select Network Interface**
     - Choose from common interfaces (eth0, ens33, enp0s3, etc.)
     - Or specify a custom interface name
   - **Step 2: Choose Configuration Type**
     - **DHCP (Automatic)**: Automatic IP configuration
     - **Static IP (Manual)**: Specify IP address, gateway, and DNS
   - **Step 3: Review Configuration**
     - See the generated Netplan YAML before applying
4. Click **"Apply Configuration"** to insert into your config

**Static IP Configuration:**
- IP address with CIDR notation (e.g., 192.168.1.100/24)
- Gateway address
- DNS servers (one per line)
- Generates proper Netplan v2 format

### Cloud-Init Export

1. Configure your autoinstall settings
2. Click **"☁️ Export to Cloud-Init"** in the toolbar
3. Review the configuration summary showing what will be converted
4. View the generated cloud-init user-data YAML
5. Download as `user-data.yaml` or copy to clipboard

**What gets converted:**
- System settings (hostname, timezone, locale, keyboard)
- User accounts with passwords and SSH keys
- Package installation (APT and Snap)
- Network configuration
- Commands (early, late, and snap installation commands)
- SSH server and configuration
- Ubuntu Pro token
- Power state after completion

**Use cases:**
- Deploy to cloud providers (AWS, Azure, GCP, DigitalOcean)
- Use with cloud-init-enabled systems
- Virtual machine provisioning
- Container initialization

### Configuration Simulator (Preview System)

1. Configure your autoinstall settings
2. Click **"🔍 Preview System"** in the toolbar
3. Review the complete system analysis:
   - **System Information**: Hostname, locale, timezone, keyboard, updates
   - **User Accounts**: Configured users with password types and SSH keys
   - **Network Configuration**: Interface details and IP addresses
   - **Storage Layout**: Disk partitioning scheme
   - **Software**: Package counts and installed applications
   - **Security Analysis**: Security level scoring and recommendations

**Issue Detection:**
- **Critical Issues** (red): Must be fixed (e.g., no user account, duplicate mount points)
- **Warnings** (yellow): Best practice recommendations (e.g., plain text passwords, missing SSH keys)

**Security Scoring:**
- Evaluates SSH configuration, password hashing, Ubuntu Pro, and update settings
- Provides overall security level: Excellent, Good, Moderate, or Low

### System Importer

1. Click **"📥 Import from System"** in the toolbar
2. Follow the 5-step wizard:

**Step 1: System Information**
- Paste output from `hostnamectl` (hostname)
- Paste output from `timedatectl` (timezone)
- Paste output from `locale` (locale settings)

**Step 2: Network Configuration**
- Paste output from `ip addr show` (network interfaces and IP addresses)

**Step 3: Installed Packages**
- Paste output from `dpkg -l` or `apt list --installed`
- Base system packages are automatically filtered out

**Step 4: User Accounts**
- Paste output from `cat /etc/passwd`
- Only regular user accounts (UID ≥ 1000) are imported
- Passwords are NOT imported for security

**Step 5: Review and Apply**
- Review the generated configuration
- See summary of imported items
- Apply to merge with current configuration

**Use cases:**
- Recreate existing server configurations
- Document current system setup
- Create templates from production systems
- Migrate to new installations

### Multi-Language Support

1. Click the **language selector** (flag dropdown) in the header
2. Choose from:
   - 🇬🇧 English
   - 🇪🇸 Español (Spanish)
   - 🇫🇷 Français (French)
   - 🇩🇪 Deutsch (German)
   - 🇳🇱 Nederlands (Dutch)
3. The page will reload with all UI text translated
4. Language preference is saved to browser localStorage
5. Auto-detects browser language on first visit

**What's translated:**
- All toolbar buttons and tab labels
- Form labels and help text
- Validation messages
- Modal titles and descriptions
- Button text and placeholders

## Autoinstall Schema Reference

This tool is based on the official Ubuntu autoinstall schema:
- [Autoinstall Schema Documentation](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-schema.html)
- [Autoinstall Reference Manual](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html)

## Browser Compatibility

This application works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- Local Storage
- File API

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Technical Details

### Technology Stack

**Frontend Framework:**
- **React 18**: Modern UI library with Hooks for state management
- **TypeScript**: Type-safe development with full IDE support
- **Tailwind CSS**: Utility-first CSS framework with dark mode support

**Build Tools:**
- **Vite**: Fast build tool with Hot Module Replacement (HMR)
- **ESLint**: Code linting with TypeScript support
- **TypeScript Compiler**: Strict type checking enabled

**Core Libraries:**
- **js-yaml (4.1.0)**: YAML parsing and generation for autoinstall files
- **CryptoJS (4.2.0)**: SHA-512 password hashing for secure Linux passwords
- **Intro.js (7.2.0)**: Interactive onboarding tours (future feature)

**PWA Features:**
- **Vite PWA Plugin**: Service worker generation for offline support
- **Workbox**: Advanced caching strategies for assets and data

### React Architecture

The application uses modern React patterns:
- **Hooks**: useState, useEffect, useCallback, useRef for state and lifecycle management
- **Component Composition**: Reusable FormInput, FormTextarea, FormSelect, and FormCheckbox components
- **Functional Components**: All components are functional with hooks
- **Props**: Clean data flow from parent to child components
- **Auto-Generation**: useEffect hook automatically generates YAML when config changes
- **URL Persistence**: useEffect manages URL hash synchronization for bookmarking

### Project Structure

```
.
├── index.html                      # Minimal Vite entry point
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Main application component (768 lines)
│   ├── index.css                   # Global styles and Tailwind imports
│   ├── types/
│   │   └── config.ts               # TypeScript type definitions
│   ├── components/
│   │   ├── forms/                  # Form input components
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormTextarea.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── FormCheckbox.tsx
│   │   │   ├── InfoBox.tsx
│   │   │   └── ScreenReaderAnnouncement.tsx
│   │   ├── tabs/                   # Configuration tab components
│   │   │   ├── BasicTab.tsx
│   │   │   ├── IdentityTab.tsx
│   │   │   ├── NetworkTab.tsx
│   │   │   ├── StorageTab.tsx
│   │   │   ├── SoftwareTab.tsx
│   │   │   ├── SSHTab.tsx
│   │   │   └── AdvancedTab.tsx
│   │   ├── modals/                 # Modal dialog components
│   │   │   ├── PasswordHashModal.tsx
│   │   │   └── TemplatesModal.tsx
│   │   ├── CollapsibleSection.tsx
│   │   ├── InlineExample.tsx
│   │   ├── HelpTooltip.tsx
│   │   ├── UndoRedoToolbar.tsx
│   │   ├── VersionManagerModal.tsx
│   │   └── KeyboardShortcutsModal.tsx
│   ├── features/
│   │   ├── wizards/                # Configuration wizards
│   │   │   ├── StorageWizard.tsx
│   │   │   ├── NetworkWizard.tsx
│   │   │   └── SystemImporter.tsx
│   │   ├── validation/
│   │   │   └── SchemaValidator.tsx
│   │   ├── diff/
│   │   │   └── DiffTool.tsx
│   │   ├── export/
│   │   │   └── CloudInitExporter.tsx
│   │   └── simulator/
│   │       └── ConfigSimulator.tsx
│   ├── utils/
│   │   ├── helpers.ts              # Utility functions
│   │   ├── storage.ts              # localStorage wrapper
│   │   ├── keyboardShortcuts.ts    # Keyboard shortcut system
│   │   ├── versionManager.ts       # Configuration versioning
│   │   ├── historyManager.ts       # Undo/redo functionality
│   │   ├── diffCalculator.ts       # YAML diff highlighting
│   │   ├── validators.ts           # Form validation functions
│   │   └── passwordHash.ts         # SHA-512 password hashing
│   ├── i18n/
│   │   ├── index.ts                # i18n class with React integration
│   │   └── translations.ts         # Type-safe translations
│   └── data/
│       └── templates.ts            # Pre-configured server templates
├── dist/                           # Production build output (gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment
├── MIGRATION.md                    # TypeScript migration status
├── CLAUDE.md                       # Claude Code project instructions
├── example-autoinstall.yaml        # Sample configuration file
└── README.md                       # This file
```

### Build System

**Development:**
- **Vite Dev Server**: Fast HMR with instant feedback at `localhost:3000`
- **TypeScript**: Real-time type checking during development
- **Source Maps**: Full debugging support with source-to-source mapping

**Production Build:**
- **Code Splitting**: Separate vendor chunks for React, YAML, CryptoJS, and Intro.js
- **Tree Shaking**: Removes unused code for minimal bundle size
- **Minification**: Optimized JavaScript and CSS with gzip compression
- **Asset Optimization**: Images and fonts optimized for web delivery
- **Bundle Size**: ~380 KiB total (React 142 KB, App 106 KB, CryptoJS 71 KB, js-yaml 40 KB, CSS 29 KB)

**Deployment:**
- **GitHub Actions**: Automated deployment on push to `main` branch
- **GitHub Pages**: Static hosting with automatic SSL
- **Base Path**: Configured for `/automaticinstall-GUI-Ubuntu/` repository path
- **PWA Support**: Service worker for offline capability and caching

### State Persistence

Configuration state is saved in the URL hash using Base64 encoding of JSON data. This allows:
- Bookmarking configurations
- Sharing configurations via URL
- No server-side storage required

## Example Configurations

### Minimal Configuration
```yaml
autoinstall:
  version: 1
  identity:
    hostname: ubuntu-server
    username: ubuntu
    password: ubuntu
```

### Full Server Setup
```yaml
autoinstall:
  version: 1
  locale: en_US.UTF-8
  timezone: America/New_York
  keyboard:
    layout: us
  identity:
    hostname: web-server-01
    username: admin
    password: SecurePassword123
    realname: Admin User
  ssh:
    install-server: true
    allow-pw: true
  packages:
    - nginx
    - postgresql
    - redis-server
  late-commands:
    - curtin in-target -- systemctl enable nginx
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Based on the [Canonical Subiquity](https://github.com/canonical/subiquity) autoinstall schema
- Uses [js-yaml](https://github.com/nodeca/js-yaml) for YAML processing

## Support

For issues related to:
- **This GUI tool**: Open an issue in this repository
- **Ubuntu autoinstall schema**: Refer to the [official documentation](https://canonical-subiquity.readthedocs-hosted.com/)
- **Ubuntu installation**: Check [Ubuntu community support](https://ubuntu.com/support)

## Roadmap

- [x] Add validation for required fields
- [x] Interactive storage layout designer
- [x] Network configuration wizard
- [x] Example templates gallery
- [x] Dark mode support
- [x] Schema validation against official JSON schema
- [x] Export to cloud-init format
- [x] Live configuration testing/simulation
- [x] Import from existing system configuration
- [x] Multi-language support (EN, ES, FR, DE, NL)
- [ ] Additional language translations (PT, IT, RU, ZH, JA)
- [ ] Configuration versioning and history
- [ ] Advanced storage layouts (RAID, ZFS)
- [ ] Integration with Terraform/Ansible

---

Made with ❤️ for the Ubuntu community
