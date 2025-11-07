import { useState, ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: string | null;
  helpText?: string | null;
}

/**
 * Collapsible Section Component
 * Accordion-style collapsible container with optional icon and help text
 */
export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  icon = null,
  helpText = null
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details className="flex flex-col rounded border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 group" open={isOpen}>
      <summary
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex cursor-pointer list-none items-center justify-between gap-4 py-3"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="material-symbols-outlined text-primary">{icon}</span>}
          <p className="text-base font-medium text-text-light dark:text-text-dark">{title}</p>
        </div>
        <span className="material-symbols-outlined text-text-light dark:text-text-muted-dark group-open:rotate-180 transition-transform">
          expand_more
        </span>
      </summary>
      <div className="border-t border-border-light dark:border-border-dark py-4">
        {children}
      </div>
    </details>
  );
}
