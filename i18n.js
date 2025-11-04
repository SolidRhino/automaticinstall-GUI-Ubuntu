// Internationalization (i18n) Module
// Multi-language support for the Ubuntu Autoinstall Configuration Builder

const i18n = {
    currentLanguage: 'en',

    translations: {
        en: {
            // Header
            appTitle: 'Ubuntu Autoinstall Configuration Builder',
            appSubtitle: 'Create and customize your Ubuntu autoinstall.yaml configuration',
            darkMode: 'Dark mode',
            lightMode: 'Light mode',

            // Toolbar buttons
            loadTemplate: 'Load Template',
            validateConfig: 'Validate Config',
            compareConfigs: 'Compare Configs',
            previewSystem: 'Preview System',
            exportCloudInit: 'Export to Cloud-Init',
            importSystem: 'Import from System',

            // Tabs
            tabBasic: 'Basic',
            tabIdentity: 'Identity',
            tabNetwork: 'Network',
            tabStorage: 'Storage',
            tabSoftware: 'Software',
            tabSSH: 'SSH',
            tabAdvanced: 'Advanced',

            // Action buttons
            generateYAML: 'Generate YAML',
            downloadYAML: 'Download autoinstall.yaml',
            copyToClipboard: 'Copy to Clipboard',
            loadYAMLFile: 'Load YAML File',
            saveToBookmark: 'Save to Bookmark',
            clearForm: 'Clear Form',

            // Basic tab
            basicTitle: 'Basic Configuration',
            version: 'Version',
            versionHelp: 'Autoinstall schema version (must be 1)',
            locale: 'Locale',
            localeHelp: 'System language and region',
            timezone: 'Timezone',
            timezoneHelp: 'System timezone (e.g., America/New_York, Europe/London)',
            keyboardLayout: 'Keyboard Layout',
            keyboardLayoutHelp: 'Keyboard layout (e.g., us, uk, de)',
            keyboardVariant: 'Keyboard Variant',
            keyboardVariantHelp: 'Optional keyboard variant',
            updates: 'Updates',
            updatesHelp: 'Update policy during installation',
            updatesNone: 'No automatic updates',
            updatesSecurity: 'Security updates only',
            updatesAll: 'All updates',

            // Identity tab
            identityTitle: 'User Identity',
            hostname: 'Hostname',
            hostnameHelp: 'System hostname',
            username: 'Username',
            usernameHelp: 'Primary user account name (lowercase, start with letter)',
            password: 'Password',
            passwordHelp: 'Use the Hash button to generate a secure SHA-512 password hash',
            hashButton: 'Hash',
            realname: 'Real Name',
            realnameHelp: 'User\'s full name',

            // Network tab
            networkTitle: 'Network Configuration',
            networkWizard: 'Network Wizard',
            networkInfo: 'Network configuration uses Netplan format. Leave empty for DHCP on all interfaces. Use the Network Wizard for a guided setup.',
            networkConfig: 'Network Configuration (YAML)',
            networkConfigHelp: 'Netplan v2 configuration in YAML format',
            proxy: 'HTTP Proxy',
            proxyHelp: 'HTTP proxy URI (optional)',

            // Storage tab
            storageTitle: 'Storage Configuration',
            storageWizard: 'Storage Wizard',
            storageInfo: 'Storage configuration defines disk partitioning. Leave empty for default guided partitioning. Use the Storage Wizard for a guided setup.',
            storageConfig: 'Storage Configuration (YAML)',
            storageConfigHelp: 'Storage layout configuration in YAML format',

            // Software tab
            softwareTitle: 'Software Installation',
            packages: 'APT Packages',
            packagesHelp: 'Package names (one per line)',
            snaps: 'Snap Packages',
            snapsHelp: 'Snap packages (YAML format, use --- to separate multiple snaps)',
            kernel: 'Kernel Package',
            kernelHelp: 'Kernel package or flavor (optional)',
            drivers: 'Install proprietary drivers',
            driversHelp: 'Automatically install proprietary hardware drivers',
            codecs: 'Install restricted codecs',
            codecsHelp: 'Install media codecs and plugins',

            // SSH tab
            sshTitle: 'SSH Configuration',
            sshInstallServer: 'Install OpenSSH server',
            sshInstallServerHelp: 'Install and configure OpenSSH server',
            sshAllowPw: 'Allow password authentication',
            sshAllowPwHelp: 'Permit SSH login with password',
            sshAuthorizedKeys: 'Authorized SSH Keys',
            sshAuthorizedKeysHelp: 'SSH public keys (one per line)',

            // Advanced tab
            advancedTitle: 'Advanced Options',
            earlyCommands: 'Early Commands',
            earlyCommandsHelp: 'Commands to run before installation (one per line)',
            lateCommands: 'Late Commands',
            lateCommandsHelp: 'Commands to run after installation (one per line)',
            errorCommands: 'Error Commands',
            errorCommandsHelp: 'Commands to run on installation error (one per line)',
            userData: 'Cloud-init User Data',
            userDataHelp: 'Cloud-init user-data configuration',
            shutdown: 'Shutdown Action',
            shutdownHelp: 'Action to take after installation completes',
            shutdownDefault: 'Default (reboot)',
            shutdownReboot: 'Reboot',
            shutdownPoweroff: 'Power off',
            kernelCrashDumps: 'Enable kernel crash dumps',
            kernelCrashDumpsHelp: 'Enable kdump for kernel crash analysis',
            ubuntuProToken: 'Ubuntu Pro Token',
            ubuntuProTokenHelp: 'Ubuntu Pro subscription token (Base58, starts with \'C\')',

            // Common
            close: 'Close',
            cancel: 'Cancel',
            apply: 'Apply',
            next: 'Next',
            previous: 'Previous',
            download: 'Download',
            copy: 'Copy',
            required: 'required',
        },

        es: {
            // Header
            appTitle: 'Constructor de Configuración de Autoinstalación de Ubuntu',
            appSubtitle: 'Crea y personaliza tu configuración autoinstall.yaml de Ubuntu',
            darkMode: 'Modo oscuro',
            lightMode: 'Modo claro',

            // Toolbar buttons
            loadTemplate: 'Cargar Plantilla',
            validateConfig: 'Validar Configuración',
            compareConfigs: 'Comparar Configuraciones',
            previewSystem: 'Vista Previa del Sistema',
            exportCloudInit: 'Exportar a Cloud-Init',
            importSystem: 'Importar desde Sistema',

            // Tabs
            tabBasic: 'Básico',
            tabIdentity: 'Identidad',
            tabNetwork: 'Red',
            tabStorage: 'Almacenamiento',
            tabSoftware: 'Software',
            tabSSH: 'SSH',
            tabAdvanced: 'Avanzado',

            // Action buttons
            generateYAML: 'Generar YAML',
            downloadYAML: 'Descargar autoinstall.yaml',
            copyToClipboard: 'Copiar al Portapapeles',
            loadYAMLFile: 'Cargar Archivo YAML',
            saveToBookmark: 'Guardar en Marcador',
            clearForm: 'Limpiar Formulario',

            // Basic tab
            basicTitle: 'Configuración Básica',
            version: 'Versión',
            versionHelp: 'Versión del esquema de autoinstalación (debe ser 1)',
            locale: 'Idioma',
            localeHelp: 'Idioma y región del sistema',
            timezone: 'Zona Horaria',
            timezoneHelp: 'Zona horaria del sistema (ej., America/New_York, Europe/Madrid)',
            keyboardLayout: 'Distribución del Teclado',
            keyboardLayoutHelp: 'Distribución del teclado (ej., es, us, uk)',
            keyboardVariant: 'Variante del Teclado',
            keyboardVariantHelp: 'Variante opcional del teclado',
            updates: 'Actualizaciones',
            updatesHelp: 'Política de actualizaciones durante la instalación',
            updatesNone: 'Sin actualizaciones automáticas',
            updatesSecurity: 'Solo actualizaciones de seguridad',
            updatesAll: 'Todas las actualizaciones',

            // Identity tab
            identityTitle: 'Identidad de Usuario',
            hostname: 'Nombre del Host',
            hostnameHelp: 'Nombre del sistema',
            username: 'Nombre de Usuario',
            usernameHelp: 'Nombre de cuenta de usuario principal (minúsculas, comenzar con letra)',
            password: 'Contraseña',
            passwordHelp: 'Use el botón Hash para generar un hash SHA-512 seguro',
            hashButton: 'Hash',
            realname: 'Nombre Real',
            realnameHelp: 'Nombre completo del usuario',

            // Network tab
            networkTitle: 'Configuración de Red',
            networkWizard: 'Asistente de Red',
            networkInfo: 'La configuración de red usa el formato Netplan. Deje vacío para DHCP en todas las interfaces. Use el Asistente de Red para una configuración guiada.',
            networkConfig: 'Configuración de Red (YAML)',
            networkConfigHelp: 'Configuración Netplan v2 en formato YAML',
            proxy: 'Proxy HTTP',
            proxyHelp: 'URI del proxy HTTP (opcional)',

            // Storage tab
            storageTitle: 'Configuración de Almacenamiento',
            storageWizard: 'Asistente de Almacenamiento',
            storageInfo: 'La configuración de almacenamiento define el particionado del disco. Deje vacío para particionado guiado predeterminado. Use el Asistente de Almacenamiento para una configuración guiada.',
            storageConfig: 'Configuración de Almacenamiento (YAML)',
            storageConfigHelp: 'Configuración de diseño de almacenamiento en formato YAML',

            // Software tab
            softwareTitle: 'Instalación de Software',
            packages: 'Paquetes APT',
            packagesHelp: 'Nombres de paquetes (uno por línea)',
            snaps: 'Paquetes Snap',
            snapsHelp: 'Paquetes Snap (formato YAML, use --- para separar múltiples snaps)',
            kernel: 'Paquete del Kernel',
            kernelHelp: 'Paquete o variante del kernel (opcional)',
            drivers: 'Instalar controladores propietarios',
            driversHelp: 'Instalar automáticamente controladores de hardware propietarios',
            codecs: 'Instalar códecs restringidos',
            codecsHelp: 'Instalar códecs multimedia y plugins',

            // SSH tab
            sshTitle: 'Configuración SSH',
            sshInstallServer: 'Instalar servidor OpenSSH',
            sshInstallServerHelp: 'Instalar y configurar el servidor OpenSSH',
            sshAllowPw: 'Permitir autenticación por contraseña',
            sshAllowPwHelp: 'Permitir inicio de sesión SSH con contraseña',
            sshAuthorizedKeys: 'Claves SSH Autorizadas',
            sshAuthorizedKeysHelp: 'Claves públicas SSH (una por línea)',

            // Advanced tab
            advancedTitle: 'Opciones Avanzadas',
            earlyCommands: 'Comandos Tempranos',
            earlyCommandsHelp: 'Comandos a ejecutar antes de la instalación (uno por línea)',
            lateCommands: 'Comandos Tardíos',
            lateCommandsHelp: 'Comandos a ejecutar después de la instalación (uno por línea)',
            errorCommands: 'Comandos de Error',
            errorCommandsHelp: 'Comandos a ejecutar en caso de error de instalación (uno por línea)',
            userData: 'Datos de Usuario de Cloud-init',
            userDataHelp: 'Configuración user-data de cloud-init',
            shutdown: 'Acción de Apagado',
            shutdownHelp: 'Acción a realizar después de completar la instalación',
            shutdownDefault: 'Predeterminado (reiniciar)',
            shutdownReboot: 'Reiniciar',
            shutdownPoweroff: 'Apagar',
            kernelCrashDumps: 'Habilitar volcados de fallos del kernel',
            kernelCrashDumpsHelp: 'Habilitar kdump para análisis de fallos del kernel',
            ubuntuProToken: 'Token de Ubuntu Pro',
            ubuntuProTokenHelp: 'Token de suscripción de Ubuntu Pro (Base58, comienza con \'C\')',

            // Common
            close: 'Cerrar',
            cancel: 'Cancelar',
            apply: 'Aplicar',
            next: 'Siguiente',
            previous: 'Anterior',
            download: 'Descargar',
            copy: 'Copiar',
            required: 'requerido',
        },

        fr: {
            // Header
            appTitle: 'Constructeur de Configuration Auto-installation Ubuntu',
            appSubtitle: 'Créez et personnalisez votre configuration autoinstall.yaml Ubuntu',
            darkMode: 'Mode sombre',
            lightMode: 'Mode clair',

            // Toolbar buttons
            loadTemplate: 'Charger un Modèle',
            validateConfig: 'Valider la Configuration',
            compareConfigs: 'Comparer les Configurations',
            previewSystem: 'Aperçu du Système',
            exportCloudInit: 'Exporter vers Cloud-Init',
            importSystem: 'Importer depuis le Système',

            // Tabs
            tabBasic: 'Base',
            tabIdentity: 'Identité',
            tabNetwork: 'Réseau',
            tabStorage: 'Stockage',
            tabSoftware: 'Logiciels',
            tabSSH: 'SSH',
            tabAdvanced: 'Avancé',

            // Action buttons
            generateYAML: 'Générer YAML',
            downloadYAML: 'Télécharger autoinstall.yaml',
            copyToClipboard: 'Copier dans le Presse-papiers',
            loadYAMLFile: 'Charger un Fichier YAML',
            saveToBookmark: 'Enregistrer dans un Signet',
            clearForm: 'Effacer le Formulaire',

            // Basic tab
            basicTitle: 'Configuration de Base',
            version: 'Version',
            versionHelp: 'Version du schéma d\'auto-installation (doit être 1)',
            locale: 'Langue',
            localeHelp: 'Langue et région du système',
            timezone: 'Fuseau Horaire',
            timezoneHelp: 'Fuseau horaire du système (ex., Europe/Paris, America/New_York)',
            keyboardLayout: 'Disposition du Clavier',
            keyboardLayoutHelp: 'Disposition du clavier (ex., fr, us, uk)',
            keyboardVariant: 'Variante du Clavier',
            keyboardVariantHelp: 'Variante facultative du clavier',
            updates: 'Mises à Jour',
            updatesHelp: 'Politique de mise à jour pendant l\'installation',
            updatesNone: 'Aucune mise à jour automatique',
            updatesSecurity: 'Mises à jour de sécurité uniquement',
            updatesAll: 'Toutes les mises à jour',

            // Identity tab
            identityTitle: 'Identité Utilisateur',
            hostname: 'Nom d\'Hôte',
            hostnameHelp: 'Nom du système',
            username: 'Nom d\'Utilisateur',
            usernameHelp: 'Nom du compte utilisateur principal (minuscules, commencer par une lettre)',
            password: 'Mot de Passe',
            passwordHelp: 'Utilisez le bouton Hash pour générer un hash SHA-512 sécurisé',
            hashButton: 'Hash',
            realname: 'Nom Réel',
            realnameHelp: 'Nom complet de l\'utilisateur',

            // Network tab
            networkTitle: 'Configuration Réseau',
            networkWizard: 'Assistant Réseau',
            networkInfo: 'La configuration réseau utilise le format Netplan. Laissez vide pour DHCP sur toutes les interfaces. Utilisez l\'Assistant Réseau pour une configuration guidée.',
            networkConfig: 'Configuration Réseau (YAML)',
            networkConfigHelp: 'Configuration Netplan v2 au format YAML',
            proxy: 'Proxy HTTP',
            proxyHelp: 'URI du proxy HTTP (facultatif)',

            // Storage tab
            storageTitle: 'Configuration du Stockage',
            storageWizard: 'Assistant de Stockage',
            storageInfo: 'La configuration de stockage définit le partitionnement du disque. Laissez vide pour le partitionnement guidé par défaut. Utilisez l\'Assistant de Stockage pour une configuration guidée.',
            storageConfig: 'Configuration du Stockage (YAML)',
            storageConfigHelp: 'Configuration de la disposition du stockage au format YAML',

            // Software tab
            softwareTitle: 'Installation de Logiciels',
            packages: 'Paquets APT',
            packagesHelp: 'Noms des paquets (un par ligne)',
            snaps: 'Paquets Snap',
            snapsHelp: 'Paquets Snap (format YAML, utilisez --- pour séparer plusieurs snaps)',
            kernel: 'Paquet du Noyau',
            kernelHelp: 'Paquet ou variante du noyau (facultatif)',
            drivers: 'Installer les pilotes propriétaires',
            driversHelp: 'Installer automatiquement les pilotes matériels propriétaires',
            codecs: 'Installer les codecs restreints',
            codecsHelp: 'Installer les codecs multimédias et plugins',

            // SSH tab
            sshTitle: 'Configuration SSH',
            sshInstallServer: 'Installer le serveur OpenSSH',
            sshInstallServerHelp: 'Installer et configurer le serveur OpenSSH',
            sshAllowPw: 'Autoriser l\'authentification par mot de passe',
            sshAllowPwHelp: 'Permettre la connexion SSH avec mot de passe',
            sshAuthorizedKeys: 'Clés SSH Autorisées',
            sshAuthorizedKeysHelp: 'Clés publiques SSH (une par ligne)',

            // Advanced tab
            advancedTitle: 'Options Avancées',
            earlyCommands: 'Commandes Précoces',
            earlyCommandsHelp: 'Commandes à exécuter avant l\'installation (une par ligne)',
            lateCommands: 'Commandes Tardives',
            lateCommandsHelp: 'Commandes à exécuter après l\'installation (une par ligne)',
            errorCommands: 'Commandes d\'Erreur',
            errorCommandsHelp: 'Commandes à exécuter en cas d\'erreur d\'installation (une par ligne)',
            userData: 'Données Utilisateur Cloud-init',
            userDataHelp: 'Configuration user-data de cloud-init',
            shutdown: 'Action d\'Arrêt',
            shutdownHelp: 'Action à effectuer après l\'installation',
            shutdownDefault: 'Par défaut (redémarrer)',
            shutdownReboot: 'Redémarrer',
            shutdownPoweroff: 'Éteindre',
            kernelCrashDumps: 'Activer les vidages de plantage du noyau',
            kernelCrashDumpsHelp: 'Activer kdump pour l\'analyse des plantages du noyau',
            ubuntuProToken: 'Jeton Ubuntu Pro',
            ubuntuProTokenHelp: 'Jeton d\'abonnement Ubuntu Pro (Base58, commence par \'C\')',

            // Common
            close: 'Fermer',
            cancel: 'Annuler',
            apply: 'Appliquer',
            next: 'Suivant',
            previous: 'Précédent',
            download: 'Télécharger',
            copy: 'Copier',
            required: 'requis',
        },

        de: {
            // Header
            appTitle: 'Ubuntu Autoinstall Konfigurations-Builder',
            appSubtitle: 'Erstellen und passen Sie Ihre Ubuntu autoinstall.yaml-Konfiguration an',
            darkMode: 'Dunkler Modus',
            lightMode: 'Heller Modus',

            // Toolbar buttons
            loadTemplate: 'Vorlage Laden',
            validateConfig: 'Konfiguration Validieren',
            compareConfigs: 'Konfigurationen Vergleichen',
            previewSystem: 'System-Vorschau',
            exportCloudInit: 'Nach Cloud-Init Exportieren',
            importSystem: 'Von System Importieren',

            // Tabs
            tabBasic: 'Basis',
            tabIdentity: 'Identität',
            tabNetwork: 'Netzwerk',
            tabStorage: 'Speicher',
            tabSoftware: 'Software',
            tabSSH: 'SSH',
            tabAdvanced: 'Erweitert',

            // Action buttons
            generateYAML: 'YAML Generieren',
            downloadYAML: 'autoinstall.yaml Herunterladen',
            copyToClipboard: 'In Zwischenablage Kopieren',
            loadYAMLFile: 'YAML-Datei Laden',
            saveToBookmark: 'Als Lesezeichen Speichern',
            clearForm: 'Formular Löschen',

            // Basic tab
            basicTitle: 'Basiskonfiguration',
            version: 'Version',
            versionHelp: 'Autoinstall-Schema-Version (muss 1 sein)',
            locale: 'Gebietsschema',
            localeHelp: 'Systemsprache und Region',
            timezone: 'Zeitzone',
            timezoneHelp: 'System-Zeitzone (z.B., Europe/Berlin, America/New_York)',
            keyboardLayout: 'Tastaturlayout',
            keyboardLayoutHelp: 'Tastaturlayout (z.B., de, us, uk)',
            keyboardVariant: 'Tastaturvariante',
            keyboardVariantHelp: 'Optionale Tastaturvariante',
            updates: 'Aktualisierungen',
            updatesHelp: 'Update-Richtlinie während der Installation',
            updatesNone: 'Keine automatischen Updates',
            updatesSecurity: 'Nur Sicherheitsupdates',
            updatesAll: 'Alle Updates',

            // Identity tab
            identityTitle: 'Benutzeridentität',
            hostname: 'Hostname',
            hostnameHelp: 'System-Hostname',
            username: 'Benutzername',
            usernameHelp: 'Primärer Benutzerkonto-Name (Kleinbuchstaben, mit Buchstaben beginnen)',
            password: 'Passwort',
            passwordHelp: 'Verwenden Sie die Hash-Schaltfläche, um einen sicheren SHA-512-Hash zu generieren',
            hashButton: 'Hash',
            realname: 'Echter Name',
            realnameHelp: 'Vollständiger Name des Benutzers',

            // Network tab
            networkTitle: 'Netzwerkkonfiguration',
            networkWizard: 'Netzwerk-Assistent',
            networkInfo: 'Die Netzwerkkonfiguration verwendet das Netplan-Format. Leer lassen für DHCP auf allen Schnittstellen. Verwenden Sie den Netzwerk-Assistenten für eine geführte Einrichtung.',
            networkConfig: 'Netzwerkkonfiguration (YAML)',
            networkConfigHelp: 'Netplan v2-Konfiguration im YAML-Format',
            proxy: 'HTTP-Proxy',
            proxyHelp: 'HTTP-Proxy-URI (optional)',

            // Storage tab
            storageTitle: 'Speicherkonfiguration',
            storageWizard: 'Speicher-Assistent',
            storageInfo: 'Die Speicherkonfiguration definiert die Festplattenpartitionierung. Leer lassen für standardmäßige geführte Partitionierung. Verwenden Sie den Speicher-Assistenten für eine geführte Einrichtung.',
            storageConfig: 'Speicherkonfiguration (YAML)',
            storageConfigHelp: 'Speicher-Layout-Konfiguration im YAML-Format',

            // Software tab
            softwareTitle: 'Softwareinstallation',
            packages: 'APT-Pakete',
            packagesHelp: 'Paketnamen (einer pro Zeile)',
            snaps: 'Snap-Pakete',
            snapsHelp: 'Snap-Pakete (YAML-Format, verwenden Sie --- zum Trennen mehrerer Snaps)',
            kernel: 'Kernel-Paket',
            kernelHelp: 'Kernel-Paket oder -Variante (optional)',
            drivers: 'Proprietäre Treiber installieren',
            driversHelp: 'Automatisch proprietäre Hardware-Treiber installieren',
            codecs: 'Eingeschränkte Codecs installieren',
            codecsHelp: 'Medien-Codecs und Plugins installieren',

            // SSH tab
            sshTitle: 'SSH-Konfiguration',
            sshInstallServer: 'OpenSSH-Server installieren',
            sshInstallServerHelp: 'OpenSSH-Server installieren und konfigurieren',
            sshAllowPw: 'Passwort-Authentifizierung erlauben',
            sshAllowPwHelp: 'SSH-Anmeldung mit Passwort erlauben',
            sshAuthorizedKeys: 'Autorisierte SSH-Schlüssel',
            sshAuthorizedKeysHelp: 'Öffentliche SSH-Schlüssel (einer pro Zeile)',

            // Advanced tab
            advancedTitle: 'Erweiterte Optionen',
            earlyCommands: 'Frühe Befehle',
            earlyCommandsHelp: 'Befehle, die vor der Installation ausgeführt werden (einer pro Zeile)',
            lateCommands: 'Späte Befehle',
            lateCommandsHelp: 'Befehle, die nach der Installation ausgeführt werden (einer pro Zeile)',
            errorCommands: 'Fehlerbefehle',
            errorCommandsHelp: 'Befehle, die bei Installationsfehlern ausgeführt werden (einer pro Zeile)',
            userData: 'Cloud-init Benutzerdaten',
            userDataHelp: 'Cloud-init user-data-Konfiguration',
            shutdown: 'Herunterfahren-Aktion',
            shutdownHelp: 'Aktion nach Abschluss der Installation',
            shutdownDefault: 'Standard (neu starten)',
            shutdownReboot: 'Neu starten',
            shutdownPoweroff: 'Ausschalten',
            kernelCrashDumps: 'Kernel-Crash-Dumps aktivieren',
            kernelCrashDumpsHelp: 'kdump für Kernel-Crash-Analyse aktivieren',
            ubuntuProToken: 'Ubuntu Pro Token',
            ubuntuProTokenHelp: 'Ubuntu Pro Abonnement-Token (Base58, beginnt mit \'C\')',

            // Common
            close: 'Schließen',
            cancel: 'Abbrechen',
            apply: 'Anwenden',
            next: 'Weiter',
            previous: 'Zurück',
            download: 'Herunterladen',
            copy: 'Kopieren',
            required: 'erforderlich',
        },

        nl: {
            // Header
            appTitle: 'Ubuntu Autoinstall Configuratiebouwer',
            appSubtitle: 'Maak en pas uw Ubuntu autoinstall.yaml configuratie aan',
            darkMode: 'Donkere modus',
            lightMode: 'Lichte modus',

            // Toolbar buttons
            loadTemplate: 'Sjabloon Laden',
            validateConfig: 'Configuratie Valideren',
            compareConfigs: 'Configuraties Vergelijken',
            previewSystem: 'Systeemvoorbeeld',
            exportCloudInit: 'Exporteren naar Cloud-Init',
            importSystem: 'Importeren van Systeem',

            // Tabs
            tabBasic: 'Basis',
            tabIdentity: 'Identiteit',
            tabNetwork: 'Netwerk',
            tabStorage: 'Opslag',
            tabSoftware: 'Software',
            tabSSH: 'SSH',
            tabAdvanced: 'Geavanceerd',

            // Action buttons
            generateYAML: 'YAML Genereren',
            downloadYAML: 'autoinstall.yaml Downloaden',
            copyToClipboard: 'Kopiëren naar Klembord',
            loadYAMLFile: 'YAML-bestand Laden',
            saveToBookmark: 'Opslaan als Bladwijzer',
            clearForm: 'Formulier Wissen',

            // Basic tab
            basicTitle: 'Basisconfiguratie',
            version: 'Versie',
            versionHelp: 'Autoinstall schema versie (moet 1 zijn)',
            locale: 'Taalinstelling',
            localeHelp: 'Systeemtaal en regio',
            timezone: 'Tijdzone',
            timezoneHelp: 'Systeem tijdzone (bijv., Europe/Amsterdam, America/New_York)',
            keyboardLayout: 'Toetsenbordindeling',
            keyboardLayoutHelp: 'Toetsenbordindeling (bijv., nl, us, uk)',
            keyboardVariant: 'Toetsenbordvariant',
            keyboardVariantHelp: 'Optionele toetsenbordvariant',
            updates: 'Updates',
            updatesHelp: 'Update-beleid tijdens installatie',
            updatesNone: 'Geen automatische updates',
            updatesSecurity: 'Alleen beveiligingsupdates',
            updatesAll: 'Alle updates',

            // Identity tab
            identityTitle: 'Gebruikersidentiteit',
            hostname: 'Hostnaam',
            hostnameHelp: 'Systeem hostnaam',
            username: 'Gebruikersnaam',
            usernameHelp: 'Primaire gebruikersaccountnaam (kleine letters, begin met letter)',
            password: 'Wachtwoord',
            passwordHelp: 'Gebruik de Hash-knop om een veilige SHA-512 hash te genereren',
            hashButton: 'Hash',
            realname: 'Echte Naam',
            realnameHelp: 'Volledige naam van de gebruiker',

            // Network tab
            networkTitle: 'Netwerkconfiguratie',
            networkWizard: 'Netwerkassistent',
            networkInfo: 'Netwerkconfiguratie gebruikt Netplan-formaat. Laat leeg voor DHCP op alle interfaces. Gebruik de Netwerkassistent voor begeleide configuratie.',
            networkConfig: 'Netwerkconfiguratie (YAML)',
            networkConfigHelp: 'Netplan v2 configuratie in YAML-formaat',
            proxy: 'HTTP-proxy',
            proxyHelp: 'HTTP-proxy URI (optioneel)',

            // Storage tab
            storageTitle: 'Opslagconfiguratie',
            storageWizard: 'Opslagassistent',
            storageInfo: 'Opslagconfiguratie definieert schijfpartitionering. Laat leeg voor standaard begeleide partitionering. Gebruik de Opslagassistent voor begeleide configuratie.',
            storageConfig: 'Opslagconfiguratie (YAML)',
            storageConfigHelp: 'Opslagindelingsconfiguratie in YAML-formaat',

            // Software tab
            softwareTitle: 'Software-installatie',
            packages: 'APT-pakketten',
            packagesHelp: 'Pakketnamen (één per regel)',
            snaps: 'Snap-pakketten',
            snapsHelp: 'Snap-pakketten (YAML-formaat, gebruik --- om meerdere snaps te scheiden)',
            kernel: 'Kernel-pakket',
            kernelHelp: 'Kernel-pakket of variant (optioneel)',
            drivers: 'Propriëtaire stuurprogramma\'s installeren',
            driversHelp: 'Automatisch propriëtaire hardwarestuurprogramma\'s installeren',
            codecs: 'Beperkte codecs installeren',
            codecsHelp: 'Media-codecs en plug-ins installeren',

            // SSH tab
            sshTitle: 'SSH-configuratie',
            sshInstallServer: 'OpenSSH-server installeren',
            sshInstallServerHelp: 'OpenSSH-server installeren en configureren',
            sshAllowPw: 'Wachtwoordauthenticatie toestaan',
            sshAllowPwHelp: 'SSH-aanmelding met wachtwoord toestaan',
            sshAuthorizedKeys: 'Geautoriseerde SSH-sleutels',
            sshAuthorizedKeysHelp: 'Openbare SSH-sleutels (één per regel)',

            // Advanced tab
            advancedTitle: 'Geavanceerde Opties',
            earlyCommands: 'Vroege Opdrachten',
            earlyCommandsHelp: 'Opdrachten om uit te voeren vóór installatie (één per regel)',
            lateCommands: 'Late Opdrachten',
            lateCommandsHelp: 'Opdrachten om uit te voeren na installatie (één per regel)',
            errorCommands: 'Foutopdrachten',
            errorCommandsHelp: 'Opdrachten om uit te voeren bij installatiefouten (één per regel)',
            userData: 'Cloud-init Gebruikersgegevens',
            userDataHelp: 'Cloud-init user-data configuratie',
            shutdown: 'Afsluitactie',
            shutdownHelp: 'Actie om uit te voeren na voltooiing van installatie',
            shutdownDefault: 'Standaard (herstarten)',
            shutdownReboot: 'Herstarten',
            shutdownPoweroff: 'Uitschakelen',
            kernelCrashDumps: 'Kernel-crashdumps inschakelen',
            kernelCrashDumpsHelp: 'kdump inschakelen voor kernel-crashanalyse',
            ubuntuProToken: 'Ubuntu Pro Token',
            ubuntuProTokenHelp: 'Ubuntu Pro abonnementstoken (Base58, begint met \'C\')',

            // Common
            close: 'Sluiten',
            cancel: 'Annuleren',
            apply: 'Toepassen',
            next: 'Volgende',
            previous: 'Vorige',
            download: 'Downloaden',
            copy: 'Kopiëren',
            required: 'verplicht',
        }
    },

    /**
     * Initialize i18n with saved or browser language
     */
    init() {
        const savedLang = localStorage.getItem('language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        } else {
            // Detect browser language
            const browserLang = navigator.language.split('-')[0];
            if (this.translations[browserLang]) {
                this.currentLanguage = browserLang;
            }
        }
    },

    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @returns {string} - Translated text
     */
    t(key) {
        return this.translations[this.currentLanguage][key] || this.translations.en[key] || key;
    },

    /**
     * Set language
     * @param {string} lang - Language code
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            return true;
        }
        return false;
    },

    /**
     * Get current language
     * @returns {string} - Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    },

    /**
     * Get available languages
     * @returns {Array} - Array of language objects
     */
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
        ];
    }
};

// Initialize on load
i18n.init();

// Export to window
window.i18n = i18n;
