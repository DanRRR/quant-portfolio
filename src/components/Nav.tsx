import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link href="/" className="wordmark">Dan Ruksujarit</Link>
        <div className="nav-actions">
          <ul className="nav-links">
            <li><Link href="/experience">Experience</Link></li>
            <li><Link href="/research">Research</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/cv">CV</Link></li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
