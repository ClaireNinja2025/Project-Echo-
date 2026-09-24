import React from 'react';
import { 
  Shield, 
  Activity, 
  Clock, 
  Globe,
  Lock,
  Target
} from 'lucide-react';
import { UserRole, OperationalPhase } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  currentPhase: OperationalPhase;
  onOpenGlobalMap: () => void;
  onOpenTacticalCop: () => void;
  onOpenIoWorkspace?: () => void;
  onOpenOpDesign?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentPhase,
  onOpenGlobalMap,
  onOpenTacticalCop,
  onOpenIoWorkspace,
  onOpenOpDesign,
}) => {
  return (
    <header className="bg-black border-b border-slate-800 text-slate-100 z-20 shrink-0">
      {/* Classification & Operational Banner */}
      <div className="bg-black border-b border-emerald-900/50 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs tracking-wider font-mono gap-2">
        <div className="flex items-center space-x-3 text-emerald-400 flex-wrap">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-900/90 text-emerald-300 font-semibold border border-emerald-700 text-[10px]">
            UNCLASSIFIED // REL TO USA, PARTNER COALITION
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenGlobalMap}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
              title="Switch to Global Combatant Command AOR World Map"
            >
              <Globe className="w-3 h-3 text-blue-400" />
              <span className="underline underline-offset-2">USCENTCOM AOR</span>
            </button>
            <span className="text-slate-600">/</span>
            <button 
              onClick={onOpenTacticalCop}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              title="Switch to Tactical Civil COP"
            >
              <Target className="w-3 h-3 text-emerald-400" />
              <span className="underline underline-offset-2">AO GRIFFIN (SECTOR 4)</span>
            </button>
            {onOpenOpDesign && (
              <>
                <span className="text-slate-600">/</span>
                <button
                  onClick={onOpenOpDesign}
                  className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                  title="Switch to Army Operational Design Framework (ADP 5-0)"
                >
                  <Activity className="w-3 h-3 text-purple-400" />
                  <span className="underline underline-offset-2">OP DESIGN (ADP 5-0)</span>
                </button>
              </>
            )}
            {onOpenIoWorkspace && (
              <>
                <span className="text-slate-600">/</span>
                <button
                  onClick={onOpenIoWorkspace}
                  className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                  title="Switch to Information Operations (IO) Doctrine & AOR Framework Workspace"
                >
                  <Activity className="w-3 h-3 text-amber-400" />
                  <span className="underline underline-offset-2">IO WORKSPACE (ADP 3-13)</span>
                </button>
              </>
            )}
          </div>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-emerald-400 hidden lg:flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            FEDERATED DATA FABRIC: SYNCHRONIZED
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-400 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black border border-slate-800 text-[10px] text-slate-300">
            <span className="text-slate-500">PHASE:</span>
            <span className="font-semibold text-cyan-300">{currentPhase.split(' - ')[0]}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black border border-slate-800 text-[10px] text-slate-300">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span className="font-semibold text-amber-300 truncate max-w-[160px]">{currentRole}</span>
          </div>

          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>DTG: 221700Z SEP 26</span>
          </span>
        </div>
      </div>
    </header>
  );
};
