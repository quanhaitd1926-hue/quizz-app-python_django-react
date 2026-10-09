import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="animate-pulse-glow text-2xl">⚡</span>
          <span className="font-display text-2xl tracking-widest text-brand-text">
            QUIZ<span className="text-brand-lime">MASTER</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors duration-150 ${
              pathname === "/"
                ? "text-brand-text"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            Quizzes
          </Link>
          <Link
            to="/create"
            className="rounded-xl bg-brand-lime px-4 py-2 text-sm font-bold text-[#0a1000] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lime"
          >
            + New Quiz
          </Link>
        </nav>
      </div>
    </header>
  );
}