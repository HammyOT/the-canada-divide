import { useInView } from '@/hooks/useInView';

interface Quote {
  id: string;
  text: string;
  generation: string;
  ageRange: string;
  isPlaceholder: boolean;
}

interface QuotesSectionProps {
  quotes: Quote[];
  ethicsNote: string;
}

export function QuotesSection({ quotes, ethicsNote }: QuotesSectionProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="quotes"
      className={`quotes-section article-section-inner transition-opacity duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}
      aria-labelledby="quotes-title"
    >
      <p id="quotes-title" className="quotes-heading">Voices</p>

      <div className="quote-grid">
        {quotes.map((quote) => (
          <div key={quote.id} className="quote-card">
            <p className="quote-text">{quote.text}</p>
            <p className="quote-attribution">
              {quote.generation} &middot; Ages {quote.ageRange}
            </p>
          </div>
        ))}
      </div>

      <p className="ethics-note">{ethicsNote}</p>
    </section>
  );
}
