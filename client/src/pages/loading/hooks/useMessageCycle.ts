import { useState, useEffect } from "react";

interface MessageCycleState {
  messageIndex: number;
  isMessageVisible: boolean;
  showQuotes: boolean;
}

export function useMessageCycle(
  isLoading: boolean,
  messages: string[]
): MessageCycleState {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [showQuotes, setShowQuotes] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    if (messageIndex >= messages.length - 1) {
      setShowQuotes(true);
      return;
    }

    // Track both timers for proper cleanup
    let outerTimer: NodeJS.Timeout | null = null;
    let innerTimer: NodeJS.Timeout | null = null;

    outerTimer = setTimeout(() => {
      setIsMessageVisible(false);

      innerTimer = setTimeout(() => {
        setMessageIndex((prev) => prev + 1);
        setIsMessageVisible(true);
      }, 300);
    }, 2000);

    return () => {
      if (outerTimer) clearTimeout(outerTimer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [isLoading, messageIndex, messages.length]);

  return { messageIndex, isMessageVisible, showQuotes };
}
