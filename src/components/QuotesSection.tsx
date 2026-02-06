import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';

interface Quote {
  id: string;
  text: string;
  generation: string;
  ageRange: string;
  isPlaceholder: boolean;
}

interface QuotesSectionProps {
  quotes: Quote[];
  ethicsNote: string;
}

export function QuotesSection({ quotes, ethicsNote }: QuotesSectionProps) {
  const reducedMotion = useReducedMotion();
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reducedMotion ? 0 : 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: reducedMotion ? 0.1 : 0.5 }
    }
  };

  // Group quotes by generation
  const groupedQuotes = quotes.reduce((acc, quote) => {
    if (!acc[quote.generation]) {
      acc[quote.generation] = [];
    }
    acc[quote.generation].push(quote);
    return acc;
  }, {} as Record<string, Quote[]>);

  return (
    <section
      ref={ref}
      id="quotes"
      className="relative py-24 md:py-32 slide-gradient"
      aria-labelledby="quotes-title"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-4 block">
            Voices
          </span>
          <h2 id="quotes-title" className="text-headline font-bold text-foreground mb-4">
            What Canadians Are Saying
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Perspectives from different generations on economic opportunity.
          </p>
        </motion.div>

        {/* Quotes grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-12"
        >
          {Object.entries(groupedQuotes).map(([generation, genQuotes]) => (
            <div key={generation}>
              <h3 className="text-sm font-medium text-primary mb-4 uppercase tracking-widest">
                {generation} ({genQuotes[0]?.ageRange})
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {genQuotes.map((quote) => (
                  <motion.div
                    key={quote.id}
                    variants={cardVariants}
                    className="quote-card"
                  >
                    <blockquote className="relative z-10">
                      <p className="text-lg text-foreground mb-4 leading-relaxed">
                        {quote.text}
                      </p>
                      {quote.isPlaceholder && (
                        <span className="placeholder-badge">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                          </svg>
                          Placeholder quote
                        </span>
                      )}
                    </blockquote>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Ethics note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.8, duration: 0.4 }}
          className="mt-12 text-center text-sm text-muted-foreground italic"
        >
          {ethicsNote}
        </motion.p>
      </div>
    </section>
  );
}
