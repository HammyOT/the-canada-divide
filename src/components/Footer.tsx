export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <span className="footer-brand">Generational Inequality Project</span>
      <span className="footer-note">
        Hamza Ahmadi &bull; {currentYear}
      </span>
    </footer>
  );
}
