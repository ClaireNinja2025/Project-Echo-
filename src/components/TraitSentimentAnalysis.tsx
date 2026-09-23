import React, { useState } from 'react';
import { 
  Brain, 
  Activity, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Search, 
  BarChart3, 
  PieChart, 
  Sparkles,
  Compass,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { BASEBALL_CARD_ACTORS, BaseballCardActor } from '../data/doctrineAnalyticsData';

interface DemographicCohortSentiment {
  id: string;
  cohortName: string;
  sampleSize: number;
  sentimentScore: number; // -100 to +100
  thirtyDayShift: number; // e.g. +14
  primaryGrievance: string;
  vulnerabilityToAdversaryNarrative: 'HIGH' | 'MODERATE' | 'LOW';
  coalitionTrustLevel: number; // 0 - 100%
  keyInterlocutorToEngage: string;
}

const DEMOGRAPHIC_COHORTS: DemographicCohortSentiment[] = [
  {
    id: 'c-youth',
    cohortName: 'Rural & Urban Youth (Ages 16-24)',
    sampleSize: 2100,
    sentimentScore: -18,
    thirtyDayShift: 12,
    primaryGrievance: 'Lack of legal economic employment; high risk of forced militant recruitment or subversive culture glorification.',
    vulnerabilityToAdversaryNarrative: 'HIGH',
    coalitionTrustLevel: 42,
    keyInterlocutorToEngage: 'Padre Mateo Vega & Maestra Luciana Cruz (Sanctuary Network)',
  },
  {
    id: 'c-farmers',
    cohortName: 'Ejido Farming Families & Co-op Members',
    sampleSize: 1400,
    sentimentScore: 54,
    thirtyDayShift: 28,
    primaryGrievance: 'Illicit armed extortion demands of 20% on avocado and corn harvests; black-market fertilizer costs.',
    vulnerabilityToAdversaryNarrative: 'LOW',
    coalitionTrustLevel: 74,
    keyInterlocutorToEngage: 'Valeria Ramos (Cooperativa Agrícola President)',
  },
  {
    id: 'c-merchants',
    cohortName: 'Mercado Municipal Wholesale Merchants',
    sampleSize: 650,
    sentimentScore: 32,
    thirtyDayShift: 8,
    primaryGrievance: 'Daily protection shakedowns and freight hijackings on Highway 45.',
    vulnerabilityToAdversaryNarrative: 'MODERATE',
    coalitionTrustLevel: 61,
    keyInterlocutorToEngage: 'Mercado Benito Juárez Syndicate Lead',
  },
  {
    id: 'c-displaced',
    cohortName: 'Displaced Civilians in Temporary Shelters',
    sampleSize: 3200,
    sentimentScore: -35,
    thirtyDayShift: -6,
    primaryGrievance: 'Loss of homes due to armed conflict; inadequate potable water and medical resupply.',
    vulnerabilityToAdversaryNarrative: 'HIGH',
    coalitionTrustLevel: 51,
    keyInterlocutorToEngage: 'Dr. Tariq Al-Husseini & Red Cross Logistics',
  },
  {
    id: 'c-police',
    cohortName: 'Municipal Police Department Patrol Officers',
    sampleSize: 45,
    sentimentScore: 12,
    thirtyDayShift: 15,
    primaryGrievance: 'Extreme weapon and armor disparity against hostile heavy weapons; fear of retaliation against families.',
    vulnerabilityToAdversaryNarrative: 'MODERATE',
    coalitionTrustLevel: 68,
    keyInterlocutorToEngage: 'Col. Javier Mendez (Ret.)',
  },
];

export const TraitSentimentAnalysis: React.FC = () => {
  const [selectedActorId, setSelectedActorId] = useState<string>(BASEBALL_CARD_ACTORS[0].id);
  const [compareActorId, setCompareActorId] = useState<string>(BASEBALL_CARD_ACTORS[1].id);

  const actorA = BASEBALL_CARD_ACTORS.find((a) => a.id === selectedActorId) || BASEBALL_CARD_ACTORS[0];
  const actorB = BASEBALL_CARD_ACTORS.find((a) => a.id === compareActorId) || BASEBALL_CARD_ACTORS[1];

  const traitKeys: { key: keyof typeof actorA.traits; label: string; desc: string }[] = [
    { key: 'riskTolerance', label: 'Risk Tolerance', desc: 'Willingness to take personal safety risks to confront adversary' },
    { key: 'transactionalism', label: 'Transactionalism', desc: 'Driven by economic/power self-interest vs community ideology' },
    { key: 'powerDistance', label: 'Power Distance', desc: 'Deference to strict hierarchy vs autonomous lateral action' },
    { key: 'publicPrivateDivergence', label: 'Public vs Private Gap', desc: 'Disparity between public pronouncements and private deeds' },
    { key: 'communityProtection', label: 'Community Protection', desc: 'Altruistic commitment to civil population safety' },
    { key: 'ideologicalRigidity', label: 'Ideological Rigidity', desc: 'Inflexibility of belief vs pragmatic negotiation willingness' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-white font-mono">
                Key Leader Trait & Population Sentiment Analytics
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                FM 3-57 / JP 3-04
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Psychological profiling of key interlocutors, comparative behavioral vectors, and demographic cohort sentiment monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Comparative Trait Profiler (Actor A vs Actor B) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide font-mono">
              Bilateral Key Leader Trait Comparison
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">ACTOR A:</span>
              <select
                value={selectedActorId}
                onChange={(e) => setSelectedActorId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
              >
                {BASEBALL_CARD_ACTORS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.moniker})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-purple-400 font-bold">ACTOR B:</span>
              <select
                value={compareActorId}
                onChange={(e) => setCompareActorId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
              >
                {BASEBALL_CARD_ACTORS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.moniker})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Trait Comparison Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {traitKeys.map(({ key, label, desc }) => {
            const valA = actorA.traits[key];
            const valB = actorB.traits[key];
            const delta = valA - valB;

            return (
              <div key={key} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-sans">{label}</span>
                  <span className="text-[10px] text-slate-400">
                    Δ {delta > 0 ? `+${delta}%` : `${delta}%`}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 font-sans leading-snug">{desc}</p>

                {/* Actor A Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-cyan-400 truncate">{actorA.name} ({actorA.moniker})</span>
                    <span className="font-bold text-cyan-400">{valA}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${valA}%` }}></div>
                  </div>
                </div>

                {/* Actor B Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-purple-400 truncate">{actorB.name} ({actorB.moniker})</span>
                    <span className="font-bold text-purple-400">{valB}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full transition-all" style={{ width: `${valB}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Demographic Cohort Sentiment Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide font-mono">
              Demographic Cohort Sentiment & Narrative Vulnerability
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Total Sampled: n=7,395
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMOGRAPHIC_COHORTS.map((cohort) => (
            <div
              key={cohort.id}
              className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[10px] font-mono text-slate-400">n={cohort.sampleSize.toLocaleString()}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                      cohort.vulnerabilityToAdversaryNarrative === 'HIGH'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : cohort.vulnerabilityToAdversaryNarrative === 'MODERATE'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    Vulnerability: {cohort.vulnerabilityToAdversaryNarrative}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">{cohort.cohortName}</h4>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-mono text-slate-400">Net Sentiment:</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      cohort.sentimentScore > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {cohort.sentimentScore > 0 ? `+${cohort.sentimentScore}` : cohort.sentimentScore} / 100
                  </span>
                  <span
                    className={`text-[10px] font-mono flex items-center ${
                      cohort.thirtyDayShift >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {cohort.thirtyDayShift >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {cohort.thirtyDayShift >= 0 ? `+${cohort.thirtyDayShift}` : cohort.thirtyDayShift}%
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  <strong className="text-slate-400 block text-[10px] font-mono">PRIMARY GRIEVANCE:</strong>
                  {cohort.primaryGrievance}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Coalition Trust:</span>
                  <span className="text-cyan-400 font-bold">{cohort.coalitionTrustLevel}%</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-500 block text-[10px]">RECOMMENDED INTERLOCUTOR:</span>
                  <span className="text-amber-300 font-sans font-medium text-xs">{cohort.keyInterlocutorToEngage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
