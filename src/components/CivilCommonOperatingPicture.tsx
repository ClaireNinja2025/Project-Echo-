import React, { useState } from 'react';
import { 
  Filter, 
  Layers, 
  MapPin, 
  Zap, 
  Droplet, 
  Hospital, 
  Radio, 
  Truck, 
  Wheat, 
  ShieldAlert, 
  Building2, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Target,
  Sparkles,
  Info,
  RadioTower,
  Eye,
  Crosshair,
  Compass,
  Navigation
} from 'lucide-react';
import { 
  CivilEntity, 
  ASCOPECategory, 
  PMESIICategory, 
  InfrastructureType 
} from '../types';
import { IndicatorCategorySelector } from './IndicatorCategorySelector';
import { 
  ALL_INFORMATION_INDICATORS, 
  InformationIndicator, 
  IndicatorDataPoint,
  AorId,
  getPointsForAor,
  getAorIndicatorSummary,
  AOR_THEATER_NODES
} from '../data/indicatorLayers';

interface CivilCommonOperatingPictureProps {
  entities: CivilEntity[];
  selectedEntity: CivilEntity | null;
  onSelectEntity: (entity: CivilEntity | null) => void;
  onUpdateEntityStatus: (entityId: string, newStatus: CivilEntity['status']) => void;
  onOpenGlobalMap?: () => void;
  initialTheater?: OperatingTheater;
}

export type OperatingTheater = 
  | 'SECTOR_NORTH_BORDER'  // USNORTHCOM
  | 'AO_GRIFFIN_CENTCOM'   // USCENTCOM
  | 'DARIEN_GAP_SOUTHCOM'  // USSOUTHCOM
  | 'SUWALKI_EUCOM'        // USEUCOM
  | 'LUZON_INDOPACOM'      // USINDOPACOM
  | 'SAHEL_AFRICOM';       // USAFRICOM

const THEATER_CONFIGS: Record<OperatingTheater, {
  label: string;
  acronym: string;
  aorId: AorId;
  color: string;
  badge: string;
  description: string;
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
}> = {
  SECTOR_NORTH_BORDER: {
    label: 'Sector North (Batallón / Transit Corridor)',
    acronym: 'USNORTHCOM',
    aorId: 'aor-northcom',
    color: '#ef4444',
    badge: 'bg-red-950 text-red-300 border-red-700',
    description: 'Northern transit corridor: Batallón de Infantería garrison, El Cazadero, El Torreón, and Carretera Federal 45.',
    bounds: { minLat: 24.01, maxLat: 24.068, minLng: -105.375, maxLng: -105.328 },
  },
  AO_GRIFFIN_CENTCOM: {
    label: 'AO Griffin (Tigris Valley)',
    acronym: 'USCENTCOM',
    aorId: 'aor-centcom',
    color: '#10b981',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-700',
    description: 'Tigris River Valley: 8 synchronized civil critical infrastructure facilities (power, water, health, governance).',
    bounds: { minLat: 34.48, maxLat: 34.54, minLng: 43.09, maxLng: 43.20 },
  },
  DARIEN_GAP_SOUTHCOM: {
    label: 'Darién Gap (Necoclí / Bajo Chiquito)',
    acronym: 'USSOUTHCOM',
    aorId: 'aor-southcom',
    color: '#06b6d4',
    badge: 'bg-cyan-950 text-cyan-300 border-cyan-700',
    description: 'Panama-Colombia border: Transnational human mobility corridor, Clan del Golfo checkpoints, and indigenous shelters.',
    bounds: { minLat: 8.28, maxLat: 8.56, minLng: -77.62, maxLng: -76.72 },
  },
  SUWALKI_EUCOM: {
    label: 'Suwalki Gap (PL-LT Frontier)',
    acronym: 'USEUCOM',
    aorId: 'aor-eucom',
    color: '#3b82f6',
    badge: 'bg-blue-950 text-blue-300 border-blue-700',
    description: 'NATO Eastern Flank: 65-mile choke point between Belarus and Kaliningrad, Rail Baltica, and hybrid cognitive defense.',
    bounds: { minLat: 54.00, maxLat: 54.22, minLng: 22.80, maxLng: 23.10 },
  },
  LUZON_INDOPACOM: {
    label: 'Luzon Strait Arc (Batanes / Philippines)',
    acronym: 'USINDOPACOM',
    aorId: 'aor-indopacom',
    color: '#a855f7',
    badge: 'bg-purple-950 text-purple-300 border-purple-700',
    description: 'First Island Chain maritime arc: Artisanal fisheries, subsea telecom cable landing station, and coastal surveillance.',
    bounds: { minLat: 20.35, maxLat: 20.55, minLng: 121.85, maxLng: 122.10 },
  },
  SAHEL_AFRICOM: {
    label: 'Liptako-Gourma (Sahel Tri-Border)',
    acronym: 'USAFRICOM',
    aorId: 'aor-africom',
    color: '#ec4899',
    badge: 'bg-pink-950 text-pink-300 border-pink-700',
    description: 'Sahelian tri-border zone (Niger-Mali-Burkina Faso): Trans-Saharan migrant axis, pastoralist wells, and counter-VEO stabilization.',
    bounds: { minLat: 13.40, maxLat: 13.62, minLng: 2.00, maxLng: 2.25 },
  },
};

