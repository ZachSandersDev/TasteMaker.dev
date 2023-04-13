import { useEffect, useState } from "react";

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    const mediaMatcher = window.matchMedia(query);

    mediaMatcher.addEventListener("change", listener);
    return () => mediaMatcher.removeEventListener("change", listener);
  }, [query, setMatches]);

  return matches;
} 