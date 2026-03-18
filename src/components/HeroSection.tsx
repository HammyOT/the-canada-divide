import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import heroImage from '@/assets/hero-toronto.jpg';

interface HeroSectionProps {
  title: string;
  id: string;
}

export function HeroSection({ title, id }: HeroSectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      className="relative flex items-end justify-start overflow-hidden hero-section"
      aria-labelledby={`hero-title-${id}`}
    >
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Downtown Toronto skyline with CN Tower at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 pb-16 md:pb-24 pt-28">
        <motion.p
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="hero-kicker"
        >
          Special Report
        </motion.p>
        <motion.h1
          id={`hero-title-${id}`}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.8, delay: 0.1 }}
          className="hero-title"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.7, delay: 0.25 }}
          className="hero-subtitle"
        >
          Housing, wages, and wealth: how Canada's economic promise became conditional on when you were born.
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={reducedMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-50">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
