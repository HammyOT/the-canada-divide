import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  sections: { id: string; label: string }[];
  activeIndex: number;
  scrollProgress: number;
  onNavigate: (id: string) => void;
}

export function ProgressIndicator({ 
  sections, 
  activeIndex, 
  scrollProgress, 
  onNavigate 
}: ProgressIndicatorProps) {
  return (
    <nav 
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-3"
      aria-label="Page sections"
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onNavigate(section.id)}
          className={cn(
            "group relative focus-ring rounded-full touch-target flex items-center justify-center",
            "w-8 h-8"
          )}
          aria-label={`Go to ${section.label}`}
          aria-current={index === activeIndex ? 'true' : undefined}
        >
          {/* Dot */}
          <motion.span
            className={cn(
              "progress-dot",
              index === activeIndex && "active"
            )}
            initial={false}
            animate={{
              scale: index === activeIndex ? 1.5 : 1,
              backgroundColor: index === activeIndex 
                ? 'hsl(var(--primary))' 
                : index < activeIndex 
                  ? 'hsl(var(--primary) / 0.5)' 
                  : 'hsl(var(--muted-foreground) / 0.3)'
            }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-2 py-1 text-xs font-medium bg-card border border-border rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {section.label}
          </span>
        </button>
      ))}
      
      {/* Progress bar */}
      <div className="mt-4 w-0.5 h-12 bg-muted/20 rounded-full overflow-hidden">
        <motion.div
          className="w-full bg-primary rounded-full"
          initial={{ height: '0%' }}
          animate={{ height: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </nav>
  );
}

// Mobile progress bar at top
export function MobileProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted/20 z-50 md:hidden">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
