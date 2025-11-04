import { FormInput, FormTextarea, FormCheckbox } from '../forms';

interface SoftwareTabProps {
  config: {
    packages: string;
    snaps: string;
    kernel: string;
    drivers: boolean;
    codecs: boolean;
    [key: string]: any;
  };
  updateConfig: (key: string, value: any) => void;
}

export function SoftwareTab({ config, updateConfig }: SoftwareTabProps) {
  return (
    <div role="tabpanel" id="software-panel" aria-labelledby="software-tab" className="fade-in">
      <h2 className="text-2xl font-semibold text-ubuntu-orange mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
        Software Installation
      </h2>

      <FormTextarea
        label="APT Packages"
        id="packages"
        value={config.packages}
        onChange={(val) => updateConfig('packages', val)}
        placeholder="curl&#10;wget&#10;git&#10;vim"
        rows={6}
        helpText="Package names (one per line)"
      />

      <FormTextarea
        label="Snap Packages"
        id="snaps"
        value={config.snaps}
        onChange={(val) => updateConfig('snaps', val)}
        placeholder="name: lxd&#10;channel: latest/stable&#10;---&#10;name: docker&#10;classic: true"
        rows={6}
        helpText="Snap packages (YAML format, use --- to separate multiple snaps)"
      />

      <FormInput
        label="Kernel Package"
        id="kernel"
        value={config.kernel}
        onChange={(val) => updateConfig('kernel', val)}
        placeholder="linux-generic-hwe-22.04"
        helpText="Kernel package or flavor (optional)"
      />

      <FormCheckbox
        label="Install proprietary drivers"
        id="drivers"
        checked={config.drivers}
        onChange={(val) => updateConfig('drivers', val)}
        helpText="Automatically install proprietary hardware drivers"
      />

      <FormCheckbox
        label="Install restricted codecs"
        id="codecs"
        checked={config.codecs}
        onChange={(val) => updateConfig('codecs', val)}
        helpText="Install media codecs and plugins"
      />
    </div>
  );
}
