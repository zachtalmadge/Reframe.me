import { useState, useEffect } from "react";

interface QuoteCycleState {
  quoteIndex: number;
  isQuoteVisible: boolean;
}

export function useQuoteCycle(
  showQuotes: boolean,
  isLoading: boolean,
  quotesCount: number
): QuoteCycleState {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);

  useEffect(() => {
    if (!showQuotes || !isLoading) return;

    // Track both timer IDs for proper cleanup
    let intervalTimer: NodeJS.Timeout | null = null;
    let innerTimer: NodeJS.Timeout | null = null;

    intervalTimer = setInterval(() => {
      setIsQuoteVisible(false);

      innerTimer = setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotesCount);
        setIsQuoteVisible(true);
      }, 300);
    }, 3000);

    return () => {
      if (intervalTimer) clearInterval(intervalTimer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [showQuotes, isLoading, quotesCount]);

  return { quoteIndex, isQuoteVisible };
}
