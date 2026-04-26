const BackgroundWrapper = ({ children }) => (
  <div className="cl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {children}
  </div>
);
export default BackgroundWrapper;
