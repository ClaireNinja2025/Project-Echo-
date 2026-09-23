import React, { useState } from 'react';
import { 
  Radio, 
  MessageSquare, 
  Compass, 
  Share2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Users, 
  ArrowRight,
  TrendingUp,
  Volume2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { 
  COMPETING_NARRATIVES, 
  INTERLOCUTOR_PATHWAYS, 
  CompetingNarrative, 
  InterlocutorPathway 
} from '../data/doctrineAnalyticsData';

export const NarrativeInterlocutorPaths: React.FC = () => {
  const [selectedNarrativeId, setSelectedNarrativeId] = useState<string>(COMPETING_NARRATIVES[0].id);
  const [selectedPathId, setSelectedPathId] = useState<string>(INTERLOCUTOR_PATHWAYS[0].id);
  const [activeSection, setActiveSection] = useState<'NARRATIVES' | 'INTERLOCUTOR_PATHS'>('NARRATIVES');

  const selectedNarrative =
    COMPETING_NARRATIVES.find((n) => n.id === selectedNarrativeId) || COMPETING_NARRATIVES[0];

  const selectedPathway =
    INTERLOCUTOR_PATHWAYS.find((p) => p.id === selectedPathId) || INTERLOCUTOR_PATHWAYS[0];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-white font-mono">
                Narrative Ecology & Interlocutor Engagement Pathways
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                ADP 3-13 / FM 3-57
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Competing cognitive narratives matrix, velocity vectors, and multi-hop interlocutor access routing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveSection('NARRATIVES')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeSection === 'NARRATIVES'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Competing Narratives
          </button>
          <button
            onClick={() => setActiveSection('INTERLOCUTOR_PATHS')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeSection === 'INTERLOCUTOR_PATHS'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interlocutor Pathways
          </button>
        </div>
      </div>

      {/* SECTION 1: COMPETING NARRATIVES */}
      {activeSection === 'NARRATIVES' && (
        <div className="space-y-6">
          {/* Narrative Cards Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMPETING_NARRATIVES.map((nar) => {
              const isSelected = nar.id === selectedNarrativeId;
              return (
                <div
                  key={nar.id}
                  onClick={() => setSelectedNarrativeId(nar.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/80 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          nar.narrativeType === 'ADVERSARY_MALIGN'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : nar.narrativeType === 'COALITION_HOST_NATION'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {nar.narrativeType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {nar.velocity}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{nar.theme}</h3>
                    <p className="text-xs text-slate-300 italic mt-2 line-clamp-3 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                      {nar.coreMessage}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Resonance Score:</span>
                      <span className="font-bold text-white">{nar.resonanceScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          nar.narrativeType === 'ADVERSARY_MALIGN'
                            ? 'bg-red-500'
                            : nar.narrativeType === 'COALITION_HOST_NATION'
                            ? 'bg-emerald-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${nar.resonanceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep-Dive Narrative Vector Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-bold">NARRATIVE VECTOR DEEP-DIVE</span>
                <h3 className="text-lg font-bold text-white">{selectedNarrative.theme}</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-slate-300">
                Resonance: {selectedNarrative.resonanceScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="font-mono font-bold text-slate-400 text-[11px] block">
                  TARGET AUDIENCE & VULNERABILITIES:
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedNarrative.targetAudience}</p>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="font-mono font-bold text-slate-400 text-[10px] block mb-1">
                    DISSEMINATION CHANNELS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNarrative.channels.map((ch, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-300 font-mono"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="font-mono font-bold text-emerald-400 text-[11px] block">
                  RECOMMENDED COUNTER-NARRATIVE VECTOR:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {selectedNarrative.counterNarrativeVector}
                </p>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="font-mono font-bold text-cyan-400 text-[10px] block mb-1">
                    EMPIRICAL CIVIL VERIFICATION ANCHOR:
                  </span>
                  <p className="text-slate-300 text-[11.5px] italic">
                    {selectedNarrative.verificationEvidence}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INTERLOCUTOR PATHWAYS */}
      {activeSection === 'INTERLOCUTOR_PATHS' && (
        <div className="space-y-6">
          {/* Pathway Selector */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
            {INTERLOCUTOR_PATHWAYS.map((path) => (
              <button
                key={path.id}
                onClick={() => setSelectedPathId(path.id)}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                  selectedPathId === path.id
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Target: {path.targetActorName} ({path.targetRole})</span>
              </button>
            ))}
          </div>

          {/* Pathway Multi-Hop Route Visualization */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-md">
            <div className="border-b border-slate-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold">OPERATIONAL OBJECTIVE</span>
                <h3 className="text-base font-bold text-white">{selectedPathway.objective}</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold self-start md:self-auto ${
                  selectedPathway.frictionLevel === 'LOW'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                FRICTION: {selectedPathway.frictionLevel}
              </span>
            </div>

            {/* Step-by-Step Flow */}
            <div className="space-y-4">
              {selectedPathway.steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Hop Marker */}
                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/60 flex items-center justify-center text-blue-400 font-mono font-bold text-sm shrink-0 shadow-md">
                    {step.hop}
                  </div>

                  {/* Step Card */}
                  <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-sm font-bold text-white font-mono">{step.actor}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400">
                        Trust Rating: {step.trustScore}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{step.action}</p>

                    <div className="pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-amber-400 font-mono text-[10px] block mb-0.5">
                        CULTURAL & TACTICAL PROTOCOL:
                      </span>
                      <p className="text-slate-400 text-[11.5px] italic">{step.culturalProtocol}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
