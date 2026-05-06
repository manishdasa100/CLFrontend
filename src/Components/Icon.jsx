// Shared Icon component used across pages
import React from "react";

const PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  filter: <path d="M3 6h18M6 12h12M10 18h4" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  play: <path d="M6 4l14 8-14 8V4z" fill="currentColor" stroke="none" />,
  dice: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1" fill="currentColor" /><circle cx="16" cy="16" r="1" fill="currentColor" /><circle cx="16" cy="8" r="1" fill="currentColor" /><circle cx="8" cy="16" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
  fire: <path d="M12 2s4 4 4 8c0 2-1 3-2 3s-1-1-1-2c0 0-2 2-2 5 0 2 1 4 3 4s4-2 4-5c0-4-3-7-6-13z" fill="currentColor" stroke="none" />,
  star: <path d="m12 2 3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />,
  check: <path d="m5 12 5 5 9-11" />,
  code: <><path d="m8 6-6 6 6 6M16 6l6 6-6 6" /></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3z" />,
  bookmarkFill: <path d="M6 3h12v18l-6-4-6 4V3z" fill="currentColor" />,
  heart: <path d="M12 20s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 9c0 6.5-7 11-7 11z" />,
  heartFill: <path d="M12 20s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 9c0 6.5-7 11-7 11z" fill="currentColor" />,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18M10.58 10.58a3 3 0 0 0 4.24 4.24M9.88 4.24A9.6 9.6 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-3.17 4.08M6.17 6.17C3.47 7.95 2 12 2 12s3.5 8 10 8c1.56 0 3-.36 4.3-.93" /></>,
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7" />,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  sparkle: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>,
  reset: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />,
  dot: <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />,
  book: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
};

export default function Icon({ name, size = 16, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
