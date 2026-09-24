import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Download, 
  Share2, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  Building2, 
  Users, 
  TrendingUp,
  Cpu,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { OperationalPhase } from '../types';
import { 
  INITIAL_OPERATIONAL_DESIGNS, 
  OperationalDesignModel, 
  LineOfEffort, 
  DecisivePoint, 
  RequiredCondition, 
  CenterOfGravityElement, 
  DefeatMechanism, 
  StabilityMechanism, 
  ApproachType,
  OperationalRisk,
  OperationalAssumption
} from '../data/operationalDesignData';

interface ArmyOperationalDesignProps {
  currentPhase: OperationalPhase;
  onPhaseChange?: (phase: OperationalPhase) => void;
  onNavigateToCop?: () => void;
  onNavigateToCoa?: () => void;
  onNavigateToMoeMop?: () => void;
}

export const ArmyOperationalDesign: React.FC<ArmyOperationalDesignProps> = ({
  currentPhase,
  onPhaseChange,
  onNavigateToCop,
  onNavigateToCoa,
  onNavigateToMoeMop,
}) => {
  // Active AOR Model State
  const [selectedAorKey, setSelectedAorKey] = useState<string>('aor-centcom');
  const [activeTab, setActiveTab] = useState<'LOE_MATRIX' | 'END_STATE' | 'COG_ANALYSIS' | 'MECHANISMS_REACH' | 'RISKS_ASSUMPTIONS'>('LOE_MATRIX');
  
  // Local Mutable Operational Design Store
  const [designs, setDesigns] = useState<Record<string, OperationalDesignModel>>(INITIAL_OPERATIONAL_DESIGNS);
  const currentDesign = designs[selectedAorKey] || INITIAL_OPERATIONAL_DESIGNS['aor-centcom'];

  // Editing Modals / Inline State
  const [editingEndState, setEditingEndState] = useState<boolean>(false);
  const [milEndStateDraft, setMilEndStateDraft] = useState<string>(currentDesign.militaryEndState);
  const [civEndStateDraft, setCivEndStateDraft] = useState<string>(currentDesign.civilPoliticalEndState);
  const [approachDraft, setApproachDraft] = useState<ApproachType>(currentDesign.approach);
  const [approachRationaleDraft, setApproachRationaleDraft] = useState<string>(currentDesign.approachRationale);

  // New Decisive Point Modal State
  const [isAddingDp, setIsAddingDp] = useState<boolean>(false);
  const [targetLoeId, setTargetLoeId] = useState<string>(currentDesign.linesOfEffort[0]?.id || '');
  const [newDpName, setNewDpName] = useState<string>('');
  const [newDpDescription, setNewDpDescription] = useState<string>('');
  const [newDpPhase, setNewDpPhase] = useState<OperationalPhase>(currentPhase);
  const [newDpLeadUnit, setNewDpLeadUnit] = useState<string>('CAT 712');
  const [newDpVulnerability, setNewDpVulnerability] = useState<string>('');
  const [newDpTargetDTG, setNewDpTargetDTG] = useState<string>('281200Z SEP 26');

  // Selected Decisive Point for detailed view/edit
  const [editingDp, setEditingDp] = useState<{ loeId: string; dp: DecisivePoint } | null>(null);

  // New Condition Modal State
  const [isAddingCondition, setIsAddingCondition] = useState<boolean>(false);
  const [newConditionText, setNewConditionText] = useState<string>('');
  const [newConditionLoeId, setNewConditionLoeId] = useState<string>(currentDesign.linesOfEffort[0]?.id || '');

  // Export banner feedback
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Handle Synchronizing Drafts when AOR changes
  const handleAorChange = (newKey: string) => {
    setSelectedAorKey(newKey);
    const d = designs[newKey] || INITIAL_OPERATIONAL_DESIGNS[newKey];
    if (d) {
      setMilEndStateDraft(d.militaryEndState);
      setCivEndStateDraft(d.civilPoliticalEndState);
      setApproachDraft(d.approach);
      setApproachRationaleDraft(d.approachRationale);
    }
  };

  // Save End State edits
  const handleSaveEndState = () => {
    setDesigns((prev) => ({
      ...prev,
      [selectedAorKey]: {
        ...prev[selectedAorKey],
        militaryEndState: milEndStateDraft,
        civilPoliticalEndState: civEndStateDraft,
        approach: approachDraft,
        approachRationale: approachRationaleDraft,
      },
    }));
    setEditingEndState(false);
  };

  // Add Decisive Point
  const handleCreateDecisivePoint = () => {
    if (!newDpName.trim()) return;

    const newDp: DecisivePoint = {
      id: `dp-${Date.now()}`,
      name: newDpName,
      description: newDpDescription || 'Newly articulated decisive point in line of effort.',
      phase: newDpPhase,
      status: 'PLANNED',
      targetDTG: newDpTargetDTG || '301200Z SEP 26',
      criticalVulnerabilityTargeted: newDpVulnerability || 'Unmitigated operational friction point',
      leadUnit: newDpLeadUnit || 'Civil Affairs Planning Team',
      successCriteria: 'Milestone conditions established and verified by CMOC.',
    };

    setDesigns((prev) => {
      const current = prev[selectedAorKey];
      const updatedLoes = current.linesOfEffort.map((loe) => {
        if (loe.id === targetLoeId) {
          return {
            ...loe,
            decisivePoints: [...loe.decisivePoints, newDp],
          };
        }
        return loe;
      });
      return {
        ...prev,
        [selectedAorKey]: {
          ...current,
          linesOfEffort: updatedLoes,
        },
      };
    });

    setIsAddingDp(false);
    setNewDpName('');
    setNewDpDescription('');
    setNewDpVulnerability('');
  };

  // Update Decisive Point Status
  const handleUpdateDpStatus = (loeId: string, dpId: string, status: DecisivePoint['status']) => {
    setDesigns((prev) => {
      const current = prev[selectedAorKey];
      const updatedLoes = current.linesOfEffort.map((loe) => {
        if (loe.id === loeId) {
          return {
            ...loe,
            decisivePoints: loe.decisivePoints.map((dp) => (dp.id === dpId ? { ...dp, status } : dp)),
          };
        }
        return loe;
      });
      return {
        ...prev,
        [selectedAorKey]: {
          ...current,
          linesOfEffort: updatedLoes,
        },
      };
    });

    if (editingDp && editingDp.dp.id === dpId) {
      setEditingDp({
        ...editingDp,
        dp: { ...editingDp.dp, status },
      });
    }
  };

  // Delete Decisive Point
  const handleDeleteDp = (loeId: string, dpId: string) => {
    setDesigns((prev) => {
      const current = prev[selectedAorKey];
      const updatedLoes = current.linesOfEffort.map((loe) => {
        if (loe.id === loeId) {
          return {
            ...loe,
            decisivePoints: loe.decisivePoints.filter((dp) => dp.id !== dpId),
          };
        }
        return loe;
      });
      return {
        ...prev,
        [selectedAorKey]: {
          ...current,
          linesOfEffort: updatedLoes,
        },
      };
    });
    setEditingDp(null);
  };

  // Add Required Condition
  const handleAddCondition = () => {
    if (!newConditionText.trim()) return;
    const newCond: RequiredCondition = {
      id: `cond-${Date.now()}`,
      statement: newConditionText,
      loeId: newConditionLoeId,
      status: 'PARTIAL',
      assessmentNotes: 'Initial condition criteria ingested during operational design synthesis.',
      evaluationDTG: '211800Z SEP 26',
    };

    setDesigns((prev) => {
      const current = prev[selectedAorKey];
      return {
        ...prev,
        [selectedAorKey]: {
          ...current,
          requiredConditions: [...current.requiredConditions, newCond],
        },
      };
    });

    setIsAddingCondition(false);
    setNewConditionText('');
  };

  // Toggle Condition Status
  const handleCycleConditionStatus = (conditionId: string) => {
    const statuses: RequiredCondition['status'][] = ['MET', 'PARTIAL', 'NOT_MET', 'AT_RISK'];
    setDesigns((prev) => {
      const current = prev[selectedAorKey];
      const updated = current.requiredConditions.map((c) => {
        if (c.id === conditionId) {
          const nextIdx = (statuses.indexOf(c.status) + 1) % statuses.length;
          return { ...c, status: statuses[nextIdx] };
        }
        return c;
      });
      return {
        ...prev,
        [selectedAorKey]: { ...current, requiredConditions: updated },
      };
    });
  };

  // Update Defeat & Stability Mechanism
  const handleUpdateMechanism = (
    type: 'DEFEAT' | 'STABILITY',
    value: DefeatMechanism | StabilityMechanism,
    rationale: string
  ) => {
    setDesigns((prev) => {
      const current = prev[selectedAorKey];
      if (type === 'DEFEAT') {
        return {
          ...prev,
          [selectedAorKey]: {
            ...current,
            defeatMechanism: { primary: value as DefeatMechanism, rationale },
          },
        };
      } else {
        return {
          ...prev,
          [selectedAorKey]: {
            ...current,
            stabilityMechanism: { primary: value as StabilityMechanism, rationale },
          },
        };
      }
    });
  };

  // Reset to Doctrinal Default
  const handleResetToBaseline = () => {
    setDesigns((prev) => ({
      ...prev,
      [selectedAorKey]: JSON.parse(JSON.stringify(INITIAL_OPERATIONAL_DESIGNS[selectedAorKey] || INITIAL_OPERATIONAL_DESIGNS['aor-centcom'])),
    }));
    const d = INITIAL_OPERATIONAL_DESIGNS[selectedAorKey] || INITIAL_OPERATIONAL_DESIGNS['aor-centcom'];
    setMilEndStateDraft(d.militaryEndState);
    setCivEndStateDraft(d.civilPoliticalEndState);
    setApproachDraft(d.approach);
    setApproachRationaleDraft(d.approachRationale);
  };

  // Export Annex P Operational Design Brief
  const handleExportAnnex = () => {
    const brief = `
================================================================================
CLASSIFICATION: SECRET // REL TO USA, FVEY // EXERCISE ONLY
ARMY OPERATIONAL DESIGN ANNEX (ADP 5-0 / JP 5-0 / FM 5-0)
CAMPAIGN: ${currentDesign.campaignTitle}
COMMAND: ${currentDesign.aorAcronym}
DATE/TIME: 211800Z SEP 26
================================================================================

1. PROBLEM STATEMENT:
${currentDesign.problemStatement}

2. OPERATIONAL ENVIRONMENT SUMMARY:
${currentDesign.operationalEnvironmentSummary}

3. OPERATIONAL APPROACH (${currentDesign.approach} APPROACH):
${currentDesign.approachRationale}

4. END STATE & TERMINATION CRITERIA:
A. Military End State:
   ${currentDesign.militaryEndState}
B. Civil-Political End State:
   ${currentDesign.civilPoliticalEndState}

5. REQUIRED CONDITIONS:
${currentDesign.requiredConditions.map((c, i) => `   [${c.status}] Cond ${i + 1}: ${c.statement}`).join('\n')}

6. CENTER OF GRAVITY (COG) BREAKDOWN (Dr. Strange Model):
${currentDesign.cogs
  .map(
    (g) => `   * ${g.actor} COG: ${g.centerOfGravity}
     - Critical Capabilities: ${g.criticalCapabilities.join('; ')}
     - Critical Requirements: ${g.criticalRequirements.join('; ')}
     - Critical Vulnerabilities: ${g.criticalVulnerabilities.join('; ')}`
  )
  .join('\n\n')}

7. LINES OF EFFORT (LOEs) & DECISIVE POINTS (DPs):
${currentDesign.linesOfEffort
  .map(
    (loe) => `   LOE ${loe.number}: ${loe.name} (Lead: ${loe.leadAgent})
   Objective: ${loe.objective}
   Decisive Points:
${loe.decisivePoints.map((dp) => `     - [${dp.status}] ${dp.name} (${dp.phase}) | DTG: ${dp.targetDTG} | Lead: ${dp.leadUnit}`).join('\n')}`
  )
  .join('\n\n')}

8. DEFEAT & STABILITY MECHANISMS:
   - Primary Defeat Mechanism: ${currentDesign.defeatMechanism.primary}
     Rationale: ${currentDesign.defeatMechanism.rationale}
   - Primary Stability Mechanism: ${currentDesign.stabilityMechanism.primary}
     Rationale: ${currentDesign.stabilityMechanism.rationale}

9. OPERATIONAL REACH & CULMINATION:
   - Base of Operations: ${currentDesign.operationalReach.baseOfOperations}
   - Forward Logistics: ${currentDesign.operationalReach.forwardLogisticsBasing}
   - Endurance Window: ${currentDesign.operationalReach.enduranceWindow}
   - Culmination Factors: ${currentDesign.operationalReach.culminationFactors}
   - Refit Triggers: ${currentDesign.operationalReach.pauseRefitTriggers}
================================================================================
`;
    navigator.clipboard.writeText(brief);
    setCopiedNotice('Operational Design Brief copied to clipboard (Annex P format)!');
    setTimeout(() => setCopiedNotice(null), 3500);
  };

  const PHASES: OperationalPhase[] = [
    'Phase 0 - Shape',
    'Phase 1 - Crisis Response',
    'Phase 2 - Seize Initiative',
    'Phase 3 - Dominate',
    'Phase 4 - Transition / Stabilize',
    'Phase 5 - Enable Civil Authority',
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-black text-slate-100 p-4 md:p-6 space-y-6 font-sans">
      {/* Top Banner & Header */}
      <div className="bg-black border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base md:text-lg font-bold text-white font-mono flex items-center gap-2">
                Army Operational Design Framework
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ADP 5-0 / JP 5-0 / FM 5-0
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Conceptual planning suite: End State, Center of Gravity (COG), Lines of Effort (LOEs), Decisive Points, Defeat/Stability Mechanisms & Reach.
            </p>
          </div>
        </div>

        {/* Global Theater Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theater Preset Picker */}
          <div className="flex items-center bg-black border border-slate-800 rounded-lg p-0.5 font-mono text-xs">
            <span className="px-2 text-slate-500 text-[10px] uppercase font-bold">AOR:</span>
            {Object.keys(INITIAL_OPERATIONAL_DESIGNS).map((key) => {
              const item = INITIAL_OPERATIONAL_DESIGNS[key];
              const isSelected = selectedAorKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleAorChange(key)}
                  className={`px-2.5 py-1 rounded transition-colors text-xs ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.aorAcronym}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleResetToBaseline}
            className="px-2.5 py-1.5 bg-black hover:bg-neutral-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors"
            title="Reset active Operational Design to doctrinal template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Preset</span>
          </button>

          <button
            onClick={handleExportAnnex}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Copy Annex P formatted operational brief"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Brief</span>
          </button>
        </div>
      </div>

      {copiedNotice && (
        <div className="p-2.5 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-lg text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Operational Phase & Cross-Link Ribbon */}
      <div className="bg-black border border-slate-800 rounded-xl p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 font-bold uppercase text-[10px]">CURRENT PHASE:</span>
          {PHASES.map((p) => {
            const isCurrent = currentPhase === p;
            return (
              <button
                key={p}
                onClick={() => onPhaseChange && onPhaseChange(p)}
                className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'bg-black border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-neutral-900'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Cross-Link Shortcuts to Related Sections */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 uppercase text-[10px]">CORRELATED MODULES:</span>
          {onNavigateToCop && (
            <button
              onClick={onNavigateToCop}
              className="px-2 py-1 bg-black hover:bg-neutral-900 border border-slate-800 text-cyan-400 rounded text-[10px] transition-colors"
            >
              Tactical COP
            </button>
          )}
          {onNavigateToCoa && (
            <button
              onClick={onNavigateToCoa}
              className="px-2 py-1 bg-black hover:bg-neutral-900 border border-slate-800 text-amber-400 rounded text-[10px] transition-colors"
            >
              COA Wargaming
            </button>
          )}
          {onNavigateToMoeMop && (
            <button
              onClick={onNavigateToMoeMop}
              className="px-2 py-1 bg-black hover:bg-neutral-900 border border-slate-800 text-purple-400 rounded text-[10px] transition-colors"
            >
              MOE / MOP Matrix
            </button>
          )}
        </div>
      </div>

      {/* Main Framework Tabs */}
      <div className="flex items-center border-b border-slate-800 text-xs font-mono space-x-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('LOE_MATRIX')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'LOE_MATRIX'
              ? 'border-emerald-400 text-white bg-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Lines of Effort & Decisive Points</span>
          <span className="px-1.5 py-0.2 rounded bg-neutral-900 text-emerald-300 text-[10px]">
            {currentDesign.linesOfEffort.reduce((sum, l) => sum + l.decisivePoints.length, 0)} DPs
          </span>
        </button>

        <button
          onClick={() => setActiveTab('END_STATE')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'END_STATE'
              ? 'border-emerald-400 text-white bg-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4 text-cyan-400" />
          <span>End State & Conditions</span>
          <span className="px-1.5 py-0.2 rounded bg-neutral-900 text-cyan-300 text-[10px]">
            {currentDesign.requiredConditions.length} Cond
          </span>
        </button>

        <button
          onClick={() => setActiveTab('COG_ANALYSIS')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'COG_ANALYSIS'
              ? 'border-emerald-400 text-white bg-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Center of Gravity (CC / CR / CV)</span>
        </button>

        <button
          onClick={() => setActiveTab('MECHANISMS_REACH')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'MECHANISMS_REACH'
              ? 'border-emerald-400 text-white bg-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span>Defeat / Stability & Reach</span>
        </button>

        <button
          onClick={() => setActiveTab('RISKS_ASSUMPTIONS')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'RISKS_ASSUMPTIONS'
              ? 'border-emerald-400 text-white bg-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Risks & Assumptions</span>
          <span className="px-1.5 py-0.2 rounded bg-neutral-900 text-rose-300 text-[10px]">
            {currentDesign.risks.length} Risks
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LINES OF EFFORT & DECISIVE POINTS MATRIX                           */}
      {/* ========================================================================= */}
      {activeTab === 'LOE_MATRIX' && (
        <div className="space-y-6">
          {/* Section Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black border border-slate-800 p-3 rounded-xl text-xs font-mono">
            <div>
              <span className="text-white font-bold block">OPERATIONAL DESIGN VISUALIZATION (ADP 5-0)</span>
              <span className="text-slate-400 text-[11px]">
                Lines of effort connect decisive points in time and space toward achieving operational end state conditions.
              </span>
            </div>

            <button
              onClick={() => setIsAddingDp(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Decisive Point</span>
            </button>
          </div>

          {/* Phase Header Columns */}
          <div className="grid grid-cols-6 gap-2 text-center font-mono text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 pb-2 hidden md:grid">
            <div className="p-1 rounded bg-black border border-slate-800 text-slate-300">Phase 0: Shape</div>
            <div className="p-1 rounded bg-black border border-slate-800 text-blue-300">Phase 1: Crisis Resp</div>
            <div className="p-1 rounded bg-black border border-slate-800 text-amber-300">Phase 2: Seize Init</div>
            <div className="p-1 rounded bg-black border border-slate-800 text-rose-300">Phase 3: Dominate</div>
            <div className="p-1 rounded bg-black border border-slate-800 text-purple-300">Phase 4: Stabilize</div>
            <div className="p-1 rounded bg-black border border-slate-800 text-emerald-300">Phase 5: Civil Auth</div>
          </div>

          {/* LOE Swimlanes */}
          <div className="space-y-4">
            {currentDesign.linesOfEffort.map((loe) => {
              return (
                <div
                  key={loe.id}
                  className="bg-black border border-slate-800 rounded-xl p-4 space-y-3 shadow-md"
                >
                  {/* Swimlane Title Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: loe.color }}
                      />
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        LOE {loe.number}: {loe.name}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-slate-300">
                          Lead: {loe.leadAgent}
                        </span>
                      </h4>
                    </div>

                    <div className="text-xs text-slate-400 font-mono italic">
                      Obj: {loe.objective}
                    </div>
                  </div>

                  {/* Decisive Points Cards along Phases */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2.5">
                    {PHASES.map((phase) => {
                      const pointsInPhase = loe.decisivePoints.filter((dp) => dp.phase === phase);
                      return (
                        <div
                          key={phase}
                          className="bg-black border border-slate-800/60 rounded-lg p-2 min-h-[110px] flex flex-col justify-between"
                        >
                          <span className="md:hidden text-[9px] text-slate-500 uppercase font-mono block mb-1">
                            {phase}
                          </span>

                          <div className="space-y-2">
                            {pointsInPhase.map((dp) => {
                              const isCompleted = dp.status === 'COMPLETED';
                              const isInProgress = dp.status === 'IN_PROGRESS';
                              const isAtRisk = dp.status === 'AT_RISK';
                              return (
                                <div
                                  key={dp.id}
                                  onClick={() => setEditingDp({ loeId: loe.id, dp })}
                                  className={`p-2 rounded border text-left cursor-pointer transition-transform hover:scale-[1.02] shadow-sm ${
                                    isCompleted
                                      ? 'bg-black border-emerald-600/80 text-emerald-200'
                                      : isInProgress
                                      ? 'bg-black border-blue-500/80 text-blue-200 ring-1 ring-blue-500/30'
                                      : isAtRisk
                                      ? 'bg-black border-rose-500/80 text-rose-200'
                                      : 'bg-black border-slate-800 text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                                    <span
                                      className={`px-1 py-0.2 rounded font-bold ${
                                        isCompleted
                                          ? 'bg-emerald-950 text-emerald-300'
                                          : isInProgress
                                          ? 'bg-blue-950 text-blue-300'
                                          : isAtRisk
                                          ? 'bg-rose-950 text-rose-300'
                                          : 'bg-neutral-900 text-slate-400'
                                      }`}
                                    >
                                      {dp.status}
                                    </span>
                                    <span className="text-slate-400">{dp.targetDTG.split(' ')[0]}</span>
                                  </div>

                                  <div className="font-bold text-xs leading-tight mb-1">{dp.name}</div>
                                  <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                                    {dp.description}
                                  </div>
                                </div>
                              );
                            })}

                            {pointsInPhase.length === 0 && (
                              <div className="h-full flex items-center justify-center text-[10px] text-slate-600 font-mono italic">
                                — No DP —
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decisive Point Detail / Status Modal */}
          {editingDp && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">DECISIVE POINT INSPECTOR</span>
                    <h3 className="text-sm font-bold text-white">{editingDp.dp.name}</h3>
                  </div>
                  <button
                    onClick={() => setEditingDp(null)}
                    className="p-1 rounded hover:bg-neutral-900 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">OPERATIONAL DESCRIPTION</label>
                    <p className="text-slate-200 bg-neutral-900/60 p-2.5 rounded border border-slate-800">
                      {editingDp.dp.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">OPERATIONAL PHASE</label>
                      <div className="text-white p-2 rounded bg-neutral-900 border border-slate-800">
                        {editingDp.dp.phase}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">TARGET DTG</label>
                      <div className="text-white p-2 rounded bg-neutral-900 border border-slate-800">
                        {editingDp.dp.targetDTG}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">CRITICAL VULNERABILITY TARGETED (CV)</label>
                    <div className="text-amber-300 p-2 rounded bg-amber-950/20 border border-amber-800/50">
                      {editingDp.dp.criticalVulnerabilityTargeted}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">LEAD EXECUTING UNIT</label>
                    <div className="text-slate-300 p-2 rounded bg-neutral-900 border border-slate-800">
                      {editingDp.dp.leadUnit}
                    </div>
                  </div>

                  {/* Status Editor */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">OPERATIONAL STATUS</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['COMPLETED', 'IN_PROGRESS', 'PLANNED', 'AT_RISK'] as DecisivePoint['status'][]).map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateDpStatus(editingDp.loeId, editingDp.dp.id, st)}
                            className={`py-1.5 px-2 rounded text-center font-bold text-[10px] transition-all cursor-pointer ${
                              editingDp.dp.status === st
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-black border border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleDeleteDp(editingDp.loeId, editingDp.dp.id)}
                    className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete DP</span>
                  </button>

                  <button
                    onClick={() => setEditingDp(null)}
                    className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Decisive Point Modal */}
          {isAddingDp && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">Create New Decisive Point</h3>
                  </div>
                  <button
                    onClick={() => setIsAddingDp(false)}
                    className="p-1 rounded hover:bg-neutral-900 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">TARGET LINE OF EFFORT</label>
                    <select
                      value={targetLoeId}
                      onChange={(e) => setTargetLoeId(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {currentDesign.linesOfEffort.map((loe) => (
                        <option key={loe.id} value={loe.id}>
                          LOE {loe.number}: {loe.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">DECISIVE POINT TITLE</label>
                    <input
                      type="text"
                      placeholder="e.g., DP 2.4: Municipal Radio Tower Security & Fact-Delivery"
                      value={newDpName}
                      onChange={(e) => setNewDpName(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">OPERATIONAL DESCRIPTION</label>
                    <textarea
                      rows={2}
                      placeholder="Specific action, event, or critical factor necessary to gain advantage or achieve conditions..."
                      value={newDpDescription}
                      onChange={(e) => setNewDpDescription(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">OPERATIONAL PHASE</label>
                      <select
                        value={newDpPhase}
                        onChange={(e) => setNewDpPhase(e.target.value as OperationalPhase)}
                        className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                      >
                        {PHASES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">TARGET DTG</label>
                      <input
                        type="text"
                        placeholder="281200Z SEP 26"
                        value={newDpTargetDTG}
                        onChange={(e) => setNewDpTargetDTG(e.target.value)}
                        className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">CRITICAL VULNERABILITY TARGETED (CV)</label>
                    <input
                      type="text"
                      placeholder="e.g., Hostile proxy monopoly over municipal information channels"
                      value={newDpVulnerability}
                      onChange={(e) => setNewDpVulnerability(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">LEAD EXECUTING UNIT</label>
                    <input
                      type="text"
                      placeholder="e.g., CAT 712 / MISO Detachment"
                      value={newDpLeadUnit}
                      onChange={(e) => setNewDpLeadUnit(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setIsAddingDp(false)}
                    className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateDecisivePoint}
                    disabled={!newDpName.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    Create Decisive Point
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: END STATE & REQUIRED CONDITIONS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'END_STATE' && (
        <div className="space-y-6">
          {/* End State Editors */}
          <div className="bg-black border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Strategic & Operational End State (ADP 5-0 / JP 5-0)</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  The set of required conditions that defines achievement of all commander's operational objectives.
                </p>
              </div>

              {!editingEndState ? (
                <button
                  onClick={() => setEditingEndState(true)}
                  className="px-3 py-1.5 bg-black hover:bg-neutral-900 border border-slate-700 text-cyan-300 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit End States</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingEndState(false)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-slate-300 rounded text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEndState}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save End State</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Military End State */}
              <div className="bg-black border border-slate-800/80 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-blue-400">MILITARY END STATE</span>
                  <span className="text-[10px] text-slate-500">FORCES & SECURITY</span>
                </div>
                {!editingEndState ? (
                  <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {currentDesign.militaryEndState}
                  </p>
                ) : (
                  <textarea
                    rows={4}
                    value={milEndStateDraft}
                    onChange={(e) => setMilEndStateDraft(e.target.value)}
                    className="w-full bg-black border border-slate-700 rounded p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>

              {/* Civil-Political End State */}
              <div className="bg-black border border-slate-800/80 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-emerald-400">CIVIL-POLITICAL END STATE</span>
                  <span className="text-[10px] text-slate-500">GOVERNANCE & COGNITIVE</span>
                </div>
                {!editingEndState ? (
                  <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {currentDesign.civilPoliticalEndState}
                  </p>
                ) : (
                  <textarea
                    rows={4}
                    value={civEndStateDraft}
                    onChange={(e) => setCivEndStateDraft(e.target.value)}
                    className="w-full bg-black border border-slate-700 rounded p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>
            </div>

            {/* Operational Approach Selector */}
            <div className="bg-black border border-slate-800 rounded-lg p-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">OPERATIONAL APPROACH SELECTION</span>
                <span className="text-slate-500 text-[10px]">DIRECT VS. INDIRECT</span>
              </div>
              {!editingEndState ? (
                <div className="flex items-start gap-3">
                  <span className="px-2 py-1 rounded bg-neutral-900 border border-slate-800 text-purple-300 font-bold shrink-0">
                    {currentDesign.approach} APPROACH
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">{currentDesign.approachRationale}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="approach"
                        checked={approachDraft === 'DIRECT'}
                        onChange={() => setApproachDraft('DIRECT')}
                        className="accent-purple-500"
                      />
                      <span className="text-slate-200">Direct Approach (Attacks adversary COG directly)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="approach"
                        checked={approachDraft === 'INDIRECT'}
                        onChange={() => setApproachDraft('INDIRECT')}
                        className="accent-purple-500"
                      />
                      <span className="text-slate-200">Indirect Approach (Attacks through critical vulnerabilities)</span>
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={approachRationaleDraft}
                    onChange={(e) => setApproachRationaleDraft(e.target.value)}
                    className="w-full bg-black border border-slate-700 rounded p-2 text-xs text-slate-100"
                    placeholder="Rationale for selected approach..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Required Conditions Table */}
          <div className="bg-black border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Required Conditions Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Click status pill to cycle assessment (MET → PARTIAL → NOT_MET → AT_RISK).
                </p>
              </div>

              <button
                onClick={() => setIsAddingCondition(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Condition</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs divide-y divide-slate-800 border border-slate-800 rounded-lg">
                <thead className="bg-black text-slate-400 text-[10px]">
                  <tr>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">REQUIRED CONDITION STATEMENT</th>
                    <th className="p-3">LOE MAPPING</th>
                    <th className="p-3">ASSESSMENT NOTES</th>
                    <th className="p-3">EVAL DTG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {currentDesign.requiredConditions.map((cond) => {
                    const mappedLoe = currentDesign.linesOfEffort.find((l) => l.id === cond.loeId);
                    return (
                      <tr key={cond.id} className="hover:bg-neutral-900/50">
                        <td className="p-3">
                          <button
                            onClick={() => handleCycleConditionStatus(cond.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                              cond.status === 'MET'
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                                : cond.status === 'PARTIAL'
                                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                                : cond.status === 'AT_RISK'
                                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                                : 'bg-neutral-900 border-slate-700 text-slate-400'
                            }`}
                            title="Click to cycle status"
                          >
                            {cond.status}
                          </button>
                        </td>
                        <td className="p-3 font-semibold text-white max-w-sm">{cond.statement}</td>
                        <td className="p-3">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] border border-slate-800 whitespace-nowrap"
                            style={{ color: mappedLoe?.color || '#94a3b8' }}
                          >
                            LOE {mappedLoe?.number}: {mappedLoe?.name.split('&')[0]}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] max-w-xs">{cond.assessmentNotes}</td>
                        <td className="p-3 text-slate-500 text-[10px] whitespace-nowrap">{cond.evaluationDTG}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Condition Modal */}
          {isAddingCondition && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Add Required End State Condition</h3>
                  <button
                    onClick={() => setIsAddingCondition(false)}
                    className="p-1 rounded hover:bg-neutral-900 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">CONDITION STATEMENT</label>
                    <textarea
                      rows={3}
                      placeholder="Measurable desired condition (e.g., Municipal water flow established at 80%+ across district)..."
                      value={newConditionText}
                      onChange={(e) => setNewConditionText(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">ASSOCIATED LINE OF EFFORT</label>
                    <select
                      value={newConditionLoeId}
                      onChange={(e) => setNewConditionLoeId(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      {currentDesign.linesOfEffort.map((loe) => (
                        <option key={loe.id} value={loe.id}>
                          LOE {loe.number}: {loe.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setIsAddingCondition(false)}
                    className="px-4 py-1.5 bg-neutral-900 text-slate-300 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCondition}
                    disabled={!newConditionText.trim()}
                    className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded text-xs"
                  >
                    Add Condition
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CENTER OF GRAVITY (CC / CR / CV) BREAKDOWN                         */}
      {/* ========================================================================= */}
      {activeTab === 'COG_ANALYSIS' && (
        <div className="space-y-6">
          <div className="bg-black border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span className="text-white font-bold block">
                CENTER OF GRAVITY SYSTEMIC ANALYSIS (DR. JOE STRANGE METHODOLOGY)
              </span>
              <span className="text-slate-400 text-[11px]">
                Center of Gravity (COG) → Critical Capabilities (CC) → Critical Requirements (CR) → Critical Vulnerabilities (CV).
              </span>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold shrink-0">
              JP 5-0 CH IV-13
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentDesign.cogs.map((cog) => {
              const isAdv = cog.actor === 'ADVERSARY';
              return (
                <div
                  key={cog.id}
                  className={`bg-black border rounded-xl p-5 space-y-4 shadow-md font-mono ${
                    isAdv ? 'border-rose-900/60' : 'border-blue-900/60'
                  }`}
                >
                  {/* COG Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          isAdv ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'
                        }`}
                      />
                      <h4
                        className={`text-sm font-bold uppercase tracking-wider ${
                          isAdv ? 'text-rose-400' : 'text-blue-400'
                        }`}
                      >
                        {cog.actor} CENTER OF GRAVITY
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase">MORAL & PHYSICAL POWER</span>
                  </div>

                  {/* COG Primary Box */}
                  <div
                    className={`p-3.5 rounded-lg border text-sm font-bold ${
                      isAdv
                        ? 'bg-rose-950/20 border-rose-800/80 text-rose-200'
                        : 'bg-blue-950/20 border-blue-800/80 text-blue-200'
                    }`}
                  >
                    {cog.centerOfGravity}
                  </div>

                  {/* Critical Capabilities (CC) */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">
                      1. CRITICAL CAPABILITIES (CC: What the COG does)
                    </span>
                    <div className="space-y-1.5">
                      {cog.criticalCapabilities.map((cc, i) => (
                        <div
                          key={i}
                          className="bg-black border border-slate-800 p-2.5 rounded text-xs text-slate-300 flex items-start gap-2"
                        >
                          <span className="text-amber-500 font-bold shrink-0">CC{i + 1}:</span>
                          <span>{cc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Requirements (CR) */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide block">
                      2. CRITICAL REQUIREMENTS (CR: Resources/conditions needed)
                    </span>
                    <div className="space-y-1.5">
                      {cog.criticalRequirements.map((cr, i) => (
                        <div
                          key={i}
                          className="bg-black border border-slate-800 p-2.5 rounded text-xs text-slate-300 flex items-start gap-2"
                        >
                          <span className="text-cyan-500 font-bold shrink-0">CR{i + 1}:</span>
                          <span>{cr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Vulnerabilities (CV) */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide flex items-center justify-between">
                      <span>3. CRITICAL VULNERABILITIES (CV: Targetable aspects)</span>
                      <span className="text-[9px] text-slate-500 lowercase">linked to decisive points</span>
                    </span>
                    <div className="space-y-1.5">
                      {cog.criticalVulnerabilities.map((cv, i) => (
                        <div
                          key={i}
                          className="bg-black border border-emerald-900/60 p-2.5 rounded text-xs text-emerald-200 flex items-start gap-2"
                        >
                          <span className="text-emerald-400 font-bold shrink-0">CV{i + 1}:</span>
                          <span>{cv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DEFEAT & STABILITY MECHANISMS & OPERATIONAL REACH                  */}
      {/* ========================================================================= */}
      {activeTab === 'MECHANISMS_REACH' && (
        <div className="space-y-6">
          {/* Defeat and Stability Mechanisms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Defeat Mechanisms Card */}
            <div className="bg-black border border-slate-800 rounded-xl p-5 space-y-4 font-mono">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Defeat Mechanisms (ADP 5-0 / FM 3-0)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">TACTICAL & OPERATIONAL COERCION</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-xs font-bold border border-rose-800">
                  {currentDesign.defeatMechanism.primary}
                </span>
              </div>

              {/* Selector */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {(['DESTROY', 'DISLOCATE', 'DISINTEGRATE', 'ISOLATE'] as DefeatMechanism[]).map((mech) => (
                  <button
                    key={mech}
                    onClick={() => handleUpdateMechanism('DEFEAT', mech, currentDesign.defeatMechanism.rationale)}
                    className={`py-2 px-1 text-center font-bold text-[11px] rounded transition-all cursor-pointer border ${
                      currentDesign.defeatMechanism.primary === mech
                        ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                        : 'bg-black border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mech}
                  </button>
                ))}
              </div>

              <div className="bg-neutral-900/60 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">DOCTRINAL DEFINITIONS</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-rose-400">Destroy:</strong> Render combat ineffective until reconstituted.<br />
                  <strong className="text-rose-400">Dislocate:</strong> Compel enemy to expose forces or abandon positions.<br />
                  <strong className="text-rose-400">Disintegrate:</strong> Disrupt system cohesion, command nodes, and synchronization.<br />
                  <strong className="text-rose-400">Isolate:</strong> Seal off enemy physically and psychologically from support.
                </p>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">OPERATIONAL APPLICATION RATIONALE</label>
                <textarea
                  rows={3}
                  value={currentDesign.defeatMechanism.rationale}
                  onChange={(e) =>
                    handleUpdateMechanism('DEFEAT', currentDesign.defeatMechanism.primary, e.target.value)
                  }
                  className="w-full bg-black border border-slate-800 rounded p-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Stability Mechanisms Card */}
            <div className="bg-black border border-slate-800 rounded-xl p-5 space-y-4 font-mono">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Stability Mechanisms (ADP 3-07 / JP 5-0)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">CIVIL-MILITARY STABILIZATION</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800">
                  {currentDesign.stabilityMechanism.primary}
                </span>
              </div>

              {/* Selector */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {(['COMPEL', 'CONTROL', 'INFLUENCE', 'SUPPORT'] as StabilityMechanism[]).map((mech) => (
                  <button
                    key={mech}
                    onClick={() =>
                      handleUpdateMechanism('STABILITY', mech, currentDesign.stabilityMechanism.rationale)
                    }
                    className={`py-2 px-1 text-center font-bold text-[11px] rounded transition-all cursor-pointer border ${
                      currentDesign.stabilityMechanism.primary === mech
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                        : 'bg-black border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mech}
                  </button>
                ))}
              </div>

              <div className="bg-neutral-900/60 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">DOCTRINAL DEFINITIONS</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-emerald-400">Compel:</strong> Use threat or force to establish civil compliance.<br />
                  <strong className="text-emerald-400">Control:</strong> Impose physical security and limits on movement.<br />
                  <strong className="text-emerald-400">Influence:</strong> Alter behavioral choices through communication and deeds.<br />
                  <strong className="text-emerald-400">Support:</strong> Assist civil authorities with logistics, engineering, and essential aid.
                </p>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">OPERATIONAL APPLICATION RATIONALE</label>
                <textarea
                  rows={3}
                  value={currentDesign.stabilityMechanism.rationale}
                  onChange={(e) =>
                    handleUpdateMechanism('STABILITY', currentDesign.stabilityMechanism.primary, e.target.value)
                  }
                  className="w-full bg-black border border-slate-800 rounded p-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Operational Reach & Culmination Assessment */}
          <div className="bg-black border border-slate-800 rounded-xl p-5 space-y-4 font-mono">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Operational Reach, Basing & Culmination Point Assessment</span>
                </h4>
                <span className="text-[10px] text-slate-500">
                  Distance and duration across which forces can employ military capabilities without culminating.
                </span>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                JP 5-0 CH IV-32
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-black border border-slate-800 p-3.5 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">BASE OF OPERATIONS</span>
                <p className="text-slate-200 font-semibold">{currentDesign.operationalReach.baseOfOperations}</p>
              </div>
              <div className="bg-black border border-slate-800 p-3.5 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">FORWARD LOGISTICS BASING</span>
                <p className="text-slate-200 font-semibold">{currentDesign.operationalReach.forwardLogisticsBasing}</p>
              </div>
              <div className="bg-black border border-slate-800 p-3.5 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">ENDURANCE WINDOW</span>
                <p className="text-emerald-400 font-bold">{currentDesign.operationalReach.enduranceWindow}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-black border border-rose-950/70 p-3.5 rounded-lg space-y-1">
                <span className="text-[10px] text-rose-400 font-bold block">PROJECTED CULMINATION FACTORS</span>
                <p className="text-slate-300 text-xs leading-relaxed">{currentDesign.operationalReach.culminationFactors}</p>
              </div>
              <div className="bg-black border border-amber-950/70 p-3.5 rounded-lg space-y-1">
                <span className="text-[10px] text-amber-400 font-bold block">OPERATIONAL PAUSE / REFIT TRIGGERS</span>
                <p className="text-slate-300 text-xs leading-relaxed">{currentDesign.operationalReach.pauseRefitTriggers}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: OPERATIONAL RISKS & ASSUMPTIONS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'RISKS_ASSUMPTIONS' && (
        <div className="space-y-6">
          {/* Operational Risks Table */}
          <div className="bg-black border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Operational Risk Matrix & Mitigation Measures (FM 5-0)</span>
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Tactical, civil-information, and strategic risks evaluated with contingency branch and sequel plans.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs divide-y divide-slate-800 border border-slate-800 rounded-lg">
                <thead className="bg-black text-slate-400 text-[10px]">
                  <tr>
                    <th className="p-3">RISK TITLE</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">PROB / SEV</th>
                    <th className="p-3">MITIGATION MEASURE</th>
                    <th className="p-3">CONTINGENCY BRANCH / SEQUEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {currentDesign.risks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-neutral-900/50">
                      <td className="p-3 font-bold text-white max-w-xs">{risk.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-slate-300 text-[10px] border border-slate-800">
                          {risk.category}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800 mr-1">
                          {risk.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">({risk.probability})</span>
                      </td>
                      <td className="p-3 text-slate-300 max-w-sm text-[11px]">{risk.mitigationMeasure}</td>
                      <td className="p-3 text-amber-300 max-w-xs text-[11px]">{risk.contingencyBranch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Assumptions */}
          <div className="bg-black border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Operational Assumptions & Validation Criteria</span>
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Suppositions on the operational environment presumed true in the absence of positive proof.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              {currentDesign.assumptions.map((asmp) => (
                <div key={asmp.id} className="p-3.5 rounded-lg bg-black border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{asmp.statement}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                      {asmp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">IMPACT IF INVALIDATED:</span>
                      <p className="text-rose-300">{asmp.impactIfInvalid}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">VALIDATION METHOD:</span>
                      <p className="text-cyan-300">{asmp.validationMethod}</p>
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
