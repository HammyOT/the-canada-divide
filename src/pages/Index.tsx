import { useMemo } from 'react';
import { SlideSection, SlideData } from '@/components/SlideSection';
import { ProgressIndicator, MobileProgressBar } from '@/components/ProgressIndicator';
import { TableOfContents } from '@/components/TableOfContents';
import { QuotesSection } from '@/components/QuotesSection';
import { DataPlayground } from '@/components/DataPlayground';
import { PolicyGrid } from '@/components/PolicyGrid';
import { SourcesPanel } from '@/components/SourcesPanel';
import { Footer } from '@/components/Footer';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import slidesDataRaw from '@/content/slides.json';

// Cast the slides to ensure proper typing
const slidesData = {
  ...slidesDataRaw,
  slides: slidesDataRaw.slides as SlideData[],
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
      {/* Skip to content link for accessibility */}
      <a 
        href="#hook" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <TableOfContents 
        items={slidesData.tableOfContents}
        activeIndex={activeSection}
        onNavigate={scrollToSection}
      />
      
      {/* Progress indicators */}
      <ProgressIndicator
        sections={slidesData.tableOfContents}
        activeIndex={activeSection}
        scrollProgress={scrollProgress}
        onNavigate={scrollToSection}
      />
      <MobileProgressBar progress={scrollProgress} />

      {/* ACT 1: Narrative Slides */}
      <article aria-label="Act 1: The Narrative">
        {slidesData.slides.map((slide, index) => (
          <SlideSection
            key={slide.id}
            slide={slide}
            index={index}
          />
        ))}
      </article>

      {/* Quotes Section */}
      <QuotesSection 
        quotes={slidesData.quotes}
        ethicsNote={slidesData.ethicsNote}
      />

      {/* ACT 2: Data Playground */}
      <article aria-label="Act 2: Explore the Data">
        <DataPlayground />
      </article>

      {/* Policy Options */}
      <PolicyGrid options={slidesData.policyOptions} />

      {/* Sources */}
      <SourcesPanel />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;
