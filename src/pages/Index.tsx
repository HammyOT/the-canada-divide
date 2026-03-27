import { useMemo } from 'react';
import { SlideSection, SlideData } from '@/components/SlideSection';
import { HeroSection } from '@/components/HeroSection';
import { NewsNav } from '@/components/NewsNav';
import { DataPlayground } from '@/components/DataPlayground';
import { PolicyGrid } from '@/components/PolicyGrid';
import { SourcesPanel } from '@/components/SourcesPanel';
import { Footer } from '@/components/Footer';
import { PhotoBreak } from '@/components/PhotoBreak';
import { DataTable } from '@/components/DataTable';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import slidesDataRaw from '@/content/slides.json';

import photoHousing from '@/assets/photo-housing.jpg';
import photoGroceries from '@/assets/photo-groceries.jpg';
import photoCampus from '@/assets/photo-campus.jpg';

const slidesData = {
  ...slidesDataRaw,
  slides: slidesDataRaw.slides as SlideData[],
};

const photoBreaks: Record<number, { src: string; alt: string; caption: string; credit: string }> = {
  1: {
    src: photoHousing,
    alt: 'A student outside apartment buildings in Waterloo, Ontario',
    caption: 'Waterloo, Ontario. Rental apartments near university campuses have seen sharp price increases in recent years — a pressure felt first by students, and then by graduates trying to stay.',
    credit: 'Photo: Hamza Ahmadi',
  },
  3: {
    src: photoGroceries,
    alt: 'Produce and grocery aisles inside a Walmart in Waterloo, Ontario',
    caption: 'Waterloo, Ontario. The cost of essentials has risen alongside broader inflation, while wage growth has remained comparatively modest. For many households, this has meant that even as earnings increase in real terms, everyday expenses continue to absorb a large share of income.',
    credit: 'Photo: Hamza Ahmadi',
  },
  4: {
    src: photoCampus,
    alt: 'Students with backpacks walking through a hallway at the University of Waterloo',
    caption: 'University of Waterloo. Between tuition, rent, and groceries, students today carry a financial load that previous generations did not — and the debt follows them long after graduation.',
    credit: 'Photo: Hamza Ahmadi',
  },
};

const homeownershipData = {
  caption: 'Homeownership rate by age group, Canada',
  source: 'Statistics Canada — National Household Survey (2011) and Census (2016, 2021)',
  columns: ['Age group', '2011', '2016', '2021'],
  rows: [
    ['25–29', '44.1%', '39.6%', '36.5%'],
    ['30–34', '59.2%', '55.0%', '52.3%'],
    ['35–39', '67.1%', '63.5%', '61.5%'],
    ['70–74', '75.5%', '75.8%', '74.8%'],
  ],
  highlight: [0, 1, 2],
};

const netWorthData = {
  caption: 'Median net worth by age of major income recipient (constant 2023 dollars)',
  source: 'Statistics Canada — Survey of Financial Security, 1999–2023',
  columns: ['Age group', '1999', '2012', '2016', '2019', '2023'],
  rows: [
    ['Under 35', '$30,000', '$32,600', '$43,000', '$56,400', '$159,100'],
    ['35–44', '$161,200', '$235,600', '$268,600', '$270,800', '$409,300'],
    ['55–64', '$457,300', '$688,900', '$819,200', '$797,000', '$873,400'],
  ],
  highlight: [0],
};

const Index = () => {
  const sectionIds = useMemo(() =>
    slidesData.tableOfContents.map(item => item.id),
    []
  );

  const { activeSection, scrollToSection } = useScrollProgress({ sectionIds });

  return (
    <main className="relative bg-paper min-h-screen custom-scrollbar">
      <a
        href="#hook"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <NewsNav
        items={slidesData.tableOfContents}
        activeIndex={activeSection}
        onNavigate={scrollToSection}
      />

      <HeroSection title={slidesData.slides[0].title} id={slidesData.slides[0].id} />

      <div className="article-wrapper">
        <div className="article-meta">
          <p className="article-section-label">Special Report</p>
          <h2 className="article-deck">
            For decades, Canada sold a familiar promise. Study hard. Find work. Rent your first place. Save up. Maybe buy a home. For a growing share of younger adults, that promise no longer holds.
          </h2>
          <div className="article-byline-row">
            <span className="article-byline">Hamza A</span>
            <span className="article-date">March 2026</span>
          </div>
          <div className="article-rule" />
        </div>

        <article aria-label="Generational Inequality in Canada">
          {slidesData.slides.map((slide, index) => (
            <div key={slide.id}>
              <SlideSection slide={slide} index={index} />

              {slide.id === 'housing' && (
                <DataTable
                  caption={homeownershipData.caption}
                  source={homeownershipData.source}
                  columns={homeownershipData.columns}
                  rows={homeownershipData.rows}
                  highlightRows={homeownershipData.highlight}
                />
              )}

              {slide.id === 'wealth' && (
                <DataTable
                  caption={netWorthData.caption}
                  source={netWorthData.source}
                  columns={netWorthData.columns}
                  rows={netWorthData.rows}
                  highlightRows={netWorthData.highlight}
                />
              )}

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
      </div>

      <DataPlayground />
      <PolicyGrid options={slidesData.policyOptions} />
      <SourcesPanel />
      <Footer />
    </main>
  );
};

export default Index;
