import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';
import sourcesData from '@/content/sources.json';

export function SourcesPanel() {
  const reducedMotion = useReducedMotion();
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.2 });

  const groupedSources = sourcesData.sources.reduce((acc, source) => {
    if (!acc[source.category]) {
      acc[source.category] = [];
    }
    acc[source.category].push(source);
    return acc;
  }, {} as Record<string, typeof sourcesData.sources>);

  return (
    <section
      ref={ref}
      id="sources"
      className="relative py-24 md:py-32 slide-gradient"
      aria-labelledby="sources-title"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="text-center mb-12"
        >
          <h2 id="sources-title" className="text-headline font-bold text-foreground mb-4">
            Sources & Methods
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All data comes from official Canadian statistical sources. Replace placeholder links with actual references before publication.
          </p>
        </motion.div>

        {/* Placeholder warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.2 }}
          className="mb-8 p-4 rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-3"
        >
          <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <p className="font-medium text-foreground">Placeholder Sources</p>
            <p className="text-sm text-muted-foreground">
              All source links and table numbers are placeholders. Replace with actual URLs and identifiers.
            </p>
          </div>
        </motion.div>

        {/* Sources by category */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
          transition={{ delay: reducedMotion ? 0 : 0.3 }}
          className="space-y-8 mb-12"
        >
          {Object.entries(groupedSources).map(([category, sources]) => (
            <div key={category} className="p-6 rounded-xl border border-border/50 bg-card/30">
              <h3 className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-4">
                {sources.map((source, index) => (
                  <li key={source.id} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted/50 text-muted-foreground flex items-center justify-center text-xs font-mono">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <a
                        href={source.url}
                        className="text-foreground hover:text-primary transition-colors font-medium focus-ring inline-flex items-center gap-1"
                      >
                        {source.label}
                        {source.isPlaceholder && (
                          <span className="placeholder-badge ml-2">Placeholder</span>
                        )}
                      </a>
                      {source.tableNumber && (
                        <p className="text-sm text-muted-foreground mt-1 font-mono">
                          {source.tableNumber}
                        </p>
                      )}
                      {source.note && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          {source.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Methodology */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
          transition={{ delay: reducedMotion ? 0 : 0.4 }}
          className="p-6 rounded-xl border border-border/50 bg-card/30"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {sourcesData.methodology.title}
          </h3>
          <p className="text-muted-foreground mb-4">
            {sourcesData.methodology.description}
          </p>
          <ul className="space-y-2">
            {sourcesData.methodology.notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                {note}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
