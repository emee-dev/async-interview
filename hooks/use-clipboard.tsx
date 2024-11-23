import { useState, useEffect } from "react";

function useCopyToClipboard(timeout: number = 2000) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      setCopied(false);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [copied, timeout]);

  return { copied, copyToClipboard };
}

export default useCopyToClipboard;
