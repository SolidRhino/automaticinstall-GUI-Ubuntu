import { ReactNode } from 'react';

interface InfoBoxProps {
  children: ReactNode;
}

/**
 * Info Box Component
 * Blue informational box for help text and notes
 */
export function InfoBox({ children }: InfoBoxProps) {
  return (
    <div
      role="note"
      className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-4 mb-6 rounded"
    >
      <p className="text-sm text-blue-900 dark:text-blue-200">{children}</p>
    </div>
  );
}
