import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';

interface PhotoBreakProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export function PhotoBreak({ src, alt, caption, credit }: PhotoBreakProps) {
  const reducedMotion = useReducedMotion();
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <figure
      ref={ref}
      className="relative w-full overflow-hidden my-0"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.8 }}
        className="relative w-full"
        style={{ aspectRatio: '16 / 7' }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {(caption || credit) && (
        <figcaption className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl py-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          {caption && (
            <span className="text-sm text-muted-foreground italic font-serif">
              {caption}
            </span>
          )}
          {credit && (
            <span className="text-xs text-muted-foreground/70 uppercase tracking-widest">
              {credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
