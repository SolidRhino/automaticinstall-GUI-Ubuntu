import { FormCheckbox, FormTextarea } from '../forms';
import { AutoinstallConfig } from '../../types/config';
import { validators } from '../../utils/validators';

interface SSHTabProps {
  config: AutoinstallConfig;
  updateConfig: (key: keyof AutoinstallConfig, value: any) => void;
}

export function SSHTab({ config, updateConfig }: SSHTabProps) {
  return (
    <div role="tabpanel" id="ssh-panel" aria-labelledby="ssh-tab" className="fade-in">
      <h2 className="text-2xl font-semibold text-ubuntu-orange mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
        SSH Configuration
      </h2>

      <FormCheckbox
        label="Install OpenSSH server"
        id="ssh-install-server"
        checked={config.sshInstallServer}
        onChange={(val) => updateConfig('sshInstallServer', val)}
        helpText="Install and configure OpenSSH server"
      />

      <FormCheckbox
        label="Allow password authentication"
        id="ssh-allow-pw"
        checked={config.sshAllowPw}
        onChange={(val) => updateConfig('sshAllowPw', val)}
        helpText="Permit SSH login with password"
      />

      <FormTextarea
        label="Authorized SSH Keys"
        id="ssh-authorized-keys"
        value={config.sshAuthorizedKeys}
        onChange={(val) => updateConfig('sshAuthorizedKeys', val)}
        placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ..."
        rows={4}
        helpText="SSH public keys (one per line)"
        validate={validators.sshKey}
      />
    </div>
  );
}
