// This file contains the additional components for wizards and validation
// To be integrated into index.html

// ============================================
// SCHEMA VALIDATION
// ============================================

const autoinstallSchema = {
    version: { type: 'number', required: true, min: 1, max: 1 },
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
            hostname: { type: 'string', pattern: /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])$/ },
            username: { type: 'string', pattern: /^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/, required: true },
            password: { type: 'string', required: true },
            realname: { type: 'string' }
        }
    },
    ssh: {
        type: 'object',
        properties: {
            'install-server': { type: 'boolean' },
            'allow-pw': { type: 'boolean' },
            'authorized-keys': { type: 'array', items: { type: 'string' } }
        }
    },
    network: { type: 'object' },
    storage: { type: 'object' },
    packages: { type: 'array', items: { type: 'string' } },
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
    }
};

function validateAgainstSchema(config) {
    const errors = [];
    const warnings = [];

    // Check for required version
    if (!config.autoinstall) {
        errors.push({ field: 'root', message: 'Missing "autoinstall" root key' });
        return { valid: false, errors, warnings };
    }

    const ai = config.autoinstall;

    // Validate version
    if (!ai.version) {
        errors.push({ field: 'version', message: 'Version is required and must be 1' });
    } else if (ai.version !== 1) {
        errors.push({ field: 'version', message: 'Version must be 1' });
    }

    // Validate identity if present
    if (ai.identity) {
        if (ai.identity.username && !/^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/.test(ai.identity.username)) {
            errors.push({ field: 'identity.username', message: 'Invalid username format' });
        }
        if (ai.identity.hostname && !/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])$/.test(ai.identity.hostname)) {
            errors.push({ field: 'identity.hostname', message: 'Invalid hostname format' });
        }
        if (!ai.identity.password) {
            warnings.push({ field: 'identity.password', message: 'No password set for user' });
        }
    }

    // Validate packages
    if (ai.packages && !Array.isArray(ai.packages)) {
        errors.push({ field: 'packages', message: 'Packages must be an array' });
    }

    // Validate snaps
    if (ai.snaps) {
        if (!Array.isArray(ai.snaps)) {
            errors.push({ field: 'snaps', message: 'Snaps must be an array' });
        } else {
            ai.snaps.forEach((snap, index) => {
                if (!snap.name) {
                    errors.push({ field: `snaps[${index}]`, message: 'Snap must have a name' });
                }
            });
        }
    }

    // Check for common issues
    if (!ai.ssh || !ai.ssh['install-server']) {
        warnings.push({ field: 'ssh', message: 'SSH server not configured - you may not be able to access the system remotely' });
    }

    if (!ai.network) {
        warnings.push({ field: 'network', message: 'Network not configured - will use DHCP on all interfaces' });
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

// ============================================
// DIFF TOOL
// ============================================

function computeDiff(config1, config2) {
    const diffs = [];

    function compareObjects(obj1, obj2, path = '') {
        const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

        keys.forEach(key => {
            const fullPath = path ? `${path}.${key}` : key;
            const val1 = obj1?.[key];
            const val2 = obj2?.[key];

            if (val1 === undefined && val2 !== undefined) {
                diffs.push({ type: 'added', path: fullPath, value: val2 });
            } else if (val1 !== undefined && val2 === undefined) {
                diffs.push({ type: 'removed', path: fullPath, value: val1 });
            } else if (typeof val1 === 'object' && typeof val2 === 'object') {
                if (Array.isArray(val1) && Array.isArray(val2)) {
                    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                        diffs.push({ type: 'modified', path: fullPath, oldValue: val1, newValue: val2 });
                    }
                } else {
                    compareObjects(val1, val2, fullPath);
                }
            } else if (val1 !== val2) {
                diffs.push({ type: 'modified', path: fullPath, oldValue: val1, newValue: val2 });
            }
        });
    }

    compareObjects(config1, config2);
    return diffs;
}

// ============================================
// STORAGE WIZARD DATA
// ============================================

const storagePresets = {
    simple: {
        name: 'Simple (Entire Disk)',
        description: 'Use entire disk with default partitioning',
        config: {
            layout: { name: 'direct' }
        }
    },
    lvm: {
        name: 'LVM (Logical Volume Manager)',
        description: 'Flexible volume management for easy resizing',
        config: {
            layout: { name: 'lvm' }
        }
    },
    custom: {
        name: 'Custom Partitions',
        description: 'Define your own partition layout',
        config: null // Will be built by wizard
    }
};

// ============================================
// NETWORK WIZARD DATA
// ============================================

const networkPresets = {
    dhcp: {
        name: 'DHCP (Automatic)',
        description: 'Automatically obtain IP address',
        generate: (interfaceName) => ({
            version: 2,
            ethernets: {
                [interfaceName]: {
                    dhcp4: true,
                    dhcp6: false
                }
            }
        })
    },
    static: {
        name: 'Static IP',
        description: 'Manually configure IP address',
        generate: (interfaceName, ip, gateway, dns) => ({
            version: 2,
            ethernets: {
                [interfaceName]: {
                    addresses: [ip],
                    gateway4: gateway,
                    nameservers: {
                        addresses: dns
                    }
                }
            }
        })
    }
};
