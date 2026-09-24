import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Globe, 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Target, 
  Activity, 
  Layers, 
  Search, 
  Maximize2, 
  ArrowRight,
  RefreshCw,
  Compass,
  Eye,
  CheckCircle2,
  Anchor,
  Sparkles,
  Info,
  RadioTower,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Key,
  X
} from 'lucide-react';
import { 
  COMBATANT_COMMANDS, 
  STRATEGIC_CHOKEPOINTS, 
  CombatantCommandAOR, 
  StrategicChokepoint 
} from '../data/aorData';
import { IndicatorCategorySelector } from './IndicatorCategorySelector';
import { 
  ALL_INFORMATION_INDICATORS, 
  InformationIndicator, 
  IndicatorDataPoint,
  AorId,
  getPointsForAor,
  getAorIndicatorSummary 
} from '../data/indicatorLayers';

interface GlobalAorWorldMapProps {
  onNavigateToTacticalCop?: (aoName?: string, aorId?: string) => void;
  onNavigateToIoWorkspace?: (aorAcronym: string) => void;
}

type MapTileProvider = 'dark' | 'streets' | 'satellite' | 'osm';

export const GlobalAorWorldMap: React.FC<GlobalAorWorldMapProps> = ({
  onNavigateToTacticalCop,
  onNavigateToIoWorkspace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<{ [aorId: string]: L.Polygon }>({});
  const polygonGroupRef = useRef<L.LayerGroup | null>(null);
  const markerLayersRef = useRef<L.LayerGroup | null>(null);
  const chokepointsGroupRef = useRef<L.LayerGroup | null>(null);
  const indicatorLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);

  // AOR Selection State
  const [selectedAorId, setSelectedAorId] = useState<string>('aor-northcom');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tileProvider, setTileProvider] = useState<MapTileProvider>('dark');
  const [showAorOutlines, setShowAorOutlines] = useState<boolean>(false);
  const [showChokepoints, setShowChokepoints] = useState<boolean>(true);
  const [showHqMarkers, setShowHqMarkers] = useState<boolean>(true);
  const [showTacticalAoPin, setShowTacticalAoPin] = useState<boolean>(true);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [reloadNotice, setReloadNotice] = useState<string | null>(null);

  // 36 Information Indicator State across all AORs
  const [selectedIndicator, setSelectedIndicator] = useState<InformationIndicator | null>(
    ALL_INFORMATION_INDICATORS[0] // Adversary & Threat Narratives
  );
  const [showIndicatorPoints, setShowIndicatorPoints] = useState<boolean>(true);
  const [filterIndicatorToSelectedAor, setFilterIndicatorToSelectedAor] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<IndicatorDataPoint | null>(null);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState<boolean>(false);
  const [showKeyInfoModal, setShowKeyInfoModal] = useState<boolean>(false);

  // Invalidate map size when inspector collapses or expands
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [isInspectorCollapsed]);

  // Handle ResizeObserver to prevent gray/unloaded tile areas
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Multi-tier mount sizing
  useEffect(() => {
    const t1 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
    const t2 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 350);
    const t3 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const selectedAor =
    COMBATANT_COMMANDS.find((a) => a.id === selectedAorId) || COMBATANT_COMMANDS[0];

  // Tile layer URLs
  const tileLayersConfig = {
    dark: {
      name: 'Carto Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      labels: null,
    },
    streets: {
      name: 'Street Grid',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Sources: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom',
      labels: null,
    },
    satellite: {
      name: 'Satellite Recon',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &copy; Maxar, Earthstar Geographics',
      labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    },
    osm: {
      name: 'Tactical Topo',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      labels: null,
    },
  };

  const handleReloadMap = () => {
    setIsReloading(true);
    setReloadNotice('Synchronizing map tiles & coordinates...');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      tileLayerRef.current?.redraw();
      if (labelsLayerRef.current) {
        labelsLayerRef.current.redraw();
      }
    }
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
      setIsReloading(false);
      setReloadNotice('Map synchronized (WGS84 // EPSG:3857)');
      setTimeout(() => setReloadNotice(null), 3000);
    }, 450);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2.3,
      minZoom: 1.8,
      maxZoom: 11,
      zoomControl: false,
      worldCopyJump: true,
      maxBounds: [
        [-85, -190],
        [85, 190],
      ],
    });

    // Custom Zoom Control top-right
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map);

    // Initial Base Tile Layer
    const config = tileLayersConfig[tileProvider];
    const baseTile = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);
    tileLayerRef.current = baseTile;

    if (config.labels) {
      const labelsTile = L.tileLayer(config.labels, {
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);
      labelsLayerRef.current = labelsTile;
    }

    // Layer groups for markers
    markerLayersRef.current = L.layerGroup().addTo(map);
    chokepointsGroupRef.current = L.layerGroup().addTo(map);
    indicatorLayerGroupRef.current = L.layerGroup().addTo(map);

    // Layer group for AOR Polygons (kept off map by default to remove outline boxes)
    const polygonGroup = L.layerGroup();
    polygonGroupRef.current = polygonGroup;
    if (showAorOutlines) {
      polygonGroup.addTo(map);
    }

    // Render AOR Polygons
    const polygons: { [aorId: string]: L.Polygon } = {};

    COMBATANT_COMMANDS.forEach((cmd) => {
      const isSelected = cmd.id === selectedAorId;

      const polygon = L.polygon(cmd.realPolygon, {
        color: cmd.colorTheme.stroke,
        weight: isSelected ? 3.5 : 1.8,
        dashArray: isSelected ? undefined : '6, 5',
        fillColor: cmd.colorTheme.stroke,
        fillOpacity: isSelected ? 0.28 : 0.12,
        className: `aor-poly-${cmd.id}`,
      }).addTo(polygonGroup);

      // Tooltip
      polygon.bindTooltip(
        `<div class="p-1 font-mono text-xs bg-slate-950 text-white border border-slate-700 rounded shadow-lg">
          <div class="font-bold" style="color: ${cmd.colorTheme.stroke}">${cmd.acronym}</div>
          <div class="text-[10px] text-slate-300">${cmd.name}</div>
          <div class="text-[9px] text-emerald-400 font-mono">Assigned: ${cmd.assignedCivilAffairsUnits.primaryCacom}</div>
        </div>`,
        { sticky: true, opacity: 0.95 }
      );

      polygon.on('click', () => {
        setSelectedAorId(cmd.id);
        map.flyTo(cmd.realCenter, cmd.zoomLevel, { duration: 1.2 });
      });

      polygon.on('mouseover', () => {
        if (cmd.id !== selectedAorId) {
          polygon.setStyle({
            weight: 2.5,
            fillOpacity: 0.22,
          });
        }
      });

      polygon.on('mouseout', () => {
        if (cmd.id !== selectedAorId) {
          polygon.setStyle({
            weight: 1.8,
            fillOpacity: 0.12,
          });
        }
      });

      polygons[cmd.id] = polygon;
    });

    polygonLayersRef.current = polygons;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

  // Handle Tile Provider Change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    if (labelsLayerRef.current) {
      map.removeLayer(labelsLayerRef.current);
      labelsLayerRef.current = null;
    }

    const config = tileLayersConfig[tileProvider];
    const newBase = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);
    tileLayerRef.current = newBase;

    if (config.labels) {
      const newLabels = L.tileLayer(config.labels, {
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);
      labelsLayerRef.current = newLabels;
    }

    Object.values(polygonLayersRef.current).forEach((poly) => poly.bringToFront());
  }, [tileProvider]);

  // Handle AOR Outlines Visibility and Styling
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonGroupRef.current) return;

    if (showAorOutlines) {
      if (!mapInstanceRef.current.hasLayer(polygonGroupRef.current)) {
        polygonGroupRef.current.addTo(mapInstanceRef.current);
      }
      Object.entries(polygonLayersRef.current).forEach(([aorId, poly]) => {
        const isSelected = aorId === selectedAorId;
        poly.setStyle({
          weight: isSelected ? 3.5 : 1.8,
          dashArray: isSelected ? undefined : '6, 5',
          fillOpacity: isSelected ? 0.28 : 0.12,
        });
        if (isSelected) {
          poly.bringToFront();
        }
      });
    } else {
      if (mapInstanceRef.current.hasLayer(polygonGroupRef.current)) {
        mapInstanceRef.current.removeLayer(polygonGroupRef.current);
      }
    }
  }, [selectedAorId, showAorOutlines]);

  // Render Tactical Markers, Chokepoints, and HQ Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !markerLayersRef.current || !chokepointsGroupRef.current) return;

    markerLayersRef.current.clearLayers();
    chokepointsGroupRef.current.clearLayers();

    // 1. AOR Central Nameplate Badges (borderless sleek badge without outline box)
    COMBATANT_COMMANDS.forEach((cmd) => {
      const isSelected = cmd.id === selectedAorId;
      const html = `
        <div class="cursor-pointer select-none transition-transform hover:scale-110" style="transform: translate(-50%, -50%);">
          <div class="px-2.5 py-1 rounded font-mono font-bold text-[11px] flex items-center gap-1.5 whitespace-nowrap shadow-md ${
            isSelected
              ? 'bg-blue-600 text-white shadow-xl ring-2 ring-blue-400'
              : 'bg-black/90 text-slate-200'
          }">
            <span class="w-2 h-2 rounded-full" style="background-color: ${cmd.colorTheme.stroke};"></span>
            <span>${cmd.acronym}</span>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html,
        className: 'aor-center-icon',
        iconSize: [0, 0],
      });

      const marker = L.marker(cmd.realCenter, { icon });
      marker.on('click', () => {
        setSelectedAorId(cmd.id);
        mapInstanceRef.current?.flyTo(cmd.realCenter, cmd.zoomLevel, { duration: 1.2 });
      });
      marker.addTo(markerLayersRef.current!);
    });

    // 2. Headquarter Pins
    if (showHqMarkers) {
      COMBATANT_COMMANDS.forEach((cmd) => {
        const hqCoords: [number, number] = [cmd.hqCoordinates.lat, cmd.hqCoordinates.lng];
        const hqHtml = `
          <div class="cursor-pointer group select-none" style="transform: translate(-50%, -50%);">
            <div class="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center group-hover:scale-125 transition-transform">
              <div class="w-1 h-1 rounded-full bg-white"></div>
            </div>
          </div>
        `;
        const hqIcon = L.divIcon({
          html: hqHtml,
          className: 'hq-marker-pin',
          iconSize: [0, 0],
        });

        const hqMarker = L.marker(hqCoords, { icon: hqIcon });
        hqMarker.bindTooltip(
          `<div class="p-1 font-mono text-xs bg-slate-950 text-white border border-blue-500 rounded">
            <div class="font-bold text-blue-400">${cmd.acronym} HQ</div>
            <div class="text-[10px] text-slate-300">${cmd.hqLocation}</div>
          </div>`,
          { direction: 'top', offset: [0, -6] }
        );

        hqMarker.addTo(markerLayersRef.current!);
      });
    }

    // 3. Active Tactical COP Pins across ALL 6 Combatant Commands
    if (showTacticalAoPin) {
      COMBATANT_COMMANDS.forEach((cmd) => {
        if (!cmd.linkedTacticalAo) return;

        const aoCoords: [number, number] = cmd.linkedTacticalAo.coordinates;
        const isSelected = cmd.id === selectedAorId;

        const aoHtml = `
          <div class="relative flex items-center justify-center cursor-pointer select-none" style="transform: translate(-50%, -50%);">
            <div class="absolute w-7 h-7 rounded-full bg-emerald-500/30 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div class="absolute left-5 top-[-10px] whitespace-nowrap bg-emerald-950/95 border border-emerald-500 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-lg flex items-center gap-1 ${
              isSelected ? 'ring-2 ring-emerald-400 scale-105' : ''
            }">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ${cmd.acronym} COP
            </div>
          </div>
        `;
        const aoIcon = L.divIcon({
          html: aoHtml,
          className: 'tactical-cop-pin',
          iconSize: [0, 0],
        });

        const aoMarker = L.marker(aoCoords, { icon: aoIcon });
        aoMarker.bindPopup(
          `<div class="p-2 font-mono text-xs bg-slate-950 text-slate-100 border border-emerald-500 rounded max-w-xs">
            <div class="font-bold text-emerald-400 flex items-center gap-1 mb-1">
              <span>${cmd.linkedTacticalAo.name}</span>
            </div>
            <div class="text-[11px] text-slate-300 mb-2">
              ${cmd.linkedTacticalAo.description}
            </div>
            <div class="text-[10px] text-slate-400 font-mono">CCMD: ${cmd.acronym} // CACOM: ${cmd.assignedCivilAffairsUnits.primaryCacom}</div>
          </div>`
        );

        aoMarker.on('click', () => {
          setSelectedAorId(cmd.id);
        });

        aoMarker.addTo(markerLayersRef.current!);
      });
    }

    // 4. Strategic Maritime Chokepoints
    if (showChokepoints) {
      STRATEGIC_CHOKEPOINTS.forEach((cp) => {
        const isCrit = cp.threat === 'CRITICAL';
        const isHigh = cp.threat === 'HIGH';
        const color = isCrit ? '#ef4444' : isHigh ? '#f59e0b' : '#38bdf8';

        const cpHtml = `
          <div class="cursor-pointer" style="transform: translate(-50%, -50%);">
            <div class="w-3 h-3 rotate-45 border border-slate-900 shadow-md" style="background-color: ${color};"></div>
          </div>
        `;
        const cpIcon = L.divIcon({
          html: cpHtml,
          className: 'chokepoint-pin',
          iconSize: [0, 0],
        });

        const cpMarker = L.marker(cp.coordinates, { icon: cpIcon });
        cpMarker.bindTooltip(
          `<div class="p-1 font-mono text-xs bg-slate-950 text-white border border-slate-700 rounded max-w-xs">
            <div class="font-bold" style="color: ${color}">${cp.name}</div>
            <div class="text-[10px] text-slate-400 font-mono">${cp.aor} | THREAT: ${cp.threat}</div>
            <div class="text-[10px] text-slate-300 mt-1">${cp.description}</div>
          </div>`,
          { direction: 'top', offset: [0, -6] }
        );

        cpMarker.addTo(chokepointsGroupRef.current!);
      });
    }
  }, [selectedAorId, showHqMarkers, showTacticalAoPin, showChokepoints]);

  // Render Multi-AOR Indicator Point Cloud on the World Map
  useEffect(() => {
    if (!mapInstanceRef.current || !indicatorLayerGroupRef.current) return;

    indicatorLayerGroupRef.current.clearLayers();

    if (!showIndicatorPoints || !selectedIndicator) return;

    // Filter points either globally across all 6 AORs or for the selected AOR
    const pointsToPlot = filterIndicatorToSelectedAor
      ? getPointsForAor(selectedIndicator, selectedAorId as AorId)
      : selectedIndicator.dataPoints;

    pointsToPlot.forEach((pt) => {
      const isSelected = selectedPoint?.id === pt.id;

      const circle = L.circleMarker([pt.lat, pt.lng], {
        radius: isSelected ? 8 : 5.5,
        fillColor: pt.color,
        fillOpacity: 0.88,
        color: isSelected ? '#ffffff' : '#020617',
        weight: isSelected ? 2.5 : 1,
      });

      // Rich Telemetry Tooltip & Popup
      circle.bindTooltip(
        `<div class="p-1 font-mono text-xs bg-slate-950 text-slate-100 border border-slate-700 rounded shadow-lg max-w-xs">
          <div class="font-bold flex items-center justify-between gap-2" style="color: ${pt.color}">
            <span>${selectedIndicator.name}</span>
            <span class="text-[10px] text-slate-400 font-mono">${pt.aorName}</span>
          </div>
          <div class="text-[11px] text-white font-semibold mt-0.5">${pt.locationName}</div>
          <div class="text-[10px] text-slate-300 mt-0.5">Value: <span class="font-bold" style="color: ${pt.color}">${pt.value}</span></div>
          <div class="text-[9px] text-emerald-400 font-mono mt-0.5">Confidence: ${pt.confidence}% | Sample: n=${pt.sampleSize}</div>
        </div>`,
        { direction: 'top', offset: [0, -4] }
      );

      circle.on('click', () => {
        setSelectedPoint(pt);
        setSelectedAorId(pt.aorId);
      });

      circle.addTo(indicatorLayerGroupRef.current!);
    });
  }, [
    selectedIndicator,
    showIndicatorPoints,
    filterIndicatorToSelectedAor,
    selectedAorId,
    selectedPoint,
  ]);

  // Quick Action: Select AOR from Ribbon
  const handleSelectAor = (cmd: CombatantCommandAOR) => {
    setSelectedAorId(cmd.id);
    mapInstanceRef.current?.flyTo(cmd.realCenter, cmd.zoomLevel, { duration: 1.2 });
  };

  // Fly to Tactical AO
  const handleFlyToTacticalAo = () => {
    if (!mapInstanceRef.current || !selectedAor.linkedTacticalAo) return;
    mapInstanceRef.current.flyTo(selectedAor.linkedTacticalAo.coordinates, 8, { duration: 1.5 });
  };

  // Reset to Full World Projection
  const handleResetWorldView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([20, 0], 2.2, { duration: 1.2 });
  };

  // Indicator summary for currently selected AOR
  const currentAorIndicatorSummary = selectedIndicator
    ? getAorIndicatorSummary(selectedIndicator, selectedAorId as AorId)
    : null;

  const pointsInSelectedAorCount = selectedIndicator
    ? getPointsForAor(selectedIndicator, selectedAorId as AorId).length
    : 0;

  return (
    <div className="flex flex-col h-full flex-1 bg-black text-slate-100 overflow-hidden">
      {/* Top Header & Indicator Selection Bar */}
      <div className="p-3 bg-black border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Global Geographic Combatant Command (AOR) Map
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700">
                ALL 6 CCMDs SYNCHRONIZED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              36 Information Indicators across all 6 Combatant Command AORs with geolocated survey telemetry.
            </p>
          </div>
        </div>

        {/* Global Controls & Indicator Category Selector */}
        <div className="flex items-center space-x-2 flex-wrap text-xs">
          {/* Indicator Category Dropdown applied to ALL AORs */}
          <IndicatorCategorySelector
            selectedIndicatorId={selectedIndicator?.id || null}
            onSelectIndicator={(ind) => {
              setSelectedIndicator(ind);
              if (ind) {
                const aorPts = getPointsForAor(ind, selectedAorId as AorId);
                setSelectedPoint(aorPts[0] || ind.dataPoints[0] || null);
              }
            }}
          />

          {/* Scope Toggle: All AORs vs Selected AOR */}
          <button
            onClick={() => setFilterIndicatorToSelectedAor(!filterIndicatorToSelectedAor)}
            className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors flex items-center gap-1.5 ${
              filterIndicatorToSelectedAor
                ? 'bg-purple-950 border-purple-600 text-purple-300'
                : 'bg-black border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle between displaying survey dots across all 6 AORs or only in active AOR"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{filterIndicatorToSelectedAor ? `Filter: ${selectedAor.acronym}` : 'Scope: All 6 AORs'}</span>
          </button>

          {/* Toggle AOR Boundary Outlines */}
          <label 
            className="flex items-center space-x-1.5 bg-black border border-slate-800 px-2 py-1 rounded cursor-pointer text-xs font-mono"
            title="AOR boundary outline boxes (off by default)"
          >
            <input
              type="checkbox"
              checked={showAorOutlines}
              onChange={(e) => setShowAorOutlines(e.target.checked)}
              className="accent-blue-600 rounded"
            />
            <span className={showAorOutlines ? 'text-cyan-300' : 'text-slate-400'}>
              AOR Outlines: {showAorOutlines ? 'ON' : 'OFF'}
            </span>
          </label>

          {/* Toggle Survey Dots */}
          <label className="flex items-center space-x-1.5 bg-black border border-slate-800 px-2 py-1 rounded cursor-pointer text-xs font-mono">
            <input
              type="checkbox"
              checked={showIndicatorPoints}
              onChange={(e) => setShowIndicatorPoints(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span className="text-amber-300">
              Telemetry ({filterIndicatorToSelectedAor ? pointsInSelectedAorCount : selectedIndicator?.dataPoints.length || 0})
            </span>
          </label>

          {/* Map Layer Switcher */}
          <div className="bg-black border border-slate-800 rounded p-0.5 flex items-center font-mono">
            <button
              onClick={() => setTileProvider('dark')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                tileProvider === 'dark'
                  ? 'bg-slate-800 text-blue-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setTileProvider('streets')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                tileProvider === 'streets'
                  ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Global Street & Road Cartography"
            >
              Streets
            </button>
            <button
              onClick={() => setTileProvider('satellite')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                tileProvider === 'satellite'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sat
            </button>
            <button
              onClick={() => setTileProvider('osm')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                tileProvider === 'osm'
                  ? 'bg-slate-800 text-emerald-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OSM
            </button>
          </div>

          {/* Dedicated Reload Map Button */}
          <button
            onClick={handleReloadMap}
            disabled={isReloading}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all border cursor-pointer ${
              isReloading
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 animate-pulse'
                : 'bg-black hover:bg-neutral-900 text-cyan-300 hover:text-cyan-200 border-slate-700 shadow-sm'
            }`}
            title="Reload map canvas, recalculate viewport bounds, and refresh GIS tiles"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
            <span className="font-bold">{isReloading ? 'RELOADING...' : 'RELOAD MAP'}</span>
          </button>

          {/* GIS & API Key Status Guide Button */}
          <button
            onClick={() => setShowKeyInfoModal(true)}
            className="px-2.5 py-1 bg-black hover:bg-neutral-900 border border-slate-700 text-slate-300 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View API Key & Cartography Engine Status Guide"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xl:inline text-slate-200">GIS: READY</span>
            <Info className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={handleResetWorldView}
            className="px-2.5 py-1 bg-black hover:bg-neutral-900 border border-slate-800 text-slate-300 rounded text-xs font-mono flex items-center gap-1 transition-colors"
            title="Reset to Full World Projection"
          >
            <span className="hidden sm:inline">Reset View</span>
          </button>

          {/* Inspector Collapsible Toggle */}
          <button
            onClick={() => setIsInspectorCollapsed(!isInspectorCollapsed)}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors font-mono cursor-pointer text-xs border ${
              isInspectorCollapsed
                ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-sm'
                : 'bg-black hover:bg-neutral-900 text-slate-300 border-slate-800'
            }`}
            title={isInspectorCollapsed ? 'Expand Intelligence & Civil Assessment Inspector' : 'Collapse Inspector for full-screen operational map'}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Inspector:</span>
            <span className="font-bold">{isInspectorCollapsed ? 'EXPAND' : 'COLLAPSE'}</span>
          </button>
        </div>
      </div>

      {/* Main View: Real Leaflet Map (Left) + Intelligence Drawer (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left GIS World Map Container */}
        <div className="flex-1 flex flex-col bg-black relative border-r border-slate-800 overflow-hidden min-w-0">
          {/* Quick-Switch Ribbon of all 6 Combatant Commands */}
          <div className="px-3 py-1.5 bg-black border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-mono z-10">
            <span className="text-slate-500 text-[11px] whitespace-nowrap font-bold">THEATER:</span>
            {COMBATANT_COMMANDS.map((cmd) => {
              const isSelected = selectedAorId === cmd.id;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleSelectAor(cmd)}
                  className={`px-2.5 py-1 rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md ring-1 ring-blue-400'
                      : 'bg-black border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-neutral-900'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cmd.colorTheme.stroke }}
                  ></span>
                  <span>{cmd.acronym}</span>
                  {cmd.linkedTacticalAo && (
                    <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                      COP
                    </span>
                  )}
                </button>
              );
            })}

            {/* Tactical Focus Button for Active AOR */}
            {selectedAor.linkedTacticalAo && (
              <button
                onClick={handleFlyToTacticalAo}
                className="ml-auto px-2 py-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 hover:bg-emerald-900 text-xs font-mono flex items-center gap-1 whitespace-nowrap transition-colors"
                title={`Focus tactical terrain for ${selectedAor.acronym}`}
              >
                <Crosshair className="w-3 h-3 text-emerald-400" />
                <span>Focus {selectedAor.acronym} Sector</span>
              </button>
            )}
          </div>

          {/* Leaflet Real World Map Canvas */}
          <div
            ref={mapContainerRef}
            className="flex-1 w-full h-full bg-slate-950 relative z-0"
            style={{ minHeight: '380px' }}
          />

          {/* Map Reload Notification Badge */}
          {reloadNotice && (
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/60 text-cyan-300 font-mono text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md animate-fade-in">
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-cyan-400' : 'text-emerald-400'}`} />
              <span>{reloadNotice}</span>
            </div>
          )}

          {/* Bottom Left Legend Box for Map Layers & Active Indicator */}
          <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-800 rounded-lg p-3 backdrop-blur-md text-[11px] font-mono space-y-1.5 z-10 shadow-2xl max-w-sm hidden md:block">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-300 font-bold">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Globe className="w-3.5 h-3.5" />
                <span>ALL AORs INFORMATION TELEMETRY</span>
              </span>
              <span className="text-emerald-400 text-[10px]">WGS84 // EPSG:3857</span>
            </div>

            {selectedIndicator && (
              <div className="space-y-1 text-[10px]">
                <div className="text-amber-400 font-semibold truncate">
                  ACTIVE LAYER: {selectedIndicator.name.toUpperCase()}
                </div>
                <div className="grid grid-cols-2 gap-1 text-slate-400">
                  {selectedIndicator.sentimentBreakdown.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Tactical COP Pin (All 6 AORs)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rotate-45 bg-amber-400"></span>
                <span>Chokepoint Artery</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Intelligence Inspector: Dual Information Layer & CCMD Details */}
        {!isInspectorCollapsed ? (
          <div className="w-full lg:w-[26%] xl:w-[25%] min-w-[320px] max-w-[420px] bg-black flex flex-col p-4 space-y-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-800 shadow-2xl shrink-0 z-20">
            {/* Header Card with Selected Theater Identity */}
            <div className="border-b border-slate-800 pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded text-xs font-mono font-bold"
                  style={{
                    backgroundColor: selectedAor.colorTheme.fill,
                    color: selectedAor.colorTheme.stroke,
                    border: `1px solid ${selectedAor.colorTheme.stroke}`,
                  }}
                >
                  {selectedAor.acronym}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
                      selectedAor.stabilityStatus === 'CRITICAL_DISRUPTION'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : selectedAor.stabilityStatus === 'ELEVATED_CONTEST'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : selectedAor.stabilityStatus === 'MODERATE_STRESS'
                        ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    CIVIL: {selectedAor.civilStabilityScore}/100
                  </span>

                  <button
                    onClick={() => setIsInspectorCollapsed(true)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Collapse Inspector"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            <h3 className="text-base font-bold text-white leading-snug">{selectedAor.name}</h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedAor.geographicScope}
            </p>
          </div>

          {/* ACTIVE 36-INDICATOR LAYER INTELLIGENCE FOR THIS COMBATANT COMMAND */}
          {selectedIndicator && currentAorIndicatorSummary && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  INDICATOR TELEMETRY // {selectedAor.acronym}
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {pointsInSelectedAorCount} Points in AOR
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {selectedIndicator.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Focal Sector: <span className="text-slate-200 font-semibold">{currentAorIndicatorSummary.theaterName}</span>
                </p>
              </div>

              {/* Theater Sentiment Breakdown Bars */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>THEATER BREAKDOWN:</span>
                  <span className="text-amber-400 font-bold">{currentAorIndicatorSummary.keyMetric}</span>
                </div>
                {currentAorIndicatorSummary.sentimentBreakdown.map((s, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[10.5px]">
                      <span className="text-slate-300 truncate max-w-[240px]">{s.label}</span>
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

              {/* Strategic Implication for this CCMD */}
              <div className="p-2.5 bg-amber-950/20 border border-amber-800/50 rounded-lg text-xs space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                  Civil Affairs Strategic Implication ({selectedAor.acronym}):
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {currentAorIndicatorSummary.strategicImplication}
                </p>
              </div>

              {/* Clicked Telemetry Dot Inspector */}
              {selectedPoint && selectedPoint.aorId === selectedAorId && (
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>SELECTED POINT:</span>
                    <span className="text-emerald-400 font-bold">{selectedPoint.confidence}% CONFIDENCE</span>
                  </div>
                  <div className="text-white font-sans font-semibold">{selectedPoint.locationName}</div>
                  <div className="flex justify-between text-slate-400">
                    <span>OBSERVED:</span>
                    <span className="font-bold" style={{ color: selectedPoint.color }}>
                      {selectedPoint.value}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tactical COP Link Callout for this Theater */}
          {selectedAor.linkedTacticalAo && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/80 rounded-xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  TACTICAL COP SECTOR
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300">
                  {selectedAor.acronym}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {selectedAor.linkedTacticalAo.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleFlyToTacticalAo}
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>Zoom on Map</span>
                </button>
                {onNavigateToTacticalCop && (
                  <button
                    onClick={() => onNavigateToTacticalCop(selectedAor.linkedTacticalAo?.name, selectedAor.id)}
                    className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer shadow"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Launch COP</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Army IO Framework Launch Button */}
          {onNavigateToIoWorkspace && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/80 rounded-xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5">
                  <RadioTower className="w-4 h-4 text-indigo-400" />
                  ARMY IO & INFO ADVANTAGE (ADP 3-13)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-900/70 text-indigo-300">
                  {selectedAor.acronym}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Access doctrinal IO framework, open-source adversary threat vectors, 5 activities, and mission statement workspace for {selectedAor.name}.
              </p>
              <button
                onClick={() => onNavigateToIoWorkspace(selectedAor.acronym)}
                className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open {selectedAor.acronym} IO Framework & Mission</span>
              </button>
            </div>
          )}

          {/* Assigned Civil Affairs Command (CACOM) Structure */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              Assigned Theater Civil Affairs Formation
            </span>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2 font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">PRIMARY THEATER CACOM:</span>
                <span className="font-bold text-white text-xs">
                  {selectedAor.assignedCivilAffairsUnits.primaryCacom}
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Station: {selectedAor.assignedCivilAffairsUnits.homeStation}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 text-[10px] block mb-1">SUPPORTING BRIGADES / UNITS:</span>
                <ul className="space-y-1 text-slate-300 font-sans text-xs">
                  {selectedAor.assignedCivilAffairsUnits.supportingBrigades.map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Active Civil Operations */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Active Civil Operations in {selectedAor.acronym}
            </span>
            <div className="space-y-2 text-xs">
              {selectedAor.activeCivilMissions.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{m.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        m.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : m.status === 'ONGOING'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono block">
                    Loc: {m.location}
                  </span>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    {m.focusArea}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed Inspector Rail on Right Edge */
        <div
          onClick={() => setIsInspectorCollapsed(false)}
          className="w-11 bg-black border-l border-slate-800 flex flex-col items-center py-3 select-none cursor-pointer hover:bg-neutral-900 transition-colors z-20 shrink-0 group"
          title="Expand Intelligence & Civil Assessment Inspector"
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
              <span>Intelligence & Assessment Inspector</span>
            </span>
          </div>

          <div className="mt-auto flex flex-col items-center gap-1.5 pt-3 border-t border-slate-800 text-center">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" title="Feed Online" />
            <span className="text-[9px] font-mono text-slate-400">{selectedAor.acronym}</span>
          </div>
        </div>
      )}
    </div>

    {/* Key & Cartography Engine Status Modal */}
    {showKeyInfoModal && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
        onClick={() => setShowKeyInfoModal(false)}
      >
        <div 
          className="bg-black border border-cyan-500/50 rounded-xl shadow-2xl max-w-xl w-full p-6 text-slate-200 font-mono space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold tracking-wide">GIS Cartography & API Key Status</h3>
            </div>
            <button
              onClick={() => setShowKeyInfoModal(false)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fully Done For You Notice */}
          <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-lg p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Everything Is Ready — No Key Required</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We have fully configured and optimized 4 worldwide GIS cartographic providers into the operational map engine. You do not need to purchase or configure an API key to view full satellite, street, and tactical terrain.
            </p>
          </div>

          {/* Active Cartography Modes */}
          <div className="space-y-2 text-xs">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Basemaps In Engine:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span><strong>Streets:</strong> Esri Global Street Grid</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span><strong>Sat:</strong> High-Res Satellite + Borders</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span><strong>Dark:</strong> Tactical Night Operations</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span><strong>OSM:</strong> Tactical Topo & Contours</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step If User Wants Custom Key */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px]">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>How To Bind A Private Google Maps API Key (Optional):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>Open the <strong>Secrets</strong> panel in AI Studio (left sidebar).</li>
              <li>Add variable name: <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded border border-slate-700">VITE_GOOGLE_MAPS_API_KEY</code>.</li>
              <li>Paste your Google Cloud key and click <strong>Save</strong>.</li>
            </ol>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowKeyInfoModal(false)}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold transition-colors cursor-pointer"
            >
              Close & Return to Map
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
