import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';

export interface SlideData {
  id: string;
  title: string;
  statLabel: string;
  statValue: string;
  statNote: string;
  body: string;
  question: string;
  backgroundType: 'gradient' | 'image';
  backgroundImage: string | null;
  theme: string;
}

interface SlideSectionProps {
  slide: SlideData;
  index: number;
}

export function SlideSection({ slide, index }: SlideSectionProps) {
  const reducedMotion = useReducedMotion();
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reducedMotion ? 0 : 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section
      ref={ref}
      id={slide.id}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby={`slide-title-${slide.id}`}
    >
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 py-24 max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Kicker / slide number */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="kicker">
            {String(index + 1).padStart(2, '0')}
          </span>
        </motion.div>

        {/* Thin rule above title */}
        <motion.div variants={itemVariants}>
          <div className="nyt-rule-thick mb-4" />
        </motion.div>

        {/* Title */}
        <motion.h2
          id={`slide-title-${slide.id}`}
          variants={itemVariants}
          className="text-display font-black text-foreground mb-10 leading-[1.05] font-serif"
        >
          {slide.title}
        </motion.h2>

        {/* Stat callout — large number with label */}
        <motion.div variants={itemVariants} className="mb-10 border-l-2 border-accent pl-6">
          <p className="stat-label font-mono mb-1">{slide.statLabel}</p>
          <p className="text-stat stat-value font-serif leading-none">{slide.statValue}</p>
          <span className="placeholder-badge mt-2 inline-flex">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            {slide.statNote}
          </span>
        </motion.div>

        {/* Body text */}
        <motion.p
          variants={itemVariants}
          className="text-body-lg text-muted-foreground mb-8 max-w-2xl font-serif leading-relaxed"
        >
          {slide.body}
        </motion.p>

        {/* Question — italicized pull-quote style */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-foreground italic font-serif border-t border-foreground/15 pt-6"
        >
          "{slide.question}"
        </motion.p>
      </motion.div>

      {/* Scroll indicator (first slide only) */}
      {index === 0 && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
