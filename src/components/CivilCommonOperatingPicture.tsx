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
  Navigation,
  ChevronLeft,
  ChevronRight,
  RefreshCw
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
  onNavigateToOpDesign?: () => void;
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
    color: '#E34B4B',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    description: 'Northern transit corridor: Batallón de Infantería garrison, El Cazadero, El Torreón, and Carretera Federal 45.',
    bounds: { minLat: 24.01, maxLat: 24.068, minLng: -105.375, maxLng: -105.328 },
  },
  AO_GRIFFIN_CENTCOM: {
    label: 'AO Griffin (Tigris Valley)',
    acronym: 'USCENTCOM',
    aorId: 'aor-centcom',
    color: '#42BFA5',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    description: 'Tigris River Valley: 8 synchronized civil critical infrastructure facilities (power, water, health, governance).',
    bounds: { minLat: 34.48, maxLat: 34.54, minLng: 43.09, maxLng: 43.20 },
  },
  DARIEN_GAP_SOUTHCOM: {
    label: 'Darién Gap (Necoclí / Bajo Chiquito)',
    acronym: 'USSOUTHCOM',
    aorId: 'aor-southcom',
    color: '#39BCE5',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    description: 'Panama-Colombia border: Transnational human mobility corridor, transit checkpoints, and indigenous shelters.',
    bounds: { minLat: 8.28, maxLat: 8.56, minLng: -77.62, maxLng: -76.72 },
  },
  SUWALKI_EUCOM: {
    label: 'Suwalki Gap (PL-LT Frontier)',
    acronym: 'USEUCOM',
    aorId: 'aor-eucom',
    color: '#2378C3',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    description: 'NATO Eastern Flank: 65-mile choke point between Belarus and Kaliningrad, Rail Baltica, and hybrid cognitive defense.',
    bounds: { minLat: 54.00, maxLat: 54.22, minLng: 22.80, maxLng: 23.10 },
  },
  LUZON_INDOPACOM: {
    label: 'Luzon Strait Arc (Batanes / Philippines)',
    acronym: 'USINDOPACOM',
    aorId: 'aor-indopacom',
    color: '#9D5BD2',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    description: 'First Island Chain maritime arc: Artisanal fisheries, subsea telecom cable landing station, and coastal surveillance.',
    bounds: { minLat: 20.35, maxLat: 20.55, minLng: 121.85, maxLng: 122.10 },
  },
  SAHEL_AFRICOM: {
    label: 'Liptako-Gourma (Sahel Tri-Border)',
    acronym: 'USAFRICOM',
    aorId: 'aor-africom',
    color: '#FFBE2E',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
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
  onNavigateToOpDesign,
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
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [reloadNotice, setReloadNotice] = useState<string | null>(null);

  const handleReloadPicture = () => {
    setIsReloading(true);
    setReloadNotice('Reloading tactical grid & telemetry layers...');
    setTimeout(() => {
      setIsReloading(false);
      setReloadNotice('Tactical picture reloaded');
      setTimeout(() => setReloadNotice(null), 2500);
    }, 400);
  };

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
      case 'Operational': return 'bg-teal-600 text-white border-teal-500';
      case 'Degraded': return 'bg-amber-600 text-white border-amber-500';
      case 'Critical': return 'bg-red-600 text-white border-red-500';
      case 'Destroyed': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'Restored': return 'bg-cyan-600 text-white border-cyan-500';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
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
    <div className="flex flex-col lg:flex-row h-full flex-1 bg-black text-slate-100 overflow-hidden">
      {/* Map & Visual Controls Area */}
      <div className="flex-1 flex flex-col border-r border-slate-700 relative min-w-0 bg-black">
        {/* Map Top Bar with Indicator Dropdown & Theater Switcher */}
        <div className="p-3 bg-black border-b border-slate-700 flex flex-wrap items-center justify-between gap-2.5 text-xs z-10">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {/* Operational Theater Dropdown Selector */}
            <div className="flex items-center space-x-1.5 bg-black border border-slate-700 rounded px-2 py-1 text-xs font-mono">
              <span className="text-slate-400 font-bold text-[11px]">THEATER:</span>
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
                className="bg-black border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-blue-600 font-bold cursor-pointer"
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
              <label className="flex items-center space-x-1.5 bg-black border border-slate-700 px-2 py-1 rounded cursor-pointer text-[11px] font-mono">
                <input
                  type="checkbox"
                  checked={showIndicatorCloud}
                  onChange={(e) => setShowIndicatorCloud(e.target.checked)}
                  className="accent-blue-600 rounded"
                />
                <span className="text-cyan-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
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
                className="bg-black border border-slate-700 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-44"
              />
            </div>
            {/* Dedicated Reload Map Button */}
            <button
              onClick={handleReloadPicture}
              disabled={isReloading}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors font-mono cursor-pointer text-xs border ${
                isReloading
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 animate-pulse'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-cyan-300 hover:text-cyan-200 border-slate-700 shadow-sm'
              }`}
              title="Reload operational picture, grid lines, and telemetry points"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
              <span className="font-bold">{isReloading ? 'RELOADING...' : 'RELOAD MAP'}</span>
            </button>

            {onOpenGlobalMap && (
              <button
                onClick={onOpenGlobalMap}
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-slate-200 hover:text-white border border-slate-700 rounded flex items-center gap-1.5 transition-colors font-mono cursor-pointer text-xs"
                title="View Global Combatant Command AOR World Map"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">World Map</span>
              </button>
            )}

            {onNavigateToOpDesign && (
              <button
                onClick={onNavigateToOpDesign}
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-purple-300 hover:text-white border border-slate-700 rounded flex items-center gap-1.5 transition-colors font-mono cursor-pointer text-xs"
                title="Open Army Operational Design Framework (ADP 5-0 / JP 5-0)"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Op Design</span>
              </button>
            )}

            {/* Collapsible Inspector Toggle */}
            <button
              onClick={() => setIsInspectorCollapsed(!isInspectorCollapsed)}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors font-mono cursor-pointer text-xs border ${
                isInspectorCollapsed
                  ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-slate-200 hover:text-white border-slate-700'
              }`}
              title={isInspectorCollapsed ? 'Expand Intelligence & Civil Assessment Inspector' : 'Collapse Inspector (Focus 75%+ Visual Emphasis on Operational Picture)'}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Inspector:</span>
              <span className="font-bold">{isInspectorCollapsed ? 'EXPAND' : 'COLLAPSE'}</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter & ASCOPE/PMESII Bar */}
        <div className="px-3 py-1.5 bg-black border-b border-slate-700 flex flex-wrap items-center justify-between text-[11px] gap-2">
          <div className="flex items-center space-x-2 flex-wrap text-slate-400">
            <span className="font-mono text-slate-400 font-semibold">ASCOPE:</span>
            <button
              onClick={() => setSelectedAscope('ALL')}
              className={`hover:underline font-mono ${selectedAscope === 'ALL' ? 'text-white font-bold' : 'text-slate-400'}`}
            >
              ALL
            </button>
            {ascopeCategories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedAscope(c)}
                className={`hover:underline font-mono ${selectedAscope === c ? 'text-white font-bold' : 'text-slate-400'}`}
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
                className="accent-blue-600 rounded"
              />
              <span className="text-slate-300">Cyber/EW</span>
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
        <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center p-2">
          {reloadNotice && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-black/95 border border-cyan-500/60 text-cyan-300 font-mono text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md animate-fade-in">
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-cyan-400' : 'text-emerald-400'}`} />
              <span>{reloadNotice}</span>
            </div>
          )}

          <svg
            viewBox="0 0 1000 650"
            className="w-full h-full select-none rounded border border-slate-700 bg-black shadow-2xl"
          >
            <defs>
              <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38536B" strokeWidth="0.5" strokeDasharray="2,2" />
              </pattern>
            </defs>
            <rect width="1000" height="650" fill="url(#tacticalGrid)" />

            {/* THEATER 1: SECTOR NORTH (USNORTHCOM - BATALLÓN DE INFANTERÍA / DURANGO) */}
            {activeTheater === 'SECTOR_NORTH_BORDER' && (
              <g id="sectorNorthTerrain">
                <text x="25" y="30" fill="#AABAC8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  SECTOR NORTH (USNORTHCOM) // LAT: 24.0312°N, LON: -105.3510°W // DURANGO CORRIDOR
                </text>
                <text x="750" y="30" fill="#E34B4B" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  ADVERSARY NARRATIVE & PRECURSOR CORRIDOR
                </text>

                {/* Regional River */}
                <path
                  d="M 120,50 C 250,90 400,160 520,280 C 620,380 750,460 920,520"
                  fill="none"
                  stroke="#173653"
                  strokeWidth="16"
                  strokeOpacity="0.35"
                  strokeLinecap="round"
                />
                <path
                  d="M 120,50 C 250,90 400,160 520,280 C 620,380 750,460 920,520"
                  fill="none"
                  stroke="#38536B"
                  strokeWidth="2"
                  strokeOpacity="0.7"
                />

                {/* Highway: Ruta Federal 45 */}
                <path
                  d="M 220,620 L 380,480 L 530,340 L 700,200 L 880,40"
                  fill="none"
                  stroke="#38536B"
                  strokeWidth="4"
                  strokeOpacity="0.4"
                  strokeDasharray="8,4"
                />

                {/* Communities */}
                <g transform="translate(680, 110)">
                  <circle r="6" fill="#10263D" stroke="#38536B" strokeWidth="2" />
                  <text x="12" y="4" fill="#AABAC8" fontSize="11" fontFamily="sans-serif">
                    Lomas del Río
                  </text>
                </g>
                <g transform="translate(320, 200)">
                  <circle r="6" fill="#10263D" stroke="#38536B" strokeWidth="2" />
                  <text x="12" y="4" fill="#AABAC8" fontSize="11" fontFamily="sans-serif">
                    El Cazadero
                  </text>
                </g>
                <g transform="translate(760, 420)">
                  <circle r="6" fill="#10263D" stroke="#38536B" strokeWidth="2" />
                  <text x="12" y="4" fill="#AABAC8" fontSize="11" fontFamily="sans-serif">
                    El Torreón
                  </text>
                </g>

                {/* Batallón de Infantería Garrison */}
                <g transform="translate(480, 320)">
                  <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#10263D" stroke="#2378C3" strokeWidth="2" />
                  <circle r="28" fill="none" stroke="#2378C3" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
                  <text x="0" y="5" textAnchor="middle" fill="#39BCE5" fontSize="13" fontWeight="bold">BI</text>
                  <text x="0" y="-24" textAnchor="middle" fill="#F1F5F8" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                    Batallón de Infantería
                  </text>
                  <text x="0" y="32" textAnchor="middle" fill="#AABAC8" fontSize="9" fontFamily="monospace">
                    MILITARY GARRISON & CMOC
                  </text>
                </g>

                {/* Threat Network Checkpoint Zone */}
                {showCyberEWZones && (
                  <g transform="translate(290, 390)">
                    <circle r="45" fill="#E34B4B" fillOpacity="0.12" stroke="#E34B4B" strokeWidth="1.5" strokeDasharray="4,4" />
                    <text x="0" y="-50" textAnchor="middle" fill="#E34B4B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      THREAT NETWORK CHECKPOINT CONTESTED ZONE
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* THEATER 2: AO GRIFFIN (USCENTCOM - TIGRIS VALLEY INFRASTRUCTURE NODES) */}
            {activeTheater === 'AO_GRIFFIN_CENTCOM' && (
              <g id="aoGriffinTerrain">
                <text x="25" y="30" fill="#AABAC8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  AO GRIFFIN (USCENTCOM) // TIGRIS RIVER VALLEY // 38T LN 2000 8000
                </text>

                {/* River Tigris */}
                <path
                  d="M 520,0 C 530,120 480,240 540,360 C 580,440 600,520 570,650"
                  fill="none"
                  stroke="#173653"
                  strokeWidth="24"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                />
                <path
                  d="M 520,0 C 530,120 480,240 540,360 C 580,440 600,520 570,650"
                  fill="none"
                  stroke="#38536B"
                  strokeWidth="2"
                  strokeOpacity="0.7"
                />

                {/* Infrastructure Dependency Links */}
                <g stroke="#38536B" strokeWidth="1" strokeDasharray="4,2">
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
                          stroke={ent.status === 'Degraded' || dep.status === 'Degraded' ? '#FFBE2E' : '#38536B'}
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
                        setIsInspectorCollapsed(false);
                        setInspectorTab('NODE');
                      }}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      {isSelected && (
                        <circle r="26" fill="none" stroke="#2378C3" strokeWidth="2.5" strokeDasharray="4,2" />
                      )}
                      <circle
                        r="15"
                        fill="#10263D"
                        stroke={
                          ent.status === 'Operational'
                            ? '#42BFA5'
                            : ent.status === 'Degraded'
                            ? '#FFBE2E'
                            : '#E34B4B'
                        }
                        strokeWidth="2"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#F1F5F8"
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
                        fill="#071525"
                        fillOpacity="0.9"
                        stroke="#38536B"
                        strokeWidth="0.5"
                      />
                      <text
                        x="0"
                        y="31"
                        textAnchor="middle"
                        fill="#F1F5F8"
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
                  stroke="#173653"
                  strokeWidth="28"
                  strokeOpacity="0.4"
                />

                {/* Darién Jungle Trail */}
                <path
                  d="M 280,340 C 440,320 580,360 740,410 C 840,440 920,470 960,490"
                  fill="none"
                  stroke="#38536B"
                  strokeWidth="4"
                  strokeDasharray="6,4"
                  strokeOpacity="0.6"
                />

                {/* Reception Nodes */}
                <g transform="translate(280, 340)">
                  <circle r="7" fill="#10263D" stroke="#39BCE5" strokeWidth="2" />
                  <text x="14" y="4" fill="#F1F5F8" fontSize="11" fontWeight="bold">Necoclí Boat Embankment</text>
                </g>
                <g transform="translate(560, 360)">
                  <circle r="7" fill="#10263D" stroke="#FFBE2E" strokeWidth="2" />
                  <text x="14" y="4" fill="#F1F5F8" fontSize="11" fontWeight="bold">Acandí Trailhead</text>
                </g>
                <g transform="translate(820, 430)">
                  <circle r="7" fill="#10263D" stroke="#42BFA5" strokeWidth="2" />
                  <text x="14" y="4" fill="#F1F5F8" fontSize="11" fontWeight="bold">Bajo Chiquito Reception Shelter</text>
                </g>
              </g>
            )}

            {/* THEATER 4: SUWALKI GAP (USEUCOM - POLAND-LITHUANIA BORDER) */}
            {activeTheater === 'SUWALKI_EUCOM' && (
              <g id="suwalkiTerrain">
                <text x="25" y="30" fill="#AABAC8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  SUWALKI CORRIDOR (USEUCOM) // LAT: 54.103°N, LON: 22.930°E // NATO ARTICLE 3 CORRIDOR
                </text>
                <text x="730" y="30" fill="#2378C3" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  HYBRID DEFENSE & MOBILITY AXIS
                </text>

                {/* International Border Line */}
                <line x1="200" y1="120" x2="820" y2="540" stroke="#38536B" strokeWidth="3" strokeDasharray="10,5" strokeOpacity="0.7" />

                {/* Rail Baltica Logistic Axis */}
                <line x1="150" y1="580" x2="880" y2="100" stroke="#38536B" strokeWidth="4" strokeOpacity="0.4" />

                {/* Suwalki City & Logistics Hub */}
                <g transform="translate(480, 320)">
                  <rect x="-14" y="-14" width="28" height="28" rx="3" fill="#10263D" stroke="#2378C3" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#39BCE5" fontSize="11" fontWeight="bold">SG</text>
                  <text x="0" y="-20" textAnchor="middle" fill="#F1F5F8" fontSize="12" fontWeight="bold">Suwalki Logistics Hub</text>
                </g>
                <g transform="translate(740, 480)">
                  <circle r="7" fill="#10263D" stroke="#42BFA5" strokeWidth="2" />
                  <text x="12" y="4" fill="#AABAC8" fontSize="11" fontWeight="bold">Kaliningrad Flank Sensor</text>
                </g>
              </g>
            )}

            {/* THEATER 5: LUZON STRAIT (USINDOPACOM - BATANES / PHILIPPINES) */}
            {activeTheater === 'LUZON_INDOPACOM' && (
              <g id="luzonTerrain">
                <text x="25" y="30" fill="#AABAC8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  LUZON STRAIT ARC (USINDOPACOM) // LAT: 20.448°N, LON: 121.970°E // FIRST ISLAND CHAIN
                </text>
                <text x="730" y="30" fill="#9D5BD2" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  GRAY-ZONE MARITIME & SLOC AXIS
                </text>

                {/* Island Outposts */}
                <g transform="translate(380, 240)">
                  <ellipse rx="35" ry="18" fill="#10263D" stroke="#38536B" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#F1F5F8" fontSize="10" fontWeight="bold">Itbayat Atoll</text>
                </g>
                <g transform="translate(540, 360)">
                  <ellipse rx="45" ry="24" fill="#10263D" stroke="#38536B" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#F1F5F8" fontSize="11" fontWeight="bold">Batanes Island Station</text>
                </g>

                {/* Subsea Cable Route */}
                <path d="M 120,480 C 350,420 540,360 880,260" fill="none" stroke="#FFBE2E" strokeWidth="2.5" strokeDasharray="6,3" />
                <text x="680" y="290" fill="#FFBE2E" fontSize="9" fontFamily="monospace">SUBSEA FIBER-OPTIC ARTERY</text>
              </g>
            )}

            {/* THEATER 6: SAHEL (USAFRICOM - LIPTAKO-GOURMA) */}
            {activeTheater === 'SAHEL_AFRICOM' && (
              <g id="sahelTerrain">
                <text x="25" y="30" fill="#AABAC8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  LIPTAKO-GOURMA TRI-BORDER (USAFRICOM) // LAT: 13.513°N, LON: 2.115°E
                </text>
                <text x="740" y="30" fill="#FFBE2E" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  COUNTER-VEO & DROUGHT RESILIENCE
                </text>

                {/* River Niger Bend */}
                <path d="M 150,600 C 350,540 520,420 680,220 C 760,120 820,40 850,0" fill="none" stroke="#173653" strokeWidth="18" strokeOpacity="0.4" />
                <path d="M 150,600 C 350,540 520,420 680,220 C 760,120 820,40 850,0" fill="none" stroke="#38536B" strokeWidth="2" strokeOpacity="0.7" />

                {/* Tri-Border Marker */}
                <g transform="translate(490, 330)">
                  <polygon points="0,-18 16,12 -16,12" fill="#10263D" stroke="#FFBE2E" strokeWidth="2" />
                  <text x="0" y="28" textAnchor="middle" fill="#F1F5F8" fontSize="11" fontWeight="bold">Liptako-Gourma Junction</text>
                </g>
                <g transform="translate(720, 200)">
                  <circle r="8" fill="#10263D" stroke="#42BFA5" strokeWidth="2" />
                  <text x="14" y="4" fill="#F1F5F8" fontSize="11" fontWeight="bold">Gao Solar Water Well Node</text>
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
                        setIsInspectorCollapsed(false);
                        setInspectorTab('INDICATOR');
                      }}
                      className="cursor-pointer transition-transform hover:scale-150"
                    >
                      {isSelected && (
                        <circle r="9" fill="none" stroke="#2378C3" strokeWidth="2" />
                      )}
                      <circle
                        r={isSelected ? 6 : 4}
                        fill={pt.color}
                        fillOpacity={0.9}
                        stroke="#071525"
                        strokeWidth="0.75"
                      />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>

          {/* Bottom Left Legend Box */}
          <div className="absolute bottom-3 left-3 bg-slate-900 border border-slate-700 rounded p-3 text-[11px] max-w-sm shadow-2xl z-10 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1 font-mono font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Layers className="w-3.5 h-3.5" />
                <span>{selectedIndicator ? selectedIndicator.name.toUpperCase() : 'MAP LAYERS'}</span>
              </span>
              <span className="text-[10px] text-slate-400">
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

      {/* Right Intelligence / Civil Assessment Inspector: Collapsible (leaving ~75% for Operational Picture) */}
      {!isInspectorCollapsed ? (
        <div className="w-full lg:w-[26%] xl:w-[25%] min-w-[310px] max-w-[420px] bg-black border-t lg:border-t-0 lg:border-l border-slate-700 flex flex-col shadow-2xl shrink-0 overflow-y-auto z-20">
          {/* Inspector Header & Mode Switcher */}
          <div className="p-2.5 bg-black border-b border-slate-700 flex items-center justify-between gap-1.5">
            <div className="flex items-center space-x-1 font-mono text-xs overflow-x-auto scrollbar-none">
              <button
                onClick={() => setInspectorTab('INDICATOR')}
                className={`px-2 py-1 rounded transition-colors font-bold whitespace-nowrap text-[11px] ${
                  inspectorTab === 'INDICATOR'
                    ? 'bg-neutral-900 text-white border border-blue-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Indicator Intel ({currentTheaterConfig.acronym})
              </button>
              <button
                onClick={() => setInspectorTab('NODE')}
                className={`px-2 py-1 rounded transition-colors font-bold whitespace-nowrap text-[11px] ${
                  inspectorTab === 'NODE'
                    ? 'bg-neutral-900 text-white border border-blue-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Civil Infra
              </button>
            </div>

            <button
              onClick={() => setIsInspectorCollapsed(true)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-neutral-900 transition-colors shrink-0 flex items-center gap-0.5"
              title="Collapse Inspector (Focus 75%+ Visual Emphasis on Operational Picture)"
            >
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">COLLAPSE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        {/* Tab 1: Indicator Intelligence Analysis */}
        {inspectorTab === 'INDICATOR' && selectedIndicator && (
          <div className="p-4 space-y-4 text-xs font-sans">
            {/* Indicator Card */}
            <div className="space-y-1.5 border-b border-slate-700 pb-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedIndicator.domain}
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {currentTheaterConfig.acronym} // ADP 3-13
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {selectedIndicator.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedIndicator.description}
              </p>
            </div>

            {/* Doctrinal Crosswalk Mappings */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-700">
                <span className="text-slate-400 text-[10px] block">PMESII DIMENSION</span>
                <span className="font-bold text-cyan-400">{selectedIndicator.pmesii}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-700">
                <span className="text-slate-400 text-[10px] block">ASCOPE CATEGORY</span>
                <span className="font-bold text-slate-200">{selectedIndicator.ascope}</span>
              </div>
            </div>

            {/* Sentiment & Telemetry Breakdown Bars for this AOR */}
            {aorIndicatorDetail && (
              <div className="space-y-2 bg-slate-950 p-3 rounded border border-slate-700">
                <div className="flex items-center justify-between text-[11px] font-mono font-semibold">
                  <span className="text-slate-300">{currentTheaterConfig.acronym} SURVEY SHARES:</span>
                  <span className="text-cyan-400 font-bold">{aorIndicatorDetail.keyMetric}</span>
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
              <div className="p-3 bg-slate-950 border border-slate-700 rounded space-y-1.5 text-xs">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Civil Affairs Strategic Implication ({currentTheaterConfig.acronym})
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {aorIndicatorDetail.strategicImplication}
                </p>
              </div>
            )}

            {/* Selected Point Telemetry Details */}
            {selectedPoint && (
              <div className="p-3 bg-slate-950 rounded border border-slate-700 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                  <span className="text-slate-400 text-[10px]">SELECTED TELEMETRY SAMPLE</span>
                  <span className="text-teal-400 font-bold text-[10px]">{selectedPoint.confidence}% CONFIDENCE</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">LOCATION:</span>
                    <span className="text-slate-200 font-semibold">{selectedPoint.locationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">COORDINATES:</span>
                    <span className="text-cyan-400">{selectedPoint.lat}°N, {selectedPoint.lng}°W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">OBSERVED VALUE:</span>
                    <span className="font-bold" style={{ color: selectedPoint.color }}>
                      {selectedPoint.value}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">COHORT METHOD:</span>
                    <span className="text-slate-300">{selectedPoint.sampleCohort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SAMPLE SIZE:</span>
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
                <div className="border-b border-slate-700 pb-3">
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
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-700">
                    <span className="text-slate-400 font-mono block text-[10px]">ASCOPE CLASS</span>
                    <span className="font-semibold text-slate-200">{selectedEntity.ascope}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-700">
                    <span className="text-slate-400 font-mono block text-[10px]">PMESII SECTOR</span>
                    <span className="font-semibold text-cyan-400">{selectedEntity.pmesii}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Civil Assessment & Situation</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-700">
                    {selectedEntity.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700 space-y-2">
                  <button
                    onClick={() =>
                      onUpdateEntityStatus(
                        selectedEntity.id,
                        selectedEntity.status === 'Operational' ? 'Degraded' : 'Operational'
                      )
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-medium text-xs border border-slate-700 text-center transition-colors cursor-pointer"
                  >
                    Toggle Operational Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <Layers className="w-12 h-12 text-slate-600 mb-3" />
                <h4 className="text-sm font-semibold text-slate-300">No Civil Node Selected</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Select any civil facility on the map or switch to Indicator Intelligence mode to view the 36 information layers for this theater.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      /* Sleek Collapsed Inspector Rail on Right Edge */
      <div
        onClick={() => setIsInspectorCollapsed(false)}
        className="w-11 bg-black border-l border-slate-700 flex flex-col items-center py-3 select-none cursor-pointer hover:bg-neutral-900 transition-colors z-20 shrink-0 group"
        title="Expand Intelligence / Civil Assessment Inspector"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsInspectorCollapsed(false);
          }}
          className="p-1.5 rounded bg-black hover:bg-neutral-900 text-cyan-400 border border-slate-700 mb-4 transition-transform group-hover:scale-110"
          title="Expand Inspector"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-cyan-300 uppercase whitespace-nowrap flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400 -rotate-90 inline-block" />
            <span>Intelligence & Civil Assessment Inspector</span>
          </span>
        </div>

        <div className="mt-auto flex flex-col items-center gap-1.5 pt-3 border-t border-slate-800 text-center">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" title="Feed Online" />
          <span className="text-[9px] font-mono text-slate-400">{currentTheaterConfig.acronym}</span>
        </div>
      </div>
    )}
  </div>
);
};
