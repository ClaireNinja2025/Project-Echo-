import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Radio, 
  Compass, 
  Layers, 
  Target, 
  Users, 
  FileText, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Lock, 
  Wifi, 
  CloudSun, 
  Mountain, 
  Satellite, 
  Terminal, 
  ChevronRight, 
  Eye, 
  Globe,
  Sliders,
  Play
} from 'lucide-react';
import { 
  CivilEntity, 
  DisruptionNode, 
  FieldObservation, 
  UserRole, 
  OperationalPhase 
} from '../types';
import { COMBATANT_COMMANDS, CombatantCommandAOR } from '../data/aorData';
import { GlobalAorWorldMap } from './GlobalAorWorldMap';
import { CivilCommonOperatingPicture } from './CivilCommonOperatingPicture';
import { PmesiiAscopeCogAnalysis } from './PmesiiAscopeCogAnalysis';
import { CivilKnowledgeIntegration } from './CivilKnowledgeIntegration';
import { CivilSystemsResilienceGraph } from './CivilSystemsResilienceGraph';
import { InformationAdvantageMatrix } from './InformationAdvantageMatrix';
import { DecisionSupportCOA } from './DecisionSupportCOA';
import { CMOCOperations } from './CMOCOperations';

interface TacticalCommandDashboardProps {
  entities: CivilEntity[];
  selectedEntity: CivilEntity | null;
  onSelectEntity: (entity: CivilEntity | null) => void;
  onUpdateEntityStatus: (id: string, status: CivilEntity['status']) => void;
  disruptionNodes: DisruptionNode[];
  onToggleNodeStatus: (nodeId: string) => void;
  observations: FieldObservation[];
  onAddObservation: (obs: FieldObservation) => void;
  onCommitExtractedEntity: (partialEntity: Partial<CivilEntity>) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentPhase: OperationalPhase;
  onPhaseChange: (phase: OperationalPhase) => void;
  onOpenDoctrine: () => void;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
  coursesOfAction: any[];
  cmocProjects: any[];
  auditLogs: any[];
}

interface DetectionAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  text: string;
  gridRef: string;
}

