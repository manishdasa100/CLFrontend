// The project's single loading indicator. Styling lives in tokens.css (.cl-spinner)
// so size and colour stay on the design system rather than per call site.
export default function Spinner({ size = 16, label = "Loading", style }) {
  return (
    <span
      className="cl-spinner"
      role="status"
      aria-label={label}
      style={{ width: size, height: size, borderWidth: size >= 28 ? 3 : 2, ...style }}
    />
  );
}
