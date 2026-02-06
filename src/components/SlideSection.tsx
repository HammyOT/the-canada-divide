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

// SVG decorative elements for different themes
const ThemeDecoration = ({
  theme,
  reducedMotion
}: {
  theme: string;
  reducedMotion: boolean;
}) => {
  switch (theme) {
    case 'noise':
      return null;
    // Handled by CSS class
    case 'lines':
      return <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" preserveAspectRatio="none">
          <defs>
            <pattern id="lines" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="1" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>;
    case 'graduation':
      return <motion.div className="absolute bottom-20 right-10 md:right-20 opacity-10" animate={reducedMotion ? {} : {
        y: [0, -10, 0]
      }} transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </motion.div>;
    case 'timeline':
      return <div className="absolute left-8 md:left-16 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />;
    case 'layers':
      return <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-48 md:w-64 opacity-20 pointer-events-none" viewBox="0 0 200 200">
          <rect x="20" y="100" width="160" height="30" rx="4" fill="hsl(var(--primary))" opacity="0.3" />
          <rect x="20" y="60" width="160" height="30" rx="4" fill="hsl(var(--primary))" opacity="0.5" />
          <rect x="20" y="20" width="160" height="30" rx="4" fill="hsl(var(--primary))" opacity="0.7" />
        </svg>;
    default:
      return null;
  }
};
export function SlideSection({
  slide,
  index
}: SlideSectionProps) {
  const reducedMotion = useReducedMotion();
  const [ref, isInView] = useInView<HTMLElement>({
    threshold: 0.3
  });
  const hasImage = slide.backgroundType === 'image' && slide.backgroundImage;

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };
  return <section ref={ref} id={slide.id} className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby={`slide-title-${slide.id}`}>
      {/* Background */}
      <div className="absolute inset-0">
        {hasImage ? <>
            {/* Image with fallback */}
            <div className="absolute inset-0 bg-cover bg-center slide-gradient" style={{
          backgroundImage: `url(${slide.backgroundImage})`
        }} onError={e => {
          // Fallback to gradient if image fails
          (e.target as HTMLDivElement).style.backgroundImage = 'none';
        }} />
            {/* Dark overlay for text protection */}
            <div className="absolute inset-0 image-overlay" />
          </> : <div className={`absolute inset-0 ${index === 0 ? 'slide-gradient-animated noise-overlay' : 'slide-gradient'}`} />}
        
        {/* Theme-specific decorations */}
        <ThemeDecoration theme={slide.theme} reducedMotion={reducedMotion} />
      </div>

      {/* Content */}
      <motion.div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 py-20 max-w-4xl" variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
        {/* Slide number */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            {String(index + 1).padStart(2, '0')} / 08
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2 id={`slide-title-${slide.id}`} variants={itemVariants} className="text-display font-black text-foreground mb-12 leading-tight font-serif">
          {slide.title}
        </motion.h2>

        {/* Stat callout */}
        <motion.div variants={itemVariants} className="mb-12 space-y-2">
          <p className="stat-label font-mono">{slide.statLabel}</p>
          <p className="text-stat stat-value font-serif">{slide.statValue}</p>
          <span className="placeholder-badge">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            {slide.statNote}
          </span>
        </motion.div>

        {/* Body text */}
        <motion.p variants={itemVariants} className="text-body-lg text-muted-foreground mb-8 max-w-2xl font-serif">
          {slide.body}
        </motion.p>

        {/* Question */}
        <motion.p variants={itemVariants} className="text-xl md:text-2xl font-medium text-foreground italic font-serif">
          "{slide.question}"
        </motion.p>
      </motion.div>

      {/* Scroll indicator (only on first slide) */}
      {index === 0 && <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 1.5,
      duration: 0.6
    }}>
          <motion.div animate={reducedMotion ? {} : {
        y: [0, 8, 0]
      }} transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }} className="flex flex-col items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>}
    </section>;
}