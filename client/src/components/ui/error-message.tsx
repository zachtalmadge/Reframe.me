import { useEffect, useState } from "react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
  "data-testid"?: string;
}

export function ErrorMessage({ message, className = "", "data-testid": testId }: ErrorMessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message) return null;

  return (
    <p
      className={`text-sm text-destructive transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      data-testid={testId}
    >
      {message}
    </p>
  );
}
