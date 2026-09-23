import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Filter, 
  Info, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  BarChart,
  Calendar
} from 'lucide-react';
import { 
  DOCTRINAL_MOPS, 
  DOCTRINAL_MOES, 
  MopItem, 
  MoeItem 
} from '../data/doctrineAnalyticsData';

export const MoeMopAssessment: React.FC = () => {
  const [selectedLoeFilter, setSelectedLoeFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'MOE' | 'MOP' | 'CAUSAL_MATRIX'>('MOE');

  const loeList = [
    'ALL',
    'LOE 1: Civil Governance Legitimacy',
    'LOE 2: Essential Services Resilience',
    'LOE 3: Information Advantage & Cognitive Defense',
    'LOE 4: Alternative Economic Livelihoods',
  ];

  const filteredMops = DOCTRINAL_MOPS.filter((m) =>
    selectedLoeFilter === 'ALL' ? true : m.lineOfEffort.includes(selectedLoeFilter.split(':')[0])
  );

  const filteredMoes = DOCTRINAL_MOES.filter((m) =>
    selectedLoeFilter === 'ALL' ? true : m.lineOfEffort.includes(selectedLoeFilter.split(':')[0])
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6 font-sans">
      {/* Doctrinal Assessment Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-white font-mono">
                Measures of Effectiveness (MOE) & Measures of Performance (MOP)
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                JP 5-0 / FM 3-57 / ATP 3-57.80
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Rigorous civil-military operational assessment distinguishing task performance (MOP) from systemic system effects (MOE).
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('MOE')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'MOE'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MOEs (System Effects)
          </button>
          <button
            onClick={() => setActiveTab('MOP')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'MOP'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MOPs (Task Execution)
          </button>
          <button
            onClick={() => setActiveTab('CAUSAL_MATRIX')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'CAUSAL_MATRIX'
                ? 'bg-purple-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Causal Traceability Matrix
          </button>
        </div>
      </div>

      {/* Doctrinal Definition Anchor Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-blue-900/60 rounded-xl p-3.5 space-y-1 text-xs">
          <div className="flex items-center justify-between text-blue-300 font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              MEASURE OF PERFORMANCE (MOP)
            </span>
            <span className="text-[10px] text-slate-400">"Are we doing things right?"</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Evaluates <strong>friendly task execution, inputs, and outputs</strong> (e.g., number of Key Leader Engagements held, metric tons of seed distributed, generator fuel deliveries made).
          </p>
        </div>

        <div className="bg-slate-900/80 border border-emerald-900/60 rounded-xl p-3.5 space-y-1 text-xs">
          <div className="flex items-center justify-between text-emerald-300 font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              MEASURE OF EFFECTIVENESS (MOE)
            </span>
            <span className="text-[10px] text-slate-400">"Are we doing the right things?"</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Evaluates <strong>system state change and behavioral shifts</strong> in the operational environment (e.g., civilian trust in security forces, reduction in illicit network extortion freedom of action, water continuity).
          </p>
        </div>
      </div>

      {/* Line of Effort Filter Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
        <span className="text-slate-500 font-bold whitespace-nowrap">LINE OF EFFORT:</span>
        {loeList.map((loe) => (
          <button
            key={loe}
            onClick={() => setSelectedLoeFilter(loe)}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              selectedLoeFilter === loe
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {loe === 'ALL' ? 'ALL LINES OF EFFORT' : loe.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Tab 1: Measures of Effectiveness (MOE) Dashboard */}
      {activeTab === 'MOE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMoes.map((moe) => (
              <div
                key={moe.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-cyan-400 font-bold">{moe.lineOfEffort}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        moe.status === 'ON_TARGET'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {moe.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{moe.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    <strong className="text-slate-300">Desired End State:</strong> {moe.desiredEndState}
                  </p>
                </div>

                {/* Score Progress Gauge */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-slate-500 text-[10px] block">BASELINE</span>
                      <span className="font-bold text-slate-400">{moe.baselineScore}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">CURRENT</span>
                      <span className="font-bold text-emerald-400 text-sm">{moe.currentScore}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">TARGET</span>
                      <span className="font-bold text-cyan-400">{moe.targetScore}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(10, (moe.currentScore / moe.targetScore) * 100)
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Trend: {moe.trend}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Source: {moe.indicatorSource.split('&')[0]}
                    </span>
                  </div>
                </div>

                {/* Doctrinal Assessment Note */}
                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 text-xs">
                  <span className="text-slate-500 font-mono text-[10px] block">CIVIL AFFAIRS ASSESSMENT:</span>
                  <p className="text-slate-300 text-[11.5px] mt-0.5 leading-snug">{moe.doctrinalAssessment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Measures of Performance (MOP) Dashboard */}
      {activeTab === 'MOP' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMops.map((mop) => (
              <div
                key={mop.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-blue-300">
                      {mop.category}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        mop.status === 'ON_TRACK'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {mop.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{mop.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{mop.description}</p>
                </div>

                {/* Progress Metric */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-slate-500 text-[10px] block">OUTPUT PROGRESS</span>
                      <span className="text-base font-bold text-white">
                        {mop.actual.toLocaleString()} / {mop.target.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-400">{mop.unit}</span>
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-400">{mop.percentComplete}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, mop.percentComplete)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>Unit: {mop.reportingUnit.split('/')[0]}</span>
                    <span>DTG: {mop.lastUpdatedDTG}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Causal Traceability Matrix (MOP -> MOE -> LOE End State) */}
      {activeTab === 'CAUSAL_MATRIX' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-md">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Doctrinal Causal Traceability Matrix (Tasks &rarr; MOPs &rarr; MOEs &rarr; End-State)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizes how friendly tactical tasks directly contribute to population-level systemic changes.
            </p>
          </div>

          <div className="space-y-4">
            {DOCTRINAL_MOES.map((moe) => {
              const connectedMops = DOCTRINAL_MOPS.filter((m) => moe.causalMopIds.includes(m.id));

              return (
                <div key={moe.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{moe.lineOfEffort}</span>
                      <h4 className="text-sm font-bold text-white">{moe.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400">Current Impact:</span>
                      <span className="text-emerald-400 font-bold">{moe.currentScore} / {moe.targetScore}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 block">
                      DRIVING FRIENDLY TASKS & MOPS (INPUT LEVEL):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {connectedMops.map((mop) => (
                        <div
                          key={mop.id}
                          className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-200 block">{mop.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {mop.actual} of {mop.target} {mop.unit} ({mop.percentComplete}%)
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              mop.status === 'ON_TRACK'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {mop.percentComplete}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
