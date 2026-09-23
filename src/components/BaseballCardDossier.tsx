import React, { useState } from 'react';
import { 
  FileText, 
  Shield, 
  Target, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Search, 
  Copy, 
  Check, 
  MapPin, 
  Radio, 
  Lock, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Brain,
  Eye
} from 'lucide-react';
import { 
  BASEBALL_CARD_ACTORS, 
  BaseballCardActor 
} from '../data/doctrineAnalyticsData';

interface BaseballCardDossierProps {
  initialSelectedCardId?: string;
  onOpenNetworkCluster?: () => void;
}

export const BaseballCardDossier: React.FC<BaseballCardDossierProps> = ({
  initialSelectedCardId,
  onOpenNetworkCluster,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(
    initialSelectedCardId || BASEBALL_CARD_ACTORS[0].id
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const selectedCard =
    BASEBALL_CARD_ACTORS.find((c) => c.id === selectedCardId) || BASEBALL_CARD_ACTORS[0];

  const filteredCards = BASEBALL_CARD_ACTORS.filter((card) => {
    if (tierFilter !== 'ALL' && card.tier !== tierFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        card.name.toLowerCase().includes(q) ||
        card.moniker.toLowerCase().includes(q) ||
        card.role.toLowerCase().includes(q) ||
        card.organization.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyDossierSummary = () => {
    const text = `
=== MILITARY INTELLIGENCE BASEBALL CARD (FM 3-57 / ATP 2-01.3) ===
CLASSIFICATION: ${selectedCard.securityClassification}
ACTOR: ${selectedCard.name} (${selectedCard.moniker})
TIER: ${selectedCard.tier} | DISPOSITION: ${selectedCard.dispositionLabel} (${selectedCard.dispositionScore}/100)
ROLE: ${selectedCard.role} // ORG: ${selectedCard.organization}
GRID: ${selectedCard.gridCoordinates} // LOC: ${selectedCard.geographicLocation}
AOR: ${selectedCard.aorAffiliation} | TEAM: ${selectedCard.assignedCATeam}
PRIMARY TRAIT DRIVER: Community Protection: ${selectedCard.traits.communityProtection}%, Transactionalism: ${selectedCard.traits.transactionalism}%
SENTIMENT (COALITION): ${selectedCard.sentiment.sentimentTowardCoalition}/100 | TREND: ${selectedCard.sentiment.thirtyDayTrend}
PRIMARY GRIEVANCE/LEVERAGE: ${selectedCard.sentiment.primarySentimentDriver}
INTERLOCUTOR PATH: ${selectedCard.interlocutorPath.join(' -> ')}
LAST ENGAGEMENT DTG: ${selectedCard.lastEngagementDTG}
==================================================================`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const getDispositionColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400 bg-emerald-950/60 border-emerald-700';
    if (score >= 20) return 'text-cyan-400 bg-cyan-950/60 border-cyan-700';
    if (score >= -20) return 'text-yellow-400 bg-yellow-950/60 border-yellow-700';
    if (score >= -60) return 'text-amber-500 bg-amber-950/60 border-amber-700';
    return 'text-red-500 bg-red-950/60 border-red-700';
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar: Actor Card Gallery Ribbon */}
      <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {/* Gallery Header */}
        <div className="p-3.5 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-400" />
              KEY LEADER BASEBALL CARDS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {filteredCards.length} Dossiers
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Search actors, monikers, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded pl-7 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tier Filter */}
          <div className="flex gap-1 text-[10px] font-mono">
            {['ALL', 'TIER_1_HVI', 'TIER_2_KEY_LEADER'].map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`flex-1 py-1 rounded transition-colors ${
                  tierFilter === t
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? 'ALL' : t === 'TIER_1_HVI' ? 'TIER 1 HVI' : 'TIER 2'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Actor List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          {filteredCards.map((actor) => {
            const isSelected = actor.id === selectedCardId;
            return (
              <div
                key={actor.id}
                onClick={() => setSelectedCardId(actor.id)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-blue-950/40 border border-blue-500 shadow-md ring-1 ring-blue-500/50'
                    : 'hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <img
                  src={actor.photoUrl}
                  alt={actor.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{actor.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${getDispositionColor(
                        actor.dispositionScore
                      )}`}
                    >
                      {actor.dispositionScore > 0 ? `+${actor.dispositionScore}` : actor.dispositionScore}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono text-amber-400 block truncate">
                    {actor.moniker}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {actor.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Dossier Presentation (Right) */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-4 md:p-6 space-y-5 min-w-0">
        {/* Doctrinal Security Banner & Action Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 tracking-wider uppercase">
                  {selectedCard.securityClassification}
                </span>
                <span className="text-xs font-mono text-slate-400">FM 3-57 / ATP 2-01.3 STANDARD</span>
              </div>
              <h2 className="text-base font-bold text-white font-mono mt-0.5">
                MILITARY INTELLIGENCE & CIVIL AFFAIRS BASEBALL CARD
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button
              onClick={handleCopyDossierSummary}
              className="flex-1 md:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                  <span>Copy DTG Summary</span>
                </>
              )}
            </button>

            {onOpenNetworkCluster && (
              <button
                onClick={onOpenNetworkCluster}
                className="flex-1 md:flex-none px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View in Link Cluster</span>
              </button>
            )}
          </div>
        </div>

        {/* Classic Military Intelligence Baseball Card Frame */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Card Top Strip */}
          <div className="p-4 md:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex flex-col md:flex-row gap-5 items-start">
            {/* Actor Photo with Tier Stamp */}
            <div className="relative shrink-0">
              <img
                src={selectedCard.photoUrl}
                alt={selectedCard.name}
                className="w-32 h-36 md:w-40 md:h-44 object-cover rounded-xl border-2 border-slate-700 shadow-xl"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950 text-white border border-slate-700 shadow-lg">
                {selectedCard.tier.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Profile Overview */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {selectedCard.name}
                  </h1>
                  <span className="text-amber-400 font-mono text-base font-bold">
                    {selectedCard.moniker}
                  </span>
                </div>

                <div
                  className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${getDispositionColor(
                    selectedCard.dispositionScore
                  )}`}
                >
                  <span>DISPOSITION:</span>
                  <span>{selectedCard.dispositionLabel} ({selectedCard.dispositionScore > 0 ? `+${selectedCard.dispositionScore}` : selectedCard.dispositionScore})</span>
                </div>
              </div>

              <div className="text-sm font-semibold text-slate-300">
                {selectedCard.role} // <span className="text-cyan-400">{selectedCard.organization}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">MGRS GRID</span>
                  <span className="text-slate-200 font-bold">{selectedCard.gridCoordinates}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">LOCATION</span>
                  <span className="text-slate-200 truncate block">{selectedCard.geographicLocation.split(',')[0]}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">AOR COMMAND</span>
                  <span className="text-slate-200">{selectedCard.aorAffiliation.split(' ')[0]}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">ASSIGNED CA UNIT</span>
                  <span className="text-emerald-400 font-bold">{selectedCard.assignedCATeam.split('/')[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Analysis Body */}
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Trait & Sentiment Profiling */}
            <div className="space-y-4">
              {/* Trait Analysis Matrix */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-amber-400" />
                    Psychological & Behavioral Trait Matrix
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Scale: 0 - 100</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {/* Risk Tolerance */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Risk Tolerance (Confront Adversary Threats):</span>
                      <span className="font-bold text-white">{selectedCard.traits.riskTolerance}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${selectedCard.traits.riskTolerance}%` }}></div>
                    </div>
                  </div>

                  {/* Transactionalism */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Transactional vs. Doctrinal Alignment:</span>
                      <span className="font-bold text-white">{selectedCard.traits.transactionalism}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedCard.traits.transactionalism}%` }}></div>
                    </div>
                  </div>

                  {/* Power Distance */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Power Distance (Strict Formal Hierarchy):</span>
                      <span className="font-bold text-white">{selectedCard.traits.powerDistance}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedCard.traits.powerDistance}%` }}></div>
                    </div>
                  </div>

                  {/* Public-Private Divergence */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Public Posture vs. Private Alignment Gap:</span>
                      <span className="font-bold text-purple-400">{selectedCard.traits.publicPrivateDivergence}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedCard.traits.publicPrivateDivergence}%` }}></div>
                    </div>
                  </div>

                  {/* Community Protection */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Community Protection Loyalty:</span>
                      <span className="font-bold text-emerald-400">{selectedCard.traits.communityProtection}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedCard.traits.communityProtection}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentiment Vector */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    30-Day Sentiment Vector & Trajectory
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {selectedCard.sentiment.thirtyDayTrend.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TO HOST NATION</span>
                    <span className={`font-bold text-sm ${selectedCard.sentiment.sentimentTowardHostNation > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedCard.sentiment.sentimentTowardHostNation}%
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TO COALITION</span>
                    <span className={`font-bold text-sm ${selectedCard.sentiment.sentimentTowardCoalition > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                      {selectedCard.sentiment.sentimentTowardCoalition}%
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TO ADVERSARY</span>
                    <span className={`font-bold text-sm ${selectedCard.sentiment.sentimentTowardAdversary > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {selectedCard.sentiment.sentimentTowardAdversary}%
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono text-[10px] block mb-0.5">PRIMARY SENTIMENT DRIVER:</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{selectedCard.sentiment.primarySentimentDriver}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Operational Vulnerabilities, Leverage & Interlocutor Pathway */}
            <div className="space-y-4">
              {/* Motivations & Vulnerabilities */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Motivations & Civil Leverage Points
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] block mb-1">CORE MOTIVATIONS:</span>
                    <ul className="space-y-1 text-slate-200">
                      {selectedCard.motivations.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 font-mono text-[10px] block mb-1">CIVIL LEVERAGE POINTS:</span>
                    <ul className="space-y-1 text-cyan-300 font-medium">
                      {selectedCard.leveragePoints.map((l, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-rose-400 font-mono text-[10px] block mb-1">SYSTEMIC VULNERABILITIES & RISKS:</span>
                    <ul className="space-y-1 text-slate-300">
                      {selectedCard.vulnerabilities.map((v, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommended Interlocutor Engagement Pathway */}
              <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/60 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-blue-300 uppercase flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-400" />
                    Recommended Interlocutor Access Pathway
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">Multi-Hop Safe Routing</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-2">
                  {selectedCard.interlocutorPath.map((hop, index) => (
                    <React.Fragment key={index}>
                      <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-semibold text-slate-200 whitespace-nowrap shadow-sm">
                        <span className="text-slate-500 text-[10px] block">HOP {index + 1}</span>
                        {hop}
                      </div>
                      {index < selectedCard.interlocutorPath.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Engagements Log */}
          {selectedCard.engagementLog.length > 0 && (
            <div className="p-4 md:p-6 bg-slate-950/60 border-t border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center justify-between">
                <span>Interlocutor Engagement Log (CIM History)</span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  Last DTG: {selectedCard.lastEngagementDTG}
                </span>
              </span>

              <div className="space-y-2">
                {selectedCard.engagementLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">
                        {log.dtg} // {log.team}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.sentimentOutcome === 'POSITIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {log.sentimentOutcome}
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans">{log.summary}</p>
                    <div className="pt-1 text-[11px] text-slate-400">
                      <span className="text-slate-500">COMMITMENTS: </span>
                      {log.commitmentsMade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
