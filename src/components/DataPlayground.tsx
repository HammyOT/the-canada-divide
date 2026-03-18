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
import { cn } from '@/lib/utils';
import sampleData from '@/data/sampleData.json';

type TabId = 'housing' | 'wages' | 'education' | 'overview';

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  { id: 'housing', label: 'Housing' },
  { id: 'wages', label: 'Wages & Prices' },
  { id: 'education', label: 'Education' },
];

const CHART_COLORS = {
  primary: 'hsl(220, 20%, 10%)',
  secondary: 'hsl(0, 65%, 48%)',
  tertiary: 'hsl(220, 15%, 45%)',
  grid: 'hsl(30, 15%, 82%)',
  text: 'hsl(220, 10%, 40%)',
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
              <XAxis 
                dataKey="year" 
                stroke={CHART_COLORS.text}
                tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              />
              <YAxis 
                stroke={CHART_COLORS.text}
                tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                domain={[0.2, 0.6]}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                label={{ 
                  value: 'Share of Income (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: CHART_COLORS.text,
                  fontSize: 12
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(40, 25%, 93%)',
                  border: '1px solid hsl(30, 15%, 82%)',
                  borderRadius: '4px',
                  color: 'hsl(220, 20%, 10%)'
                }}
                labelFormatter={(value) => `Year: ${value}`}
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Affordability Index']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="index" 
                name="Housing Affordability Index"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, r: 4 }}
                activeDot={{ r: 6, fill: CHART_COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'wages':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sampleData.wagesVsCpi}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis 
                dataKey="year" 
                stroke={CHART_COLORS.text}
                tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              />
              <YAxis 
                stroke={CHART_COLORS.text}
                tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                domain={[85, 185]}
                label={{ 
                  value: 'Index (2005=100)', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: CHART_COLORS.text,
                  fontSize: 12
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(40, 25%, 93%)',
                  border: '1px solid hsl(30, 15%, 82%)',
                  borderRadius: '4px',
                  color: 'hsl(220, 20%, 10%)'
                }}
                labelFormatter={(value) => `Year: ${value}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="wageIndex" 
                name="Wage Growth"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="cpiIndex" 
                name="Consumer Price Index"
                stroke={CHART_COLORS.secondary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.secondary, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'education':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sampleData.educationCosts}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis 
                dataKey="year" 
                stroke={CHART_COLORS.text}
                tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              />
              <YAxis 
                stroke={CHART_COLORS.text}
                tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                domain={[0, 9000]}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                label={{ 
                  value: 'Annual Tuition ($)', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: CHART_COLORS.text,
                  fontSize: 12
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(40, 25%, 93%)',
                  border: '1px solid hsl(30, 15%, 82%)',
                  borderRadius: '4px',
                  color: 'hsl(220, 20%, 10%)'
                }}
                labelFormatter={(value) => `${value}/${Number(value) + 1} Academic Year`}
                formatter={(value: number, name: string) => {
                  if (value === null) return ['-', name];
                  return [`$${value.toLocaleString()}`, name];
                }}
              />
              <Legend />
              <Bar 
                dataKey="tuition" 
                name="Canadian Undergraduate Tuition"
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (activeTab) {
      case 'housing':
        return 'Housing Affordability Index (1990–2025)';
      case 'wages':
        return 'Wage Growth vs Consumer Prices (2001–2025)';
      case 'education':
        return 'Canadian Undergraduate Tuition (2007–2026)';
      default:
        return '';
    }
  };

  const getChartDescription = () => {
    switch (activeTab) {
      case 'housing':
        return 'The affordability index represents mortgage payments as a share of income. Higher values mean housing is less affordable. Source: Bank of Canada.';
      case 'wages':
        return 'Wage data from Statistics Canada Table 14-10-0222-01 (average weekly earnings, January values). CPI from Table 18-10-0006-01. Both rebased to 2005=100.';
      case 'education':
        return 'Average annual tuition fees for Canadian undergraduates. Source: Statistics Canada Table 37-10-0045. Student debt data (NGS, Table 37-10-0036-01) available every 5 years.';
      default:
        return '';
    }
  };

  return (
    <section
      ref={ref}
      id="data-playground"
      className="relative py-24 md:py-32 bg-card/50"
      aria-labelledby="data-title"
    >
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-4 block">
            Act 2
          </span>
          <h2 id="data-title" className="text-headline font-bold text-foreground mb-4">
            Explore the Data
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dig into the numbers behind the narrative. Filter by topic and download charts for your own analysis.
          </p>
        </motion.div>

        {/* Placeholder warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.2 }}
          className="mb-8 p-4 rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-3"
        >
          <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <p className="font-medium text-foreground">Data Sources</p>
            <p className="text-sm text-muted-foreground">
              Housing data: Bank of Canada. CPI data: Statistics Canada. Wage and education charts still use placeholder data.
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 10 }}
          transition={{ delay: reducedMotion ? 0 : 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
          role="tablist"
          aria-label="Data categories"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all focus-ring touch-target",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Chart container */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
          transition={{ delay: reducedMotion ? 0 : 0.4 }}
          className="chart-container mb-8"
        >
          {/* Chart header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{getChartTitle()}</h3>
              <p className="text-sm text-muted-foreground mt-1">{getChartDescription()}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Region toggle (placeholder) */}
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as 'national' | 'ontario')}
                className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus-ring"
                aria-label="Select region"
              >
                <option value="national">Canada (National)</option>
                <option value="ontario">Ontario (Placeholder)</option>
              </select>
              
              {/* Download button */}
              <button
                onClick={handleDownload}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-primary/10 text-primary border border-primary/20",
                  "hover:bg-primary/20 transition-colors focus-ring touch-target"
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span className="hidden sm:inline text-sm font-medium">Download PNG</span>
              </button>
            </div>
          </div>

          {/* Chart */}
          <div ref={chartRef} className="p-4">
            {renderChart()}
          </div>
        </motion.div>

        {/* How to read guide */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
          transition={{ delay: reducedMotion ? 0 : 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="p-6 rounded-xl border border-border/50 bg-card/30">
            <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Read
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Housing index: share of income spent on mortgage</li>
              <li>• Higher values indicate growth from baseline</li>
              <li>• Hover over points for exact values</li>
              <li>• Download charts for presentations</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-xl border border-border/50 bg-card/30">
            <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-destructive/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Limitations
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
