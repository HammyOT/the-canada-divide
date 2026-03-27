import { useInView } from '@/hooks/useInView';
import sourcesData from '@/content/sources.json';

const labelStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '0.68rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'hsl(220 15% 38%)',
  marginBottom: '0.6rem',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Source Serif 4', Georgia, serif",
  fontSize: '0.85rem',
  color: 'hsl(220 25% 12%)',
  lineHeight: 1.65,
  whiteSpace: 'pre-line',
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid hsl(30 12% 82%)',
  paddingTop: '1.2rem',
  marginTop: '1.2rem',
};

export function SourcesPanel() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  const groupedSources = sourcesData.sources.reduce((acc, source) => {
    if (!acc[source.category]) acc[source.category] = [];
    acc[source.category].push(source);
    return acc;
  }, {} as Record<string, typeof sourcesData.sources>);

  return (
    <section
      ref={ref}
      id="sources"
      className={`transition-opacity duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}
      aria-labelledby="sources-title"
    >
      <div className="sources-panel">
        <p id="sources-title" className="sources-heading">Sources &amp; Methods</p>

        {Object.entries(groupedSources).map(([category, sources]) => (
          <div key={category} style={{ marginBottom: '1.4rem' }}>
            <p style={labelStyle}>{category}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sources.map((source) => (
                <li key={source.id} style={{ marginBottom: '0.45rem' }}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.85rem', color: 'hsl(220 25% 12%)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                  >
                    {source.label}
                  </a>
                  {source.note && (
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: 'hsl(220 10% 45%)', marginLeft: '0.5rem' }}>
                      — {source.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div style={dividerStyle}>
          <p style={labelStyle}>Methodology</p>
          <p style={bodyStyle}>{sourcesData.methodology.description}</p>
        </div>

      </div>
    </section>
  );
}
