export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] text-sm text-[var(--color-fg-muted)]">
      <div className="mx-auto max-w-3xl px-6 py-6 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Thiraphat (Dan) Ruksujarit</span>
        <div className="flex gap-4">
          <a href="https://github.com/DanRRR" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-fg)]">GitHub</a>
          <a href="https://www.linkedin.com/in/thiraphat-ruksujarit/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-fg)]">LinkedIn</a>
          <a href="mailto:dtruk001@gmail.com" className="hover:text-[var(--color-fg)]">Email</a>
        </div>
      </div>
    </footer>
  );
}
