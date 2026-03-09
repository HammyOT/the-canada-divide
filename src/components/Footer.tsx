import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Footer() {
  const reducedMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 slide-gradient border-t border-border/30">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="text-center space-y-6">
          
          {/* Logo/Title */}
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-foreground">Generational Divide</span>
          </div>

          {/* Tagline */}
          <p className="text-muted-foreground max-w-md mx-auto">
            An exploration of economic inequality across generations in Canada.
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="#hook"
              className="text-muted-foreground hover:text-primary transition-colors focus-ring">
              
              Back to top
            </a>
            <a
              href="#data-playground"
              className="text-muted-foreground hover:text-primary transition-colors focus-ring">
              
              Explore data
            </a>
            <a
              href="#sources"
              className="text-muted-foreground hover:text-primary transition-colors focus-ring">
              
              Sources
            </a>
          </div>

          {/* Disclaimer */}
          <div className="pt-8 border-t border-border/30">
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              Built for educational purposes.  
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              © {currentYear} Hamza S. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>);

}