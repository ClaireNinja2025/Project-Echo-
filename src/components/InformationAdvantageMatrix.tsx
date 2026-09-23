import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  Lock, 
  MessageSquare, 
  Radio, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  Info,
  TrendingUp,
  Flame,
  Volume2
} from 'lucide-react';
import { InformationActivityItem, NarrativeIndicator } from '../types';

interface InformationAdvantageMatrixProps {
  activities: InformationActivityItem[];
  narratives: NarrativeIndicator[];
}

export const InformationAdvantageMatrix: React.FC<InformationAdvantageMatrixProps> = ({
  activities,
  narratives,
}) => {
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('ALL');

  const fiveActivities = [
    {
      id: 'Enable',
      label: '1. ENABLE',
      color: 'border-blue-500 text-blue-400 bg-blue-950/40',
      description: 'Improve situational understanding, civil COP data fabric, decision-support, and comms awareness.',
    },
    {
      id: 'Protect',
      label: '2. PROTECT',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
      description: 'Identify civil critical infrastructure vulnerabilities, protect trusted civil data, source integrity.',
    },
    {
      id: 'Inform',
      label: '3. INFORM',
      color: 'border-cyan-500 text-cyan-400 bg-cyan-950/40',
      description: 'Support accurate, timely public communication using verified civil context; synchronize with PAO.',
    },
    {
      id: 'Influence',
      label: '4. INFLUENCE',
      color: 'border-amber-500 text-amber-400 bg-amber-950/40',
      description: 'Support authorized PSYOP/MISO with aggregate civil context and assessment; human/authority approval required.',
    },
    {
      id: 'Attack',
      label: '5. ATTACK',
      color: 'border-rose-500 text-rose-400 bg-rose-950/40',
      description: 'Provide civilian-impact dependency analysis to operational planners; CIO is not the execution mechanism.',
    },
  ];

  const filteredActivities =
    selectedActivityFilter === 'ALL'
      ? activities
      : activities.filter((a) => a.activity === selectedActivityFilter);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6">
      {/* Doctrinal Architecture Header & Boundary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                Army Information Advantage & Joint OIE Alignment
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  ADP 3-13 / JP 3-04
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                CIO acts as a decision-support fabric linking civil knowledge to the five information activities.
              </p>
            </div>
          </div>
        </div>

        {/* Ethical & Statutory Guardrails Callout */}
        <div className="bg-slate-950 p-3 rounded-lg border border-amber-800/60 flex items-start gap-3 text-xs text-slate-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 uppercase tracking-wide">
              Doctrinal & Oversight Governance Rule:
            </span>
            <p className="text-slate-400 leading-relaxed">
              In accordance with DoD Directive 5240.01 (Intelligence Oversight) and ADP 3-13, individual-level psychological profiling or covert targeting is strictly prohibited in the CIO. All audience sentiment, narrative velocity, and resilience models operate strictly on <strong className="text-slate-200">aggregate population-level datasets</strong>. Public Affairs (informing) and MISO (influencing approved foreign audiences) maintain separate statutory authorities and approval chains.
            </p>
          </div>
        </div>
      </div>

      {/* The 5 Army Information Activities Grid (ADP 3-13) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span>Five Information Activities (ADP 3-13 Framework)</span>
          </h3>
          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setSelectedActivityFilter('ALL')}
              className={`px-2.5 py-1 rounded font-mono ${
                selectedActivityFilter === 'ALL'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL (5)
            </button>
            {fiveActivities.map((fa) => (
              <button
                key={fa.id}
                onClick={() => setSelectedActivityFilter(fa.id)}
                className={`px-2 py-1 rounded font-mono text-xs ${
                  selectedActivityFilter === fa.id
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {fa.id}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Activity Definitions Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {fiveActivities.map((fa) => (
            <div
              key={fa.id}
              onClick={() => setSelectedActivityFilter(fa.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${fa.color} ${
                selectedActivityFilter === fa.id ? 'ring-1 ring-emerald-400 shadow-md' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <h4 className="font-bold text-xs font-mono">{fa.label}</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">{fa.description}</p>
            </div>
          ))}
        </div>

        {/* Activity Items Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
                    ACTIVITY: {act.activity.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      act.approvalStatus === 'Approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : act.approvalStatus === 'Staff Review'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {act.approvalStatus}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{act.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{act.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1">
                <div className="text-slate-400">
                  <span className="font-mono text-slate-500">CIVIL INTEGRATION: </span>
                  <span className="text-slate-300">{act.civilConnection}</span>
                </div>
                <div className="text-slate-500 font-mono text-[10px]">
                  Authority: <span className="text-slate-400">{act.authority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aggregate Narrative & Community Resilience Tracker (Section 6) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Aggregate Information Environment & Community Resilience
            </h3>
            <p className="text-xs text-slate-400">
              Longitudinal indicators of institutional trust, rumor void detection, and social cohesion across aggregate community segments.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
            AGGREGATE AUDIENCE ONLY (NO PII)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {narratives.map((nar) => (
            <div
              key={nar.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                nar.rumorFlag
                  ? 'bg-amber-950/20 border-amber-700/60'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400">{nar.audienceSegment}</span>
                  {nar.rumorFlag && (
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-mono border border-rose-800 font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      RUMOR VOID FLAG
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-100">{nar.theme}</h4>

                {/* Trust score gauge */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Institutional Trust Score:</span>
                    <span
                      className={`font-bold ${
                        nar.trustScore > 70
                          ? 'text-emerald-400'
                          : nar.trustScore > 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {nar.trustScore}/100 ({nar.velocity} Velocity)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        nar.trustScore > 70
                          ? 'bg-emerald-500'
                          : nar.trustScore > 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${nar.trustScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Recommended Civil Action */}
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-xs">
                <span className="text-[10px] font-mono text-emerald-400 block font-semibold mb-0.5">
                  RECOMMENDED PA / CIVIL SYNCHRONIZATION:
                </span>
                <p className="text-slate-300 text-[11px]">{nar.recommendedCounteraction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
