interface InlineExampleProps {
  text: string;
  onClick: () => void;
}

/**
 * Inline Example Component
 * Clickable example value that can be inserted into form fields
 */
export function InlineExample({ text, onClick }: InlineExampleProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer"
      title="Click to use this example"
    >
      <span>💡</span>
      <span>{text}</span>
    </button>
  );
}
