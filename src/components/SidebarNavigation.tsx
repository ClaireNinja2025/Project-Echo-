import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  Users, 
  BookOpen, 
  Layers, 
  AlertTriangle,
  Lock,
  Compass,
  Target,
  Globe,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  FileText,
  Brain,
  CheckCircle2,
  Radio,
  Scale,
  Zap
} from 'lucide-react';
import { UserRole, OperationalPhase } from '../types';

interface SidebarNavigationProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentPhase: OperationalPhase;
  onPhaseChange: (phase: OperationalPhase) => void;
  onOpenDoctrine: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentRole,
  onRoleChange,
  currentPhase,
  onPhaseChange,
  onOpenDoctrine,
  activeTab,
  onTabChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const tabs = [
    { 
      id: 'global-aor', 
      label: 'Global AOR Map', 
      icon: Globe, 
      badge: '6 CCMDs',
      description: 'Strategic Theater Cartography'
    },
    { 
      id: 'operational-design', 
      label: 'Operational Design', 
      icon: Compass, 
      badge: 'ADP 5-0',
      description: 'End State, COG, LOEs & DPs'
    },
    { 
      id: 'io-workspace', 
      label: 'IO & Info Advantage', 
      icon: Zap, 
      badge: 'ADP 3-13',
      description: 'Army IO Doctrine & AOR Frameworks'
    },
    { 
      id: 'cop', 
      label: 'Civil COP & Overlay', 
      icon: Compass, 
      badge: '36 Layers',
      description: 'Tactical COP & Indicator Layers'
    },
    { 
      id: 'analyst-cluster', 
      label: 'Analyst\'s Notebook', 
      icon: Share2, 
      badge: 'i2 / Link',
      description: 'Link Analysis & Threat Cell Clusters'
    },
    { 
      id: 'baseball-cards', 
      label: 'Baseball Cards', 
      icon: FileText, 
      badge: 'Dossiers',
      description: 'Key Leader & Interlocutor Profiles'
    },
    { 
      id: 'trait-sentiment', 
      label: 'Trait & Sentiment', 
      icon: Brain, 
      badge: 'Psychology',
      description: 'Behavioral Traits & Population Trends'
    },
    { 
      id: 'moe-mop', 
      label: 'MOE & MOP Assessment', 
      icon: CheckCircle2, 
      badge: 'JP 5-0',
      description: 'Task Performance vs System Effects'
    },
    { 
      id: 'narrative-paths', 
      label: 'Narratives & Paths', 
      icon: Radio, 
      badge: 'ADP 3-13',
      description: 'Competing Narratives & Interlocutor Hops'
    },
    { 
      id: 'coa-wargame', 
      label: 'COA & Wargaming', 
      icon: Scale, 
      badge: 'FM 5-0',
      description: 'Action-Reaction-Counteraction Simulation'
    },
    { 
      id: 'crosswalk-cog', 
      label: 'PMESII × ASCOPE & COG', 
      icon: Target, 
      badge: 'JP 5-0',
      description: 'Civil Center of Gravity Matrix'
    },
    { 
      id: 'cki', 
      label: 'CKI Workspace', 
      icon: Layers, 
      badge: 'ATP 3-57.50',
      description: 'Civil Knowledge Integration'
    },
    { 
      id: 'resilience', 
      label: 'Systems & Resilience', 
      icon: Activity, 
      badge: 'Cascade Sim',
      description: 'Infrastructure Dependency Graph'
    },
    { 
      id: 'cmoc', 
      label: 'CMOC & Governance', 
      icon: Users, 
      badge: 'Coordination',
      description: 'Civil-Military Operations Center'
    },
  ];

  return (
    <aside 
      className={`bg-black border-r border-slate-700 text-slate-100 flex flex-col transition-all duration-200 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-56 xl:w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between bg-black">
        <div className={`flex items-center space-x-2 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded bg-black border border-slate-700 flex items-center justify-center text-slate-200 shrink-0 shadow-inner">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-xs tracking-tight text-white uppercase font-mono">
                  CIO-KE
                </h1>
                <span className="px-1 py-0.2 text-[8.5px] font-mono font-semibold bg-black text-slate-400 rounded border border-slate-700">
                  v3.2
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 truncate leading-tight">
                Civil Operational Overlay
              </p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-neutral-900 transition-colors"
            title="Collapse Navigation Rail"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="p-1.5 border-b border-slate-700 flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Expand Navigation Rail"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs Section */}
      <div className="flex-1 overflow-y-auto px-1.5 py-2 space-y-0.5 scrollbar-none">
        <div className={`px-2 pb-1 text-[9px] font-mono tracking-wider text-slate-400 uppercase ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? 'TABS' : 'NAVIGATION'}
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full group relative flex items-center rounded transition-all text-left ${
                isCollapsed ? 'justify-center p-2' : 'px-2.5 py-2 gap-2.5'
              } ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold shadow-sm ring-1 ring-blue-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-neutral-900/60'
              }`}
              title={isCollapsed ? `${tab.label} (${tab.badge})` : undefined}
            >
              {/* Active Indicator Bar on Edge */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-1 bg-blue-600 rounded-r" />
              )}

              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
              }`} />

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs truncate ${isActive ? 'text-white font-bold' : 'text-slate-300'}`}>{tab.label}</span>
                    <span className={`text-[8.5px] font-mono px-1 py-0.2 rounded shrink-0 ${
                      isActive 
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50' 
                        : 'bg-black text-slate-400 border border-slate-700/60'
                    }`}>
                      {tab.badge}
                    </span>
                  </div>
                </div>
              )}

              {/* Floating Tooltip for Collapsed State */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-black text-slate-100 text-xs font-mono rounded shadow-xl border border-slate-700 whitespace-nowrap hidden group-hover:flex items-center gap-2 z-50 pointer-events-none">
                  <span className="font-bold">{tab.label}</span>
                  <span className="px-1 text-[9px] bg-neutral-900 text-cyan-400 rounded">
                    {tab.badge}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Operational Controls & Controls Footer */}
      <div className="p-3 border-t border-slate-700 space-y-3 bg-black">
        {!isCollapsed ? (
          <>
            {/* Operational Phase Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                OPERATIONAL PHASE:
              </label>
              <select
                value={currentPhase}
                onChange={(e) => onPhaseChange(e.target.value as OperationalPhase)}
                className="w-full bg-black text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-600 cursor-pointer font-medium"
              >
                <option value="Phase 0 - Competition / Shaping">Phase 0: Shaping / Campaigning</option>
                <option value="Phase 1 - Crisis Response">Phase 1: Crisis Response</option>
                <option value="Phase 2 - Large-Scale Combat">Phase 2: LSCO Operations</option>
                <option value="Phase 3 - Stabilization & Consolidation">Phase 3: Stabilization</option>
                <option value="Phase 4 - Humanitarian Assistance">Phase 4: Foreign Humanitarian</option>
              </select>
            </div>

            {/* Role / RBAC Selector */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                  USER ROLE:
                </span>
                <span className="text-cyan-400 text-[9px]">ACTIVE RBAC</span>
              </div>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="w-full bg-black text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-600 cursor-pointer font-medium"
              >
                <option value="CA Team Leader (CAT 712)">CA Team Leader (CAT 712)</option>
                <option value="CMOC Operations Director">CMOC Operations Director</option>
                <option value="J-39 Information Advantage Planner">J-39 IA Planner</option>
                <option value="Staff Judge Advocate (Legal/Oversight)">SJA / Legal Oversight</option>
                <option value="Public Affairs Officer (PAO)">Public Affairs (PAO)</option>
              </select>
            </div>

            {/* Doctrine AI Button */}
            <button
              onClick={onOpenDoctrine}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors border border-slate-700 shadow-sm cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Doctrine & JP 5-0 AI</span>
              <Sparkles className="w-3 h-3 text-cyan-300" />
            </button>
          </>
        ) : (
          /* Collapsed Icons Only */
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={onOpenDoctrine}
              className="p-2 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors border border-slate-700"
              title="Open Doctrine & JP 5-0 AI Assistant"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Security & Oversight Status Indicator */}
        <div className={`text-[9px] font-mono text-slate-400 border-t border-slate-700 pt-2 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <span className="text-teal-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                FABRIC SYNC
              </span>
              <span className="text-slate-400">DoD 5240.01 COMPLIANT</span>
            </div>
          ) : (
            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" title="Federated Fabric Sync"></span>
          )}
        </div>
      </div>
    </aside>
  );
};