export const TacticalCommandDashboard: React.FC<TacticalCommandDashboardProps> = ({
  entities,
  selectedEntity,
  onSelectEntity,
  onUpdateEntityStatus,
  disruptionNodes,
  onToggleNodeStatus,
  observations,
  onAddObservation,
  onCommitExtractedEntity,
  currentRole,
  onRoleChange,
  currentPhase,
  onPhaseChange,
  onOpenDoctrine,
  activeNavTab,
  onNavTabChange,
  coursesOfAction,
  cmocProjects,
  auditLogs,
}) => {
  // Center screen expansion toggle
  const [isMaximizedCenter, setIsMaximizedCenter] = useState<boolean>(false);

  // Live Military DTG Clock
  const [currentDTG, setCurrentDTG] = useState<string>('');
  const [etaSeconds, setEtaSeconds] = useState<number>(765); // 00:12:45

  // Active AOR Selection
  const [currentAor, setCurrentAor] = useState<CombatantCommandAOR>(COMBATANT_COMMANDS[0]);

  // Detection Feed State
  const [detectionAlerts, setDetectionAlerts] = useState<DetectionAlert[]>([
    {
      id: 'alt-1',
      type: 'CRITICAL',
      timestamp: '16:52:10',
      text: 'Municipal Water Pump 04 power loss detected - Sector 4',
      gridRef: '38T LN 2405 8120',
    },
    {
      id: 'alt-2',
      type: 'WARNING',
      timestamp: '16:48:22',
      text: 'Unusual black-market fuel tanker clustering near Highway 8',
      gridRef: '38T LN 2190 7980',
    },
    {
      id: 'alt-3',
      type: 'INFO',
      timestamp: '16:41:55',
      text: 'Milstar satellite link federated telemetry re-established',
      gridRef: 'THEATER-WIDE',
    },
    {
      id: 'alt-4',
      type: 'WARNING',
      timestamp: '16:35:40',
      text: 'Thermal signature surge in Grid 4 electrical substation',
      gridRef: '38T LN 2340 8200',
    },
    {
      id: 'alt-5',
      type: 'INFO',
      timestamp: '16:20:12',
      text: 'CAT 712 key leader engagement completed with Municipal Director',
      gridRef: 'DISTRICT-HQ',
    },
  ]);

  // Action Recommended Execution Tracker
  const [recommendedActions, setRecommendedActions] = useState([
    {
      id: 'rec-1',
      title: 'DEPLOY CA RECON TEAM (CAT 712)',
      description: 'Conduct rapid civil vulnerability assessment at Al-Zawra Water Facility',
      resources: '18%',
      riskFactor: 'LOW',
      riskColor: 'text-emerald-400',
      status: 'READY',
    },
    {
      id: 'rec-2',
      title: 'REINFORCE SECTOR 4 WATER GRID',
      description: 'Stage backup 500kW mobile diesel generator via CMOC distribution channel',
      resources: '42%',
      riskFactor: 'MEDIUM',
      riskColor: 'text-amber-400',
      status: 'PENDING',
    },
    {
      id: 'rec-3',
      title: 'INITIATE CMOC FUEL SUBSIDY COA',
      description: 'Subsidize civilian transit cooperative to counter black-market syndicate',
      resources: '25%',
      riskFactor: 'LOW',
      riskColor: 'text-emerald-400',
      status: 'READY',
    },
  ]);

  // Ticker console text
  const [consoleTicker, setConsoleTicker] = useState<string>(
    '[16:52:12] FEDERATED DATA FABRIC: SYNCHRONIZED ACROSS 8 MUNICIPAL INFRASTRUCTURE NODES...'
  );

  // Update Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      const dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).toUpperCase();
      setCurrentDTG(`${hours}:${minutes}:${seconds} ZULU // ${dateStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Countdown for ETA
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 765));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatEta = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Triggering a recommended action
  const handleExecuteAction = (actionId: string) => {
    setRecommendedActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'EXECUTING...' } : a))
    );
    setTimeout(() => {
      setRecommendedActions((prev) =>
        prev.map((a) => (a.id === actionId ? { ...a, status: 'COMPLETED' } : a))
      );
      setDetectionAlerts((prev) => [
        {
          id: `alt-${Date.now()}`,
          type: 'INFO',
          timestamp: new Date().toTimeString().slice(0, 8),
          text: `Action successfully initiated: ${actionId.toUpperCase()}`,
          gridRef: 'SECTOR-4',
        },
        ...prev,
      ]);
      setConsoleTicker(`> [ACTION COMPLETED] ${actionId.toUpperCase()} EXECUTED BY ${currentRole}`);
    }, 1200);
  };

  // Threat Matrix Calculation based on entities
  const criticalCount = entities.filter((e) => e.status === 'Critical').length;
  const threatScore = Math.min(95, Math.max(45, 60 + criticalCount * 8));

  // Circular gauge parameters
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (threatScore / 100) * circumference;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070c18] text-slate-100 font-sans overflow-hidden select-none">
      {/* ========================================================================= */}
      {/* 1. TOP COMMAND HEADER BAR (Exact layout from reference image)             */}
      {/* ========================================================================= */}
      <header className="h-14 bg-[#091122] border-b border-[#1b2b48] px-4 flex items-center justify-between z-30 shrink-0 shadow-md">
        {/* Left: System Title & Version */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest text-[#60a5fa] font-mono">
                CIO-KE
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 border-l border-slate-700 pl-2">
                CIVIL-MILITARY COMMAND INTERFACE // V4.01
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-wider text-emerald-400">
              UNIFIED COMMAND PLAN // USACAPOC // JP 5-0
            </span>
          </div>
        </div>

        {/* Center: Operational Navigation Pills (exact pill button row) */}
        <nav className="hidden md:flex items-center space-x-1 font-mono text-xs">
          <button
            onClick={() => onNavTabChange('global-aor')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'global-aor'
                ? 'bg-[#1e3a8a] text-blue-100 border border-[#3b82f6] shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101b33] border border-transparent'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span>GLOBAL AOR</span>
          </button>

          <button
            onClick={() => onNavTabChange('cop')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'cop'
                ? 'bg-[#1e3a8a] text-blue-100 border border-[#3b82f6] shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101b33] border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#34d399]" />
            <span>CIVIL COP</span>
          </button>

          <button
            onClick={() => onNavTabChange('crosswalk-cog')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'crosswalk-cog'
                ? 'bg-[#1e3a8a] text-blue-100 border border-[#3b82f6] shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101b33] border border-transparent'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>PMESII × ASCOPE</span>
          </button>

          <button
            onClick={() => onNavTabChange('cki')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'cki'
                ? 'bg-[#1e3a8a] text-blue-100 border border-[#3b82f6] shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101b33] border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>CKI INTEL</span>
          </button>

          <button
            onClick={() => onNavTabChange('resilience')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'resilience'
                ? 'bg-[#1e3a8a] text-blue-100 border border-[#3b82f6] shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101b33] border border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>RESILIENCE</span>
          </button>

          <button
            onClick={() => onNavTabChange('info-adv')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'info-adv'
                ? 'bg-[#1e3a8a] text-blue-100 border border-[#3b82f6] shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101b33] border border-transparent'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>INFO ADV</span>
          </button>

          <button
            onClick={() => onNavTabChange('decision')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'decision'
                ? 'bg-[#1e3a8a] text-blue-100 border border-[#3b82f6] shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101b33] border border-transparent'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#f87171]" />
            <span>COA DECISION</span>
          </button>

          <button
            onClick={() => onNavTabChange('cmoc')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'cmoc'
                ? 'bg-[#1e3a8a] text-blue-100 border border-[#3b82f6] shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101b33] border border-transparent'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#34d399]" />
            <span>CMOC</span>
          </button>
        </nav>

        {/* Right: Operational Status Elements (AI Status, Threat, Secure Link, Zulu Clock, Node Indicator) */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          {/* AI System Status */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2 py-1 rounded bg-[#0e1b33] border border-[#1e3a8a] text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-400">AI SYSTEM:</span>
            <span className="text-[10px] text-emerald-300 font-bold">ONLINE</span>
          </div>

          {/* Threat / Instability Level */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded bg-[#2b1805] border border-amber-800/80 text-amber-300">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-amber-400">CIVIL STRESS:</span>
            <span className="text-[10px] font-bold">ELEVATED</span>
          </div>

          {/* Secure Link Status */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2 py-1 rounded bg-[#0d1f1c] border border-emerald-800/80 text-emerald-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400">FEDERATED:</span>
            <span className="text-[10px] font-bold text-emerald-300">ENCRYPTED</span>
          </div>

          {/* Military Zulu DTG Clock */}
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#0a1224] border border-[#1e293b] text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span className="text-[11px] font-bold tracking-tight text-slate-200">
              {currentDTG || '16:52:00 ZULU'}
            </span>
          </div>

          {/* Node Indicator */}
          <div className="px-2 py-1 rounded bg-[#064e3b] border border-emerald-500 text-emerald-200 text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>NODE-07 ACTIVE</span>
          </div>

          {/* Doctrine Button */}
          <button
            onClick={onOpenDoctrine}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Doctrine Reference"
          >
            <FileText className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 3-COLUMN COMMAND DASHBOARD (Exact 3-panel architecture)           */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: Threat Matrix (Gauge), Detection Feed, Tactical Insights   */}
        {/* ----------------------------------------------------------------------- */}
        {!isMaximizedCenter && (
          <aside className="w-72 lg:w-80 bg-[#0a1120] border-r border-[#19263f] flex flex-col p-3 space-y-3 shrink-0 overflow-y-auto z-10 shadow-lg">
            {/* Card 1: THREAT / INSTABILITY MATRIX (Circular HUD Gauge) */}
            <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-lg p-3 relative flex flex-col space-y-2 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1b2b46] pb-1.5">
                <span className="text-[11px] font-mono font-bold text-[#60a5fa] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#60a5fa]" />
                  INSTABILITY MATRIX
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  ID: AO-GRIFFIN-CENTCOM
                </span>
              </div>

              {/* Radial Circular Progress HUD */}
              <div className="flex flex-col items-center justify-center py-2 relative">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                    {/* Background track circle */}
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      fill="transparent"
                      stroke="#1e293b"
                      strokeWidth="8"
                      strokeDasharray="4, 4"
                    />
                    {/* Active progress arc */}
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Centered Readout */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black font-mono text-amber-400 leading-none">
                      {threatScore}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                      CONFLICT PROB
                    </span>
                  </div>
                </div>

                {/* Engagement / Cascade ETA */}
                <div className="w-full flex items-center justify-between text-[11px] font-mono mt-1 pt-1.5 border-t border-[#1b2b46] text-slate-300">
                  <span className="text-slate-400 text-[10px]">CASCADE ETA:</span>
                  <span className="font-bold text-amber-300 font-mono tracking-wider">
                    {formatEta(etaSeconds)}
                  </span>
                </div>

                {/* Bottom Cyan Progress Bar matching image */}
                <div className="w-full h-1.5 bg-[#14233c] rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-amber-500 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${threatScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Card 2: DETECTION FEED (Real-time telemetry event stream) */}
            <div className="flex-1 bg-[#0e172a] border border-[#1e2e4a] rounded-lg p-3 flex flex-col space-y-2 min-h-[220px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1b2b46] pb-1.5">
                <span className="text-[11px] font-mono font-bold text-[#60a5fa] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  DETECTION FEED
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                {detectionAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2 rounded bg-[#091122] border border-[#1a2844] space-y-1 hover:border-[#2b416e] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          alert.type === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : alert.type === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-blue-950 text-blue-300 border border-blue-700'
                        }`}
                      >
                        {alert.type}
                      </span>
                      <span className="text-[9px] text-slate-400">[{alert.timestamp}]</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-200 leading-snug">
                      {alert.text}
                    </p>
                    <div className="text-[9px] text-slate-400 text-right">
                      Grid: {alert.gridRef}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: TACTICAL INSIGHTS */}
            <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-lg p-3 space-y-1.5 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#60a5fa] flex items-center gap-1.5 border-b border-[#1b2b46] pb-1">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                CIVIL-TACTICAL INSIGHTS
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Pattern analysis indicates municipal power drop is compounding civilian water shortage in Sector 4. Recommend immediate CA engagement to confirm generator fuel reserves.
              </p>
            </div>
          </aside>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* CENTER VIEWPORT: Tactical Map with Military HUD Frame & Overlays        */}
        {/* ----------------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col relative bg-[#060b14] overflow-hidden">
          {/* HUD Corner Brackets (exact design from image) */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#3b82f6]/60 pointer-events-none z-20"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#3b82f6]/60 pointer-events-none z-20"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#3b82f6]/60 pointer-events-none z-20"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#3b82f6]/60 pointer-events-none z-20"></div>

          {/* Floating Top-Left Target Analysis HUD Box (matching image) */}
          <div className="absolute top-4 left-4 z-20 bg-[#091224]/90 border border-[#1e3a8a] rounded-md px-3 py-2 shadow-2xl backdrop-blur-md font-mono pointer-events-auto">
            <span className="text-[9px] text-[#60a5fa] block uppercase tracking-wider font-bold">
              TARGET ANALYSIS // CURRENT VECTOR
            </span>
            <div className="text-xs font-bold text-white tracking-wide">
              {selectedEntity ? selectedEntity.name : 'AO-GRIFFIN // SECTOR 4'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>LAT: 33.3152°N</span>
              <span>//</span>
              <span>LON: 44.3661°E</span>
              <span>//</span>
              <span className="text-emerald-400 font-bold">USCENTCOM</span>
            </div>
          </div>

          {/* Floating Top-Right View Controls (Maximize / Switch View) */}
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 font-mono text-xs">
            <button
              onClick={() => setIsMaximizedCenter(!isMaximizedCenter)}
              className="p-1.5 rounded bg-[#091224]/90 border border-[#1e3a8a] text-slate-300 hover:text-white hover:bg-blue-900 transition-colors cursor-pointer shadow-md"
              title={isMaximizedCenter ? 'Restore Panels' : 'Maximize Center View'}
            >
              {isMaximizedCenter ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Central Interactive Module Render Area */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {activeNavTab === 'global-aor' && (
              <GlobalAorWorldMap
                onNavigateToTacticalCop={(aoName) => {
                  onNavTabChange('cop');
                }}
              />
            )}

            {activeNavTab === 'cop' && (
              <CivilCommonOperatingPicture
                entities={entities}
                selectedEntity={selectedEntity}
                onSelectEntity={onSelectEntity}
                onUpdateEntityStatus={onUpdateEntityStatus}
                onOpenGlobalMap={() => onNavTabChange('global-aor')}
              />
            )}

            {activeNavTab === 'crosswalk-cog' && (
              <PmesiiAscopeCogAnalysis
                entities={entities}
                onSelectEntityOnCop={(ent) => {
                  onSelectEntity(ent);
                  onNavTabChange('cop');
                }}
              />
            )}

            {activeNavTab === 'cki' && (
              <CivilKnowledgeIntegration
                observations={observations}
                onAddObservation={onAddObservation}
                onCommitExtractedEntity={onCommitExtractedEntity}
              />
            )}

            {activeNavTab === 'resilience' && (
              <CivilSystemsResilienceGraph
                nodes={disruptionNodes}
                onToggleNodeStatus={onToggleNodeStatus}
              />
            )}

            {activeNavTab === 'info-adv' && (
              <InformationAdvantageMatrix
                activities={[]}
                narratives={[]}
              />
            )}

            {activeNavTab === 'decision' && (
              <DecisionSupportCOA coursesOfAction={coursesOfAction} />
            )}

            {activeNavTab === 'cmoc' && (
              <CMOCOperations 
                projects={cmocProjects} 
                auditLogs={auditLogs}
                currentRole={currentRole}
              />
            )}
          </div>

          {/* Floating Bottom-Right Threat Confirmation HUD Chip (matching image) */}
          <div className="absolute bottom-4 right-4 z-20 bg-[#160b0b]/90 border border-rose-800/80 rounded px-3 py-1.5 text-right font-mono shadow-2xl backdrop-blur-md hidden sm:block">
            <span className="text-[9px] text-slate-400 block tracking-wider uppercase">
              THREAT CONFIRMATION
            </span>
            <div className="text-xs font-bold text-rose-400 tracking-wider">
              CRITICAL_CIVIL_ENGAGEMENT
            </div>
            <div className="text-[10px] text-slate-300">
              CONFIDENCE: <span className="text-emerald-400 font-bold">99.4%</span>
            </div>
          </div>
        </main>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: AI Strategic Engine, Recommended Actions, Predictions     */}
        {/* ----------------------------------------------------------------------- */}
        {!isMaximizedCenter && (
          <aside className="w-72 lg:w-80 bg-[#0a1120] border-l border-[#19263f] flex flex-col p-3 space-y-3 shrink-0 overflow-y-auto z-10 shadow-lg">
            {/* Card 1: AI STRATEGIC ENGINE STATUS */}
            <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-lg p-3 relative flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded bg-[#10244c] border border-[#2563eb] flex items-center justify-center text-blue-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-white block">
                    AI STRATEGIC ENGINE
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">
                    PROCESSING OPTIMAL VECTORS...
                  </span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] font-bold text-emerald-400 block">OPTIMAL</span>
                <span className="text-xs tracking-tighter text-emerald-500 font-bold">|||||</span>
              </div>
            </div>

            {/* Card 2: RECOMMENDED ACTIONS (Priority: High) */}
            <div className="flex-1 bg-[#0e172a] border border-[#1e2e4a] rounded-lg p-3 flex flex-col space-y-2.5 min-h-[260px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1b2b46] pb-1.5">
                <span className="text-[11px] font-mono font-bold text-[#60a5fa] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#60a5fa]" />
                  RECOMMENDED ACTIONS
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                  PRIORITY: HIGH
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1">
                {recommendedActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-2.5 rounded bg-[#091122] border border-[#1a2844] space-y-1.5 hover:border-[#2b416e] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-300">
                        {action.title}
                      </span>
                    </div>

                    <p className="text-[11px] font-sans text-slate-300 leading-snug">
                      {action.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-[#142038] text-slate-400">
                      <div>
                        RESOURCES: <span className="text-slate-200 font-bold">{action.resources}</span>
                      </div>
                      <div>
                        RISK: <span className={`font-bold ${action.riskColor}`}>{action.riskFactor}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecuteAction(action.id)}
                      disabled={action.status === 'COMPLETED' || action.status.includes('EXECUTING')}
                      className={`w-full mt-1 py-1 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        action.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : action.status.includes('EXECUTING')
                          ? 'bg-blue-900 text-blue-200 animate-pulse'
                          : 'bg-[#1e3a8a] hover:bg-[#2563eb] text-white shadow-sm'
                      }`}
                    >
                      {action.status === 'COMPLETED' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>EXECUTED</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>{action.status}</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: OUTCOME PREDICTIONS (Horizontal metric gauges) */}
            <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-lg p-3 space-y-2.5 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#60a5fa] flex items-center gap-1.5 border-b border-[#1b2b46] pb-1">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                OUTCOME PREDICTIONS
              </span>

              {/* Metric 1: Success Probability */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">SUCCESS PROBABILITY</span>
                  <span className="text-emerald-400 font-bold">92%</span>
                </div>
                <div className="w-full h-1.5 bg-[#14233c] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[92%]"></div>
                </div>
              </div>

              {/* Metric 2: Collateral Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">CASUALTY / COLLATERAL RISK</span>
                  <span className="text-amber-400 font-bold">14%</span>
                </div>
                <div className="w-full h-1.5 bg-[#14233c] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[14%]"></div>
                </div>
              </div>

              {/* Metric 3: Resource Efficiency */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">RESOURCE EFFICIENCY</span>
                  <span className="text-blue-400 font-bold">68%</span>
                </div>
                <div className="w-full h-1.5 bg-[#14233c] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[68%]"></div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM COMMAND TELEMETRY FOOTER (Exact status strip from image)        */}
      {/* ========================================================================= */}
      <footer className="h-9 bg-[#080f1d] border-t border-[#17253d] px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 z-30 shrink-0 select-none">
        {/* Left Telemetry Cluster: Weather, Terrain, Signal, Sat-Feed */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1 text-slate-300">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-slate-400 uppercase">WEATHER:</span>
            <span className="text-[10px] font-bold">Storm / High Visibility</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-300">
            <Mountain className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-[10px] text-slate-400 uppercase">TERRAIN:</span>
            <span className="text-[10px] font-bold">Riverine / Urban Peri-Center</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400 uppercase">SIGNAL:</span>
            <span className="text-[10px] font-bold text-emerald-400">98.2% [Secure]</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-slate-300">
            <Satellite className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span className="text-[10px] text-slate-400 uppercase">SAT-FEED:</span>
            <span className="text-[10px] font-bold text-blue-300">Milstar Link Established</span>
          </div>
        </div>

        {/* Center Live Ticker Console */}
        <div className="hidden xl:flex items-center text-[10px] text-slate-400 overflow-hidden max-w-md">
          <Terminal className="w-3 h-3 text-emerald-400 mr-1 shrink-0" />
          <span className="truncate text-slate-300">{consoleTicker}</span>
        </div>

        {/* Right Encryption & Comms Status */}
        <div className="flex items-center space-x-2">
          <span className="text-[9px] text-slate-500 uppercase">COMMS STATUS:</span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#091b15] border border-emerald-700/60 text-emerald-300 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ENCRYPTED LS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
