import { FormInput } from '../forms';
import { AutoinstallConfig } from '../../types/config';
import { validators } from '../../utils/validators';

interface IdentityTabProps {
  config: AutoinstallConfig;
  updateConfig: (key: keyof AutoinstallConfig, value: any) => void;
  onShowPasswordHash: () => void;
}

export function IdentityTab({ config, updateConfig, onShowPasswordHash }: IdentityTabProps) {
  return (
    <div role="tabpanel" id="identity-panel" aria-labelledby="identity-tab" className="fade-in">
      <h2 className="text-2xl font-semibold text-ubuntu-orange mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
        User Identity
      </h2>

      <FormInput
        label="Hostname"
        id="identity-hostname"
        value={config.hostname}
        onChange={(val) => updateConfig('hostname', val)}
        placeholder="ubuntu-server"
        helpText="System hostname"
        validate={validators.hostname}
      />

      <FormInput
        label="Username"
        id="identity-username"
        value={config.username}
        onChange={(val) => updateConfig('username', val)}
        placeholder="ubuntu"
        autoComplete="username"
        helpText="Primary user account name (lowercase, start with letter)"
        validate={validators.username}
      />

      <div className="mb-5">
        <label
          htmlFor="identity-password"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
        >
          Password
        </label>
        <div className="flex gap-2">
          <input
            type="password"
            id="identity-password"
            value={config.password}
            onChange={(e) => updateConfig('password', e.target.value)}
            placeholder="Enter password or hash"
            autoComplete="new-password"
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20 transition-colors dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={onShowPasswordHash}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
            title="Generate password hash"
          >
            🔒 Hash
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Use the Hash button to generate a secure SHA-512 password hash
        </p>
      </div>

      <FormInput
        label="Real Name"
        id="identity-realname"
        value={config.realname}
        onChange={(val) => updateConfig('realname', val)}
        placeholder="Ubuntu User"
        autoComplete="name"
        helpText="User's full name"
      />
    </div>
  );
}
