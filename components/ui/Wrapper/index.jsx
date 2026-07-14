export function Wrapper({ children, className = "" }) {
  return (
    <div className={`mx-auto max-w-7xl w-full max-xl:px-3 ${className}`}>
      {children}
    </div>
  );
}
