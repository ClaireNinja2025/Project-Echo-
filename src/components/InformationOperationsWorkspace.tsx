import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Target, 
  Radio, 
  Globe, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Copy, 
  RotateCcw, 
  Save, 
  Layers, 
  Zap, 
  Lock, 
  Eye, 
  Activity, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  Cpu,
  Share2,
  Sliders,
  ExternalLink,
  MessageSquare,
  Users,
  Compass
} from 'lucide-react';
import { 
  GeographicCombatantCommand, 
  ARMY_IO_DOCTRINE_PUBLICATIONS, 
  INFORMATION_ADVANTAGE_ACTIVITIES, 
  INFORMATION_DIMENSIONS, 
  GLOBAL_AOR_IO_FRAMEWORKS,
  AorIoFramework
} from '../data/informationOperationsDoctrineData';

interface InformationOperationsWorkspaceProps {
  onNavigateToAorMap?: (aorId: string) => void;
  onNavigateToOpDesign?: () => void;
}

export const InformationOperationsWorkspace: React.FC<InformationOperationsWorkspaceProps> = ({
  onNavigateToAorMap,
  onNavigateToOpDesign
}) => {
  // Active AOR Selection
  const [selectedAor, setSelectedAor] = useState<GeographicCombatantCommand>('USINDOPACOM');
  
  // Active Workspace Sub-Tab
  const [workspaceTab, setWorkspaceTab] = useState<'AOR_FRAMEWORK' | 'DOCTRINE_LIBRARY' | 'IOSM_MATRIX' | 'ANNEX_P_EXPORT'>('AOR_FRAMEWORK');

  // Mission Statement State (Stored in localStorage or local state)
  const currentAorFramework: AorIoFramework = GLOBAL_AOR_IO_FRAMEWORKS[selectedAor];
  
  const [missionTask, setMissionTask] = useState<string>(currentAorFramework.defaultMissionStatement.task);
  const [missionPurpose, setMissionPurpose] = useState<string>(currentAorFramework.defaultMissionStatement.purpose);
  const [intentPurpose, setIntentPurpose] = useState<string>(currentAorFramework.defaultMissionStatement.commandersIntent.purpose);
  const [desiredEndState, setDesiredEndState] = useState<string>(currentAorFramework.defaultMissionStatement.commandersIntent.desiredCognitiveEndState);
  const [keyTasks, setKeyTasks] = useState<string[]>(currentAorFramework.defaultMissionStatement.commandersIntent.keyTasks);
  const [newKeyTaskInput, setNewKeyTaskInput] = useState<string>('');
  
  const [isMissionHeaderCollapsed, setIsMissionHeaderCollapsed] = useState<boolean>(false);
  const [isSaveNoticeVisible, setIsSaveNoticeVisible] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string>('');

  // Doctrine Library Filter
  const [doctrineSearchQuery, setDoctrineSearchQuery] = useState<string>('');
  const [selectedDoctrinePubId, setSelectedDoctrinePubId] = useState<string>('pub-adp313');
  const [selectedDimensionFilter, setSelectedDimensionFilter] = useState<'ALL' | 'PHYSICAL' | 'INFORMATIONAL' | 'COGNITIVE'>('ALL');
  const [selectedActivityDetailId, setSelectedActivityDetailId] = useState<string>('ENABLE');

  // Synchronize mission statement when AOR changes (if user hasn't heavily customized, or offer quick reload)
  useEffect(() => {
    const saved = localStorage.getItem(`io_mission_${selectedAor}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMissionTask(parsed.task || currentAorFramework.defaultMissionStatement.task);
        setMissionPurpose(parsed.purpose || currentAorFramework.defaultMissionStatement.purpose);
        setIntentPurpose(parsed.intentPurpose || currentAorFramework.defaultMissionStatement.commandersIntent.purpose);
        setDesiredEndState(parsed.desiredEndState || currentAorFramework.defaultMissionStatement.commandersIntent.desiredCognitiveEndState);
        setKeyTasks(parsed.keyTasks || currentAorFramework.defaultMissionStatement.commandersIntent.keyTasks);
        return;
      } catch (e) {
        console.error('Failed to parse saved mission statement', e);
      }
    }
    // Default to AOR preset
    setMissionTask(currentAorFramework.defaultMissionStatement.task);
    setMissionPurpose(currentAorFramework.defaultMissionStatement.purpose);
    setIntentPurpose(currentAorFramework.defaultMissionStatement.commandersIntent.purpose);
    setDesiredEndState(currentAorFramework.defaultMissionStatement.commandersIntent.desiredCognitiveEndState);
    setKeyTasks(currentAorFramework.defaultMissionStatement.commandersIntent.keyTasks);
  }, [selectedAor]);

  const handleSaveMissionStatement = () => {
    const payload = {
      task: missionTask,
      purpose: missionPurpose,
      intentPurpose,
      desiredEndState,
      keyTasks,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`io_mission_${selectedAor}`, JSON.stringify(payload));
    setIsSaveNoticeVisible(true);
    setTimeout(() => setIsSaveNoticeVisible(false), 3000);
  };

  const handleResetToPreset = () => {
    setMissionTask(currentAorFramework.defaultMissionStatement.task);
    setMissionPurpose(currentAorFramework.defaultMissionStatement.purpose);
    setIntentPurpose(currentAorFramework.defaultMissionStatement.commandersIntent.purpose);
    setDesiredEndState(currentAorFramework.defaultMissionStatement.commandersIntent.desiredCognitiveEndState);
    setKeyTasks(currentAorFramework.defaultMissionStatement.commandersIntent.keyTasks);
    localStorage.removeItem(`io_mission_${selectedAor}`);
  };

  const handleAddKeyTask = () => {
    if (newKeyTaskInput.trim()) {
      setKeyTasks([...keyTasks, newKeyTaskInput.trim()]);
      setNewKeyTaskInput('');
    }
  };

  const handleRemoveKeyTask = (index: number) => {
    setKeyTasks(keyTasks.filter((_, i) => i !== index));
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(''), 2500);
  };

  // Compile full Annex P text
  const generateAnnexPText = () => {
    return `ANNEX P (INFORMATION ADVANTAGE / INFORMATION OPERATIONS) TO OPORD 26-04 (OPERATION PACIFIC SENTINEL)
CLASSIFICATION: UNCLASSIFIED // FOR OFFICIAL USE ONLY
HEADQUARTERS, JOINT TASK FORCE ${selectedAor}
LOCATION: ${currentAorFramework.hqLocation}
DATE-TIME GROUP: 221700Z OCT 26

1. SITUATION
   a. Information Environment Overview:
      ${currentAorFramework.osintInformationEnvironmentSummary}
   b. Adversary Information Capabilities & Doctrine:
      Adversary: ${currentAorFramework.adversaryIoDoctrine.adversaryState}
      Doctrine: ${currentAorFramework.adversaryIoDoctrine.doctrineName}
      Strategy: ${currentAorFramework.adversaryIoDoctrine.primaryPlaybook}
      Themes:
${currentAorFramework.adversaryIoDoctrine.keyNarrativeThemes.map(t => `         - ${t}`).join('\n')}
   c. Friendly Information Capabilities:
      - Army Information Advantage Activities (ADP 3-13)
      - Civil Information Management (FM 3-57)
      - Public Affairs Operations (FM 3-61)
      - MISO / Psychological Operations (FM 3-53)
      - CEMA & Cyberspace Operations (FM 3-12)

2. MISSION
   ${missionTask} IN ORDER TO ${missionPurpose}.

3. EXECUTION
   a. Commander's Intent:
      (1) Purpose: ${intentPurpose}
      (2) Key Information Tasks:
${keyTasks.map((k, i) => `          (${i + 1}) ${k}`).join('\n')}
      (3) End State (Cognitive Dimension): ${desiredEndState}
   b. Concept of Operations in the Information Dimension:
      The Joint Force establishes Information Advantage by simultaneously executing five core activities across the Physical, Informational, and Cognitive dimensions.
${currentAorFramework.informationAdvantageActivitiesOperationalized.map(act => `      - Activity: ${act.activityName} | Lead: ${act.leadComponent} | Status: ${act.status}
        Task: ${act.theaterSpecificTask}`).join('\n')}

4. HIGH-PAYOFF INFORMATION TARGETS (HPIT)
${currentAorFramework.highPayoffTargets.map((t, idx) => `   (${idx + 1}) ${t.id} [${t.targetCategory}] - Actor: ${t.actorGroup}
       Objective: ${t.targetObjective}
       Delivery Means: ${t.deliveryMeans.join(', ')}
       Desired Behavioral Shift: ${t.desiredBehavioralShift}`).join('\n')}

5. COMMAND AND SIGNAL
   a. Information Operations Working Group (IOWG) Cadence: 0800Z and 1600Z daily.
   b. Deconfliction: Title 10 USC and DoD Directive 5122.05 compliance enforced; Public Affairs maintains strict demarcation from MISO.

ACKNOWLEDGE: RECEIPT OF ANNEX P VERIFIED BY JFC G-7 / G-39.
OFFICIAL: CHIEF OF STAFF, TF-IA ${selectedAor}`;
  };

  const aorButtons: { id: GeographicCombatantCommand; name: string; region: string }[] = [
    { id: 'USINDOPACOM', name: 'INDOPACOM', region: 'Indo-Pacific' },
    { id: 'USEUCOM', name: 'EUCOM', region: 'Europe & NATO' },
    { id: 'USCENTCOM', name: 'CENTCOM', region: 'Middle East & Central Asia' },
    { id: 'USAFRICOM', name: 'AFRICOM', region: 'Africa' },
    { id: 'USNORTHCOM', name: 'NORTHCOM', region: 'Homeland & Arctic' },
    { id: 'USSOUTHCOM', name: 'SOUTHCOM', region: 'Latin America & Caribbean' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto min-h-0">
      
      {/* ========================================================================= */}
      {/* TOP MISSION STATEMENT WORKSPACE HEADER (User Requirement Highlight)     */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-950/70 text-amber-300 rounded border border-amber-800 uppercase tracking-wide">
                    ADP 3-13 / FM 3-13 DOCTRINAL WORKSPACE
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950/70 text-emerald-300 rounded border border-emerald-800">
                    OPORD ANNEX P ACTIVE
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Information Operations (IO) & Information Advantage Workspace</span>
                </h1>
              </div>
            </div>

            {/* AOR Switcher Quick Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-xs font-mono text-slate-400 uppercase mr-1 hidden lg:inline">Theater AOR:</span>
              {aorButtons.map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedAor(btn.id)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded transition-all flex items-center gap-1 ${
                    selectedAor === btn.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 border border-indigo-400'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <Globe className="w-3 h-3 text-indigo-300" />
                  <span>{btn.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToOpDesign && (
                <button
                  onClick={onNavigateToOpDesign}
                  className="px-2.5 py-1 text-xs text-purple-300 hover:text-white bg-black hover:bg-neutral-900 rounded border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Cross-reference with Army Operational Design Framework (ADP 5-0)"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-mono text-[11px] hidden md:inline">Operational Design (ADP 5-0)</span>
                </button>
              )}

              {/* Toggle Mission Header Collapse */}
              <button
                onClick={() => setIsMissionHeaderCollapsed(!isMissionHeaderCollapsed)}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white bg-black rounded border border-slate-800 flex items-center gap-1.5 cursor-pointer"
                title="Toggle Mission Statement Editor"
              >
                <span className="font-mono text-[11px]">
                  {isMissionHeaderCollapsed ? 'Expand Mission Header' : 'Collapse Header'}
                </span>
                {isMissionHeaderCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Mission Statement Box */}
          {!isMissionHeaderCollapsed && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 bg-slate-950/60 rounded-lg p-3.5 border border-indigo-950/60">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                    Operational Mission Statement & Commander's Intent (Five-Paragraph OPORD Standard)
                  </h2>
                  <span className="text-[11px] text-slate-400 font-mono">
                    [{currentAorFramework.commandName} — {selectedAor}]
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isSaveNoticeVisible && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 animate-fade-in">
                      <CheckCircle className="w-3.5 h-3.5" /> Saved to Session
                    </span>
                  )}
                  {copyStatus && (
                    <span className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {copyStatus}
                    </span>
                  )}
                  <button
                    onClick={handleResetToPreset}
                    className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                    title="Reset to Doctrinal Default for this AOR"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Preset
                  </button>
                  <button
                    onClick={handleSaveMissionStatement}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded border border-indigo-500 flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Save className="w-3 h-3" /> Save Statement
                  </button>
                  <button
                    onClick={() => handleCopyText(`TASK: ${missionTask}\nPURPOSE: ${missionPurpose}\nINTENT: ${intentPurpose}\nEND STATE: ${desiredEndState}`, 'Mission Copied!')}
                    className="px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" /> Copy Statement
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
                {/* Task & Purpose (Column 1-7) */}
                <div className="lg:col-span-7 space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>1. Specified Operational Task (Who, What, When, Where)</span>
                      <span className="text-indigo-400 font-normal">Editable Field</span>
                    </label>
                    <textarea
                      rows={2}
                      value={missionTask}
                      onChange={(e) => setMissionTask(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded p-2 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-indigo-500 leading-relaxed outline-none"
                      placeholder="e.g., Task Force Information Advantage executes synchronized operations across..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>2. Operational Purpose (In Order To / Desired Outcome)</span>
                      <span className="text-indigo-400 font-normal">Editable Field</span>
                    </label>
                    <textarea
                      rows={2}
                      value={missionPurpose}
                      onChange={(e) => setMissionPurpose(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded p-2 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-indigo-500 leading-relaxed outline-none"
                      placeholder="e.g., In order to degrade adversary decision-making velocity and preserve freedom of maneuver..."
                    />
                  </div>

                  {/* Key Tasks Tags List */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Key Information Tasks (Annex P Paragraph 3a)
                    </label>
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      {keyTasks.map((task, idx) => (
                        <div key={idx} className="flex items-start justify-between bg-slate-900/90 border border-slate-800 rounded px-2 py-1 text-slate-300">
                          <span className="text-[11px] font-mono leading-tight">
                            <span className="text-indigo-400 font-bold mr-1">3.a.({idx + 1})</span> {task}
                          </span>
                          <button
                            onClick={() => handleRemoveKeyTask(idx)}
                            className="text-slate-500 hover:text-rose-400 text-xs ml-2 shrink-0 font-mono"
                            title="Remove Task"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5 mt-1.5">
                      <input
                        type="text"
                        value={newKeyTaskInput}
                        onChange={(e) => setNewKeyTaskInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddKeyTask()}
                        placeholder="Add key information task and press enter..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 font-mono focus:border-indigo-500 outline-none"
                      />
                      <button
                        onClick={handleAddKeyTask}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono text-[11px]"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Commander's Intent & End State (Column 8-12) */}
                <div className="lg:col-span-5 space-y-2.5 bg-slate-900/40 border border-slate-800/80 rounded-lg p-2.5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Commander's Intent — Strategic Purpose
                    </label>
                    <textarea
                      rows={2}
                      value={intentPurpose}
                      onChange={(e) => setIntentPurpose(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded p-2 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-amber-500 leading-relaxed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      Desired Cognitive Dimension End State
                    </label>
                    <textarea
                      rows={2}
                      value={desiredEndState}
                      onChange={(e) => setDesiredEndState(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded p-2 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 leading-relaxed outline-none"
                    />
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Shield className="w-3 h-3 text-indigo-400" />
                      Doctrinal Validation: ADP 3-13 Compliant
                    </span>
                    <span className="text-slate-500">Classification: UNCLASS // FOUO</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Secondary Navigation Sub-Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 border-t border-slate-800/70 overflow-x-auto">
          <button
            onClick={() => setWorkspaceTab('AOR_FRAMEWORK')}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              workspaceTab === 'AOR_FRAMEWORK'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>AOR Operations Framework ({selectedAor})</span>
          </button>

          <button
            onClick={() => setWorkspaceTab('DOCTRINE_LIBRARY')}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              workspaceTab === 'DOCTRINE_LIBRARY'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Army IO Doctrine Library (ADP 3-13 / FM 3-13)</span>
          </button>

          <button
            onClick={() => setWorkspaceTab('IOSM_MATRIX')}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              workspaceTab === 'IOSM_MATRIX'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Information Operations Sync Matrix (IOSM)</span>
          </button>

          <button
            onClick={() => setWorkspaceTab('ANNEX_P_EXPORT')}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              workspaceTab === 'ANNEX_P_EXPORT'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>OPORD Annex P Generator & Export</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTENT PANELS BASED ON WORKSPACE SUB-TAB                            */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 flex-1 w-full space-y-6">
        
        {/* ===================================================================== */}
        {/* TAB 1: AOR OPERATIONS FRAMEWORK (OSINT-GROUNDED FOR ALL 6 AORS)       */}
        {/* ===================================================================== */}
        {workspaceTab === 'AOR_FRAMEWORK' && (
          <div className="space-y-6">
            
            {/* Theater Summary Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <Globe className="w-64 h-64 text-indigo-400" />
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 rounded">
                      {currentAorFramework.aorId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      HQ: {currentAorFramework.hqLocation}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {currentAorFramework.commandName} — Operational IO Framework
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-3">
                    {currentAorFramework.osintInformationEnvironmentSummary}
                  </p>
                  <div className="text-xs font-mono text-slate-400 flex flex-wrap gap-4">
                    <span><strong>Geographic Scope:</strong> {currentAorFramework.geographicScope}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {onNavigateToAorMap && (
                    <button
                      onClick={() => onNavigateToAorMap(`aor-${selectedAor.toLowerCase().replace('us', '')}`)}
                      className="px-3.5 py-2 text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg border border-indigo-500 flex items-center gap-2 shadow-md transition-colors"
                    >
                      <Globe className="w-4 h-4" /> Open Strategic AOR Map
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyText(generateAnnexPText(), 'Annex P Copied!')}
                    className="px-3.5 py-2 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Copy Annex P Format
                  </button>
                </div>
              </div>
            </div>

            {/* Adversary IO Doctrine & Playbook */}
            <div className="bg-slate-900 border border-rose-900/60 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                    Adversary Information Operations Doctrine & Threat Vector
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {currentAorFramework.adversaryIoDoctrine.doctrineName} [{currentAorFramework.adversaryIoDoctrine.adversaryState}]
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-6 space-y-2">
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Adversary Strategy:</strong> {currentAorFramework.adversaryIoDoctrine.primaryPlaybook}
                  </p>
                  <div>
                    <h4 className="text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wide mb-1.5">
                      Core Adversary Disinformation Themes:
                    </h4>
                    <ul className="space-y-1">
                      {currentAorFramework.adversaryIoDoctrine.keyNarrativeThemes.map((theme, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-300">
                          <span className="text-rose-400 font-mono font-bold">›</span>
                          <span>{theme}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="md:col-span-6 bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                  <h4 className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-rose-400" />
                    Adversary Dissemination Ecosystem & Conduits
                  </h4>
                  <ul className="space-y-1.5">
                    {currentAorFramework.adversaryIoDoctrine.disseminationEcosystem.map((eco, idx) => (
                      <li key={idx} className="text-slate-300 text-[11px] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{eco}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* The Three Dimensions Breakdown (Physical, Informational, Cognitive) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    The Three Dimensions of the Information Environment ({selectedAor})
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">ADP 3-13 Framework</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Physical Dimension Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded bg-blue-950 border border-blue-700 flex items-center justify-center text-blue-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Physical Dimension</h4>
                      <span className="text-[10px] text-blue-400 font-mono">Tangible Nodes & Hardware</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    Human beings, C2 infrastructure, subsea fiber trunks, microwave towers, radar antennas, and data centers.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase block mb-1">
                        Critical Regional Nodes:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {currentAorFramework.dimensionsBreakdown.physical.criticalNodes.map((node, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-blue-400">•</span> <span>{node}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block mb-1">
                        Vulnerabilities:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-400">
                        {currentAorFramework.dimensionsBreakdown.physical.vulnerabilities.map((vuln, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-amber-500">⚠</span> <span>{vuln}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Informational Dimension Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Informational Dimension</h4>
                      <span className="text-[10px] text-cyan-400 font-mono">Data, Protocols & Content</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    How data is formatted, routed, encrypted, automated, and mediated through algorithmic and social platforms.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase block mb-1">
                        Prevalent Regional Platforms:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {currentAorFramework.dimensionsBreakdown.informational.prevalentPlatforms.map((plat, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 border border-slate-700 rounded text-[10px] font-mono">
                            {plat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase block mb-1">
                        Algorithmic Vectors:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {currentAorFramework.dimensionsBreakdown.informational.algorithmicVectors.map((algo, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-cyan-400">⚡</span> <span>{algo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Cognitive Dimension Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Cognitive Dimension</h4>
                      <span className="text-[10px] text-purple-400 font-mono">Perception, Heuristics & Beliefs</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    Human psychology, worldview, historical memory, tribal affiliations, fear, legitimacy, and decision calculus.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase block mb-1">
                        Core Mental Models:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {currentAorFramework.dimensionsBreakdown.cognitive.coreCulturalMentalModels.map((model, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-purple-400">✦</span> <span>{model}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-rose-400 uppercase block mb-1">
                        Exploited Grievances:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-400">
                        {currentAorFramework.dimensionsBreakdown.cognitive.exploitedGrievances.map((griev, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-rose-400">✕</span> <span>{griev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operationalization of the 5 Information Advantage Activities */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    The Five Information Advantage Activities Operationalized ({selectedAor})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mandated under ADP 3-13 Chapter 2 to synchronize all non-kinetic and kinetic effects.
                  </p>
                </div>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-1 rounded border border-indigo-800">
                  5 Doctrinal Pillars
                </span>
              </div>

              <div className="space-y-3">
                {currentAorFramework.informationAdvantageActivitiesOperationalized.map((act, index) => (
                  <div 
                    key={act.activityId} 
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-indigo-900/50 border border-indigo-700 flex items-center justify-center text-indigo-300 font-mono font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-white text-xs">{act.activityName}</h4>
                          <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {act.leadComponent}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {act.theaterSpecificTask}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                        act.status === 'ACTIVE' 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Payoff Information Targets (HPIT) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    High-Payoff Information Targets (HPIT) — {selectedAor}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">FM 3-13 Targeting Cycle</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAorFramework.highPayoffTargets.map((target) => (
                  <div key={target.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 rounded">
                          {target.id}
                        </span>
                        <span className="font-bold text-white text-xs">{target.targetCategory}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                        target.riskAssessment === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                        target.riskAssessment === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        'bg-blue-950 text-blue-300 border-blue-800'
                      }`}>
                        Risk: {target.riskAssessment}
                      </span>
                    </div>

                    <div className="text-slate-300">
                      <strong className="text-slate-200">Target Actor:</strong> {target.actorGroup}
                    </div>

                    <p className="text-slate-300 text-xs">
                      <strong className="text-slate-200">Objective:</strong> {target.targetObjective}
                    </p>

                    <div className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Delivery Means:</strong> {target.deliveryMeans.join(', ')}
                    </div>

                    <div className="p-2 bg-slate-900 border border-slate-800 rounded text-emerald-300 text-[11px]">
                      <strong>Desired Behavioral Shift:</strong> {target.desiredBehavioralShift}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phased Synchronization & Measures of Performance / Effectiveness */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Operational Phases & Assessment (MOP vs MOE)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">JP 5-0 / FM 3-13</span>
              </div>

              <div className="space-y-4">
                {currentAorFramework.synchronizationPhases.map((phase, pidx) => (
                  <div key={pidx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-sm">{phase.phase}</h4>
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-800">
                        {phase.timeframe}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
                          Key Information Lines of Effort:
                        </span>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {phase.keyIoEfforts.map((eff, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-indigo-400">▸</span> {eff}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block mb-1">
                          Decisive Information Point:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {phase.decisiveInformationPoints}
                        </p>
                      </div>

                      <div className="space-y-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase block mb-0.5">
                            Measures of Performance (MOP):
                          </span>
                          <ul className="space-y-0.5 text-[11px] text-slate-300">
                            {phase.mops.map((mop, i) => (
                              <li key={i}>• {mop}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-1.5 border-t border-slate-800">
                          <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase block mb-0.5">
                            Measures of Effectiveness (MOE):
                          </span>
                          <ul className="space-y-0.5 text-[11px] text-emerald-200">
                            {phase.moes.map((moe, i) => (
                              <li key={i}>✓ {moe}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: ARMY IO DOCTRINE LIBRARY (ADP 3-13, FM 3-13, JP 3-04, ETC)     */}
        {/* ===================================================================== */}
        {workspaceTab === 'DOCTRINE_LIBRARY' && (
          <div className="space-y-6">
            
            {/* Doctrinal Overview Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-700 flex items-center justify-center text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    U.S. Army Information Operations & Information Advantage Repository
                  </h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive doctrinal publications, core definitions, statutory boundaries, and targeting methodologies.
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-3 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={doctrineSearchQuery}
                  onChange={(e) => setDoctrineSearchQuery(e.target.value)}
                  placeholder="Search doctrine by publication code, title, keyword (e.g. 'ADP 3-13', 'MISO', 'CEMA', 'Target Audience Analysis')..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Publication List & Deep-Dive Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Publication Selectors */}
              <div className="lg:col-span-4 space-y-2.5">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Doctrinal Publications ({ARMY_IO_DOCTRINE_PUBLICATIONS.length})
                </h3>
                {ARMY_IO_DOCTRINE_PUBLICATIONS
                  .filter(pub => 
                    pub.code.toLowerCase().includes(doctrineSearchQuery.toLowerCase()) ||
                    pub.title.toLowerCase().includes(doctrineSearchQuery.toLowerCase()) ||
                    pub.summary.toLowerCase().includes(doctrineSearchQuery.toLowerCase())
                  )
                  .map(pub => (
                    <button
                      key={pub.id}
                      onClick={() => setSelectedDoctrinePubId(pub.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                        selectedDoctrinePubId === pub.id
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-indigo-400">{pub.code}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{pub.publicationDate}</span>
                      </div>
                      <div className="font-bold text-white text-xs mb-1 line-clamp-1">{pub.title}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{pub.summary}</p>
                    </button>
                  ))}
              </div>

              {/* Right Column: Selected Publication Details */}
              <div className="lg:col-span-8">
                {(() => {
                  const currentPub = ARMY_IO_DOCTRINE_PUBLICATIONS.find(p => p.id === selectedDoctrinePubId) || ARMY_IO_DOCTRINE_PUBLICATIONS[0];
                  return (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-indigo-600 text-white rounded">
                              {currentPub.code}
                            </span>
                            <span className="text-xs font-mono text-slate-400">{currentPub.authority}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white">{currentPub.title}</h3>
                          <span className="text-[10px] font-mono text-emerald-400">{currentPub.classification}</span>
                        </div>

                        <button
                          onClick={() => handleCopyText(`${currentPub.code}: ${currentPub.title}\n${currentPub.summary}\n\nKey Principles:\n${currentPub.corePrinciples.join('\n')}`, 'Publication Summary Copied!')}
                          className="px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 rounded border border-slate-700 flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy Reference
                        </button>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider mb-1.5">
                          Doctrinal Scope & Summary
                        </h4>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          {currentPub.summary}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-2">
                          Core Doctrinal Principles
                        </h4>
                        <ul className="space-y-1.5">
                          {currentPub.corePrinciples.map((principle, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                              <span className="text-amber-400 font-bold">✓</span>
                              <span>{principle}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-950 border-l-2 border-indigo-500 p-3 rounded-r-lg space-y-2">
                        <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          Key Doctrinal Excerpts
                        </h4>
                        {currentPub.keyDoctrinalQuotes.map((quote, qidx) => (
                          <p key={qidx} className="text-xs text-indigo-200 italic font-serif">
                            {quote}
                          </p>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800">
                        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Operational Application to Multi-Domain Operations (MDO)
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentPub.operationalApplication}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Informing vs Influencing Statutory & Policy Boundary (Crucial Military Distinction) */}
            <div className="bg-slate-900 border border-cyan-900/60 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Statutory & Doctrinal Boundary: Informing vs. Influencing (DoD Directive 5122.05 & Title 10 USC)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                U.S. military doctrine enforces a rigorous legal and ethical demarcation between Public Affairs (PA) and Military Information Support Operations (MISO/PSYOP). Violations compromise domestic trust and violate statutory prohibitions against propagandizing American citizens.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3 bg-cyan-950/40 border border-cyan-800 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-cyan-300 text-xs uppercase font-mono">
                    Public Affairs (FM 3-61) — "Inform"
                  </h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Operates on total truth and factual transparency. Directly addresses domestic, international, and internal military audiences. PA personnel never engage in deception, covert dissemination, or psychological influence operations.
                  </p>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">
                    Governed by: DoD Directive 5122.05, Smith-Mundt Modernization Act
                  </div>
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-amber-300 text-xs uppercase font-mono">
                    MISO / PSYOP (FM 3-53) — "Influence"
                  </h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Designed to influence foreign adversary, neutral, and friendly target audience behavior and motives. Must remain truthful to preserve long-term strategic credibility, but utilizes targeted psychological themes. Strictly prohibited from targeting U.S. citizens.
                  </p>
                  <div className="text-[10px] font-mono text-amber-400 font-bold">
                    Governed by: Title 10 USC § 167, CJCS MISO Execute Orders
                  </div>
                </div>
              </div>
            </div>

            {/* The 5 Information Advantage Activities Detail Explorer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Detailed Taxonomy of the 5 Information Advantage Activities
                  </h3>
                  <p className="text-xs text-slate-400">Click an activity to inspect capabilities, tactical examples, and doctrinal metrics.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {INFORMATION_ADVANTAGE_ACTIVITIES.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setSelectedActivityDetailId(act.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedActivityDetailId === act.id
                        ? `${act.colorTheme.bg} ${act.colorTheme.border} ${act.colorTheme.text} font-bold shadow-md`
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase mb-0.5">Pillar {act.activityNumber}</div>
                    <div className="text-xs font-bold truncate">{act.name}</div>
                  </button>
                ))}
              </div>

              {(() => {
                const act = INFORMATION_ADVANTAGE_ACTIVITIES.find(a => a.id === selectedActivityDetailId) || INFORMATION_ADVANTAGE_ACTIVITIES[0];
                return (
                  <div className={`p-4 rounded-xl border ${act.colorTheme.border} ${act.colorTheme.bg} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        Activity {act.activityNumber}: {act.name}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded border ${act.colorTheme.badge}`}>
                        ADP 3-13 Core Pillar
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {act.definition}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-300 uppercase block mb-1">
                          Doctrinal Capabilities:
                        </span>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {act.associatedArmyCapabilities.map((cap, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-indigo-400">•</span> {cap}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-300 uppercase block mb-1">
                          Tactical Employment Examples:
                        </span>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {act.tacticalExamples.map((ex, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-amber-400">›</span> {ex}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-300 uppercase block mb-1">
                          Success Indicators:
                        </span>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {act.successIndicators.map((ind, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-emerald-400">✓</span> {ind}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: INFORMATION OPERATIONS SYNCHRONIZATION MATRIX (IOSM)           */}
        {/* ===================================================================== */}
        {workspaceTab === 'IOSM_MATRIX' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      Information Operations Synchronization Matrix (IOSM) — {selectedAor}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Cross-synchronization of military information capabilities across operational phases and lines of effort.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyText(generateAnnexPText(), 'IOSM Matrix Copied!')}
                  className="px-3 py-1.5 text-xs font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Export Matrix Data
                </button>
              </div>
            </div>

            {/* Doctrinal IOSM Grid Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                      <th className="p-3 font-bold border-r border-slate-800 w-48">Line of Effort / Capability</th>
                      <th className="p-3 font-bold border-r border-slate-800 min-w-[220px]">Phase 0: Shape / Compete</th>
                      <th className="p-3 font-bold border-r border-slate-800 min-w-[220px]">Phase 1: Deter / Crisis</th>
                      <th className="p-3 font-bold border-r border-slate-800 min-w-[220px]">Phase 2: Seize Initiative</th>
                      <th className="p-3 font-bold min-w-[220px]">Phase 3: Dominate / Decisive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {/* Row 1: MISO / Psychological Operations */}
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white bg-slate-950/50 border-r border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                          <span>MISO / PSYOP (FM 3-53)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Influence Foreign Behavior</span>
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Target Audience Analysis (TAA) baseline polling; establish localized FM radio partnerships; distribute cultural inoculation themes.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Broadcast defection incentives to adversary front-line conscripts; highlight civilian safe zones; counter defeatist propaganda.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Mass distribution of surrender and safe conduct instructions via aerial leaflets, cellular SMS, and tactical loudspeakers.
                      </td>
                      <td className="p-3 leading-relaxed text-[11px]">
                        Promote local civil compliance with curfew; expose adversary leadership flight; mobilize post-conflict stabilization consensus.
                      </td>
                    </tr>

                    {/* Row 2: Cyberspace Operations */}
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white bg-slate-950/50 border-r border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Cyberspace Ops (FM 3-12)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">OCO, DCO-IDM & DODIN</span>
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        DCO hunts across friendly theater command servers; map adversary critical infrastructure botnets; pre-position non-destructive access.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Isolate compromised logistics servers; execute targeted denial of adversary state propaganda servers and command messaging bots.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Execute Offensive Cyberspace Operations (OCO) to sever adversary automated target recognition and radar sensor pipelines.
                      </td>
                      <td className="p-3 leading-relaxed text-[11px]">
                        Restore civilian municipal power grid telemetry; defend critical port infrastructure against residual wiper malware.
                      </td>
                    </tr>

                    {/* Row 3: Electronic Warfare / CEMA */}
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white bg-slate-950/50 border-r border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-rose-400" />
                          <span>Electronic Warfare (EA/EP)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Spectrum Dominance</span>
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Electromagnetic reconnaissance (ES); baseline adversary emitter signatures; enforce emissions control (EMCON) at forward posts.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Deploy electronic decoys mimicking high-value command posts; shield coalition SATCOM ground uplinks against broadband jamming.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Stand-in high-power RF jamming of adversary drone data-links and tactical radio repeaters; jam anti-ship missile target acquisition.
                      </td>
                      <td className="p-3 leading-relaxed text-[11px]">
                        Transition spectrum to civilian aviation and emergency radio frequencies; continue counter-improvised explosive device jamming.
                      </td>
                    </tr>

                    {/* Row 4: Public Affairs Operations */}
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white bg-slate-950/50 border-r border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>Public Affairs (FM 3-61)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Inform Publics with Truth</span>
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Embed international journalists on training maneuvers; release declassified photos of adversary gray-zone maritime coercion.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Host daily live televised briefings; debunk adversary false-flag civilian casualties within 60 minutes with declassified gun-camera video.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Provide unclassified combat camera feeds to international press; publish accurate Law of Armed Conflict compliance reports.
                      </td>
                      <td className="p-3 leading-relaxed text-[11px]">
                        Document humanitarian assistance and medical treatment of displaced civilians; preserve transparent historical record.
                      </td>
                    </tr>

                    {/* Row 5: Civil Affairs & Key Leader Engagements */}
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white bg-slate-950/50 border-r border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Civil Affairs & KLE (FM 3-57)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Civil Ground Truth & Trust</span>
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Civil reconnaissance of potable water and hospital networks; establish trusted relationships with municipal mayors and clerics.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Synchronize humanitarian evacuation corridors with municipal police; defuse localized rumors through direct face-to-face council meetings.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Operate Civil-Military Operations Centers (CMOC); coordinate non-governmental organization (NGO) aid distribution to prevent civilian displacement.
                      </td>
                      <td className="p-3 leading-relaxed text-[11px]">
                        Transition critical infrastructure management back to sovereign civilian authorities; execute rapid economic revitalization grants.
                      </td>
                    </tr>

                    {/* Row 6: Military Deception (MILDEC) */}
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white bg-slate-950/50 border-r border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-purple-400" />
                          <span>Military Deception (MILDEC)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Mislead Adversary Decisions</span>
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Routine logistical patterns masking true assembly areas; maintain plausible administrative cover for special operations reconnaissance.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Emit deceptive radio traffic and false satellite uplinks suggesting a main effort invasion along an alternative littoral axis.
                      </td>
                      <td className="p-3 border-r border-slate-800 leading-relaxed text-[11px]">
                        Cause adversary operational reserves to commit in the wrong direction, opening uncontested penetration corridor for allied maneuver forces.
                      </td>
                      <td className="p-3 leading-relaxed text-[11px]">
                        Deceive adversary remnants regarding coalition pursuit vectors to accelerate unconditional surrender negotiations.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: OPORD ANNEX P GENERATOR & EXPORT                               */}
        {/* ===================================================================== */}
        {workspaceTab === 'ANNEX_P_EXPORT' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Annex P (Information Advantage / IO) Formal OPORD Document
                </h2>
                <p className="text-xs text-slate-400">
                  Formatted in strict compliance with FM 6-0 (Commander and Staff Organization and Operations) and ADP 3-13.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(generateAnnexPText(), 'Annex P Copied to Clipboard!')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Copy className="w-4 h-4" /> Copy Full Text
                </button>
              </div>
            </div>

            {/* Document Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-inner font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
              {generateAnnexPText()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
