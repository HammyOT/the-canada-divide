import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Footer() {
  const reducedMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 bg-background border-t-2 border-foreground">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="space-y-6"
        >
          <span className="text-lg font-bold text-foreground font-serif">Generational Divide</span>

          <p className="text-muted-foreground font-serif text-sm">
            An exploration of economic inequality across generations in Canada.
          </p>

          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#hook" className="text-muted-foreground hover:text-foreground transition-colors focus-ring underline underline-offset-4">
              Back to top
            </a>
            <a href="#data-playground" className="text-muted-foreground hover:text-foreground transition-colors focus-ring underline underline-offset-4">
              Explore data
            </a>
            <a href="#sources" className="text-muted-foreground hover:text-foreground transition-colors focus-ring underline underline-offset-4">
              Sources
            </a>
          </div>

          <div className="pt-6 border-t border-foreground/10">
            <p className="text-xs text-muted-foreground max-w-2xl font-serif">
              This is a demonstration project with placeholder data. All statistics and quotes should be replaced with verified data from Statistics Canada, CMHC, and other official sources before publication.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              © {currentYear} Generational Divide Project.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
