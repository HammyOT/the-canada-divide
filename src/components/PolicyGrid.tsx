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
    hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0.1 : 0.4 }
    }
  };

  return (
    <section ref={ref} id="policy-options" className="relative py-24 md:py-32 bg-background" aria-labelledby="policy-title">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 16 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="mb-12"
        >
          <span className="kicker mb-3 block">Looking Forward</span>
          <div className="nyt-rule-thick mb-4" />
          <h2 id="policy-title" className="text-headline font-bold text-foreground mb-3 font-serif">
            Policy Options (With Trade-offs)
          </h2>
          <p className="text-muted-foreground font-serif">
            Every solution has costs. Here are the main levers—and what they'd require.
          </p>
        </motion.div>

        {/* Policy list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-0 divide-y divide-foreground/10"
        >
          {options.map((option, index) => (
            <motion.div key={option.id} variants={cardVariants} className="py-8 first:pt-0">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 text-2xl font-black text-foreground/20 font-serif leading-none mt-1">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2 font-serif">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 font-serif">
                    {option.description}
                  </p>
                  <p className="text-sm text-muted-foreground font-serif border-l-2 border-accent/50 pl-4">
                    <span className="font-semibold text-foreground">Trade-off:</span> {option.tradeoff}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.5, duration: 0.6 }}
          className="mt-16 border-t-2 border-foreground pt-8"
        >
          <p className="text-lg text-foreground leading-relaxed font-serif">
            This project shows how policy choices shape who benefits—and who pays.{' '}
            <em className="text-accent">The question isn't whether change is possible, but what we're willing to trade for a fairer outcome.</em>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
