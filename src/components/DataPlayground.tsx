import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { toPng } from 'html-to-image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import sampleData from '@/data/sampleData.json';

type TabId = 'housing' | 'wages' | 'education';

const tabs: { id: TabId; label: string }[] = [
  { id: 'housing', label: 'Housing' },
  { id: 'wages', label: 'Wages & Prices' },
  { id: 'education', label: 'Education' },
];

const CHART_COLORS = {
  primary: 'hsl(220, 20%, 10%)',
  secondary: 'hsl(0, 65%, 48%)',
  tertiary: 'hsl(220, 15%, 45%)',
  grid: 'hsl(30, 15%, 85%)',
  text: 'hsl(220, 10%, 40%)',
};

const tooltipStyle = {
  backgroundColor: 'hsl(40, 33%, 96%)',
  border: '1px solid hsl(30, 15%, 82%)',
  borderRadius: '2px',
  color: 'hsl(220, 20%, 10%)',
  fontFamily: 'Merriweather, Georgia, serif',
  fontSize: '13px',
};

export function DataPlayground() {
  const reducedMotion = useReducedMotion();
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState<TabId>('housing');
  const [region, setRegion] = useState<'national' | 'ontario'>('national');
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await toPng(chartRef.current, {
          backgroundColor: '#f5f0e8',
          pixelRatio: 2,
        });
        const link = document.createElement('a');
        link.download = `chart-${activeTab}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export chart:', err);
      }
    }
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'housing':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sampleData.housingAffordability}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="year" stroke={CHART_COLORS.text} tick={{ fill: CHART_COLORS.text, fontSize: 12 }} />
              <YAxis stroke={CHART_COLORS.text} tick={{ fill: CHART_COLORS.text, fontSize: 12 }} domain={[0, 350]}
                label={{ value: 'Index (2005=100)', angle: -90, position: 'insideLeft', fill: CHART_COLORS.text, fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => `Year: ${v}`} formatter={(v: number) => [`${v}`, 'Affordability Index']} />
              <Legend />
              <Line type="monotone" dataKey="index" name="Housing Affordability Index" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'wages':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sampleData.wagesVsCpi}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="year" stroke={CHART_COLORS.text} tick={{ fill: CHART_COLORS.text, fontSize: 12 }} />
              <YAxis stroke={CHART_COLORS.text} tick={{ fill: CHART_COLORS.text, fontSize: 12 }} domain={[90, 170]}
                label={{ value: 'Index (2005=100)', angle: -90, position: 'insideLeft', fill: CHART_COLORS.text, fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => `Year: ${v}`} />
              <Legend />
              <Line type="monotone" dataKey="wageIndex" name="Wage Growth" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 2 }} />
              <Line type="monotone" dataKey="cpiIndex" name="Consumer Price Index" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={{ fill: CHART_COLORS.secondary, r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'education':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sampleData.educationCosts.filter((_, i) => i % 2 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="year" stroke={CHART_COLORS.text} tick={{ fill: CHART_COLORS.text, fontSize: 12 }} />
              <YAxis stroke={CHART_COLORS.text} tick={{ fill: CHART_COLORS.text, fontSize: 12 }} domain={[0, 280]}
                label={{ value: 'Index (2005=100)', angle: -90, position: 'insideLeft', fill: CHART_COLORS.text, fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => `Year: ${v}`} />
              <Legend />
              <Bar dataKey="tuitionIndex" name="Tuition Costs" fill={CHART_COLORS.primary} radius={[2, 2, 0, 0]} />
              <Bar dataKey="debtIndex" name="Student Debt" fill={CHART_COLORS.tertiary} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const chartMeta: Record<TabId, { title: string; desc: string }> = {
    housing: {
      title: 'Housing Affordability Index (2005–2024)',
      desc: 'Higher values indicate worse affordability. The index combines home prices and mortgage rates relative to median incomes.',
    },
    wages: {
      title: 'Wage Growth vs Consumer Prices (2005–2024)',
      desc: 'The gap between the lines shows how purchasing power has eroded. When CPI rises faster than wages, real income falls.',
    },
    education: {
      title: 'Education Costs & Student Debt (2005–2024)',
      desc: 'Both tuition costs and total student debt have grown faster than inflation, increasing the burden on new graduates.',
    },
  };

  return (
    <section ref={ref} id="data-playground" className="relative py-24 md:py-32 bg-background" aria-labelledby="data-title">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 16 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="mb-10"
        >
          <span className="kicker mb-3 block">Act 2</span>
          <div className="nyt-rule-thick mb-4" />
          <h2 id="data-title" className="text-headline font-bold text-foreground mb-3 font-serif">
            Explore the Data
          </h2>
          <p className="text-muted-foreground font-serif">
            Dig into the numbers behind the narrative. Filter by topic and download charts.
          </p>
        </motion.div>

        {/* Placeholder banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.2 }}
          className="mb-8 py-3 border-y border-accent/30 flex items-start gap-3"
        >
          <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <p className="font-medium text-foreground text-sm">Placeholder Data</p>
            <p className="text-sm text-muted-foreground">
              All charts use sample data. Replace with real StatCan/CMHC data before publication.
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.3 }}
          className="flex gap-0 border-b border-foreground/15 mb-8"
          role="tablist"
          aria-label="Data categories"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors focus-ring touch-target -mb-px border-b-2",
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.4 }}
          className="chart-container mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground font-serif">{chartMeta[activeTab].title}</h3>
              <p className="text-sm text-muted-foreground mt-1 font-serif">{chartMeta[activeTab].desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as 'national' | 'ontario')}
                className="px-3 py-2 border border-foreground/15 text-sm text-foreground bg-background focus-ring"
                aria-label="Select region"
              >
                <option value="national">Canada (National)</option>
                <option value="ontario">Ontario (Placeholder)</option>
              </select>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 border border-foreground/15 text-foreground hover:bg-muted/50 transition-colors focus-ring touch-target text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span className="hidden sm:inline">Download PNG</span>
              </button>
            </div>
          </div>
          <div ref={chartRef} className="py-4">{renderChart()}</div>
        </motion.div>

        {/* How to read + Limitations — two-column text, no cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.5 }}
          className="grid md:grid-cols-2 gap-8 border-t border-foreground/15 pt-8"
        >
          <div>
            <h4 className="kicker mb-3">How to Read</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-serif">
              <li>• All indices are normalized to 2005 = 100</li>
              <li>• Higher values indicate growth from baseline</li>
              <li>• Hover over points for exact values</li>
              <li>• Download charts for presentations</li>
            </ul>
          </div>
          <div>
            <h4 className="kicker mb-3">Limitations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-serif">
              <li>• National averages mask regional variation</li>
              <li>• Survey methodologies change over time</li>
              <li>• Generational boundaries are approximate</li>
              <li>• Real vs nominal values differ significantly</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
