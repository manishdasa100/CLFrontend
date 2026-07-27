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
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  dot: <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />,
  book: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  x:         <path d="M6 6l12 12M18 6 6 18" />,
  menu:      <path d="M4 6h16M4 12h16M4 18h16" />,
  edit:      <><path d="M14 3l7 7-11 11H3v-7L14 3z" /><path d="m12 5 7 7" /></>,
  pin:       <><path d="M12 22s8-6.5 8-13a8 8 0 1 0-16 0c0 6.5 8 13 8 13z" /><circle cx="12" cy="9" r="2.5" /></>,
  pin2:      <><path d="M9 4h6l-1 6 3 3v2H7v-2l3-3-1-6z" /><path d="M12 15v5" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></>,
  graduation:<><path d="M2 9l10-4 10 4-10 4L2 9z" /><path d="M6 11v4c0 1.5 3 3 6 3s6-1.5 6-3v-4" /></>,
  target:    <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /></>,
  list:      <><path d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></>,
  medal:     <><circle cx="12" cy="15" r="6" /><path d="M9 9 6.5 3M15 9 17.5 3M9.5 3h5" /></>,
  camera:    <><path d="M4 8a2 2 0 0 1 2-2h1.5l1-2h7l1 2H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z" /><circle cx="12" cy="12.5" r="3.2" /></>,
  globe:     <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  save:      <><path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" /><path d="M8 4v5h7M8 21v-7h8v7" /></>,
  warn:      <><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4M12 17h.01" /></>,
  github:    <path d="M12 1.5A10.5 10.5 0 0 0 1.5 12c0 4.65 3.02 8.59 7.2 9.99.53.1.72-.23.72-.5v-1.8c-2.93.64-3.55-1.41-3.55-1.41-.48-1.22-1.17-1.55-1.17-1.55-.96-.66.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.41-2.34-.27-4.8-1.17-4.8-5.21 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.8 0 0 .88-.28 2.88 1.08a9.97 9.97 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.46.21 2.53.1 2.8.67.74 1.08 1.68 1.08 2.83 0 4.05-2.46 4.94-4.81 5.2.38.33.71.97.71 1.95v2.9c0 .28.19.61.72.5A10.51 10.51 0 0 0 22.5 12 10.5 10.5 0 0 0 12 1.5z" fill="currentColor" stroke="none" />,
  linkedin:  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" fill="currentColor" stroke="none" />,
  twitter:   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.677l7.73-8.835L1.25 2.25h6.83l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" fill="currentColor" stroke="none" />,
};

export default function Icon({ name, size = 16, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
