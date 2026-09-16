export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Thiraphat (Dan) Ruksujarit</span>
        <div className="footer-links">
          <a href="https://github.com/DanRRR" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/thiraphat-ruksujarit/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:dan.ruksujarit@bayes.city.ac.uk">Email</a>
        </div>
      </div>
    </footer>
  );
}
