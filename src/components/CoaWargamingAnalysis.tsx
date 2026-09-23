import React, { useState } from 'react';
import { 
  Scale, 
  ShieldAlert, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  Compass, 
  Play, 
  RotateCcw, 
  ArrowRight,
  Shield,
  HelpCircle
} from 'lucide-react';
import { DOCTRINAL_COAS, DetailedCoa, WargameTurn } from '../data/doctrineAnalyticsData';

export const CoaWargamingAnalysis: React.FC = () => {
  const [selectedCoaId, setSelectedCoaId] = useState<string>(DOCTRINAL_COAS[0].id);
  const [activeTurnNumber, setActiveTurnNumber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'WARGAMING_SIMULATOR' | 'COA_COMPARISON_MATRIX'>('WARGAMING_SIMULATOR');

  const selectedCoa = DOCTRINAL_COAS.find((c) => c.id === selectedCoaId) || DOCTRINAL_COAS[0];
  const activeTurn = selectedCoa.wargameTurns.find((t) => t.turnNumber === activeTurnNumber) || selectedCoa.wargameTurns[0];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-white font-mono">
                COA Development & Civil-Military Wargaming Suite
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                FM 5-0 MDMP STEPS 3 & 4 / FM 3-57
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Action-Reaction-Counteraction matrix simulation, second/third-order civil consequence modeling, and decision point triggers.
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewMode('WARGAMING_SIMULATOR')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              viewMode === 'WARGAMING_SIMULATOR'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Wargaming Simulator</span>
          </button>
          <button
            onClick={() => setViewMode('COA_COMPARISON_MATRIX')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              viewMode === 'COA_COMPARISON_MATRIX'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>FM 5-0 Screening Matrix</span>
          </button>
        </div>
      </div>

      {/* COA Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DOCTRINAL_COAS.map((coa) => {
          const isSelected = coa.id === selectedCoaId;
          return (
            <div
              key={coa.id}
              onClick={() => {
                setSelectedCoaId(coa.id);
                setActiveTurnNumber(1);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/80 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono text-amber-400 font-bold">{coa.name.split(':')[0]}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      coa.residualCivilianRisk === 'LOW'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    Risk: {coa.residualCivilianRisk}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {coa.name.split(':')[1] || coa.name}
                </h3>
                <span className="text-[10.5px] font-mono text-cyan-400 block mt-1">
                  {coa.doctrineType.split('/')[0]}
                </span>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {coa.commandersIntent}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Feasibility:</span>
                <span className="font-bold text-emerald-400">{coa.feasibilityScore}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW 1: WARGAMING SIMULATOR (ACTION - REACTION - COUNTERACTION) */}
      {viewMode === 'WARGAMING_SIMULATOR' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 shadow-md">
          {/* Turn Navigator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                FM 5-0 STEP 4: WARGAME SYNCHRONIZATION RUNNER
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedCoa.name}</h3>
            </div>

            {/* Turn Buttons */}
            <div className="flex items-center gap-2 font-mono text-xs">
              {selectedCoa.wargameTurns.map((turn) => (
                <button
                  key={turn.turnNumber}
                  onClick={() => setActiveTurnNumber(turn.turnNumber)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTurnNumber === turn.turnNumber
                      ? 'bg-amber-600 text-white font-bold shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>TURN {turn.turnNumber}</span>
                  <span className="text-[10px] opacity-75">({turn.timeframe.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Turn Header */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-amber-300 font-bold">
              PHASE: {activeTurn.timeframe}
            </span>
            <span className="text-slate-400">
              Turn {activeTurn.turnNumber} of {selectedCoa.wargameTurns.length}
            </span>
          </div>

          {/* Action - Reaction - Counteraction Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Friendly Action */}
            <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/60 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-400 font-mono font-bold text-xs border-b border-slate-800 pb-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>1. FRIENDLY CIVIL-MILITARY ACTION</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeTurn.action}</p>
            </div>

            {/* 2. Threat & Civil Reaction */}
            <div className="bg-slate-950 p-4 rounded-xl border border-red-900/60 space-y-3">
              <div className="flex items-center gap-1.5 text-red-400 font-mono font-bold text-xs border-b border-slate-800 pb-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>2. THREAT & CIVIL REACTION</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-red-400 block mb-0.5">THREAT REACTION:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{activeTurn.threatReaction}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-amber-400 block mb-0.5">CIVILIAN POPULATION REACTION:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{activeTurn.civilReaction}</p>
              </div>
            </div>

            {/* 3. Coalition Counteraction */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs border-b border-slate-800 pb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>3. FRIENDLY COUNTERACTION</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeTurn.counteraction}</p>
            </div>
          </div>

          {/* Second & Third-Order Effects + Decision Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* 2nd & 3rd Order Civil Cascades */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-400" />
                2nd & 3rd-Order Civil Cascade Effects
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans pt-1">
                {activeTurn.secondThirdOrderEffects.map((eff, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                    <span>{eff}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Decision Point & CCIR Trigger */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Commander Decision Point (DP)
                </span>
                <p className="text-xs text-slate-200 font-sans mt-1 leading-relaxed">
                  {activeTurn.decisionPoint}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10.5px] font-mono text-cyan-400 block font-bold">
                  CCIR / PIR TRIGGER:
                </span>
                <p className="text-[11.5px] font-mono text-slate-300 mt-0.5">
                  {activeTurn.ccirTriggered}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FM 5-0 SCREENING CRITERIA COMPARISON MATRIX */}
      {viewMode === 'COA_COMPARISON_MATRIX' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-md">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              Doctrinal COA Comparison Matrix (FM 5-0 Screening Criteria)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating all 3 COAs against the mandatory doctrinal criteria: Feasibility, Acceptability, Suitability, Distinguishability, and Completeness.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">COA OPTION</th>
                  <th className="p-3">FEASIBILITY</th>
                  <th className="p-3">ACCEPTABILITY</th>
                  <th className="p-3">SUITABILITY</th>
                  <th className="p-3">DISTINGUISHABILITY</th>
                  <th className="p-3">COMPLETENESS</th>
                  <th className="p-3">CIVIL RISK</th>
                  <th className="p-3">OVERALL RECOMMENDATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {DOCTRINAL_COAS.map((coa) => (
                  <tr key={coa.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      {coa.name.split(':')[0]}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal truncate max-w-xs">
                        {coa.name.split(':')[1]}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-400">{coa.feasibilityScore}%</td>
                    <td className="p-3 font-bold text-cyan-400">{coa.acceptabilityScore}%</td>
                    <td className="p-3 font-bold text-blue-400">{coa.suitabilityScore}%</td>
                    <td className="p-3 font-bold text-purple-400">{coa.distinguishabilityScore}%</td>
                    <td className="p-3 font-bold text-amber-400">{coa.completenessScore}%</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          coa.residualCivilianRisk === 'LOW'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {coa.residualCivilianRisk}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-sans text-xs">
                      {coa.id === 'coa-1'
                        ? 'PRIMARY RECOMMENDED (High infrastructure protection)'
                        : coa.id === 'coa-2'
                        ? 'SUPPORTING EFFORT (Grassroots alternative)'
                        : 'INFORMATION SHIELD (Enabling activity)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
