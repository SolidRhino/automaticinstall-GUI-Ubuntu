# Ubuntu Autoinstall Configuration Builder

A web-based GUI for creating and managing Ubuntu autoinstall configurations. This tool provides an intuitive interface for generating `autoinstall.yaml` files used for automated Ubuntu Server installations.

![Ubuntu Autoinstall GUI](https://img.shields.io/badge/Ubuntu-Autoinstall-E95420?style=for-the-badge&logo=ubuntu)

## Features

- **User-Friendly Interface**: Organized tabs for different configuration sections
- **Complete Coverage**: Supports all major autoinstall schema fields
- **YAML Generation**: Real-time YAML preview as you configure
- **Save & Load**: Import existing autoinstall.yaml files or export new ones
- **Bookmark Support**: Save your configuration in the URL for easy sharing and bookmarking
- **No Installation Required**: Pure HTML/CSS/JavaScript - runs in any modern browser
- **GitHub Pages Ready**: Host directly on GitHub Pages

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

- **js-yaml (4.1.0)**: YAML parsing and generation
  - Loaded from CDN: `https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js`

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
