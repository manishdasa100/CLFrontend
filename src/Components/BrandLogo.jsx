import { Link } from "react-router-dom";

export default function BrandLogo({ size = 26 }) {
  return (
    <Link to="/" className="cl-brand">
      <span className="cl-brand-mark" style={{ width: size, height: size }}>
        <span className="cl-brand-leaf" />
      </span>
      <span className="cl-brand-word">coding<em>lemon</em></span>
    </Link>
  );
}
