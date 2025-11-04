import { useState } from 'react';

interface HelpTooltipProps {
  content: string;
  learnMoreUrl?: string | null;
}

/**
 * Help Tooltip Component
 * Question mark button that shows help text on hover/click
 */
export function HelpTooltip({ content, learnMoreUrl = null }: HelpTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="inline-block relative">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs hover:bg-blue-600 transition-colors"
        aria-label="Help"
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 w-64 p-3 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg text-sm left-0 md:left-auto md:right-0">
          <p className="text-gray-700 dark:text-gray-300">{content}</p>
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2 inline-block"
            >
              Learn more →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
