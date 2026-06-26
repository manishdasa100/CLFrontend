/* ────────────────────────────────────────────────────────────────
   <Badge> — hexagonal achievement medal with ribbon banner
   props:
     imageUrl    — illustration shown inside the hexagon
     name        — short label shown on the ribbon (replaces "10"/"50")
     description — copy revealed in the hover tooltip
   The accent (frame + ribbon hue) is extracted from the image's
   dominant saturated color. If extraction fails (CORS, etc.) it
   falls back to a deterministic pick from a curated palette.
   ──────────────────────────────────────────────────────────────── */
import React from "react";

const BADGE_FALLBACK_PALETTE = [
  '#F08A4B', // amber
  '#7FB3D5', // ice blue
  '#9A7FD1', // lavender
  '#6EBE8F', // jade
  '#E07A8B', // rose
  '#E0C460', // gold
  '#5DA5C5', // ocean
  '#C97FB0', // orchid
];

/* deterministic palette pick from a string (so the same name always
   maps to the same color when extraction fails) */
function badgeHashPick(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return BADGE_FALLBACK_PALETTE[Math.abs(h) % BADGE_FALLBACK_PALETTE.length];
}

/* simple HSL -> RGB hex helper for tinting */
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(c * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/* dominant-saturated-color extraction
   - draws image into a 48x48 canvas
   - buckets pixels by hue (24 bins), weighted by saturation*alpha
   - returns the modal hue rendered at a pleasant lightness
   - returns null if canvas is tainted (cross-origin) */
function extractDominantColor(img) {
  try {
    const W = 48, H = 48;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const { data } = ctx.getImageData(0, 0, W, H);

    const bins = new Array(24).fill(0);
    const binSat = new Array(24).fill(0);
    const binLight = new Array(24).fill(0);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
      const a = data[i + 3] / 255;
      if (a < 0.5) continue;

      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const d = max - min;
      if (d < 0.08) continue;        // ignore near-grays
      if (l < 0.10 || l > 0.92) continue; // ignore near-black/white

      const s = d / (1 - Math.abs(2 * l - 1));
      if (s < 0.18) continue;

      let h;
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h = (h * 60 + 360) % 360;

      const bin = Math.floor(h / 15);
      const w = s * a;
      bins[bin] += w;
      binSat[bin] += s * w;
      binLight[bin] += l * w;
    }

    let best = -1, bestW = 0;
    for (let i = 0; i < 24; i++) {
      if (bins[i] > bestW) { bestW = bins[i]; best = i; }
    }
    if (best < 0 || bestW < 5) return null;

    const hue = best * 15 + 7.5;
    // normalize to a friendly band so neon yellows / muddy browns
    // don't make the chrome look weird
    const sat = Math.min(72, Math.max(45, (binSat[best] / bins[best]) * 100));
    const light = 60;
    return hslToHex(hue, sat, light);
  } catch (e) {
    return null;
  }
}

/* convert hex -> rgba string for soft shadows */
function hexToRgba(hex, alpha) {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* mix a hex toward black or white by t in [0,1] */
function mixHex(hex, target, t) {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const tm = target.replace('#', '');
  const tr = parseInt(tm.slice(0, 2), 16);
  const tg = parseInt(tm.slice(2, 4), 16);
  const tb = parseInt(tm.slice(4, 6), 16);
  const mix = (a, b) => Math.round(a + (b - a) * t).toString(16).padStart(2, '0');
  return `#${mix(r, tr)}${mix(g, tg)}${mix(b, tb)}`;
}

/* SVG <clipPath> defs — injected once per document. Path describes a
   pointy-top hex (1 : 1.1547 aspect) with rounded corners, expressed
   in objectBoundingBox (0-1) coords so it stretches to any size. */
const BADGE_HEX_PATH =
  'M 0.5866 0.0433 ' +
  'L 0.9134 0.2067 Q 1 0.25 1 0.3366 ' +
  'L 1 0.6634 Q 1 0.75 0.9134 0.7933 ' +
  'L 0.5866 0.9567 Q 0.5 1 0.4134 0.9567 ' +
  'L 0.0866 0.7933 Q 0 0.75 0 0.6634 ' +
  'L 0 0.3366 Q 0 0.25 0.0866 0.2067 ' +
  'L 0.4134 0.0433 Q 0.5 0 0.5866 0.0433 Z';

function ensureBadgeDefs() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('bdg-hex-clip')) return;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.style.width = '0';
  svg.style.height = '0';
  svg.style.overflow = 'hidden';
  const defs = document.createElementNS(svgNS, 'defs');
  const clip = document.createElementNS(svgNS, 'clipPath');
  clip.setAttribute('id', 'bdg-hex-clip');
  clip.setAttribute('clipPathUnits', 'objectBoundingBox');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', BADGE_HEX_PATH);
  clip.appendChild(path);
  defs.appendChild(clip);
  svg.appendChild(defs);
  document.body.appendChild(svg);
}

