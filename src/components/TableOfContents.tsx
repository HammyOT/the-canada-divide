import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TOCItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeIndex: number;
  onNavigate: (id: string) => void;
}

export function TableOfContents({ items, activeIndex, onNavigate }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <div className="fixed top-4 left-4 md:left-8 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-card/80 backdrop-blur-md border border-border/50",
          "text-sm font-medium text-foreground",
          "hover:bg-card transition-colors focus-ring touch-target"
        )}
        aria-expanded={isOpen}
        aria-controls="toc-menu"
      >
        <svg 
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">Contents</span>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="toc-menu"
            initial={{ opacity: 0, y: reducedMotion ? 0 : -10, scale: reducedMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -10, scale: reducedMotion ? 1 : 0.95 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
            className={cn(
              "absolute top-full left-0 mt-2 py-2 min-w-[200px]",
              "bg-card/95 backdrop-blur-md border border-border/50 rounded-lg",
              "shadow-xl shadow-black/20"
            )}
            aria-label="Table of contents"
          >
            <ul className="space-y-1">
              {items.map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm transition-colors focus-ring",
                      "flex items-center gap-3",
                      index === activeIndex 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="text-xs font-mono opacity-50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item.label}</span>
                    {index === activeIndex && (
                      <motion.span
                        layoutId="toc-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
