// Schema Validator Module
// Validates autoinstall configuration against the official schema

const SchemaValidator = {
    // Schema definition based on Ubuntu autoinstall specification
    schema: {
        version: {
            type: 'number',
            required: true,
            validate: (v) => v === 1,
            message: 'Version must be 1'
        },
        locale: { type: 'string' },
        timezone: { type: 'string' },
        keyboard: {
            type: 'object',
            properties: {
                layout: { type: 'string', required: true },
                variant: { type: 'string' },
                toggle: { type: 'string' }
            }
        },
        identity: {
            type: 'object',
            properties: {
                hostname: {
                    type: 'string',
                    pattern: /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])$/,
                    message: 'Invalid hostname format'
                },
                username: {
                    type: 'string',
                    required: true,
                    pattern: /^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/,
                    message: 'Invalid username (must be lowercase, start with letter/underscore)'
                },
                password: {
                    type: 'string',
                    required: true,
                    message: 'Password is required'
                },
                realname: { type: 'string' }
            }
        },
        ssh: {
            type: 'object',
            properties: {
                'install-server': { type: 'boolean' },
                'allow-pw': { type: 'boolean' },
                'authorized-keys': {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        },
        network: { type: 'object' },
        storage: { type: 'object' },
        packages: {
            type: 'array',
            items: { type: 'string' }
        },
        snaps: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string', required: true },
                    channel: { type: 'string' },
                    classic: { type: 'boolean' }
                }
            }
        },
        updates: {
            type: 'string',
            enum: ['security', 'all']
        },
        'early-commands': { type: 'array', items: { type: 'string' } },
        'late-commands': { type: 'array', items: { type: 'string' } },
        'error-commands': { type: 'array', items: { type: 'string' } },
        'user-data': { type: ['string', 'object'] },
        shutdown: { type: 'string', enum: ['reboot', 'poweroff'] },
        'ubuntu-pro': {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    pattern: /^C[A-Za-z0-9]{23}$/,
                    message: 'Invalid Ubuntu Pro token format'
                }
            }
        }
    },

    validate(config) {
        const errors = [];
        const warnings = [];

        // Check for autoinstall root
        if (!config.autoinstall) {
            errors.push({
                severity: 'error',
                field: 'root',
                message: 'Missing "autoinstall" root key'
            });
            return { valid: false, errors, warnings };
        }

        const ai = config.autoinstall;

        // Validate version (required)
        if (!ai.version) {
            errors.push({
                severity: 'error',
                field: 'version',
                message: 'Version is required'
            });
        } else if (ai.version !== 1) {
            errors.push({
                severity: 'error',
                field: 'version',
                message: 'Version must be 1'
            });
        }

        // Validate identity
        if (ai.identity) {
            const identity = ai.identity;

            if (identity.username) {
                if (!/^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/.test(identity.username)) {
                    errors.push({
                        severity: 'error',
                        field: 'identity.username',
                        message: 'Invalid username (must be lowercase, start with letter/underscore)'
                    });
                }
            }

            if (identity.hostname) {
                if (!/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])$/.test(identity.hostname)) {
                    errors.push({
                        severity: 'error',
                        field: 'identity.hostname',
                        message: 'Invalid hostname format'
                    });
                }
            }

            if (!identity.password) {
                warnings.push({
                    severity: 'warning',
                    field: 'identity.password',
                    message: 'No password configured for user'
                });
            } else if (identity.password && !identity.password.startsWith('$6$')) {
                warnings.push({
                    severity: 'warning',
                    field: 'identity.password',
                    message: 'Plain text password detected - use hash for production'
                });
            }
        } else {
            warnings.push({
                severity: 'warning',
                field: 'identity',
                message: 'No user identity configured'
            });
        }

        // Validate packages
        if (ai.packages && !Array.isArray(ai.packages)) {
            errors.push({
                severity: 'error',
                field: 'packages',
                message: 'Packages must be an array'
            });
        }

        // Validate snaps
        if (ai.snaps) {
            if (!Array.isArray(ai.snaps)) {
                errors.push({
                    severity: 'error',
                    field: 'snaps',
                    message: 'Snaps must be an array'
                });
            } else {
                ai.snaps.forEach((snap, index) => {
                    if (!snap.name) {
                        errors.push({
                            severity: 'error',
                            field: `snaps[${index}]`,
                            message: 'Snap must have a name property'
                        });
                    }
                });
            }
        }

        // Validate SSH
        if (!ai.ssh || !ai.ssh['install-server']) {
            warnings.push({
                severity: 'warning',
                field: 'ssh',
                message: 'SSH server not configured - remote access may not work'
            });
        }

        if (ai.ssh && ai.ssh['authorized-keys']) {
            if (!Array.isArray(ai.ssh['authorized-keys'])) {
                errors.push({
                    severity: 'error',
                    field: 'ssh.authorized-keys',
                    message: 'authorized-keys must be an array'
                });
            } else {
                const sshKeyRegex = /^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521) [A-Za-z0-9+\/]+=*( .*)?$/;
                ai.ssh['authorized-keys'].forEach((key, index) => {
                    if (!sshKeyRegex.test(key)) {
                        errors.push({
                            severity: 'error',
                            field: `ssh.authorized-keys[${index}]`,
                            message: 'Invalid SSH key format'
                        });
                    }
                });
            }
        }

        // Validate network (basic check)
        if (!ai.network) {
            warnings.push({
                severity: 'warning',
                field: 'network',
                message: 'Network not configured - will use DHCP on all interfaces'
            });
        }

        // Validate storage (basic check)
        if (!ai.storage) {
            warnings.push({
                severity: 'warning',
                field: 'storage',
                message: 'Storage not configured - will use default partitioning'
            });
        }

        // Validate Ubuntu Pro token format
        if (ai['ubuntu-pro'] && ai['ubuntu-pro'].token) {
            if (!/^C[A-Za-z0-9]{23}$/.test(ai['ubuntu-pro'].token)) {
                errors.push({
                    severity: 'error',
                    field: 'ubuntu-pro.token',
                    message: 'Invalid Ubuntu Pro token format (should be C followed by 23 characters)'
                });
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            summary: {
                total: errors.length + warnings.length,
                errors: errors.length,
                warnings: warnings.length
            }
        };
    }
};