function Badge({ imageUrl, name, description, size = 180 }) {
  const [accent, setAccent] = React.useState(() => badgeHashPick(name || imageUrl || ''));
  const [tipOpen, setTipOpen] = React.useState(false);
  // We sample the dominant color from the *visible* <img> instead of fetching a
  // second copy of the image. Reading pixels requires a CORS-clean image, so we
  // load it with crossOrigin; if that's blocked (origin sent no CORS header) we
  // fall back to a plain load so the badge still renders — color extraction is
  // simply skipped in that case and the deterministic fallback color is kept.
  const [allowCors, setAllowCors] = React.useState(true);
  const hideTimer = React.useRef(null);

  React.useEffect(() => { ensureBadgeDefs(); }, []);

  // new image URL → optimistically retry the CORS load for color sampling
  React.useEffect(() => { setAllowCors(true); }, [imageUrl]);

  const handleArtLoad = (e) => {
    if (!allowCors) return;            // plain (non-CORS) load → canvas would taint
    const c = extractDominantColor(e.currentTarget);
    if (c) setAccent(c);              // else keep the deterministic fallback
  };

  const handleArtError = () => {
    // most likely the CORS request was blocked; reload without crossOrigin so
    // the image still displays (we forgo color extraction).
    setAllowCors((cors) => (cors ? false : cors));
  };

  const accentDark = mixHex(accent, '#000000', 0.32);
  const accentDeep = mixHex(accent, '#000000', 0.55);
  const accentLight = mixHex(accent, '#ffffff', 0.45);
  const innerTop = mixHex(accent, '#000000', 0.62);
  const innerBot = mixHex(accent, '#000000', 0.78);

  const styleVars = {
    '--bdg-size': `${size}px`,
    '--bdg-accent': accent,
    '--bdg-accent-light': accentLight,
    '--bdg-accent-dark': accentDark,
    '--bdg-accent-deep': accentDeep,
    '--bdg-inner-top': innerTop,
    '--bdg-inner-bot': innerBot,
    '--bdg-glow': hexToRgba(accent, 0.45),
    '--bdg-glow-soft': hexToRgba(accent, 0.18),
  };

  const openTip = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setTipOpen(true);
  };
  const closeTip = () => {
    hideTimer.current = setTimeout(() => setTipOpen(false), 80);
  };

  return (
    <div
      className="bdg"
      style={styleVars}
      onMouseEnter={openTip}
      onMouseLeave={closeTip}
      onFocus={openTip}
      onBlur={closeTip}
      tabIndex={0}
      role="img"
      aria-label={`${name} — ${description}`}
    >
      <div className="bdg-glow" aria-hidden="true" />

      {/* outer hexagonal frame */}
      <div className="bdg-hex bdg-hex-outer">
        {/* inner hexagonal plate — holds the illustration full-bleed */}
        <div className="bdg-hex bdg-hex-inner">
          <img
            key={allowCors ? 'cors' : 'plain'}
            className="bdg-art"
            src={imageUrl}
            crossOrigin={allowCors ? 'anonymous' : undefined}
            loading="lazy"
            alt=""
            draggable="false"
            onLoad={handleArtLoad}
            onError={handleArtError}
          />
        </div>
      </div>

      {/* tooltip — name + description */}
      <div className={`bdg-tip ${tipOpen ? 'is-open' : ''}`} role="tooltip">
        <span className="bdg-tip-name">{name}</span>
        {description}
        <span className="bdg-tip-arrow" aria-hidden="true" />
      </div>
    </div>
  );
}

export default Badge;