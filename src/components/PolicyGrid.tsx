import { useInView } from '@/hooks/useInView';

interface PolicyOption {
  id: string;
  title: string;
  description: string;
  tradeoff: string;
}

interface PolicyGridProps {
  options: PolicyOption[];
}

export function PolicyGrid({ options }: PolicyGridProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="policy-options"
      className={`transition-opacity duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}
      aria-labelledby="policy-title"
    >
      <div className="policy-section">
        <h2 id="policy-title" className="policy-heading">Policy Options</h2>
        <p className="policy-subheading">
          Every lever has costs, politics, and unintended consequences. A rigorous article presents at
          least two competing causal frames—and shows where they agree.
        </p>

        <div className="policy-grid">
          {options.map((option) => (
            <div key={option.id} className="policy-card">
              <h3 className="policy-card-title">{option.title}</h3>
              <p className="policy-card-desc">{option.description}</p>
              <p className="policy-card-tradeoff">{option.tradeoff}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
