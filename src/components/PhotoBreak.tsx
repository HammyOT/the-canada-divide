import { useInView } from '@/hooks/useInView';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
    <motion.figure
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
      className="data-table-wrapper photo-break"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full block"
        style={{ maxHeight: '420px', objectFit: 'cover' }}
      />
      {(caption || credit) && (
        <figcaption className="photo-caption-row">
          {caption && <span className="photo-caption">{caption}</span>}
          {credit && <span className="photo-credit">{credit}</span>}
        </figcaption>
      )}
    </motion.figure>
  );
}
