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
      className="relative h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby={`slide-title-${id}`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Downtown Toronto skyline with CN Tower at golden hour"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Bottom gradient fade into background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Title */}
      <motion.h1
        id={`slide-title-${id}`}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 text-display font-black text-white leading-none font-serif text-center px-6 max-w-4xl drop-shadow-lg"
      >
        {title}
      </motion.h1>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={reducedMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-60">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
