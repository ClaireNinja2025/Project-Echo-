import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  FileSpreadsheet, 
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';
import { CourseOfAction } from '../types';

interface DecisionSupportCOAProps {
  coursesOfAction: CourseOfAction[];
}

export const DecisionSupportCOA: React.FC<DecisionSupportCOAProps> = ({
  coursesOfAction,
}) => {
  const [selectedCoaId, setSelectedCoaId] = useState<string>(coursesOfAction[0].id);
  const selectedCoa = coursesOfAction.find((c) => c.id === selectedCoaId) || coursesOfAction[0];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Commander's Decision Support & COA Civilian Consequence Estimator
            </h2>
            <p className="text-xs text-slate-400">
              Quantify and compare the civilian systemic impact across proposed military courses of action.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
            MDMP STEP 4: COA ANALYSIS (WAR-GAMING)
          </span>
        </div>
      </div>

      {/* Side-by-Side COA Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coursesOfAction.map((coa) => {
          const isSelected = coa.id === selectedCoaId;
          return (
            <div
              key={coa.id}
              onClick={() => setSelectedCoaId(coa.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/80 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-emerald-400">{coa.name.split(':')[0]}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      coa.displacementRisk === 'Low'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : coa.displacementRisk === 'Moderate'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    Displacement: {coa.displacementRisk}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{coa.name.split(':')[1] || coa.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                  {coa.description}
                </p>
              </div>

              {/* Key Quantitative Metrics */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Affected Civilians:</span>
                  <span className="font-bold text-slate-200">
                    {coa.estimatedAffectedCivilians.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Disruption:</span>
                  <span
                    className={`font-bold ${
                      coa.serviceDisruptionScore < 30
                        ? 'text-emerald-400'
                        : coa.serviceDisruptionScore < 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {coa.serviceDisruptionScore}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Governance Stability:</span>
                  <span
                    className={`font-bold ${
                      coa.governanceStabilityImpact.startsWith('+')
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {coa.governanceStabilityImpact}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transition Feasibility:</span>
                  <span className="font-bold text-cyan-400">{coa.transitionFeasibility}</span>
                </div>
              </div>

              <button
                className={`w-full py-1.5 rounded text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isSelected ? 'Currently Selected for War-Gaming' : 'Select for Detailed View'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Detailed Analysis of Selected COA */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">SELECTED COURSE OF ACTION</span>
            <h3 className="text-base font-bold text-white">{selectedCoa.name}</h3>
          </div>
          <button
            onClick={() => alert(`COA Briefing packet prepared for ${selectedCoa.name}`)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export COA Decision Brief</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Second and Third Order Effects */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-amber-400 font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Second- & Third-Order Civilian Effects
            </h4>
            <ul className="space-y-2">
              {selectedCoa.secondThirdOrderEffects.map((eff, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{eff}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Civil Affairs Mitigations */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-emerald-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pre-Planned Civil Affairs Mitigations
            </h4>
            <ul className="space-y-2">
              {selectedCoa.keyMitigations.map((mit, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{mit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CCIR Trigger Monitor */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-300 font-bold">ACTIVE CIVIL CCIR THRESHOLDS</span>
            <span className="text-emerald-400">JTF COMMANDER DIRECTED</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1"></span>
              <div>
                <strong className="text-slate-200 block font-mono">CCIR 2.1 (Water Infrastructure):</strong>
                Municipal water pumping dropping below 50% capacity triggers immediate CMOC dispatch of mobile purification assets.
              </div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1"></span>
              <div>
                <strong className="text-slate-200 block font-mono">CCIR 2.4 (Displacement Surge):</strong>
                IDP flow exceeding 5,000 persons within a 12-hour period along MSR Cedar requires immediate emergency relief corridor opening.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
