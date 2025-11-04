interface ScreenReaderAnnouncementProps {
  message: string;
}

/**
 * Screen Reader Announcement Component
 * Announces messages to screen readers via ARIA live region
 */
export function ScreenReaderAnnouncement({ message }: ScreenReaderAnnouncementProps) {
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