export const CivilCommonOperatingPicture: React.FC<CivilCommonOperatingPictureProps> = ({
  entities,
  onSelectEntity,
  selectedEntity,
  onUpdateEntityStatus,
  onOpenGlobalMap,
  initialTheater,
}) => {
  // Operational Theater selection (all 6 Combatant Commands)
  const [activeTheater, setActiveTheater] = useState<OperatingTheater>(initialTheater || 'SECTOR_NORTH_BORDER');

  React.useEffect(() => {
    if (initialTheater) {
      setActiveTheater(initialTheater);
    }
  }, [initialTheater]);

  // Indicator Layer State
  const [selectedIndicator, setSelectedIndicator] = useState<InformationIndicator | null>(
    ALL_INFORMATION_INDICATORS[0] // Adversary & Threat Narratives
  );
  const [selectedPoint, setSelectedPoint] = useState<IndicatorDataPoint | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'INDICATOR' | 'NODE'>('INDICATOR');

  // Filters
  const [selectedAscope, setSelectedAscope] = useState<ASCOPECategory | 'ALL'>('ALL');
  const [selectedPmesii, setSelectedPmesii] = useState<PMESIICategory | 'ALL'>('ALL');
  const [selectedInfra, setSelectedInfra] = useState<InfrastructureType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Layer Toggles
  const [showCyberEWZones, setShowCyberEWZones] = useState(true);
  const [showDisplacementCorridors, setShowDisplacementCorridors] = useState(true);
  const [showSupplyRoutes, setShowSupplyRoutes] = useState(true);
  const [showIndicatorCloud, setShowIndicatorCloud] = useState(true);

  const ascopeCategories: ASCOPECategory[] = ['Areas', 'Structures', 'Capabilities', 'Organizations', 'People', 'Events'];
  const pmesiiCategories: PMESIICategory[] = ['Political', 'Military', 'Economic', 'Social', 'Information', 'Infrastructure'];

  const currentTheaterConfig = THEATER_CONFIGS[activeTheater];

  // Active theater points for selected indicator
  const theaterPoints = selectedIndicator
    ? getPointsForAor(selectedIndicator, currentTheaterConfig.aorId)
    : [];

  const filteredEntities = entities.filter((ent) => {
    if (selectedAscope !== 'ALL' && ent.ascope !== selectedAscope) return false;
    if (selectedPmesii !== 'ALL' && ent.pmesii !== selectedPmesii) return false;
    if (selectedInfra !== 'ALL' && ent.infraType !== selectedInfra) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        ent.name.toLowerCase().includes(q) ||
        ent.sector.toLowerCase().includes(q) ||
        ent.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusColor = (status: CivilEntity['status']) => {
    switch (status) {
      case 'Operational': return 'bg-emerald-500 text-white border-emerald-400';
      case 'Degraded': return 'bg-amber-500 text-white border-amber-300 animate-pulse';
      case 'Critical': return 'bg-rose-600 text-white border-rose-400 animate-bounce';
      case 'Destroyed': return 'bg-slate-700 text-slate-300 border-slate-600';
      case 'Restored': return 'bg-cyan-500 text-white border-cyan-300';
      default: return 'bg-slate-500 text-white border-slate-400';
    }
  };

  // Convert GPS Coordinates to SVG canvas (1000 x 650)
  const getSvgCoords = (lat: number, lng: number) => {
    const { minLat, maxLat, minLng, maxLng } = currentTheaterConfig.bounds;
    const clampedLat = Math.max(minLat, Math.min(maxLat, lat));
    const clampedLng = Math.max(minLng, Math.min(maxLng, lng));

    const x = ((clampedLng - minLng) / (maxLng - minLng)) * 720 + 140;
    const y = 600 - ((clampedLat - minLat) / (maxLat - minLat)) * 500;
    return { x, y };
  };

  const aorIndicatorDetail = selectedIndicator
    ? getAorIndicatorSummary(selectedIndicator, currentTheaterConfig.aorId)
    : null;

  return (
    <div className="flex flex-col lg:flex-row h-full flex-1 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Map & Visual Controls Area */}
      <div className="flex-1 flex flex-col border-r border-slate-800 relative min-w-0">
        {/* Map Top Bar with Indicator Dropdown & Theater Switcher */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs z-10">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {/* Operational Theater Dropdown Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono">
              <span className="text-slate-500 font-bold text-[11px]">THEATER:</span>
              <select
                value={activeTheater}
                onChange={(e) => {
                  const newTheater = e.target.value as OperatingTheater;
                  setActiveTheater(newTheater);
                  if (newTheater === 'AO_GRIFFIN_CENTCOM') {
                    setInspectorTab('NODE');
                  } else {
                    setInspectorTab('INDICATOR');
                  }
                }}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
              >
                {Object.entries(THEATER_CONFIGS).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.acronym} — {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Indicator Category Selector for the 36 Layers */}
            <IndicatorCategorySelector
              selectedIndicatorId={selectedIndicator?.id || null}
              onSelectIndicator={(ind) => {
                setSelectedIndicator(ind);
                if (ind) {
                  const pts = getPointsForAor(ind, currentTheaterConfig.aorId);
                  setSelectedPoint(pts[0] || null);
                  setInspectorTab('INDICATOR');
                }
              }}
            />

            {/* Toggle Survey Point Cloud */}
            {selectedIndicator && (
              <label className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-2 py-1 rounded cursor-pointer text-[11px] font-mono">
                <input
                  type="checkbox"
                  checked={showIndicatorCloud}
                  onChange={(e) => setShowIndicatorCloud(e.target.checked)}
                  className="accent-emerald-500 rounded"
                />
                <span className="text-amber-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Telemetry Dots ({theaterPoints.length})
                </span>
              </label>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1.5" />
              <input
                type="text"
                placeholder="Search civil nodes, indicators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
              />
            </div>
            {onOpenGlobalMap && (
              <button
                onClick={onOpenGlobalMap}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/40 rounded flex items-center gap-1.5 transition-colors font-mono cursor-pointer text-xs"
                title="View Global Combatant Command AOR World Map"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">World Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter & ASCOPE/PMESII Bar */}
        <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between text-[11px] gap-2">
          <div className="flex items-center space-x-2 flex-wrap text-slate-400">
            <span className="font-mono text-emerald-400 font-semibold">ASCOPE:</span>
            <button
              onClick={() => setSelectedAscope('ALL')}
              className={`hover:underline font-mono ${selectedAscope === 'ALL' ? 'text-white font-bold' : ''}`}
            >
              ALL
            </button>
            {ascopeCategories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedAscope(c)}
                className={`hover:underline font-mono ${selectedAscope === c ? 'text-white font-bold' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 text-slate-300 text-[11px]">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showCyberEWZones}
                onChange={(e) => setShowCyberEWZones(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span className="text-cyan-400">Cyber/EW</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showDisplacementCorridors}
                onChange={(e) => setShowDisplacementCorridors(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span className="text-amber-400">IDP Corridors</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showSupplyRoutes}
                onChange={(e) => setShowSupplyRoutes(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span className="text-slate-300">Transit Routes</span>
            </label>
          </div>
        </div>

        {/* Interactive Tactical Map SVG Canvas */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center p-2">
          <svg
            viewBox="0 0 1000 650"
            className="w-full h-full max-h-[720px] select-none rounded border border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#0a0f18] to-slate-950 shadow-2xl"
          >
            <defs>
              <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
              </pattern>
            </defs>
            <rect width="1000" height="650" fill="url(#tacticalGrid)" />

            {/* THEATER 1: SECTOR NORTH (USNORTHCOM - BATALLÓN DE INFANTERÍA / DURANGO) */}
            {activeTheater === 'SECTOR_NORTH_BORDER' && (
              <g id="sectorNorthTerrain">
                <text x="25" y="30" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  SECTOR NORTH (USNORTHCOM) // LAT: 24.0312°N, LON: -105.3510°W // DURANGO CORRIDOR
                </text>
                <text x="750" y="30" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  ADVERSARY NARRATIVE & PRECURSOR CORRIDOR
                </text>

                {/* Regional River */}
                <path
                  d="M 120,50 C 250,90 400,160 520,280 C 620,380 750,460 920,520"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="16"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                />
                <path
                  d="M 120,50 C 250,90 400,160 520,280 C 620,380 750,460 920,520"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeOpacity="0.7"
                />

                {/* Highway: Ruta Federal 45 */}
                <path
                  d="M 220,620 L 380,480 L 530,340 L 700,200 L 880,40"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="6"
                  strokeOpacity="0.4"
                  strokeDasharray="8,4"
                />

                {/* Communities */}
                <g transform="translate(680, 110)">
                  <circle r="6" fill="#38bdf8" fillOpacity="0.6" stroke="#0284c7" strokeWidth="2" />
                  <text x="12" y="4" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    Lomas del Río
                  </text>
                </g>
                <g transform="translate(320, 200)">
                  <circle r="6" fill="#f59e0b" fillOpacity="0.6" stroke="#d97706" strokeWidth="2" />
                  <text x="12" y="4" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    El Cazadero
                  </text>
                </g>
                <g transform="translate(760, 420)">
                  <circle r="6" fill="#a855f7" fillOpacity="0.6" stroke="#9333ea" strokeWidth="2" />
                  <text x="12" y="4" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    El Torreón
                  </text>
                </g>

                {/* Batallón de Infantería Garrison */}
                <g transform="translate(480, 320)">
                  <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
                  <circle r="28" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
                  <text x="0" y="5" textAnchor="middle" fill="#60a5fa" fontSize="13" fontWeight="black">BI</text>
                  <text x="0" y="-24" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                    Batallón de Infantería
                  </text>
                  <text x="0" y="32" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace">
                    MILITARY GARRISON & CMOC
                  </text>
                </g>

                {/* Threat Network Checkpoint Zone */}
                {showCyberEWZones && (
                  <g transform="translate(290, 390)">
                    <circle r="45" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,4" />
                    <text x="0" y="-50" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      THREAT NETWORK CHECKPOINT CONTESTED ZONE
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* THEATER 2: AO GRIFFIN (USCENTCOM - TIGRIS VALLEY INFRASTRUCTURE NODES) */}
            {activeTheater === 'AO_GRIFFIN_CENTCOM' && (
              <g id="aoGriffinTerrain">
                <text x="25" y="30" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  AO GRIFFIN (USCENTCOM) // TIGRIS RIVER VALLEY // 38T LN 2000 8000
                </text>

                {/* River Tigris */}
                <path
                  d="M 520,0 C 530,120 480,240 540,360 C 580,440 600,520 570,650"
                  fill="none"
                  stroke="#0369a1"
                  strokeWidth="24"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                />
                <path
                  d="M 520,0 C 530,120 480,240 540,360 C 580,440 600,520 570,650"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeOpacity="0.7"
                />

                {/* Infrastructure Dependency Links */}
                <g stroke="#334155" strokeWidth="1" strokeDasharray="4,2">
                  {filteredEntities.map((ent) =>
                    ent.dependencies.map((depId) => {
                      const dep = entities.find((e) => e.id === depId);
                      if (!dep) return null;
                      const x1 = (ent.coordinates.x / 100) * 1000;
                      const y1 = (ent.coordinates.y / 100) * 650;
                      const x2 = (dep.coordinates.x / 100) * 1000;
                      const y2 = (dep.coordinates.y / 100) * 650;
                      return (
                        <line
                          key={`${ent.id}-${dep.id}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={ent.status === 'Degraded' || dep.status === 'Degraded' ? '#f59e0b' : '#334155'}
                          strokeWidth={ent.status === 'Degraded' ? 2 : 1}
                        />
                      );
                    })
                  )}
                </g>

                {/* Infrastructure Node Circles */}
                {filteredEntities.map((ent) => {
                  const cx = (ent.coordinates.x / 100) * 1000;
                  const cy = (ent.coordinates.y / 100) * 650;
                  const isSelected = selectedEntity?.id === ent.id;

                  return (
                    <g
                      key={ent.id}
                      transform={`translate(${cx}, ${cy})`}
                      onClick={() => {
                        onSelectEntity(ent);
                        setInspectorTab('NODE');
                      }}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      {isSelected && (
                        <circle r="26" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4,2" />
                      )}
                      <circle
                        r="15"
                        fill={
                          ent.status === 'Operational'
                            ? '#065f46'
                            : ent.status === 'Degraded'
                            ? '#78350f'
                            : '#881337'
                        }
                        stroke={
                          ent.status === 'Operational'
                            ? '#34d399'
                            : ent.status === 'Degraded'
                            ? '#fbbf24'
                            : '#f43f5e'
                        }
                        strokeWidth="2"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {ent.infraType ? ent.infraType.charAt(0) : ent.ascope.charAt(0)}
                      </text>
                      <rect
                        x="-65"
                        y="18"
                        width="130"
                        height="18"
                        rx="3"
                        fill="#020617"
                        fillOpacity="0.85"
                        stroke="#1e293b"
                        strokeWidth="0.5"
                      />
                      <text
                        x="0"
                        y="31"
                        textAnchor="middle"
                        fill="#e2e8f0"
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight="500"
                      >
                        {ent.name.length > 18 ? ent.name.substring(0, 16) + '…' : ent.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* THEATER 3: DARIÉN GAP (USSOUTHCOM - NECOCLÍ / BAJO CHIQUITO) */}
            {activeTheater === 'DARIEN_GAP_SOUTHCOM' && (
              <g id="darienTerrain">
                <text x="25" y="30" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  DARIÉN GAP MOBILITY CORRIDOR (USSOUTHCOM) // LAT: 8.423°N, LON: -76.782°W
                </text>
                <text x="720" y="30" fill="#06b6d4" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  TRANSNATIONAL MIGRATION CHOKEPOINT
                </text>

                {/* Gulf of Urabá Coastline */}
                <path
                  d="M 100,0 C 200,180 320,320 280,520 C 240,600 180,650 150,650"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="28"
                  strokeOpacity="0.25"
                />

                {/* Darién Jungle Trail */}
                <path
                  d="M 280,340 C 440,320 580,360 740,410 C 840,440 920,470 960,490"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="6"
                  strokeDasharray="6,4"
                  strokeOpacity="0.6"
                />

                {/* Reception Nodes */}
                <g transform="translate(280, 340)">
                  <circle r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="14" y="4" fill="#67e8f9" fontSize="12" fontWeight="bold">Necoclí Boat Embankment</text>
                </g>
                <g transform="translate(560, 360)">
                  <circle r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="14" y="4" fill="#fbbf24" fontSize="11" fontWeight="bold">Acandí Trailhead</text>
                </g>
                <g transform="translate(820, 430)">
                  <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="14" y="4" fill="#34d399" fontSize="12" fontWeight="bold">Bajo Chiquito Reception Shelter</text>
                </g>
              </g>
            )}

            {/* THEATER 4: SUWALKI GAP (USEUCOM - POLAND-LITHUANIA BORDER) */}
            {activeTheater === 'SUWALKI_EUCOM' && (
              <g id="suwalkiTerrain">
                <text x="25" y="30" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  SUWALKI CORRIDOR (USEUCOM) // LAT: 54.103°N, LON: 22.930°E // NATO ARTICLE 3 CORRIDOR
                </text>
                <text x="730" y="30" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  HYBRID DEFENSE & MOBILITY AXIS
                </text>

                {/* International Border Line */}
                <line x1="200" y1="120" x2="820" y2="540" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,5" strokeOpacity="0.7" />

                {/* Rail Baltica Logistic Axis */}
                <line x1="150" y1="580" x2="880" y2="100" stroke="#94a3b8" strokeWidth="5" strokeOpacity="0.4" />

                {/* Suwalki City & Logistics Hub */}
                <g transform="translate(480, 320)">
                  <rect x="-14" y="-14" width="28" height="28" rx="3" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">SG</text>
                  <text x="0" y="-20" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Suwalki Logistics Hub</text>
                </g>
                <g transform="translate(740, 480)">
                  <circle r="7" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
                  <text x="12" y="4" fill="#6ee7b7" fontSize="11" fontWeight="bold">Kaliningrad Flank Sensor</text>
                </g>
              </g>
            )}

            {/* THEATER 5: LUZON STRAIT (USINDOPACOM - BATANES / PHILIPPINES) */}
            {activeTheater === 'LUZON_INDOPACOM' && (
              <g id="luzonTerrain">
                <text x="25" y="30" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  LUZON STRAIT ARC (USINDOPACOM) // LAT: 20.448°N, LON: 121.970°E // FIRST ISLAND CHAIN
                </text>
                <text x="730" y="30" fill="#a855f7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  GRAY-ZONE MARITIME & SLOC AXIS
                </text>

                {/* Island Outposts */}
                <g transform="translate(380, 240)">
                  <ellipse rx="35" ry="18" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="bold">Itbayat Atoll</text>
                </g>
                <g transform="translate(540, 360)">
                  <ellipse rx="45" ry="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="bold">Batanes Island Station</text>
                </g>

                {/* Subsea Cable Route */}
                <path d="M 120,480 C 350,420 540,360 880,260" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6,3" />
                <text x="680" y="290" fill="#fbbf24" fontSize="9" fontFamily="monospace">SUBSEA FIBER-OPTIC ARTERY</text>
              </g>
            )}

            {/* THEATER 6: SAHEL (USAFRICOM - LIPTAKO-GOURMA) */}
            {activeTheater === 'SAHEL_AFRICOM' && (
              <g id="sahelTerrain">
                <text x="25" y="30" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  LIPTAKO-GOURMA TRI-BORDER (USAFRICOM) // LAT: 13.513°N, LON: 2.115°E
                </text>
                <text x="740" y="30" fill="#ec4899" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  COUNTER-VEO & DROUGHT RESILIENCE
                </text>

                {/* River Niger Bend */}
                <path d="M 150,600 C 350,540 520,420 680,220 C 760,120 820,40 850,0" fill="none" stroke="#0284c7" strokeWidth="18" strokeOpacity="0.3" />
                <path d="M 150,600 C 350,540 520,420 680,220 C 760,120 820,40 850,0" fill="none" stroke="#38bdf8" strokeWidth="3" strokeOpacity="0.7" />

                {/* Tri-Border Marker */}
                <g transform="translate(490, 330)">
                  <polygon points="0,-18 16,12 -16,12" fill="#831843" stroke="#f472b6" strokeWidth="2" />
                  <text x="0" y="28" textAnchor="middle" fill="#fbcfe8" fontSize="11" fontWeight="bold">Liptako-Gourma Junction</text>
                </g>
                <g transform="translate(720, 200)">
                  <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="14" y="4" fill="#a7f3d0" fontSize="11" fontWeight="bold">Gao Solar Water Well Node</text>
                </g>
              </g>
            )}

            {/* Point Cloud Telemetry Dots for Active Indicator in this Theater */}
            {showIndicatorCloud && selectedIndicator && (
              <g id="theaterIndicatorPoints">
                {theaterPoints.map((pt) => {
                  const coords = getSvgCoords(pt.lat, pt.lng);
                  const isSelected = selectedPoint?.id === pt.id;

                  return (
                    <g
                      key={pt.id}
                      transform={`translate(${coords.x}, ${coords.y})`}
                      onClick={() => {
                        setSelectedPoint(pt);
                        setInspectorTab('INDICATOR');
                      }}
                      className="cursor-pointer transition-transform hover:scale-150"
                    >
                      {isSelected && (
                        <circle r="9" fill="none" stroke="#ffffff" strokeWidth="2" />
                      )}
                      <circle
                        r={isSelected ? 6 : 4}
                        fill={pt.color}
                        fillOpacity={0.88}
                        stroke="#020617"
                        strokeWidth="0.75"
                      />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>

          {/* Bottom Left Legend Box */}
          <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-800 rounded-lg p-3 text-[11px] backdrop-blur-md max-w-sm shadow-2xl z-10 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-mono font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Layers className="w-3.5 h-3.5" />
                <span>{selectedIndicator ? selectedIndicator.name.toUpperCase() : 'MAP LAYERS'}</span>
              </span>
              <span className="text-[10px] text-cyan-400">
                {currentTheaterConfig.acronym}
              </span>
            </div>

            {selectedIndicator && (
              <div className="space-y-1 text-[10px] font-mono">
                <div className="text-slate-400 font-semibold mb-1">THEATER RESPONSE BREAKDOWN:</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedIndicator.sentimentBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="truncate text-slate-300">{item.label}</span>
                      <span className="ml-auto font-bold text-slate-400">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Intelligence Inspector: Dual Mode (Indicator Intelligence vs Civil Node) */}
      <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 flex flex-col shadow-2xl shrink-0 overflow-y-auto">
        {/* Inspector Header & Mode Switcher */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-1 font-mono text-xs">
            <button
              onClick={() => setInspectorTab('INDICATOR')}
              className={`px-2.5 py-1 rounded transition-colors font-bold ${
                inspectorTab === 'INDICATOR'
                  ? 'bg-amber-950 text-amber-300 border border-amber-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Indicator Intelligence ({currentTheaterConfig.acronym})
            </button>
            <button
              onClick={() => setInspectorTab('NODE')}
              className={`px-2.5 py-1 rounded transition-colors font-bold ${
                inspectorTab === 'NODE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Civil Infrastructure
            </button>
          </div>
        </div>

        {/* Tab 1: Indicator Intelligence Analysis */}
        {inspectorTab === 'INDICATOR' && selectedIndicator && (
          <div className="p-4 space-y-4 text-xs font-sans">
            {/* Indicator Card */}
            <div className="space-y-1.5 border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700">
                  {selectedIndicator.domain}
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {currentTheaterConfig.acronym} // ADP 3-13
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {selectedIndicator.name}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedIndicator.description}
              </p>
            </div>

            {/* Doctrinal Crosswalk Mappings */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">PMESII DIMENSION</span>
                <span className="font-bold text-cyan-400">{selectedIndicator.pmesii}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">ASCOPE CATEGORY</span>
                <span className="font-bold text-emerald-400">{selectedIndicator.ascope}</span>
              </div>
            </div>

            {/* Sentiment & Telemetry Breakdown Bars for this AOR */}
            {aorIndicatorDetail && (
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono font-semibold">
                  <span className="text-slate-300">{currentTheaterConfig.acronym} SURVEY SHARES:</span>
                  <span className="text-amber-400 font-bold">{aorIndicatorDetail.keyMetric}</span>
                </div>

                <div className="space-y-2 pt-1">
                  {aorIndicatorDetail.sentimentBreakdown.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300 truncate max-w-[200px]">{s.label}</span>
                        <span className="font-mono font-bold" style={{ color: s.color }}>
                          {s.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Implication for Civil Affairs */}
            {aorIndicatorDetail && (
              <div className="p-3 bg-red-950/20 border border-red-800/60 rounded-xl space-y-1.5 text-xs">
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  Civil Affairs Strategic Implication ({currentTheaterConfig.acronym})
                </span>
                <p className="text-red-200 leading-relaxed text-[11px]">
                  {aorIndicatorDetail.strategicImplication}
                </p>
              </div>
            )}

            {/* Selected Point Telemetry Details */}
            {selectedPoint && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400 text-[10px]">SELECTED TELEMETRY SAMPLE</span>
                  <span className="text-emerald-400 font-bold text-[10px]">{selectedPoint.confidence}% CONFIDENCE</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">LOCATION:</span>
                    <span className="text-slate-200 font-semibold">{selectedPoint.locationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">COORDINATES:</span>
                    <span className="text-cyan-400">{selectedPoint.lat}°N, {selectedPoint.lng}°W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">OBSERVED VALUE:</span>
                    <span className="font-bold" style={{ color: selectedPoint.color }}>
                      {selectedPoint.value}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">COHORT METHOD:</span>
                    <span className="text-slate-300">{selectedPoint.sampleCohort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SAMPLE SIZE:</span>
                    <span className="text-slate-300">n={selectedPoint.sampleSize}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Civil Infrastructure Node Inspection */}
        {inspectorTab === 'NODE' && (
          <div className="p-4 flex-1">
            {selectedEntity ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                      NODE ID: {selectedEntity.id.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-semibold ${getStatusColor(selectedEntity.status)}`}>
                      {selectedEntity.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2 leading-tight">
                    {selectedEntity.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Sector: {selectedEntity.sector} | DTG: {selectedEntity.freshnessDTG}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 font-mono block text-[10px]">ASCOPE CLASS</span>
                    <span className="font-semibold text-emerald-400">{selectedEntity.ascope}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 font-mono block text-[10px]">PMESII SECTOR</span>
                    <span className="font-semibold text-cyan-400">{selectedEntity.pmesii}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Civil Assessment & Situation</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800">
                    {selectedEntity.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() =>
                      onUpdateEntityStatus(
                        selectedEntity.id,
                        selectedEntity.status === 'Operational' ? 'Degraded' : 'Operational'
                      )
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium text-xs border border-slate-700 text-center transition-colors"
                  >
                    Toggle Operational Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <Layers className="w-12 h-12 text-slate-700 mb-3" />
                <h4 className="text-sm font-semibold text-slate-400">No Civil Node Selected</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Select any civil facility on the map or switch to Indicator Intelligence mode to view the 36 information layers for this theater.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
