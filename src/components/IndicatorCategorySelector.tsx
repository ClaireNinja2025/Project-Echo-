import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Search, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  Check, 
  Radio, 
  Compass, 
  Target, 
  Globe2, 
  Landmark, 
  Users2, 
  DollarSign,
  Skull,
  MoveRight
} from 'lucide-react';
import { 
  ALL_INFORMATION_INDICATORS, 
  INDICATOR_DOMAINS, 
  InformationIndicator, 
  IndicatorDomain 
} from '../data/indicatorLayers';

interface IndicatorCategorySelectorProps {
  selectedIndicatorId: string | null;
  onSelectIndicator: (indicator: InformationIndicator | null) => void;
  activeDomain?: IndicatorDomain | 'ALL';
  onDomainChange?: (domain: IndicatorDomain | 'ALL') => void;
}

export const IndicatorCategorySelector: React.FC<IndicatorCategorySelectorProps> = ({
  selectedIndicatorId,
  onSelectIndicator,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<IndicatorDomain | 'ALL'>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedIndicator = ALL_INFORMATION_INDICATORS.find((i) => i.id === selectedIndicatorId) || null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredIndicators = ALL_INFORMATION_INDICATORS.filter((ind) => {
    if (selectedDomainFilter !== 'ALL' && ind.domain !== selectedDomainFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        ind.name.toLowerCase().includes(q) ||
        ind.domain.toLowerCase().includes(q) ||
        ind.pmesii.toLowerCase().includes(q) ||
        ind.ascope.toLowerCase().includes(q) ||
        ind.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getDomainIcon = (domain: IndicatorDomain) => {
    switch (domain) {
      case 'Cognitive & Narrative Environment':
        return <Radio className="w-3.5 h-3.5 text-amber-400" />;
      case 'Illicit Networks & Narcotics':
        return <Skull className="w-3.5 h-3.5 text-rose-400" />;
      case 'Migration & Human Mobility':
        return <MoveRight className="w-3.5 h-3.5 text-sky-400" />;
      case 'Foreign Strategic Influence':
        return <Globe2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'Governance & Institutional Trust':
        return <Landmark className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Socio-Demographics & Human Terrain':
        return <Users2 className="w-3.5 h-3.5 text-pink-400" />;
      case 'Economic & Livelihood Resilience':
        return <DollarSign className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button styled matching the user's select element */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-md text-xs font-medium border shadow-sm transition-all cursor-pointer ${
          selectedIndicator
            ? 'bg-slate-800 border-blue-600 text-white ring-1 ring-blue-600/40'
            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
        }`}
        title="Select Information Indicator Layer"
      >
        <div className="flex items-center gap-2 truncate">
          <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-mono text-slate-400 text-[11px] hidden sm:inline">INDICATOR LAYER:</span>
          {selectedIndicator ? (
            <span className="font-semibold text-white truncate max-w-[160px] sm:max-w-[210px] flex items-center gap-1.5">
              {getDomainIcon(selectedIndicator.domain)}
              <span>{selectedIndicator.name}</span>
            </span>
          ) : (
            <span className="italic text-slate-400">Select indicator category</span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-80 sm:w-96 max-h-[500px] bg-slate-900 border border-slate-700 rounded-md shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header & Search Bar */}
          <div className="p-2.5 bg-slate-950 border-b border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Select Indicator Category
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                {ALL_INFORMATION_INDICATORS.length} INDICATORS
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter (e.g. Adversary, Migration, Precursor, PRC)..."
                className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-600"
                autoFocus
              />
            </div>

            {/* Operational Domains Filter Pill Strip */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 text-[10px] font-mono">
              <button
                onClick={() => setSelectedDomainFilter('ALL')}
                className={`px-2 py-0.5 rounded transition-colors shrink-0 ${
                  selectedDomainFilter === 'ALL'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                ALL DOMAINS
              </button>
              {INDICATOR_DOMAINS.map((dom) => (
                <button
                  key={dom.id}
                  onClick={() => setSelectedDomainFilter(dom.id)}
                  className={`px-2 py-0.5 rounded transition-colors shrink-0 flex items-center gap-1 ${
                    selectedDomainFilter === dom.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dom.color }}></span>
                  <span className="truncate">{dom.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Indicators List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-80">
            {filteredIndicators.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-mono">
                No indicators match search query "{searchQuery}"
              </div>
            ) : (
              filteredIndicators.map((indicator) => {
                const isSelected = selectedIndicatorId === indicator.id;
                const isAdversaryNarratives = indicator.id === 'adversary-narratives';

                return (
                  <button
                    key={indicator.id}
                    onClick={() => {
                      onSelectIndicator(indicator);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 text-xs transition-colors flex items-start justify-between gap-2 group ${
                      isSelected
                        ? 'bg-slate-800 border-l-4 border-l-blue-600'
                        : isAdversaryNarratives
                        ? 'border-l-4 border-l-red-600/70 bg-slate-900/80 hover:bg-slate-800'
                        : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {getDomainIcon(indicator.domain)}
                        <span
                          className={`font-medium truncate ${
                            isSelected
                              ? 'text-white font-bold'
                              : isAdversaryNarratives
                              ? 'text-red-300 font-medium'
                              : 'text-slate-300 group-hover:text-white'
                          }`}
                        >
                          {indicator.name}
                        </span>
                        {isAdversaryNarratives && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-red-300 border border-slate-700">
                            ADP 3-13 COGNITIVE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="text-slate-400 truncate">{indicator.domain}</span>
                        <span>•</span>
                        <span className="text-cyan-400">PMESII: {indicator.pmesii}</span>
                        <span>•</span>
                        <span className="text-slate-300">ASCOPE: {indicator.ascope}</span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1 group-hover:text-slate-300">
                        {indicator.description}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Controls: Clear Selection / Close */}
          <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            {selectedIndicator && (
              <button
                onClick={() => {
                  onSelectIndicator(null);
                  setIsOpen(false);
                }}
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear Active Indicator Layer
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
