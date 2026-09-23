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
      className={`bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col transition-all duration-200 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64 lg:w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className={`flex items-center space-x-2.5 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-sm tracking-tight text-white uppercase font-mono">
                  CIO-KE
                </h1>
                <span className="px-1 py-0.2 text-[9px] font-mono font-bold bg-slate-800 text-cyan-400 rounded border border-slate-700">
                  v3.2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate leading-tight">
                Civil Information Overlay
              </p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="p-2 border-b border-slate-800 flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs Section */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-none">
        <div className={`px-2 pb-1.5 text-[10px] font-mono tracking-wider text-slate-500 uppercase ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? 'TABS' : 'OPERATIONAL WORKSPACES'}
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full group relative flex items-center rounded-lg transition-all text-left ${
                isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-sm ring-1 ring-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? `${tab.label} (${tab.badge})` : undefined}
            >
              {/* Active Indicator Bar on Edge */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-r" />
              )}

              {/* Icon */}
              <div
                className={`p-1.5 rounded-md transition-colors shrink-0 ${
                  isActive
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                    : 'bg-slate-950 text-slate-400 group-hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Full Label and Badge when Expanded */}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs truncate">{tab.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                        isActive
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate leading-tight group-hover:text-slate-400">
                    {tab.description}
                  </p>
                </div>
              )}

              {/* Floating Tooltip for Collapsed State */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-950 text-slate-100 text-xs font-mono rounded shadow-xl border border-slate-700 whitespace-nowrap hidden group-hover:flex items-center gap-2 z-50 pointer-events-none">
                  <span className="font-bold">{tab.label}</span>
                  <span className="px-1 text-[9px] bg-slate-800 text-emerald-400 rounded">
                    {tab.badge}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Operational Controls & Controls Footer */}
      <div className="p-3 border-t border-slate-800 space-y-3 bg-slate-950/60">
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
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
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
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                  USER ROLE:
                </span>
                <span className="text-amber-400 text-[9px]">ACTIVE RBAC</span>
              </div>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
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
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs transition-colors border border-emerald-500/50 shadow-sm cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Doctrine & JP 5-0 AI</span>
              <Sparkles className="w-3 h-3 text-emerald-200" />
            </button>
          </>
        ) : (
          /* Collapsed Icons Only */
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={onOpenDoctrine}
              className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors border border-emerald-500/50"
              title="Open Doctrine & JP 5-0 AI Assistant"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Security & Oversight Status Indicator */}
        <div className={`text-[9px] font-mono text-slate-500 border-t border-slate-800/80 pt-2 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                FABRIC SYNC
              </span>
              <span>DoD 5240.01 COMPLIANT</span>
            </div>
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Federated Fabric Sync"></span>
          )}
        </div>
      </div>
    </aside>
  );
};
