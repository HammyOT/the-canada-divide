import { useMemo } from 'react';
import { SlideSection, SlideData } from '@/components/SlideSection';
import { TableOfContents } from '@/components/TableOfContents';
import { QuotesSection } from '@/components/QuotesSection';
import { DataPlayground } from '@/components/DataPlayground';
import { PolicyGrid } from '@/components/PolicyGrid';
import { SourcesPanel } from '@/components/SourcesPanel';
import { Footer } from '@/components/Footer';
import { PhotoBreak } from '@/components/PhotoBreak';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import slidesDataRaw from '@/content/slides.json';

import photoHousing from '@/assets/photo-housing.jpg';
import photoGroceries from '@/assets/photo-groceries.jpg';
import photoCampus from '@/assets/photo-campus.jpg';

const slidesData = {
  ...slidesDataRaw,
  slides: slidesDataRaw.slides as SlideData[],
};

// Photo breaks inserted after specific slide indices
const photoBreaks: Record<number, { src: string; alt: string; caption: string; credit: string }> = {
  1: {
    src: photoHousing,
    alt: 'Aerial view of suburban housing development stretching to the horizon',
    caption: 'Suburban sprawl outside a major Canadian city. For many, homeownership now depends on when — not whether — you entered the market.',
    credit: 'Photo: Placeholder',
  },
  3: {
    src: photoGroceries,
    alt: 'Grocery store aisle with price tags',
    caption: 'The cost of essentials has outpaced wages for over a decade.',
    credit: 'Photo: Placeholder',
  },
  4: {
    src: photoCampus,
    alt: 'University students walking across campus in autumn',
    caption: 'For many graduates, adulthood begins with five figures of debt.',
    credit: 'Photo: Placeholder',
  },
};

const Index = () => {
  const sectionIds = useMemo(() => 
    slidesData.tableOfContents.map(item => item.id), 
    []
  );

  const { activeSection, scrollProgress, scrollToSection } = useScrollProgress({
    sectionIds,
  });

  return (
    <main className="relative bg-background min-h-screen custom-scrollbar">
      <a 
        href="#hook" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <TableOfContents 
        items={slidesData.tableOfContents}
        activeIndex={activeSection}
        onNavigate={scrollToSection}
      />

      <article aria-label="Act 1: The Narrative">
        {slidesData.slides.map((slide, index) => (
          <div key={slide.id}>
            <SlideSection slide={slide} index={index} />
            {photoBreaks[index] && (
              <PhotoBreak
                src={photoBreaks[index].src}
                alt={photoBreaks[index].alt}
                caption={photoBreaks[index].caption}
                credit={photoBreaks[index].credit}
              />
            )}
          </div>
        ))}
      </article>

      <QuotesSection 
        quotes={slidesData.quotes}
        ethicsNote={slidesData.ethicsNote}
      />

      <article aria-label="Act 2: Explore the Data">
        <DataPlayground />
      </article>

      <PolicyGrid options={slidesData.policyOptions} />
      <SourcesPanel />
      <Footer />
    </main>
  );
};

export default Index;
