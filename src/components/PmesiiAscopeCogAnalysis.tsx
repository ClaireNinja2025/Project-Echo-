import React, { useState } from 'react';
import { 
  Grid, 
  Target, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  FileText, 
  Download, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  SlidersHorizontal,
  Zap,
  Droplet,
  Hospital,
  Radio,
  Building,
  Users,
  Calendar,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  CrosswalkCell, 
  CenterOfGravitySystem, 
  PMESIICategory, 
  ASCOPECategory, 
  CivilEntity 
} from '../types';
import { 
  PMESII_CATEGORIES, 
  ASCOPE_CATEGORIES, 
  PMESII_ASCOPE_MATRIX, 
  COG_SYSTEMS 
} from '../data/crosswalkCogData';

interface PmesiiAscopeCogAnalysisProps {
  entities: CivilEntity[];
  onSelectEntityOnCop?: (entity: CivilEntity) => void;
}

export const PmesiiAscopeCogAnalysis: React.FC<PmesiiAscopeCogAnalysisProps> = ({
  entities,
  onSelectEntityOnCop,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'matrix' | 'cog' | 'crossmap'>('matrix');

  // Crosswalk Matrix Filter State
  const [selectedPmesii, setSelectedPmesii] = useState<string>('ALL');
  const [selectedAscope, setSelectedAscope] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCellId, setSelectedCellId] = useState<string>('inf-structures');

  // Center of Gravity State
  const [cogSystems, setCogSystems] = useState<CenterOfGravitySystem[]>(COG_SYSTEMS);
  const [selectedCogId, setSelectedCogId] = useState<string>(COG_SYSTEMS[0].id);
  const [isGeneratingAiCog, setIsGeneratingAiCog] = useState<boolean>(false);
  const [customCogObjective, setCustomCogObjective] = useState<string>('');

  const selectedCell =
    PMESII_ASCOPE_MATRIX.find((c) => c.id === selectedCellId) || PMESII_ASCOPE_MATRIX[0];
  const selectedCog =
    cogSystems.find((c) => c.id === selectedCogId) || cogSystems[0];

  // Helper to retrieve a cell from matrix
  const getCell = (p: PMESIICategory, a: ASCOPECategory): CrosswalkCell | undefined => {
    return PMESII_ASCOPE_MATRIX.find((c) => c.pmesii === p && c.ascope === a);
  };

  // Run AI Center of Gravity Analysis
  const handleRunAiCogAnalysis = async () => {
    setIsGeneratingAiCog(true);
    try {
      const res = await fetch('/api/ai/cog-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemName: selectedCog.name,
          systemType: selectedCog.systemType,
          operationalObjective: customCogObjective || selectedCog.strategicObjective,
          currentCivilContext: 'Urban operations in Area of Operations Griffin with degraded electrical grid, stressed water treatment, and active displaced population movement.',
        }),
      });

      const data = await res.json();
      if (data && data.criticalCapabilities) {
        const updatedSystems = cogSystems.map((s) => {
          if (s.id === selectedCog.id) {
            return {
              ...s,
              centerOfGravity: data.centerOfGravity || s.centerOfGravity,
              strategicObjective: data.strategicObjective || s.strategicObjective,
              criticalCapabilities: data.criticalCapabilities || s.criticalCapabilities,
              decisivePoints: data.decisivePoints || s.decisivePoints,
              doctrinalNotes: data.doctrinalNotes || s.doctrinalNotes,
            };
          }
          return s;
        });
        setCogSystems(updatedSystems);
      }
    } catch (err: any) {
      console.warn('COG evaluation fallback triggered:', err);
    } finally {
      setIsGeneratingAiCog(false);
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Controls Strip */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              PMESII-PT × ASCOPE Crosswalk & Center of Gravity (COG) Model
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                JP 5-0 / Strange Model
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Integrate civil considerations into Center of Gravity critical factors (CC-CR-CV) and operational planning.
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveViewMode('matrix')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeViewMode === 'matrix'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Crosswalk Matrix (6×6)</span>
          </button>
          <button
            onClick={() => setActiveViewMode('cog')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeViewMode === 'cog'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Center of Gravity (COG)</span>
          </button>
          <button
            onClick={() => setActiveViewMode('crossmap')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeViewMode === 'crossmap'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vulnerabilities & Decisive Points</span>
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* VIEW 1: 6x6 PMESII x ASCOPE Crosswalk Matrix */}
        {activeViewMode === 'matrix' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Matrix Grid View */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800">
              {/* Filter Sub-bar */}
              <div className="p-2.5 bg-slate-900/70 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-mono text-[11px]">PMESII:</span>
                  <select
                    value={selectedPmesii}
                    onChange={(e) => setSelectedPmesii(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="ALL">All Dimensions</option>
                    {PMESII_CATEGORIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>

                  <span className="text-slate-400 font-mono text-[11px] ml-2">ASCOPE:</span>
                  <select
                    value={selectedAscope}
                    onChange={(e) => setSelectedAscope(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="ALL">All Considerations</option>
                    {ASCOPE_CATEGORIES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search crosswalk considerations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56"
                    />
                  </div>
                </div>
              </div>

              {/* Scrollable Matrix Table */}
              <div className="flex-1 overflow-auto p-3">
                <table className="w-full border-collapse text-left text-xs select-none">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 bg-slate-900/60 sticky top-0 z-10">
                      <th className="p-2.5 w-28 bg-slate-900">PMESII \ ASCOPE</th>
                      {ASCOPE_CATEGORIES.map((ascope) => (
                        <th
                          key={ascope}
                          className={`p-2.5 text-center transition-colors ${
                            selectedAscope === ascope || selectedAscope === 'ALL'
                              ? 'text-emerald-400 font-bold'
                              : 'text-slate-600'
                          }`}
                        >
                          {ascope.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {PMESII_CATEGORIES.map((pmesii) => {
                      if (selectedPmesii !== 'ALL' && selectedPmesii !== pmesii) return null;
                      return (
                        <tr key={pmesii} className="hover:bg-slate-900/40">
                          {/* Row Header */}
                          <td className="p-2.5 font-mono font-bold text-slate-300 bg-slate-900/40 border-r border-slate-800 whitespace-nowrap">
                            <span className="text-cyan-400">{pmesii}</span>
                          </td>

                          {/* Matrix Cells */}
                          {ASCOPE_CATEGORIES.map((ascope) => {
                            if (selectedAscope !== 'ALL' && selectedAscope !== ascope) return null;
                            const cell = getCell(pmesii, ascope);
                            if (!cell) return <td key={ascope} className="p-2 border border-slate-900"></td>;

                            const isSelected = selectedCellId === cell.id;
                            const isSearchMatch =
                              !searchQuery ||
                              cell.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              cell.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              cell.civilConsiderations.some((c) =>
                                c.toLowerCase().includes(searchQuery.toLowerCase())
                              );

                            let critColor = 'border-slate-800 bg-slate-950/60 text-slate-400';
                            if (cell.criticality === 'CRITICAL') {
                              critColor = 'border-rose-900/60 bg-rose-950/20 text-rose-300 hover:border-rose-600';
                            } else if (cell.criticality === 'HIGH') {
                              critColor = 'border-amber-900/60 bg-amber-950/20 text-amber-300 hover:border-amber-600';
                            } else {
                              critColor = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                            }

                            return (
                              <td
                                key={ascope}
                                onClick={() => setSelectedCellId(cell.id)}
                                className={`p-2 border border-slate-800/60 align-top cursor-pointer transition-all ${
                                  isSelected
                                    ? 'ring-2 ring-emerald-500 bg-slate-900 shadow-md'
                                    : !isSearchMatch
                                    ? 'opacity-30'
                                    : 'hover:bg-slate-900/80'
                                }`}
                              >
                                <div className={`p-2 rounded-lg border flex flex-col justify-between h-28 space-y-1.5 ${critColor}`}>
                                  <div>
                                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                                      <span className="font-bold text-slate-200 line-clamp-1">{cell.title}</span>
                                      <span
                                        className={`px-1 rounded text-[9px] font-mono ${
                                          cell.collectionPriority === 'PIR'
                                            ? 'bg-rose-900 text-rose-200'
                                            : cell.collectionPriority === 'CCIR'
                                            ? 'bg-amber-900 text-amber-200'
                                            : 'bg-slate-800 text-slate-400'
                                        }`}
                                      >
                                        {cell.collectionPriority}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug">
                                      {cell.summary}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[9px] font-mono text-slate-500">
                                    <span>{cell.civilConsiderations.length} factors</span>
                                    <span className="text-emerald-400">{cell.criticality}</span>
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Selected Cell Detail Inspector */}
            <div className="w-full lg:w-96 bg-slate-900 flex flex-col p-4 space-y-4 overflow-y-auto border-t lg:border-t-0">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {selectedCell.pmesii.toUpperCase()} × {selectedCell.ascope.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
                      selectedCell.criticality === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : selectedCell.criticality === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    CRITICALITY: {selectedCell.criticality}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedCell.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedCell.summary}</p>
              </div>

              {/* Civil Considerations List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wide block">
                  Doctrinal Civil Considerations:
                </span>
                <ul className="space-y-2 text-xs">
                  {selectedCell.civilConsiderations.map((item, idx) => (
                    <li key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Civil Vulnerabilities */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Identified Civil Vulnerabilities:
                </span>
                <div className="p-3 bg-amber-950/20 border border-amber-800/60 rounded-lg text-xs text-amber-200 leading-relaxed">
                  {selectedCell.keyVulnerabilities.map((v, i) => (
                    <p key={i}>{v}</p>
                  ))}
                </div>
              </div>

              {/* Collection Priority & Routing */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">COLLECTION PRIORITY:</span>
                  <span className="font-bold text-cyan-400">{selectedCell.collectionPriority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">STAFF ROUTING:</span>
                  <span className="text-slate-300">S-9 (Civil) / J-2 / J-39</span>
                </div>
              </div>

              {/* Copy / Export */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `PMESII-ASCOPE CROSSWALK ENTRY\n${selectedCell.title} (${selectedCell.pmesii} x ${selectedCell.ascope})\nCriticality: ${selectedCell.criticality}\nSummary: ${selectedCell.summary}\nConsiderations:\n- ${selectedCell.civilConsiderations.join('\n- ')}\nVulnerability: ${selectedCell.keyVulnerabilities.join('; ')}`
                  );
                  alert(`Crosswalk entry copied to clipboard.`);
                }}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Crosswalk Entry</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: Center of Gravity (COG) Strange Model */}
        {activeViewMode === 'cog' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* System Selection Tabs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Select Center of Gravity System (Dr. Joe Strange Model, JP 5-0):
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  METHODOLOGY: COG → CC → CR → CV → DECISIVE POINTS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cogSystems.map((sys) => {
                  const isSelected = selectedCogId === sys.id;
                  return (
                    <button
                      key={sys.id}
                      onClick={() => setSelectedCogId(sys.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                          {sys.systemType}
                        </span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                      </div>
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {sys.name}
                      </h4>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Center of Gravity Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                      CENTER OF GRAVITY (COG)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                      {selectedCog.systemType}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedCog.centerOfGravity}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    <strong className="text-slate-300">Strategic Objective: </strong>
                    {selectedCog.strategicObjective}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleRunAiCogAnalysis}
                    disabled={isGeneratingAiCog}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
                  >
                    {isGeneratingAiCog ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>AI COG & Critical Factors Evaluator</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Critical Capabilities, Requirements, Vulnerabilities Hierarchy */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <span>Critical Factors Breakdown (Strange Model)</span>
                </h4>

                <div className="space-y-4">
                  {selectedCog.criticalCapabilities.map((cc, ccIdx) => (
                    <div
                      key={cc.id || ccIdx}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
                    >
                      {/* Critical Capability */}
                      <div className="flex items-start gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                          CRITICAL CAPABILITY {ccIdx + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-100">{cc.description}</p>
                      </div>

                      {/* Critical Requirements & Vulnerabilities */}
                      <div className="pl-4 border-l-2 border-slate-800 space-y-3 ml-2">
                        {cc.requirements.map((cr, crIdx) => (
                          <div key={cr.id || crIdx} className="space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono text-[10px] shrink-0">
                                CR {ccIdx + 1}.{crIdx + 1}
                              </span>
                              <p className="text-xs text-slate-300 leading-snug">{cr.description}</p>
                            </div>

                            {/* Critical Vulnerabilities (CV) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 pl-2">
                              {cr.vulnerabilities.map((cv, cvIdx) => (
                                <div
                                  key={cv.id || cvIdx}
                                  className={`p-3 rounded-lg border space-y-2 text-xs ${
                                    cv.severity === 'CRITICAL'
                                      ? 'bg-rose-950/30 border-rose-800/80'
                                      : 'bg-amber-950/20 border-amber-800/60'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="font-bold text-rose-400 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                                      CRITICAL VULNERABILITY (CV)
                                    </span>
                                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                                      {cv.ascopePmesiiTag}
                                    </span>
                                  </div>
                                  <p className="text-slate-200 font-medium leading-relaxed">
                                    {cv.description}
                                  </p>
                                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                                    <span className="font-mono text-emerald-400 font-bold block mb-0.5">
                                      CA MITIGATION / ACTION:
                                    </span>
                                    <span className="text-slate-300">{cv.mitigationOrAction}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decisive Points & Lines of Effort (LOE) */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Decisive Points & Civil Affairs Lines of Effort</span>
                  </h4>
                  <span className="text-xs font-mono text-slate-500">JP 5-0 Section IV</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {selectedCog.decisivePoints.map((dp, idx) => (
                    <div
                      key={dp.id || idx}
                      className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-emerald-400">DECISIVE POINT 0{idx + 1}</span>
                        <span className="text-slate-400">{dp.lineOfEffort}</span>
                      </div>
                      <h5 className="font-bold text-slate-100">{dp.name}</h5>
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <span className="font-mono text-cyan-400 font-semibold block mb-0.5">
                          CIVIL AFFAIRS INTEGRATION:
                        </span>
                        <span className="text-slate-300">{dp.caRole}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctrinal Footnote */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{selectedCog.doctrinalNotes}</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Vulnerabilities & Decisive Points Crossmap */}
        {activeViewMode === 'crossmap' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Civil Component Critical Vulnerability Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Consolidated operational vulnerabilities mapped across the operational environment, linking ASCOPE/PMESII entities directly to Center of Gravity preservation.
              </p>
            </div>

            {/* Vulnerabilities Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-800 font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">COG SYSTEM</th>
                      <th className="py-3 px-4">CRITICAL VULNERABILITY</th>
                      <th className="py-3 px-4">ASCOPE / PMESII</th>
                      <th className="py-3 px-4">SEVERITY</th>
                      <th className="py-3 px-4">CIVIL MITIGATION / DECISIVE ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px] text-slate-300">
                    {cogSystems.flatMap((sys) =>
                      sys.criticalCapabilities.flatMap((cc) =>
                        cc.requirements.flatMap((cr) =>
                          cr.vulnerabilities.map((cv, idx) => (
                            <tr key={`${sys.id}-${idx}`} className="hover:bg-slate-800/40">
                              <td className="py-3 px-4 whitespace-nowrap text-cyan-400 font-bold">
                                {sys.name.split(':')[0]}
                              </td>
                              <td className="py-3 px-4 text-slate-200 font-sans font-medium max-w-xs">
                                {cv.description}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                                {cv.ascopePmesiiTag}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    cv.severity === 'CRITICAL'
                                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  {cv.severity}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-300 font-sans text-xs max-w-sm">
                                {cv.mitigationOrAction}
                              </td>
                            </tr>
                          ))
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
