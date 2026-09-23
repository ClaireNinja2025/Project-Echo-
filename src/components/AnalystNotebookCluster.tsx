import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Share2, 
  ShieldAlert, 
  Users, 
  Building2, 
  DollarSign, 
  HeartHandshake, 
  Filter, 
  Search, 
  Maximize2, 
  Eye, 
  Info, 
  Activity, 
  AlertTriangle,
  FileText,
  RadioTower,
  Crosshair,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  ANALYST_NETWORK_NODES, 
  ANALYST_NETWORK_LINKS, 
  NetworkNode, 
  NetworkLink, 
  NetworkClusterType, 
  NetworkLinkType,
  BASEBALL_CARD_ACTORS,
  BaseballCardActor
} from '../data/doctrineAnalyticsData';

interface AnalystNotebookClusterProps {
  onSelectBaseballCard?: (cardId: string) => void;
}

export const AnalystNotebookCluster: React.FC<AnalystNotebookClusterProps> = ({
  onSelectBaseballCard,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-beltran');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<NetworkClusterType | 'ALL'>('ALL');
  const [selectedLinkTypeFilter, setSelectedLinkTypeFilter] = useState<NetworkLinkType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [highlightEgoNetwork, setHighlightEgoNetwork] = useState<boolean>(true);

  // Clusters metadata
  const clusterConfig: Record<NetworkClusterType, { label: string; color: string; bg: string; icon: any }> = {
    ADVERSARY_THREAT: {
      label: 'Adversary Threat Cell',
      color: '#ef4444',
      bg: 'bg-red-950/60 border-red-800 text-red-300',
      icon: ShieldAlert,
    },
    GOVERNANCE_ELITE: {
      label: 'Municipal Governance & Security',
      color: '#3b82f6',
      bg: 'bg-blue-950/60 border-blue-800 text-blue-300',
      icon: Building2,
    },
    TRIBAL_CLERICAL: {
      label: 'Moral, Clerical & Tribal Elders',
      color: '#f59e0b',
      bg: 'bg-amber-950/60 border-amber-800 text-amber-300',
      icon: Users,
    },
    ILLICIT_BROKERS: {
      label: 'Illicit Chemical Brokers & Smuggling',
      color: '#06b6d4',
      bg: 'bg-cyan-950/60 border-cyan-800 text-cyan-300',
      icon: DollarSign,
    },
    CIVIL_SOCIETY_HUMANITARIAN: {
      label: 'Civil Society, Co-ops & Medical',
      color: '#10b981',
      bg: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
      icon: HeartHandshake,
    },
  };

  const linkTypeConfig: Record<NetworkLinkType, { label: string; color: string; dash?: string; strokeWidth: number }> = {
    HOSTILE_COMMAND: {
      label: 'Hostile Command / Extortion (Red)',
      color: '#ef4444',
      strokeWidth: 2.8,
    },
    FINANCIAL_ILLICIT: {
      label: 'Illicit Financial & Precursor (Cyan)',
      color: '#06b6d4',
      strokeWidth: 2.2,
    },
    COMMUNICATION_INTERLOCUTOR: {
      label: 'Interlocutor & Governance (Blue)',
      color: '#6366f1',
      strokeWidth: 2.0,
    },
    KINSHIP_TRIBAL: {
      label: 'Kinship & Family Ties (Slate)',
      color: '#94a3b8',
      dash: '6,4',
      strokeWidth: 1.8,
    },
    CIVIL_FACILITATION: {
      label: 'Civil Facilitation & Aid (Emerald)',
      color: '#10b981',
      strokeWidth: 2.2,
    },
  };

  // Selected Node
  const selectedNode = ANALYST_NETWORK_NODES.find((n) => n.id === selectedNodeId) || ANALYST_NETWORK_NODES[0];
  const selectedBaseballCard = BASEBALL_CARD_ACTORS.find((c) => c.id === selectedNode?.baseballCardId);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return ANALYST_NETWORK_NODES.filter((n) => {
      if (selectedClusterFilter !== 'ALL' && n.cluster !== selectedClusterFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          n.name.toLowerCase().includes(q) ||
          n.moniker.toLowerCase().includes(q) ||
          n.role.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedClusterFilter, searchQuery]);

  const visibleNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Ego network node IDs for selected node
  const egoNodeIds = useMemo(() => {
    if (!highlightEgoNetwork || !selectedNode) return new Set<string>();
    const set = new Set<string>([selectedNode.id]);
    ANALYST_NETWORK_LINKS.forEach((l) => {
      if (l.source === selectedNode.id) set.add(l.target);
      if (l.target === selectedNode.id) set.add(l.source);
    });
    return set;
  }, [highlightEgoNetwork, selectedNode]);

  // Filtered links
  const filteredLinks = useMemo(() => {
    return ANALYST_NETWORK_LINKS.filter((l) => {
      if (selectedLinkTypeFilter !== 'ALL' && l.type !== selectedLinkTypeFilter) return false;
      // Both source and target must be in visible nodes
      return visibleNodeIds.has(l.source) && visibleNodeIds.has(l.target);
    });
  }, [selectedLinkTypeFilter, visibleNodeIds]);

  // Connected links for selected node
  const connectedLinks = useMemo(() => {
    if (!selectedNode) return [];
    return ANALYST_NETWORK_LINKS.filter(
      (l) => l.source === selectedNode.id || l.target === selectedNode.id
    );
  }, [selectedNode]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Main Link Analysis Canvas (Left) */}
      <div className="flex-1 flex flex-col border-r border-slate-800 relative min-w-0">
        {/* Top Control Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide font-mono">
                  Analyst's Notebook & Link Analysis Cluster
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                  ATP 2-01.3 / FM 3-57
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-cluster network topology: Adversary cells, political elites, financial brokers & moral interlocutors.
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 flex-wrap text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1.5" />
              <input
                type="text"
                placeholder="Search actor or cell..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-40"
              />
            </div>

            {/* Cluster Filter */}
            <select
              value={selectedClusterFilter}
              onChange={(e) => setSelectedClusterFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none font-mono"
            >
              <option value="ALL">All Clusters ({ANALYST_NETWORK_NODES.length})</option>
              {Object.entries(clusterConfig).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>

            {/* Link Type Filter */}
            <select
              value={selectedLinkTypeFilter}
              onChange={(e) => setSelectedLinkTypeFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none font-mono"
            >
              <option value="ALL">All Link Types ({ANALYST_NETWORK_LINKS.length})</option>
              {Object.entries(linkTypeConfig).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>

            {/* Ego Toggle */}
            <label className="flex items-center space-x-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded cursor-pointer text-[11px] font-mono">
              <input
                type="checkbox"
                checked={highlightEgoNetwork}
                onChange={(e) => setHighlightEgoNetwork(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span className="text-cyan-300">Ego-Net</span>
            </label>
          </div>
        </div>

        {/* Cluster Header Ribbon */}
        <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-500 font-bold whitespace-nowrap">TOPOLOGICAL CLUSTERS:</span>
          {Object.entries(clusterConfig).map(([key, cfg]) => {
            const isSelected = selectedClusterFilter === key;
            const count = ANALYST_NETWORK_NODES.filter((n) => n.cluster === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedClusterFilter(isSelected ? 'ALL' : (key as NetworkClusterType))}
                className={`px-2 py-0.5 rounded transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected ? 'bg-slate-800 border-white text-white font-bold ring-1' : cfg.bg
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }}></span>
                <span>{cfg.label}</span>
                <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive SVG Network Canvas (Mirrors image.png link-analysis layout) */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center p-2">
          <svg
            viewBox="0 0 1000 650"
            className="w-full h-full max-h-[720px] select-none rounded border border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#070b12] to-slate-950 shadow-2xl"
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="analystGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#111827" strokeWidth="0.5" />
              </pattern>
              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="1000" height="650" fill="url(#analystGrid)" />

            {/* Cluster Hull Enclosures / Zone Watermarks */}
            <g id="clusterHulls" opacity="0.15">
              {/* Adversary Threat Cell Polygon */}
              <polygon points="530,300 680,420 660,560 400,540 460,400" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" />
              {/* Municipal Elite Polygon */}
              <polygon points="320,70 600,60 540,180 340,180" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" />
              {/* Illicit Precursor Satellite Cluster (Ring on right in image.png) */}
              <circle cx="850" cy="280" r="110" fill="#06b6d4" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,4" />
              {/* Tribal/Clerical Left Wing */}
              <circle cx="200" cy="290" r="120" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,4" />
              {/* Civil Society Bottom */}
              <circle cx="280" cy="480" r="100" fill="#10b981" stroke="#10b981" strokeWidth="2" strokeDasharray="6,4" />
            </g>

            {/* Network Links (Replicating image.png colors: Red, Cyan, Blue) */}
            <g id="networkLinks">
              {filteredLinks.map((link) => {
                const srcNode = ANALYST_NETWORK_NODES.find((n) => n.id === link.source);
                const tgtNode = ANALYST_NETWORK_NODES.find((n) => n.id === link.target);
                if (!srcNode || !tgtNode) return null;

                const isConnectedToSelected =
                  selectedNode && (link.source === selectedNode.id || link.target === selectedNode.id);
                const cfg = linkTypeConfig[link.type];

                const opacity = highlightEgoNetwork && selectedNode
                  ? isConnectedToSelected ? 0.95 : 0.15
                  : 0.7;

                const strokeWidth = isConnectedToSelected ? cfg.strokeWidth + 1.2 : cfg.strokeWidth;

                return (
                  <g key={link.id} className="transition-opacity duration-200">
                    <line
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={cfg.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={cfg.dash}
                      strokeOpacity={opacity}
                      filter={isConnectedToSelected ? 'url(#glow)' : undefined}
                    />
                  </g>
                );
              })}
            </g>

            {/* Network Nodes */}
            <g id="networkNodes">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isEgoNeighbor = egoNodeIds.has(node.id);
                const cfg = clusterConfig[node.cluster];

                const opacity = highlightEgoNetwork && selectedNode
                  ? isEgoNeighbor ? 1 : 0.25
                  : 1;

                const nodeRadius = isSelected ? 17 : node.tier === 'TIER_1_HVI' ? 14 : node.tier === 'TIER_2_KEY_LEADER' ? 11 : 9;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer transition-transform hover:scale-125"
                    opacity={opacity}
                  >
                    {/* Pulsing Selection Ring */}
                    {isSelected && (
                      <>
                        <circle r={nodeRadius + 10} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,3" className="animate-spin" />
                        <circle r={nodeRadius + 6} fill="none" stroke={cfg.color} strokeWidth="2.5" />
                      </>
                    )}

                    {/* Cut-point Diamond Indicator (Critical Broker Node) */}
                    {node.isCutPoint && (
                      <polygon
                        points={`0,${-nodeRadius - 6} ${nodeRadius + 6},0 0,${nodeRadius + 6} ${-nodeRadius - 6},0`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                      />
                    )}

                    {/* Node Core Body */}
                    <circle
                      r={nodeRadius}
                      fill={cfg.color}
                      fillOpacity={0.88}
                      stroke="#020617"
                      strokeWidth={2}
                    />

                    {/* Node Center Icon / Text */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#ffffff"
                      fontSize={nodeRadius > 12 ? 10 : 8}
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.degreeCentrality}
                    </text>

                    {/* Text Label */}
                    {showLabels && (
                      <g transform={`translate(0, ${nodeRadius + 14})`}>
                        <rect
                          x="-60"
                          y="-8"
                          width="120"
                          height="16"
                          rx="3"
                          fill="#020617"
                          fillOpacity="0.85"
                          stroke={isSelected ? '#ffffff' : '#334155'}
                          strokeWidth="0.75"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#f1f5f9"
                          fontSize="9"
                          fontFamily="sans-serif"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                        >
                          {node.moniker || node.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Bottom Left Legend Box matching image.png */}
          <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-800 rounded-lg p-3 text-[11px] backdrop-blur-md max-w-sm shadow-2xl z-10 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-mono font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-red-400">
                <Share2 className="w-3.5 h-3.5" />
                <span>LINK ANALYSIS LEGEND (i2 / PALANTIR)</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">22 NODES // 37 EDGES</span>
            </div>

            <div className="space-y-1 text-[10px] font-mono">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-red-500"></span>
                  <span className="text-red-300 truncate">Hostile / Threat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-cyan-400"></span>
                  <span className="text-cyan-300 truncate">Illicit Financial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-indigo-400"></span>
                  <span className="text-indigo-300 truncate">Interlocutor / Comms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-b border-dashed border-slate-400"></span>
                  <span className="text-slate-300 truncate">Kinship / Clan</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>Threat Core</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rotate-45 border border-amber-400"></span>
                  <span>Cut-Point Broker</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Governance</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Actor & Network Intelligence Dossier Drawer */}
      <div className="w-full lg:w-[420px] bg-slate-900 flex flex-col p-4 md:p-5 space-y-4 overflow-y-auto border-t lg:border-t-0 shadow-2xl shrink-0">
        {selectedNode ? (
          <div className="space-y-4">
            {/* Header Identity Card */}
            <div className="border-b border-slate-800 pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    clusterConfig[selectedNode.cluster].bg
                  }`}
                >
                  {clusterConfig[selectedNode.cluster].label.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedNode.tier.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedNode.name}</span>
                  {selectedNode.moniker && (
                    <span className="text-amber-400 font-mono text-sm">{selectedNode.moniker}</span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{selectedNode.role}</p>
              </div>

              {/* Disposition Rating Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">DISPOSITION TO COALITION:</span>
                  <span
                    className={`font-bold ${
                      selectedNode.disposition > 50
                        ? 'text-emerald-400'
                        : selectedNode.disposition > 0
                        ? 'text-cyan-400'
                        : selectedNode.disposition > -50
                        ? 'text-amber-400'
                        : 'text-red-500'
                    }`}
                  >
                    {selectedNode.disposition > 0 ? `+${selectedNode.disposition}` : selectedNode.disposition} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${Math.max(0, -selectedNode.disposition)}%` }}
                  ></div>
                  <div
                    className="h-full bg-emerald-500 transition-all ml-auto"
                    style={{ width: `${Math.max(0, selectedNode.disposition)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Centrality & Broker Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">DEGREE</span>
                <span className="text-base font-bold text-white">{selectedNode.degreeCentrality}</span>
                <span className="text-[9px] text-slate-400 block">Direct Links</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">BETWEENNESS</span>
                <span className="text-base font-bold text-cyan-400">
                  {(selectedNode.betweennessCentrality * 100).toFixed(0)}%
                </span>
                <span className="text-[9px] text-slate-400 block">Broker Score</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">RISK SCORE</span>
                <span
                  className={`text-base font-bold ${
                    selectedNode.riskScore > 75
                      ? 'text-red-400'
                      : selectedNode.riskScore > 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {selectedNode.riskScore}
                </span>
                <span className="text-[9px] text-slate-400 block">Threat/Stress</span>
              </div>
            </div>

            {/* Critical Cut-Point Alert */}
            {selectedNode.isCutPoint && (
              <div className="p-3 bg-amber-950/30 border border-amber-800/80 rounded-xl flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 font-mono block">
                    CRITICAL NETWORK CUT-POINT (SINGLE POINT OF FAILURE)
                  </span>
                  <p className="text-slate-300 text-[11px] mt-0.5 leading-snug">
                    Removing, co-opting, or incapacitating this node fractures the communication flow between the{' '}
                    {clusterConfig[selectedNode.cluster].label} and neighboring operational clusters.
                  </p>
                </div>
              </div>
            )}

            {/* Connected Network Links */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center justify-between">
                <span>Ego-Network Edges ({connectedLinks.length})</span>
                <span className="text-slate-500 font-normal text-[10px]">Source & Target Rel</span>
              </span>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {connectedLinks.map((link) => {
                  const isSource = link.source === selectedNode.id;
                  const otherNodeId = isSource ? link.target : link.source;
                  const otherNode = ANALYST_NETWORK_NODES.find((n) => n.id === otherNodeId);
                  const cfg = linkTypeConfig[link.type];

                  return (
                    <div
                      key={link.id}
                      onClick={() => setSelectedNodeId(otherNodeId)}
                      className="p-2 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 cursor-pointer transition-colors text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }}></span>
                          <span>{otherNode?.moniker || otherNode?.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {link.confidence}% Conf
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{link.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Link to Full Military Baseball Card */}
            {selectedBaseballCard && onSelectBaseballCard && (
              <div className="p-3 bg-blue-950/30 border border-blue-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    MILITARY BASEBALL CARD DOSSIER
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">FM 3-57 / ATP 2-01.3</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  View full psychological trait matrix, sentiment trend sparkline, interlocutor engagement log, and access vectors.
                </p>
                <button
                  onClick={() => onSelectBaseballCard(selectedBaseballCard.id)}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <span>Open {selectedNode.moniker || selectedNode.name} Baseball Card</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Network className="w-12 h-12 text-slate-700 mb-3" />
            <h4 className="text-sm font-semibold text-slate-400">Select a Node to Inspect</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click any cluster node in the network to inspect its ego-network, betweenness centrality, and associated intelligence baseball card.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