// Validation Results Modal Component
const ValidationModal = ({ isOpen, onClose, results }) => {
    if (!isOpen || !results) return null;

    const { valid, errors, warnings, summary } = results;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Configuration Validation Results
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Summary */}
                <div className={`p-4 rounded-lg mb-6 ${valid ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
                    <div className="flex items-center gap-3">
                        {valid ? (
                            <>
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-lg font-bold text-green-900 dark:text-green-100">
                                        Configuration is Valid!
                                    </h4>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        {warnings.length === 0
                                            ? 'No errors or warnings found.'
                                            : `${warnings.length} warning(s) found - review recommended.`
                                        }
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-lg font-bold text-red-900 dark:text-red-100">
                                        Configuration Has Errors
                                    </h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {summary.errors} error(s) and {summary.warnings} warning(s) found.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Errors ({errors.length})
                        </h4>
                        <div className="space-y-3">
                            {errors.map((error, index) => (
                                <div key={index} className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                                    <div className="flex">
                                        <div className="flex-1">
                                            <p className="text-sm font-mono text-red-700 dark:text-red-300 mb-1">
                                                {error.field}
                                            </p>
                                            <p className="text-sm text-red-800 dark:text-red-200">
                                                {error.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Warnings */}
                {warnings.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Warnings ({warnings.length})
                        </h4>
                        <div className="space-y-3">
                            {warnings.map((warning, index) => (
                                <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                                    <div className="flex">
                                        <div className="flex-1">
                                            <p className="text-sm font-mono text-yellow-700 dark:text-yellow-300 mb-1">
                                                {warning.field}
                                            </p>
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                {warning.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Export for use in main application
if (typeof window !== 'undefined') {
    window.SchemaValidator = SchemaValidator;
    window.ValidationModal = ValidationModal;
}
