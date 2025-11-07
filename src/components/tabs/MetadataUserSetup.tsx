import { FormInput, FormSelect } from '../forms';
import { AutoinstallConfig } from '../../types/config';
import { validators } from '../../utils/validators';

interface MetadataUserSetupProps {
  config: AutoinstallConfig;
  updateConfig: (key: keyof AutoinstallConfig, value: any) => void;
  onShowPasswordHash: () => void;
}

export function MetadataUserSetup({ config, updateConfig, onShowPasswordHash }: MetadataUserSetupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <div className="sm:col-span-2">
        <label
          htmlFor="identity-password"
          className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2"
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
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-gray-800 h-10 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark px-3 text-sm font-normal"
          />
          <button
            onClick={onShowPasswordHash}
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            title="Generate password hash"
          >
            🔒 Hash
          </button>
        </div>
        <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
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
