import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';

interface PolicyOption {
  id: string;
  title: string;
  description: string;
  tradeoff: string;
}

interface PolicyGridProps {
  options: PolicyOption[];
}

export function PolicyGrid({ options }: PolicyGridProps) {
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
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: reducedMotion ? 0.1 : 0.4 }
    }
  };

  return (
    <section
      ref={ref}
      id="policy-options"
      className="relative py-24 md:py-32 slide-gradient"
      aria-labelledby="policy-title"
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
            Looking Forward
          </span>
          <h2 id="policy-title" className="text-headline font-bold text-foreground mb-4">
            Policy Options (With Trade-offs)
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every solution has costs. Here are the main levers—and what they'd require.
          </p>
        </motion.div>

        {/* Policy grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              variants={cardVariants}
              className="policy-card group"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {option.description}
                  </p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <svg className="w-4 h-4 text-destructive/70 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Trade-off:</span> {option.tradeoff}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing paragraph */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
          transition={{ delay: reducedMotion ? 0 : 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="max-w-3xl mx-auto p-8 rounded-xl border border-border/50 bg-card/30">
            <p className="text-lg text-foreground leading-relaxed">
              This project shows how policy choices shape who benefits—and who pays. 
              <span className="text-primary"> The question isn't whether change is possible, but what we're willing to trade for a fairer outcome.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
