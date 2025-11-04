// Interactive Onboarding Tour Configuration
// Using Intro.js for guided tour

const tourSteps = [
    {
        element: 'header',
        intro: `
            <h3 style="margin-top: 0;">Welcome to Ubuntu Autoinstall Builder! 👋</h3>
            <p>This tool helps you create Ubuntu autoinstall configurations easily.</p>
            <p>Let's take a quick tour of the key features!</p>
        `,
        position: 'bottom'
    },
    {
        element: '.language-selector',
        intro: `
            <h4>🌐 Multi-Language Support</h4>
            <p>Change the interface language here. We support English, Spanish, French, German, and Dutch!</p>
        `,
        position: 'bottom'
    },
    {
        element: '.dark-mode-toggle',
        intro: `
            <h4>🌙 Dark Mode</h4>
            <p>Toggle between light and dark themes for comfortable viewing.</p>
        `,
        position: 'bottom'
    },
    {
        element: '.toolbar',
        intro: `
            <h4>🛠️ Toolbar Actions</h4>
            <p>Quick access to templates, validation, comparison, preview, export, and import tools.</p>
        `,
        position: 'bottom'
    },
    {
        element: '.tabs-navigation',
        intro: `
            <h4>📑 Configuration Tabs</h4>
            <p>Configure different aspects of your system: Basic settings, Identity, Network, Storage, Software, SSH, and Advanced options.</p>
            <p><strong>Tip:</strong> Use arrow keys to navigate between tabs!</p>
        `,
        position: 'bottom'
    },
    {
        element: '.yaml-preview',
        intro: `
            <h4>👁️ Live YAML Preview</h4>
            <p>See your configuration in real-time as you make changes. Changes are highlighted!</p>
        `,
        position: 'left'
    },
    {
        element: '.action-buttons',
        intro: `
            <h4>💾 Action Buttons</h4>
            <p>Download your config, copy to clipboard, load existing files, save bookmarks, or clear the form.</p>
        `,
        position: 'top'
    },
    {
        intro: `
            <h3>⌨️ Keyboard Shortcuts</h3>
            <ul style="text-align: left; padding-left: 20px;">
                <li><kbd>Ctrl+S</kbd> - Download YAML</li>
                <li><kbd>Ctrl+Z</kbd> - Undo</li>
                <li><kbd>Ctrl+Y</kbd> - Redo</li>
                <li><kbd>Ctrl+K</kbd> - Open versions</li>
                <li><kbd>Ctrl+/</kbd> - Show shortcuts</li>
                <li><kbd>←/→</kbd> - Navigate tabs</li>
            </ul>
        `
    },
    {
        intro: `
            <h3>🎉 You're All Set!</h3>
            <p>Start creating your Ubuntu autoinstall configuration now!</p>
            <p><strong>Pro tip:</strong> Your work is automatically saved to browser history. You can undo/redo changes anytime!</p>
            <p style="margin-top: 15px;"><small>You can restart this tour anytime from the help menu.</small></p>
        `
    }
];

const tourConfig = {
    steps: tourSteps,
    options: {
        nextLabel: 'Next →',
        prevLabel: '← Back',
        skipLabel: 'Skip Tour',
        doneLabel: 'Get Started! 🚀',
        showProgress: true,
        showBullets: false,
        exitOnOverlayClick: false,
        exitOnEsc: true,
        keyboardNavigation: true,
        scrollToElement: true,
        scrollPadding: 30,
        overlayOpacity: 0.7,
        tooltipClass: 'intro-tooltip-custom',
        highlightClass: 'intro-highlight-custom'
    }
};

// Export to window
window.tourConfig = tourConfig;
