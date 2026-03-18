import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toPng } from 'html-to-image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';
import sampleData from '@/data/sampleData.json';

type TabId = 'housing' | 'wages' | 'education';

const tabs: { id: TabId; label: string }[] = [
  { id: 'housing', label: 'Housing Affordability' },
  { id: 'wages', label: 'Wages vs. Prices' },
  { id: 'education', label: 'Tuition Costs' },
];

const C = {
  ink: 'hsl(220, 25%, 12%)',
  accent: 'hsl(0, 68%, 42%)',
  mid: 'hsl(220, 15%, 38%)',
  grid: 'hsl(30, 12%, 82%)',
  text: 'hsl(220, 15%, 38%)',
  tooltip: { bg: 'hsl(40, 20%, 95%)', border: 'hsl(30, 12%, 82%)' },
};

export function DataPlayground() {
  const reducedMotion = useReducedMotion();
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.08 });
  const [activeTab, setActiveTab] = useState<TabId>('housing');
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!chartRef.current) return;
    try {
      const url = await toPng(chartRef.current, { backgroundColor: 'hsl(40,30%,97%)', pixelRatio: 2 });
      const a = document.createElement('a');
      a.download = `chart-${activeTab}-${Date.now()}.png`;
      a.href = url;
      a.click();
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  const tooltipStyle = {
    backgroundColor: C.tooltip.bg,
    border: `1px solid ${C.tooltip.border}`,
    borderRadius: '2px',
    color: C.ink,
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
  };

  const axisProps = {
    stroke: C.grid,
    tick: { fill: C.text, fontSize: 11, fontFamily: "'Inter', sans-serif" },
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'housing':
        return (
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={sampleData.housingAffordability} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis
                {...axisProps}
                domain={[0.2, 0.6]}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(v) => `Year: ${v}`}
                formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, 'Affordability Index']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: "'Inter', sans-serif" }} />
              <Line
                type="monotone"
                dataKey="index"
                name="Housing Affordability Index"
                stroke={C.ink}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: C.ink }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'wages':
        return (
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={sampleData.wagesVsCpi} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis
                {...axisProps}
                domain={[85, 190]}
                label={{ value: 'Index (2005=100)', angle: -90, position: 'insideLeft', fill: C.text, fontSize: 11, fontFamily: "'Inter', sans-serif" }}
              />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => `Year: ${v}`} />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: "'Inter', sans-serif" }} />
              <Line type="monotone" dataKey="wageIndex" name="Wage Growth" stroke={C.ink} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="cpiIndex" name="Consumer Price Index" stroke={C.accent} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: C.accent }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'education':
        return (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={sampleData.educationCosts} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis
                {...axisProps}
                domain={[0, 9000]}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(v) => `${v}/${Number(v) + 1} Academic Year`}
                formatter={(v: number) => [`$${v.toLocaleString()}`, 'Avg. Tuition']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: "'Inter', sans-serif" }} />
              <Bar dataKey="tuition" name="Canadian Undergraduate Tuition" fill={C.ink} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const meta: Record<TabId, { title: string; note: string; source: string }> = {
    housing: {
      title: 'Housing Affordability Index, 1990–2025',
      note: 'Mortgage payments as a share of average household disposable income. Higher = less affordable.',
      source: 'Bank of Canada housing affordability index (INDINF_AFFORD_Q)',
    },
    wages: {
      title: 'Wage Growth vs. Consumer Prices, 2001–2025',
      note: 'Both series rebased to 2005=100. When the red CPI line rises faster than the black wage line, real purchasing power falls.',
      source: 'Statistics Canada Tables 14-10-0222-01 (wages) & 18-10-0006-01 (CPI)',
    },
    education: {
      title: 'Average Canadian Undergraduate Tuition, 2007–2026',
      note: 'Annual tuition fees in current dollars. Does not include living costs, books, or student loan interest.',
      source: 'Statistics Canada Table 37-10-0045-01',
    },
  };

  const current = meta[activeTab];

  return (
    <section
      ref={ref}
      id="data-playground"
      className="data-playground-section"
      aria-labelledby="data-title"
    >
      <motion.div
        className="data-playground-inner"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
      >
        <div className="data-playground-header">
          <div>
            <p className="data-playground-kicker">Interactive Data</p>
            <h2 id="data-title" className="data-playground-heading">Explore the Numbers</h2>
            <p className="data-playground-sub">
              Switch between charts to see the data behind each section of the article.
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="data-download-btn"
            title="Download chart as PNG"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PNG
          </button>
        </div>

        {/* Tab bar */}
        <div className="data-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`data-tab ${activeTab === tab.id ? 'data-tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="data-chart-card">
          <div className="data-chart-meta">
            <p className="data-chart-title">{current.title}</p>
            <p className="data-chart-note">{current.note}</p>
          </div>
          <div ref={chartRef} style={{ padding: '8px 0' }}>
            {renderChart()}
          </div>
          <p className="data-chart-source">Source: {current.source}</p>
        </div>

        {/* How to read */}
        <div className="data-info-row">
          <div className="data-info-card">
            <p className="data-info-label">How to read</p>
            <ul className="data-info-list">
              <li>Hover over any point or bar for the exact value</li>
              <li>Housing index: share of income spent on a mortgage</li>
              <li>Wages/CPI: indexed to 2005=100 for a fair comparison</li>
              <li>Click "Download PNG" to save the chart</li>
            </ul>
          </div>
          <div className="data-info-card">
            <p className="data-info-label">Limitations</p>
            <ul className="data-info-list">
              <li>National averages mask regional variation (Toronto, Vancouver differ significantly)</li>
              <li>Real vs. nominal values differ; tuition shown in current dollars</li>
              <li>Survey methodologies change over time</li>
              <li>Generational boundaries are approximate</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
