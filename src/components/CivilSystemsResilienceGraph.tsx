import React, { useState } from 'react';
import { 
  Activity, 
  Zap, 
  Droplet, 
  Hospital, 
  Radio, 
  Truck, 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  Loader2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { DisruptionNode, InfrastructureType, OperationalStatus } from '../types';

interface CivilSystemsResilienceGraphProps {
  nodes: DisruptionNode[];
  onToggleNodeStatus: (nodeId: string) => void;
}

export const CivilSystemsResilienceGraph: React.FC<CivilSystemsResilienceGraphProps> = ({
  nodes,
  onToggleNodeStatus,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('pwr-sub-alpha');
  const [isSimulatingCascade, setIsSimulatingCascade] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Calculate live cascade effects:
  // If a node's dependency is degraded or critical, compute downstream degradation
  const getNodeEffectiveStatus = (node: DisruptionNode): OperationalStatus => {
    if (node.status === 'Critical' || node.status === 'Degraded') return node.status;
    for (const depId of node.dependsOn) {
      const dep = nodes.find((n) => n.id === depId);
      if (dep && (dep.status === 'Critical' || dep.status === 'Degraded')) {
        return 'Degraded';
      }
    }
    return node.status;
  };

  // Quantitative resilience metrics
  const totalPopulation = nodes.reduce((acc, n) => acc + n.populationServed, 0);
  const affectedPopulation = nodes.reduce((acc, n) => {
    const eff = getNodeEffectiveStatus(n);
    if (eff === 'Degraded') return acc + n.populationServed * 0.45;
    if (eff === 'Critical') return acc + n.populationServed * 0.9;
    return acc;
  }, 0);

  const systemAvailabilityPct = Math.round(100 - (affectedPopulation / totalPopulation) * 100);

  // Call server AI consequence analysis
  const handleRunAiConsequenceAnalysis = async () => {
    setIsSimulatingCascade(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/consequence-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disruptionTarget: selectedNode.label,
          eventType: 'Civilian Infrastructure Degradation / Power-Water Cascade',
          durationHours: 48,
        }),
      });

      const data = await res.json();
      setAiAnalysisResult(data);
    } catch (err: any) {
      console.error('Consequence analysis error:', err);
    } finally {
      setIsSimulatingCascade(false);
    }
  };

  const getNodeIcon = (type: InfrastructureType) => {
    switch (type) {
      case 'Power': return Zap;
      case 'Water': return Droplet;
      case 'Healthcare': return Hospital;
      case 'Communications': return Radio;
      case 'Transportation': return Truck;
      case 'Governance': return Building2;
      case 'Emergency Services': return ShieldAlert;
      default: return Activity;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full flex-1 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Center/Left: Interactive Node-Link Dependency Graph Canvas */}
      <div className="flex-1 flex flex-col border-r border-slate-800">
        {/* Top Control Strip */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Civil Infrastructure Resilience & Dependency Graph
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Model cross-sector cascade propagation across essential civilian services.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">SYSTEM AVAILABILITY:</span>
              <span
                className={`font-mono font-bold text-xs ${
                  systemAvailabilityPct > 80
                    ? 'text-emerald-400'
                    : systemAvailabilityPct > 55
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {systemAvailabilityPct}%
              </span>
            </div>

            <button
              onClick={() => {
                // Reset all nodes to operational
                nodes.forEach((n) => {
                  if (n.status !== 'Operational') onToggleNodeStatus(n.id);
                });
                setAiAnalysisResult(null);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset Grid</span>
            </button>
          </div>
        </div>

        {/* SVG Dependency Graph Canvas */}
        <div className="flex-1 relative bg-slate-950 p-4 flex items-center justify-center overflow-auto">
          <svg
            viewBox="0 0 900 500"
            className="w-full h-full max-h-[600px] select-none rounded border border-slate-800/80 bg-gradient-to-b from-slate-950 to-[#0c121e]"
          >
            <defs>
              <marker
                id="depArrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
              </marker>
              <marker
                id="alertArrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Grid Lines */}
            <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3">
              <line x1="300" y1="0" x2="300" y2="500" />
              <line x1="550" y1="0" x2="550" y2="500" />
            </g>
            <text x="310" y="25" fill="#334155" fontSize="10" fontFamily="monospace">
              TIER 1 (GENERATION/PRIMARY)
            </text>
            <text x="560" y="25" fill="#334155" fontSize="10" fontFamily="monospace">
              TIER 2 (DISTRIBUTION)
            </text>
            <text x="760" y="25" fill="#334155" fontSize="10" fontFamily="monospace">
              TIER 3 (PUBLIC ENDPOINTS)
            </text>

            {/* Dependency Connectors */}
            {nodes.map((node) =>
              node.dependsOn.map((depId) => {
                const depNode = nodes.find((n) => n.id === depId);
                if (!depNode) return null;

                const isAlert =
                  node.status === 'Degraded' ||
                  node.status === 'Critical' ||
                  depNode.status === 'Degraded' ||
                  depNode.status === 'Critical';

                return (
                  <g key={`${depId}->${node.id}`}>
                    <line
                      x1={depNode.x}
                      y1={depNode.y}
                      x2={node.x}
                      y2={node.y}
                      stroke={isAlert ? '#f59e0b' : '#334155'}
                      strokeWidth={isAlert ? 2.5 : 1.5}
                      strokeDasharray={isAlert ? '6,3' : 'none'}
                      markerEnd={isAlert ? 'url(#alertArrow)' : 'url(#depArrow)'}
                    />
                    {isAlert && (
                      <circle r="4" fill="#f59e0b">
                        <animateMotion
                          path={`M ${depNode.x} ${depNode.y} L ${node.x} ${node.y}`}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })
            )}

            {/* Nodes */}
            {nodes.map((node) => {
              const effectiveStatus = getNodeEffectiveStatus(node);
              const isSelected = selectedNodeId === node.id;
              const Icon = getNodeIcon(node.type);

              let fillColor = '#0f172a';
              let strokeColor = '#334155';
              if (effectiveStatus === 'Operational') {
                strokeColor = '#10b981';
              } else if (effectiveStatus === 'Degraded') {
                strokeColor = '#f59e0b';
                fillColor = '#271708';
              } else if (effectiveStatus === 'Critical') {
                strokeColor = '#f43f5e';
                fillColor = '#300a14';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer transition-transform duration-150 hover:scale-105"
                >
                  {/* Selection glow */}
                  {isSelected && (
                    <rect
                      x="-85"
                      y="-35"
                      width="170"
                      height="70"
                      rx="10"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                  )}

                  {/* Main Node Card */}
                  <rect
                    x="-75"
                    y="-28"
                    width="150"
                    height="56"
                    rx="8"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="shadow-lg"
                  />

                  {/* Status Indicator Pip */}
                  <circle
                    cx="-58"
                    cy="0"
                    r="12"
                    fill={
                      effectiveStatus === 'Operational'
                        ? '#064e3b'
                        : effectiveStatus === 'Degraded'
                        ? '#78350f'
                        : '#881337'
                    }
                    stroke={strokeColor}
                    strokeWidth="1.5"
                  />
                  <text
                    x="-58"
                    y="4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.type.charAt(0)}
                  </text>

                  {/* Node Label & Capacity */}
                  <text
                    x="-38"
                    y="-6"
                    fill="#f1f5f9"
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    {node.label.length > 14 ? node.label.substring(0, 13) + '…' : node.label}
                  </text>
                  <text
                    x="-38"
                    y="10"
                    fill="#94a3b8"
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    Cap: {node.status === 'Operational' ? `${node.capacityPct}%` : 'DEGRADED'}
                  </text>
                  <text
                    x="-38"
                    y="22"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    Pop: {(node.populationServed / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Right Column: Node Inspector & AI Disruption Cascade Simulation */}
      <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col overflow-y-auto p-4 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-cyan-400 border border-slate-700">
              {selectedNode.type} INFRASTRUCTURE
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono rounded font-semibold ${
                selectedNode.status === 'Operational'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              {selectedNode.status}
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1.5">{selectedNode.label}</h3>
          <p className="text-xs text-slate-400 font-mono">
            Civil Criticality: <span className="text-amber-400 font-bold">{selectedNode.criticality}</span>
          </p>
        </div>

        {/* Toggle Disruption Action */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Simulate Node Disruption:</span>
            <button
              onClick={() => onToggleNodeStatus(selectedNode.id)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedNode.status === 'Operational'
                  ? 'bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
              }`}
            >
              {selectedNode.status === 'Operational' ? 'Trigger Outage' : 'Restore Asset'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Simulates cyber shutdown, generator fuel exhaustion, or kinetic disruption. Observe live downstream cascade.
          </p>
        </div>

        {/* AI Consequence Modeling Action */}
        <div>
          <button
            onClick={handleRunAiConsequenceAnalysis}
            disabled={isSimulatingCascade}
            className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            {isSimulatingCascade ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Interdependent Cascade...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Consequence Cascade Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* AI Analysis Output */}
        {aiAnalysisResult ? (
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-mono">
              <span className="text-emerald-400 font-bold">CONSEQUENCE ESTIMATE</span>
              <span className="text-[10px] text-amber-400">
                Vuln Index: {aiAnalysisResult.vulnerabilityIndex}/100
              </span>
            </div>

            {/* 1st Order */}
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold block mb-0.5">
                1st Order (Direct Physical / Digital):
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                {aiAnalysisResult.firstOrderEffects?.map((eff: string, i: number) => (
                  <li key={i}>{eff}</li>
                ))}
              </ul>
            </div>

            {/* 2nd Order */}
            <div>
              <span className="text-[11px] font-mono text-amber-400 font-semibold block mb-0.5">
                2nd Order (Interdependent Functional):
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                {aiAnalysisResult.secondOrderEffects?.map((eff: string, i: number) => (
                  <li key={i}>{eff}</li>
                ))}
              </ul>
            </div>

            {/* 3rd Order */}
            <div>
              <span className="text-[11px] font-mono text-rose-400 font-semibold block mb-0.5">
                3rd Order (Social, Governance & Economic):
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                {aiAnalysisResult.thirdOrderEffects?.map((eff: string, i: number) => (
                  <li key={i}>{eff}</li>
                ))}
              </ul>
            </div>

            {/* Mitigations */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-emerald-300 font-semibold block mb-1">
                Civil Affairs Mitigation Recommendations:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {aiAnalysisResult.mitigationRecommendations?.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 text-center text-slate-500 text-xs">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            <p className="font-semibold text-slate-400">Ready for Cascade Simulation</p>
            <p className="text-[11px] mt-1 text-slate-500">
              Click 'AI Consequence Cascade Analysis' to project how disruption of {selectedNode.label} spreads through water, health, and civil systems.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
