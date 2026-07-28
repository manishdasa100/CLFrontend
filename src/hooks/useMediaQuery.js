import { useState, useEffect } from "react";

// Subscribes to a media query from JS. Only reach for this when the layout change
// is structural rather than stylistic — CSS should handle anything that's purely
// a matter of appearance. The problem page uses it because narrow screens show one
// panel at a time, and "which panel" is state that CSS can't hold.
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches); // query may have changed between render and effect
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
