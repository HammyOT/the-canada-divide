import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
}

interface NewsNavProps {
  items: NavItem[];
  activeIndex: number;
  onNavigate: (id: string) => void;
}

export function NewsNav({ items, activeIndex, onNavigate }: NewsNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onHero = !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-paper/97 backdrop-blur-sm shadow-sm border-b border-ink/10'
            : 'bg-gradient-to-b from-black/40 to-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14">

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-black leading-none">GI</span>
              </div>
              <span
                className={`font-serif font-bold text-sm tracking-tight hidden sm:block transition-colors duration-300 ${
                  onHero ? 'text-white' : 'text-ink'
                }`}
              >
                Generational Inequality
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-0" aria-label="Article sections">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors duration-300 rounded ${
                    activeIndex === i
                      ? 'text-accent'
                      : onHero
                      ? 'text-white/70 hover:text-white'
                      : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              className={`md:hidden p-2 transition-colors duration-300 ${
                onHero ? 'text-white/80 hover:text-white' : 'text-ink/60 hover:text-ink'
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                {menuOpen
                  ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  : <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                }
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-paper pt-14" onClick={() => setMenuOpen(false)}>
          <nav className="flex flex-col px-4 py-6 gap-1">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                className={`text-left px-4 py-3 text-sm font-medium uppercase tracking-wide border-b border-ink/10 ${
                  activeIndex === i ? 'text-accent' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
