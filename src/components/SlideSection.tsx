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
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.15 });

  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0.1 : 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reducedMotion ? 0 : 0.15 },
    },
  };

  const paragraphs = slide.body.split('\n').filter(Boolean);

  return (
    <section
      ref={ref}
      id={slide.id}
      className="article-section"
      aria-labelledby={`slide-title-${slide.id}`}
    >
      <motion.div
        className="article-section-inner"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {index !== 0 && (
          <motion.h2
            id={`slide-title-${slide.id}`}
            variants={itemVariants}
            className="article-h2"
          >
            {slide.title}
          </motion.h2>
        )}

        <motion.div variants={itemVariants} className="stat-callout">
          <p className="stat-callout-label">{slide.statLabel}</p>
          <p className="stat-callout-value">{slide.statValue}</p>
          <p className="stat-callout-note">{slide.statNote}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="article-body">
          {paragraphs.map((para, i) => (
            <p key={i} className={i === 0 && index !== 0 ? 'first-paragraph' : ''}>
              {para}
            </p>
          ))}
        </motion.div>

        <motion.blockquote variants={itemVariants} className="article-pull-quote">
          {slide.question}
        </motion.blockquote>
      </motion.div>
    </section>
  );
}
