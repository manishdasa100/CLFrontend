// Layout lives in .cl-page (tokens.css). It was inline here, which put the page
// shell's structure out of reach of any stylesheet — including the sticky-footer
// and dvh rules that need it.
const BackgroundWrapper = ({ children }) => (
  <div className="cl-page">{children}</div>
);
export default BackgroundWrapper;
