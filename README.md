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

### Technical
- **No Build Process Required**: Uses React via CDN - runs directly in any modern browser
- **GitHub Pages Ready**: Single HTML file, perfect for static hosting
- **Fully Accessible**: WCAG 2.1 compliant with comprehensive accessibility features

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

### Local Usage

1. Clone this repository:
   ```bash
   git clone https://github.com/SolidRhino/automaticinstall-GUI-Ubuntu.git
   cd automaticinstall-GUI-Ubuntu
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On Linux
   xdg-open index.html

   # On macOS
   open index.html

   # On Windows
   start index.html
   ```

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

### Dependencies

All dependencies are loaded from CDN (no build process or npm install required):

- **React 18**: Modern UI library for building component-based interfaces
  - Loaded from CDN: `https://unpkg.com/react@18/umd/react.production.min.js`
  - Provides efficient state management and component lifecycle
- **React DOM 18**: React renderer for web applications
  - Loaded from CDN: `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js`
- **Babel Standalone**: In-browser JSX transformation
  - Loaded from CDN: `https://unpkg.com/@babel/standalone/babel.min.js`
  - Allows writing JSX directly in the HTML file
- **Tailwind CSS**: Utility-first CSS framework for styling
  - Loaded from CDN: `https://cdn.tailwindcss.com`
  - Configured with dark mode support
- **js-yaml (4.1.0)**: YAML parsing and generation
  - Loaded from CDN: `https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js`
- **CryptoJS (4.2.0)**: Cryptographic library for password hashing
  - Loaded from CDN: `https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js`
  - Used for SHA-512 password hash generation

### React Architecture

The application uses modern React patterns:
- **Hooks**: useState, useEffect, useCallback, useRef for state and lifecycle management
- **Component Composition**: Reusable FormInput, FormTextarea, FormSelect, and FormCheckbox components
- **Functional Components**: All components are functional with hooks
- **Props**: Clean data flow from parent to child components
- **Auto-Generation**: useEffect hook automatically generates YAML when config changes
- **URL Persistence**: useEffect manages URL hash synchronization for bookmarking

### File Structure

```
.
├── index.html          # Main application (HTML + CSS + JavaScript)
└── README.md          # This file
```

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

- [ ] Add validation for required fields
- [ ] Interactive storage layout designer
- [ ] Network configuration wizard
- [ ] Example templates gallery
- [ ] Dark mode support
- [ ] Export to cloud-init format
- [ ] Schema validation against official JSON schema

---

Made with ❤️ for the Ubuntu community
