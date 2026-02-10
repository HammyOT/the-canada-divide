import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';
import sourcesData from '@/content/sources.json';

export function SourcesPanel() {
  const reducedMotion = useReducedMotion();
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.2 });

  const groupedSources = sourcesData.sources.reduce((acc, source) => {
    if (!acc[source.category]) acc[source.category] = [];
    acc[source.category].push(source);
    return acc;
  }, {} as Record<string, typeof sourcesData.sources>);

  return (
    <section ref={ref} id="sources" className="relative py-24 md:py-32 bg-background" aria-labelledby="sources-title">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 16 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="mb-10"
        >
          <div className="nyt-rule-thick mb-4" />
          <h2 id="sources-title" className="text-headline font-bold text-foreground mb-3 font-serif">
            Sources & Methods
          </h2>
          <p className="text-muted-foreground font-serif">
            All data comes from official Canadian statistical sources. Replace placeholder links with actual references before publication.
          </p>
        </motion.div>

        {/* Placeholder warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.2 }}
          className="mb-8 py-3 border-y border-accent/30 flex items-start gap-3"
        >
          <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <p className="font-medium text-foreground text-sm">Placeholder Sources</p>
            <p className="text-sm text-muted-foreground">
              All source links and table numbers are placeholders. Replace with actual URLs and identifiers.
            </p>
          </div>
        </motion.div>

        {/* Sources by category */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.3 }}
          className="space-y-10 mb-12"
        >
          {Object.entries(groupedSources).map(([category, sources]) => (
            <div key={category}>
              <h3 className="kicker mb-3">{category}</h3>
              <div className="nyt-rule mb-4" />
              <ol className="space-y-4 list-decimal list-inside">
                {sources.map((source) => (
                  <li key={source.id} className="text-sm font-serif text-foreground">
                    <a href={source.url} className="hover:underline focus-ring">
                      {source.label}
                    </a>
                    {source.isPlaceholder && (
                      <span className="placeholder-badge ml-2">Placeholder</span>
                    )}
                    {source.tableNumber && (
                      <span className="text-muted-foreground font-mono text-xs ml-2">{source.tableNumber}</span>
                    )}
                    {source.note && (
                      <span className="text-muted-foreground italic ml-1">— {source.note}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </motion.div>

        {/* Methodology */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.4 }}
          className="border-t border-foreground/15 pt-8"
        >
          <h3 className="text-lg font-bold text-foreground mb-4 font-serif">
            {sourcesData.methodology.title}
          </h3>
          <p className="text-muted-foreground mb-4 font-serif">
            {sourcesData.methodology.description}
          </p>
          <ul className="space-y-2">
            {sourcesData.methodology.notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground font-serif">
                <span className="text-foreground/30">•</span>
                {note}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
