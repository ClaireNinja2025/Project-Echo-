import { ASCOPECategory, PMESIICategory } from '../types';

export type IndicatorDomain =
  | 'Cognitive & Narrative Environment'
  | 'Illicit Networks & Narcotics'
  | 'Migration & Human Mobility'
  | 'Foreign Strategic Influence'
  | 'Governance & Institutional Trust'
  | 'Socio-Demographics & Human Terrain'
  | 'Economic & Livelihood Resilience';

export type AorId = 
  | 'aor-northcom' 
  | 'aor-southcom' 
  | 'aor-eucom' 
  | 'aor-indopacom' 
  | 'aor-centcom' 
  | 'aor-africom';

export interface IndicatorDataPoint {
  id: string;
  aorId: AorId;
  aorName: string;
  lat: number;
  lng: number;
  locationName: string;
  value: string;
  numericScore?: number; // 0 - 100
  color: string;
  confidence: number;
  sampleCohort: string;
  sampleSize: number;
  details: string;
}

export interface AorIndicatorDetail {
  theaterName: string;
  keyMetric: string;
  strategicImplication: string;
  sentimentBreakdown: { label: string; percentage: number; color: string }[];
}

export interface InformationIndicator {
  id: string;
  name: string;
  domain: IndicatorDomain;
  pmesii: PMESIICategory;
  ascope: ASCOPECategory;
  description: string;
  doctrinalReference: string;
  keyMetric: string;
  sentimentBreakdown: { label: string; percentage: number; color: string }[];
  strategicImplication: string;
  dataPoints: IndicatorDataPoint[];
}

export const INDICATOR_DOMAINS: {
  id: IndicatorDomain;
  label: string;
  iconName: string;
  color: string;
}[] = [
  { id: 'Cognitive & Narrative Environment', label: 'Cognitive & Narrative Environment', iconName: 'ShieldAlert', color: '#E34B4B' },
  { id: 'Illicit Networks & Narcotics', label: 'Illicit Networks & Narcotics', iconName: 'Activity', color: '#E34B4B' },
  { id: 'Migration & Human Mobility', label: 'Migration & Human Mobility', iconName: 'Users', color: '#FFBE2E' },
  { id: 'Foreign Strategic Influence', label: 'Foreign Strategic Influence', iconName: 'Globe', color: '#9D5BD2' },
  { id: 'Governance & Institutional Trust', label: 'Governance & Institutional Trust', iconName: 'Landmark', color: '#2378C3' },
  { id: 'Socio-Demographics & Human Terrain', label: 'Socio-Demographics & Human Terrain', iconName: 'Building2', color: '#39BCE5' },
  { id: 'Economic & Livelihood Resilience', label: 'Economic & Livelihood Resilience', iconName: 'Compass', color: '#42BFA5' },
];

export const AOR_THEATER_NODES: Record<AorId, {
  name: string;
  acronym: string;
  focalLocation: string;
  subLocations: { name: string; lat: number; lng: number; spread: number }[];
}> = {
  'aor-northcom': {
    name: 'United States Northern Command',
    acronym: 'USNORTHCOM',
    focalLocation: 'Sector North (Batallón de Infantería / Durango-Zacatecas Corridor)',
    subLocations: [
      { name: 'Batallón de Infantería Garrison', lat: 24.0312, lng: -105.3510, spread: 0.008 },
      { name: 'El Cazadero Corridor', lat: 24.0450, lng: -105.3620, spread: 0.012 },
      { name: 'El Torreón Periphery', lat: 24.0210, lng: -105.3380, spread: 0.011 },
      { name: 'Lomas del Río Urban Fringe', lat: 24.0580, lng: -105.3450, spread: 0.014 },
      { name: 'Distrito Central Commercial', lat: 24.0340, lng: -105.3480, spread: 0.006 },
      { name: 'Ruta Federal 45 Highway Checkpoint', lat: 24.0150, lng: -105.3590, spread: 0.009 },
      { name: 'Ciudad Juárez / El Paso Border POE', lat: 31.7400, lng: -106.4800, spread: 0.025 },
      { name: 'Nogales Sonora Chokepoint', lat: 31.3300, lng: -110.9400, spread: 0.020 },
    ],
  },
  'aor-southcom': {
    name: 'United States Southern Command',
    acronym: 'USSOUTHCOM',
    focalLocation: 'Darién Gap & Northern Andean Transit Arc',
    subLocations: [
      { name: 'Necoclí Transit Embankment', lat: 8.4230, lng: -76.7820, spread: 0.015 },
      { name: 'Acandí Jungle Trailhead', lat: 8.5120, lng: -77.2790, spread: 0.018 },
      { name: 'Bajo Chiquito Indigenous Reception', lat: 8.3240, lng: -77.5670, spread: 0.014 },
      { name: 'Cúcuta International Crossing (Col-Ven)', lat: 7.8940, lng: -72.5050, spread: 0.022 },
      { name: 'Guayaquil Maritime Port Precursor Hub', lat: -2.1890, lng: -79.8890, spread: 0.020 },
      { name: 'San Salvador Urban Containment Hub', lat: 13.6920, lng: -89.2180, spread: 0.016 },
    ],
  },
  'aor-eucom': {
    name: 'United States European Command',
    acronym: 'USEUCOM',
    focalLocation: 'Suwalki Corridor & Eastern NATO Frontier',
    subLocations: [
      { name: 'Suwalki Gap Border Axis (PL-LT)', lat: 54.1030, lng: 22.9300, spread: 0.025 },
      { name: 'Rzeszów Civil-Military Logistics Hub', lat: 50.0410, lng: 21.9990, spread: 0.018 },
      { name: 'Constanța Black Sea Port', lat: 44.1800, lng: 28.6340, spread: 0.022 },
      { name: 'Chișinău Transnistria Flank', lat: 47.0100, lng: 28.8630, spread: 0.019 },
      { name: 'Narva River Border Transit', lat: 59.3770, lng: 28.1900, spread: 0.015 },
      { name: 'Suceava Humanitarian Corridor', lat: 47.6510, lng: 26.2550, spread: 0.020 },
    ],
  },
  'aor-indopacom': {
    name: 'United States Indo-Pacific Command',
    acronym: 'USINDOPACOM',
    focalLocation: 'Luzon Strait Arc & Maritime Chokepoints',
    subLocations: [
      { name: 'Batanes Island Surveillance Node', lat: 20.4480, lng: 121.9700, spread: 0.030 },
      { name: 'Subic Bay Maritime Support Facility', lat: 14.8230, lng: 120.2800, spread: 0.020 },
      { name: 'Davao Civil Operations Sector', lat: 7.1900, lng: 125.4550, spread: 0.022 },
      { name: 'Honiara Pacific Island Civic Hub', lat: -9.4450, lng: 159.9720, spread: 0.025 },
      { name: 'Port Moresby Maritime Gateway', lat: -9.4430, lng: 147.1800, spread: 0.020 },
      { name: 'Strait of Malacca Transit Corridor', lat: 1.3520, lng: 103.8190, spread: 0.018 },
    ],
  },
  'aor-centcom': {
    name: 'United States Central Command',
    acronym: 'USCENTCOM',
    focalLocation: 'AO Griffin & Tigris-Euphrates River Valley',
    subLocations: [
      { name: 'Al-Mansoor Water Filtration Plant', lat: 34.5050, lng: 43.1450, spread: 0.012 },
      { name: 'Substation Alpha Grid Chokepoint', lat: 34.5210, lng: 43.1120, spread: 0.014 },
      { name: 'Ibn Sina Trauma Hospital District', lat: 34.4950, lng: 43.1850, spread: 0.011 },
      { name: 'Basra Shatt al-Arab Transit Hub', lat: 30.5080, lng: 47.8180, spread: 0.022 },
      { name: 'Al-Hudaydah Red Sea Commercial Port', lat: 14.7970, lng: 42.9540, spread: 0.020 },
      { name: 'Erbil Civil-Military Operations Center', lat: 36.1910, lng: 44.0090, spread: 0.018 },
    ],
  },
  'aor-africom': {
    name: 'United States Africa Command',
    acronym: 'USAFRICOM',
    focalLocation: 'Liptako-Gourma & Sahelian Trans-Saharan Corridors',
    subLocations: [
      { name: 'Liptako-Gourma Tri-Border Node (NER-MLI-BFA)', lat: 13.5130, lng: 2.1150, spread: 0.025 },
      { name: 'Agadez Trans-Saharan Transit Center', lat: 16.9740, lng: 7.9900, spread: 0.020 },
      { name: 'Mogadishu Humanitarian Green Line', lat: 2.0460, lng: 45.3430, spread: 0.018 },
      { name: 'Maiduguri Lake Chad Civil Hub', lat: 11.8330, lng: 13.1510, spread: 0.022 },
      { name: 'Gao Niger River Crossing Node', lat: 16.2710, lng: -0.0440, spread: 0.020 },
      { name: 'Djibouti Regional Coordination Center', lat: 11.5720, lng: 43.1450, spread: 0.016 },
    ],
  },
};

// Generates realistic multi-AOR point clouds for each indicator across all 6 Combatant Commands
const generateClusterPoints = (
  indicatorId: string,
  categories: { label: string; color: string; score: number }[],
  _legacyCount: number = 85
): IndicatorDataPoint[] => {
  const points: IndicatorDataPoint[] = [];
  const aorKeys = Object.keys(AOR_THEATER_NODES) as AorId[];

  aorKeys.forEach((aorKey) => {
    const aorConfig = AOR_THEATER_NODES[aorKey];
    // Higher density in Northcom/Centcom/Southcom, robust coverage in all
    const ptsCount = aorKey === 'aor-northcom' ? 65 : 30;

    for (let i = 0; i < ptsCount; i++) {
      const loc = aorConfig.subLocations[i % aorConfig.subLocations.length];
      const cat = categories[(i + aorConfig.subLocations.length) % categories.length];
      
      const latOffset = (Math.sin(i * 12.9898 + indicatorId.length + aorKey.length) * 0.5) * loc.spread;
      const lngOffset = (Math.cos(i * 78.233 + indicatorId.length + aorKey.length) * 0.5) * loc.spread;

      points.push({
        id: `${indicatorId}-${aorKey}-pt-${i}`,
        aorId: aorKey,
        aorName: aorConfig.acronym,
        lat: Number((loc.lat + latOffset).toFixed(5)),
        lng: Number((loc.lng + lngOffset).toFixed(5)),
        locationName: loc.name,
        value: cat.label,
        numericScore: cat.score,
        color: cat.color,
        confidence: Math.round(80 + ((i * 7 + aorKey.length) % 18)),
        sampleCohort: i % 2 === 0 ? 'Civil Field Observation (Face-to-Face)' : 'OSINT & Telemetry Verification',
        sampleSize: 40 + ((i * 11) % 140),
        details: `${aorConfig.acronym} operational survey point at ${loc.name}. Classified under indicator: ${cat.label}.`,
      });
    }
  });

  return points;
};

// Helper to filter points by AOR
export const getPointsForAor = (
  indicator: InformationIndicator,
  aorId: AorId | 'ALL'
): IndicatorDataPoint[] => {
  if (aorId === 'ALL') return indicator.dataPoints;
  return indicator.dataPoints.filter((pt) => pt.aorId === aorId);
};

// Theater-specific context provider for all 6 Combatant Commands
export const getAorIndicatorSummary = (
  indicator: InformationIndicator,
  aorId: AorId
): AorIndicatorDetail => {
  const node = AOR_THEATER_NODES[aorId] || AOR_THEATER_NODES['aor-northcom'];

  switch (aorId) {
    case 'aor-northcom':
      return {
        theaterName: node.focalLocation,
        keyMetric: indicator.keyMetric,
        strategicImplication: indicator.strategicImplication,
        sentimentBreakdown: indicator.sentimentBreakdown,
      };
    case 'aor-southcom':
      return {
        theaterName: node.focalLocation,
        keyMetric: `${indicator.keyMetric} (USSOUTHCOM)`,
        strategicImplication: `In USSOUTHCOM, ${indicator.name} directly impacts Transnational Criminal Organization (Clan del Golfo / Tren de Aragua) illicit transit routes, human smuggling through the Darién Gap, and Pacific port chemical precursor diversions.`,
        sentimentBreakdown: indicator.sentimentBreakdown.map((s, idx) => ({
          ...s,
          percentage: [36, 31, 21, 12][idx % 4] || s.percentage,
        })),
      };
    case 'aor-eucom':
      return {
        theaterName: node.focalLocation,
        keyMetric: `${indicator.keyMetric} (USEUCOM)`,
        strategicImplication: `In USEUCOM, ${indicator.name} interfaces with Eastern NATO Flank hybrid warfare vectors, Belarus-orchestrated weaponized migration pressure, and Russian state cognitive influence operations across Baltic civil corridors.`,
        sentimentBreakdown: indicator.sentimentBreakdown.map((s, idx) => ({
          ...s,
          percentage: [42, 28, 18, 12][idx % 4] || s.percentage,
        })),
      };
    case 'aor-indopacom':
      return {
        theaterName: node.focalLocation,
        keyMetric: `${indicator.keyMetric} (USINDOPACOM)`,
        strategicImplication: `In USINDOPACOM, ${indicator.name} reflects PRC Gray-Zone maritime militia pressure, Pacific island telecommunications access vulnerabilities, and critical sea line of communication (SLOC) chokepoints in the Luzon and Malacca straits.`,
        sentimentBreakdown: indicator.sentimentBreakdown.map((s, idx) => ({
          ...s,
          percentage: [39, 29, 20, 12][idx % 4] || s.percentage,
        })),
      };
    case 'aor-centcom':
      return {
        theaterName: node.focalLocation,
        keyMetric: `${indicator.keyMetric} (USCENTCOM)`,
        strategicImplication: `In USCENTCOM, ${indicator.name} shapes civilian reliance on Iranian proxy militia services, Captagon trade dynamics in the Levant, and civil water-power vulnerability across the Tigris-Euphrates basin.`,
        sentimentBreakdown: indicator.sentimentBreakdown.map((s, idx) => ({
          ...s,
          percentage: [44, 26, 19, 11][idx % 4] || s.percentage,
        })),
      };
    case 'aor-africom':
      return {
        theaterName: node.focalLocation,
        keyMetric: `${indicator.keyMetric} (USAFRICOM)`,
        strategicImplication: `In USAFRICOM, ${indicator.name} influences Violent Extremist Organization (JNIM/ISGS) shadow taxation, Trans-Saharan migrant corridors through Agadez, and climate shock-induced pastoralist-farmer conflict in the Sahel.`,
        sentimentBreakdown: indicator.sentimentBreakdown.map((s, idx) => ({
          ...s,
          percentage: [46, 25, 17, 12][idx % 4] || s.percentage,
        })),
      };
    default:
      return {
        theaterName: node.focalLocation,
        keyMetric: indicator.keyMetric,
        strategicImplication: indicator.strategicImplication,
        sentimentBreakdown: indicator.sentimentBreakdown,
      };
  }
};

// Complete list of all 36 indicators exactly as shown in the user's dropdown menu
export const ALL_INFORMATION_INDICATORS: InformationIndicator[] = [
  // 1. Cognitive & Narrative Environment
  {
    id: 'adversary-narratives',
    name: 'Adversary & Threat Narratives',
    domain: 'Cognitive & Narrative Environment',
    pmesii: 'Information',
    ascope: 'Capabilities',
    description: 'Dominant adversarial and illicit narrative streams circulating among local populations (e.g. state incompetence, illicit patronage, coercion, anti-state defiance).',
    doctrinalReference: 'ADP 3-13 (Information Advantage) / ATP 3-57.50 Section 4-2',
    keyMetric: 'Narrative Penetration Rate',
    sentimentBreakdown: [
      { label: 'State Incompetence & Abandonment', percentage: 38, color: '#E34B4B' },
      { label: 'Illicit Patronage / Social Benefactor', percentage: 27, color: '#FFBE2E' },
      { label: 'Coercive Inevitability / Fear', percentage: 21, color: '#9D5BD2' },
      { label: 'Civic Resistance / Counter-Narrative', percentage: 14, color: '#42BFA5' },
    ],
    strategicImplication: 'High penetration of social benefactor narratives erodes host-nation municipal legitimacy and facilitates adversary recruitment among unattached youth.',
    dataPoints: generateClusterPoints('adversary-narratives', [
      { label: 'State Incompetence & Abandonment', color: '#E34B4B', score: 85 },
      { label: 'Illicit Patronage / Social Benefactor', color: '#FFBE2E', score: 68 },
      { label: 'Coercive Inevitability / Fear', color: '#9D5BD2', score: 74 },
      { label: 'Civic Resistance / Counter-Narrative', color: '#42BFA5', score: 42 },
    ]),
  },
  {
    id: 'primary-news-source',
    name: 'Primary News Source',
    domain: 'Cognitive & Narrative Environment',
    pmesii: 'Information',
    ascope: 'Capabilities',
    description: 'Primary media modality utilized by civilian demographics to access breaking news and operational alerts.',
    doctrinalReference: 'ATP 3-57.50 Chapter 4',
    keyMetric: 'Source Channel Share',
    sentimentBreakdown: [
      { label: 'Encrypted Messaging (WhatsApp/Telegram)', percentage: 46, color: '#42BFA5' },
      { label: 'Open Social Media (TikTok/X/FB)', percentage: 31, color: '#2378C3' },
      { label: 'Broadcast Television', percentage: 15, color: '#FFBE2E' },
      { label: 'Community Radio / Word of Mouth', percentage: 8, color: '#9D5BD2' },
    ],
    strategicImplication: 'Civil Affairs message dissemination must leverage closed messaging chains rather than traditional broadcast airwaves for effective reach.',
    dataPoints: generateClusterPoints('primary-news-source', [
      { label: 'Encrypted Messaging (WhatsApp)', color: '#42BFA5', score: 78 },
      { label: 'Open Social Media', color: '#2378C3', score: 65 },
      { label: 'Broadcast Television', color: '#FFBE2E', score: 45 },
      { label: 'Community Radio', color: '#9D5BD2', score: 30 },
    ]),
  },
  {
    id: 'social-media',
    name: 'Social Media',
    domain: 'Cognitive & Narrative Environment',
    pmesii: 'Information',
    ascope: 'Capabilities',
    description: 'Social networking platform utilization, algorithmic echo chambers, and localized civic online forums.',
    doctrinalReference: 'ADP 3-13 Section 2-4',
    keyMetric: 'Daily Active Users (DAU)',
    sentimentBreakdown: [
      { label: 'Meta Ecosystem (WhatsApp/Facebook)', percentage: 54, color: '#2378C3' },
      { label: 'TikTok (Short-Form Video)', percentage: 28, color: '#ec4899' },
      { label: 'X / Twitter (Crisis Monitoring)', percentage: 12, color: '#39BCE5' },
      { label: 'YouTube Long-Form', percentage: 6, color: '#E34B4B' },
    ],
    strategicImplication: 'Adversary communication cells heavily weaponize short-form video to romanticize illicit firearms and display tactical convoys.',
    dataPoints: generateClusterPoints('social-media', [
      { label: 'Meta Ecosystem', color: '#2378C3', score: 80 },
      { label: 'TikTok Short-Form', color: '#ec4899', score: 62 },
      { label: 'X / Crisis Mon', color: '#39BCE5', score: 38 },
    ]),
  },
  {
    id: 'newspapers-and-news-agencies',
    name: 'Newspapers and News Agencies',
    domain: 'Cognitive & Narrative Environment',
    pmesii: 'Information',
    ascope: 'Organizations',
    description: 'Independent, state-affiliated, and self-censored regional journalism outlets operating under irregular armed threat pressure.',
    doctrinalReference: 'ATP 3-57.50 Appendix B',
    keyMetric: 'Journalistic Freedom Index',
    sentimentBreakdown: [
      { label: 'Self-Censored / Forced Silence', percentage: 58, color: '#E34B4B' },
      { label: 'Independent Investigative', percentage: 22, color: '#42BFA5' },
      { label: 'Government Gazette / Municipal PR', percentage: 20, color: '#2378C3' },
    ],
    strategicImplication: 'Severe journalistic blackout in peripheral towns forces local populations to rely entirely on unverified social media rumors.',
    dataPoints: generateClusterPoints('newspapers-and-news-agencies', [
      { label: 'Self-Censored / Blackout', color: '#E34B4B', score: 88 },
      { label: 'Independent Press', color: '#42BFA5', score: 35 },
      { label: 'State PR Wire', color: '#2378C3', score: 40 },
    ]),
  },
  {
    id: 'radio',
    name: 'Radio',
    domain: 'Cognitive & Narrative Environment',
    pmesii: 'Information',
    ascope: 'Capabilities',
    description: 'FM/AM commercial, indigenous community radio stations, and illicit pirate transmitters used for tactical comms.',
    doctrinalReference: 'ATP 3-57.50 Sec 3-8',
    keyMetric: 'Listenership Reach',
    sentimentBreakdown: [
      { label: 'Commercial FM Broadcasters', percentage: 48, color: '#2378C3' },
      { label: 'Indigenous / Community Radio', percentage: 34, color: '#42BFA5' },
      { label: 'Pirate / Unlicensed Repeaters', percentage: 18, color: '#E34B4B' },
    ],
    strategicImplication: 'Community radio remains the only resilient medium reaching remote agrarian valleys when cellular infrastructure collapses.',
    dataPoints: generateClusterPoints('radio', [
      { label: 'Commercial FM', color: '#2378C3', score: 60 },
      { label: 'Indigenous Community', color: '#42BFA5', score: 55 },
      { label: 'Pirate Narco Repeaters', color: '#E34B4B', score: 72 },
    ]),
  },
  {
    id: 'television-streaming',
    name: 'Television & Streaming',
    domain: 'Cognitive & Narrative Environment',
    pmesii: 'Information',
    ascope: 'Capabilities',
    description: 'Over-the-air national television broadcasts, satellite packages, and on-demand streaming consumption.',
    doctrinalReference: 'ADP 3-13 Annex D',
    keyMetric: 'Household Screen Penetration',
    sentimentBreakdown: [
      { label: 'Over-the-Air Terrestrial TV', percentage: 51, color: '#2378C3' },
      { label: 'Satellite Dish Services', percentage: 33, color: '#39BCE5' },
      { label: 'Broadband Streaming', percentage: 16, color: '#9D5BD2' },
    ],
    strategicImplication: 'National broadcast networks enjoy high baseline credibility for weather emergencies but low credibility for illicit armed violence reporting.',
    dataPoints: generateClusterPoints('television-streaming', [
      { label: 'Over-the-Air Broadcast', color: '#2378C3', score: 65 },
      { label: 'Satellite Subscriptions', color: '#39BCE5', score: 45 },
    ]),
  },
  {
    id: 'media',
    name: 'Media',
    domain: 'Cognitive & Narrative Environment',
    pmesii: 'Information',
    ascope: 'Capabilities',
    description: 'Overall media consumption hours per capita, digital connectivity rates, and cross-platform information diet.',
    doctrinalReference: 'ADP 3-13',
    keyMetric: 'Daily Media Hours',
    sentimentBreakdown: [
      { label: 'High Exposure (>6 hrs/day)', percentage: 42, color: '#E34B4B' },
      { label: 'Moderate Exposure (2-5 hrs/day)', percentage: 41, color: '#FFBE2E' },
      { label: 'Low Exposure (<2 hrs/day)', percentage: 17, color: '#42BFA5' },
    ],
    strategicImplication: 'High digital exposure correlates directly with heightened anxiety and susceptibility to viral adversary psyops campaigns.',
    dataPoints: generateClusterPoints('media', [
      { label: 'High Exposure', color: '#E34B4B', score: 82 },
      { label: 'Moderate Exposure', color: '#FFBE2E', score: 50 },
      { label: 'Low Exposure', color: '#42BFA5', score: 25 },
    ]),
  },

  // 2. Illicit Networks & Narcotics
  {
    id: 'threat-exposure',
    name: 'Threat Network Exposure',
    domain: 'Illicit Networks & Narcotics',
    pmesii: 'Military',
    ascope: 'Organizations',
    description: 'Direct civilian exposure to illicit threat network operations, including unauthorized roadblocks, physical extortion, and forced recruitment.',
    doctrinalReference: 'ATP 3-57.50 Chapter 5 / JP 3-24',
    keyMetric: 'Civilian Contact Frequency',
    sentimentBreakdown: [
      { label: 'Direct Daily Presence / Checkpoints', percentage: 34, color: '#E34B4B' },
      { label: 'Periodic Extortion / Intimidation', percentage: 39, color: '#FFBE2E' },
      { label: 'Indirect Threat Only', percentage: 19, color: '#FFBE2E' },
      { label: 'No Overt Threat Contact', percentage: 8, color: '#42BFA5' },
    ],
    strategicImplication: 'Civil Affairs assessment teams must navigate around verified hostile checkpoint choke points along primary transit arteries.',
    dataPoints: generateClusterPoints('threat-exposure', [
      { label: 'Direct Checkpoint Presence', color: '#E34B4B', score: 92 },
      { label: 'Periodic Extortion', color: '#FFBE2E', score: 71 },
      { label: 'Indirect Threat', color: '#FFBE2E', score: 45 },
      { label: 'No Overt Contact', color: '#42BFA5', score: 15 },
    ]),
  },
  {
    id: 'counter-threat-strategies',
    name: 'Counter Threat Strategies',
    domain: 'Illicit Networks & Narcotics',
    pmesii: 'Military',
    ascope: 'Organizations',
    description: 'Host-nation military operations (Batallón de Infantería), National Guard patrols, and community self-defense arrangements.',
    doctrinalReference: 'JP 3-24 (Counterinsurgency & Security Cooperation)',
    keyMetric: 'Security Force Presence Score',
    sentimentBreakdown: [
      { label: 'Active Military Interdiction', percentage: 41, color: '#42BFA5' },
      { label: 'Static National Guard Posts', percentage: 32, color: '#2378C3' },
      { label: 'Civilian Neighborhood Watch', percentage: 15, color: '#FFBE2E' },
      { label: 'Under-Resourced / Security Void', percentage: 12, color: '#E34B4B' },
    ],
    strategicImplication: 'Concentration of Batallón de Infantería patrols in urban cores leaves agricultural hinterlands vulnerable to hostile network displacement.',
    dataPoints: generateClusterPoints('counter-threat-strategies', [
      { label: 'Military Interdiction', color: '#42BFA5', score: 85 },
      { label: 'Static National Guard', color: '#2378C3', score: 60 },
      { label: 'Under-Resourced Void', color: '#E34B4B', score: 20 },
    ]),
  },
  {
    id: 'counter-fentanyl-partners',
    name: 'Counter Fentanyl Partners',
    domain: 'Illicit Networks & Narcotics',
    pmesii: 'Political',
    ascope: 'Organizations',
    description: 'Inter-agency vetted units, customs authorities, port inspection detachments, and judicial counternarcotics task forces.',
    doctrinalReference: 'ATP 3-57.50 Section 6-3',
    keyMetric: 'Vetted Partner Reliability',
    sentimentBreakdown: [
      { label: 'Vetted Military Task Forces', percentage: 45, color: '#42BFA5' },
      { label: 'Federal Customs & Port Inspectors', percentage: 28, color: '#2378C3' },
      { label: 'Municipal Police (High Risk)', percentage: 17, color: '#E34B4B' },
      { label: 'Judicial Special Prosecutors', percentage: 10, color: '#9D5BD2' },
    ],
    strategicImplication: 'Intelligence sharing must be restricted to vetted federal and military partners to prevent tactical compromise.',
    dataPoints: generateClusterPoints('counter-fentanyl-partners', [
      { label: 'Vetted Military TF', color: '#42BFA5', score: 90 },
      { label: 'Federal Customs', color: '#2378C3', score: 68 },
      { label: 'Municipal Police (Compromised)', color: '#E34B4B', score: 32 },
    ]),
  },
  {
    id: 'fentanyl-awareness-impact',
    name: 'Fentanyl Awareness & Impact',
    domain: 'Illicit Networks & Narcotics',
    pmesii: 'Social',
    ascope: 'People',
    description: 'Public health crisis intensity, synthetic opioid overdose telemetry, and community awareness of lethal fentanyl adulteration.',
    doctrinalReference: 'ATP 3-57.50 Chapter 5',
    keyMetric: 'Overdose Crisis Index',
    sentimentBreakdown: [
      { label: 'Severe Local Overdose Spike', percentage: 36, color: '#E34B4B' },
      { label: 'Moderate Adulteration Detected', percentage: 38, color: '#FFBE2E' },
      { label: 'Transit-Only Perception', percentage: 18, color: '#FFBE2E' },
      { label: 'Low Community Awareness', percentage: 8, color: '#42BFA5' },
    ],
    strategicImplication: 'Civil Affairs MEDRETE initiatives should supply naloxone distribution and hospital training to stabilize transit communities.',
    dataPoints: generateClusterPoints('fentanyl-awareness-impact', [
      { label: 'Severe Overdose Spike', color: '#E34B4B', score: 88 },
      { label: 'Moderate Adulteration', color: '#FFBE2E', score: 62 },
      { label: 'Transit-Only Awareness', color: '#42BFA5', score: 35 },
    ]),
  },
  {
    id: 'fentanyl-blame',
    name: 'Fentanyl Blame',
    domain: 'Illicit Networks & Narcotics',
    pmesii: 'Information',
    ascope: 'Capabilities',
    description: 'Attribution of responsibility for the fentanyl crisis: transnational trafficking networks, foreign chemical precursor suppliers, or domestic consumption.',
    doctrinalReference: 'ADP 3-13 Annex C',
    keyMetric: 'Causal Attribution Sentiment',
    sentimentBreakdown: [
      { label: 'Illicit Syndicate Operations & Corrupt Enablers', percentage: 41, color: '#E34B4B' },
      { label: 'Foreign Precursor Exporters (PRC)', percentage: 31, color: '#FFBE2E' },
      { label: 'US Domestic Consumer Demand', percentage: 22, color: '#2378C3' },
      { label: 'Municipal Failure & Poverty', percentage: 6, color: '#9D5BD2' },
    ],
    strategicImplication: 'Public opinion strongly links precursor flow from East Asia to illicit synthesis hubs, creating opportunities for counter-precursor messaging.',
    dataPoints: generateClusterPoints('fentanyl-blame', [
      { label: 'Illicit Syndicates', color: '#E34B4B', score: 75 },
      { label: 'Foreign Precursors (PRC)', color: '#FFBE2E', score: 68 },
      { label: 'US Consumer Demand', color: '#2378C3', score: 55 },
    ]),
  },

  // 3. Foreign Strategic Influence
  {
    id: 'prc-influence',
    name: 'PRC Influence',
    domain: 'Foreign Strategic Influence',
    pmesii: 'Political',
    ascope: 'Organizations',
    description: 'People\'s Republic of China economic footprint, dual-use infrastructure port investments, telecommunications 5G hardware, and chemical precursor supply lines.',
    doctrinalReference: 'National Defense Strategy / ATP 3-57.50 Chapter 6',
    keyMetric: 'Strategic Footprint Index',
    sentimentBreakdown: [
      { label: 'Chemical Precursor Logistics Lines', percentage: 44, color: '#E34B4B' },
      { label: 'Critical Infrastructure & Mining Concessions', percentage: 29, color: '#9D5BD2' },
      { label: 'Commercial Telecommunications Tech', percentage: 19, color: '#FFBE2E' },
      { label: 'Diplomatic / Educational Exchanges', percentage: 8, color: '#2378C3' },
    ],
    strategicImplication: 'PRC-origin chemical container traffic through Pacific deep-water ports directly fuels clandestine synthetic opioid labs in this sector.',
    dataPoints: generateClusterPoints('prc-influence', [
      { label: 'Chemical Precursors', color: '#E34B4B', score: 86 },
      { label: 'Infrastructure & Mining', color: '#9D5BD2', score: 70 },
      { label: 'Telecom Grid Hardware', color: '#FFBE2E', score: 58 },
    ]),
  },
  {
    id: 'us-influence',
    name: 'US Influence',
    domain: 'Foreign Strategic Influence',
    pmesii: 'Political',
    ascope: 'Organizations',
    description: 'United States diplomatic presence, bilateral security cooperation, USAID civic programs, and bilateral economic cross-border trade dependencies.',
    doctrinalReference: 'JP 3-20 (Security Cooperation)',
    keyMetric: 'Bilateral Affinity Score',
    sentimentBreakdown: [
      { label: 'Favorable Security Partnership', percentage: 42, color: '#42BFA5' },
      { label: 'Remittance & Economic Reliance', percentage: 33, color: '#2378C3' },
      { label: 'Sovereignty / Intervention Concerns', percentage: 18, color: '#FFBE2E' },
      { label: 'Unfavorable / Anti-Intervention', percentage: 7, color: '#E34B4B' },
    ],
    strategicImplication: 'Remittance inflows from US diaspora represent the single largest economic stabilizer for rural households in this valley.',
    dataPoints: generateClusterPoints('us-influence', [
      { label: 'Favorable Security Ties', color: '#42BFA5', score: 78 },
      { label: 'Remittance Reliance', color: '#2378C3', score: 82 },
      { label: 'Sovereignty Concerns', color: '#FFBE2E', score: 45 },
    ]),
  },
  {
    id: 'canada-influence',
    name: 'Canada Influence',
    domain: 'Foreign Strategic Influence',
    pmesii: 'Economic',
    ascope: 'Organizations',
    description: 'Canadian commercial investments in precious metal extraction (silver/gold mining), USMCA automotive logistics, and seasonal agricultural labor agreements.',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Corporate & Labor Presence',
    sentimentBreakdown: [
      { label: 'Mining Concessions & Extraction', percentage: 53, color: '#39BCE5' },
      { label: 'Seasonal Worker Program Access', percentage: 31, color: '#42BFA5' },
      { label: 'Environmental Friction / Water Disputes', percentage: 16, color: '#FFBE2E' },
    ],
    strategicImplication: 'Disputes over mining water concessions present friction points that illicit syndicates exploit to shake down foreign concessionaires.',
    dataPoints: generateClusterPoints('canada-influence', [
      { label: 'Mining Extraction', color: '#39BCE5', score: 74 },
      { label: 'Seasonal Worker Programs', color: '#42BFA5', score: 68 },
      { label: 'Environmental Grievances', color: '#FFBE2E', score: 52 },
    ]),
  },

  // 4. Migration & Human Mobility Corridors
  {
    id: 'migration',
    name: 'Migration',
    domain: 'Migration & Human Mobility',
    pmesii: 'Social',
    ascope: 'People',
    description: 'Total human mobility rate across the transit corridor, including transmigrants and internally displaced persons.',
    doctrinalReference: 'ATP 3-57.50 Chapter 3',
    keyMetric: 'Transit Flow Rate (pers/day)',
    sentimentBreakdown: [
      { label: 'High Volume Transit (>500/day)', percentage: 48, color: '#E34B4B' },
      { label: 'Moderate Managed Flow', percentage: 34, color: '#FFBE2E' },
      { label: 'Low Static Population', percentage: 18, color: '#42BFA5' },
    ],
    strategicImplication: 'High-density migrant caravans create severe municipal water and healthcare shortages in receiving parishes.',
    dataPoints: generateClusterPoints('migration', [
      { label: 'High Transit Volume', color: '#E34B4B', score: 85 },
      { label: 'Moderate Flow', color: '#FFBE2E', score: 55 },
      { label: 'Static Community', color: '#42BFA5', score: 25 },
    ]),
  },
  {
    id: 'migration-drivers',
    name: 'Migration Drivers',
    domain: 'Migration & Human Mobility',
    pmesii: 'Social',
    ascope: 'People',
    description: 'Primary push factors compelling civilian departure: armed violence, extortion, agricultural drought, or lack of formal employment.',
    doctrinalReference: 'ATP 3-57.50 Section 3-4',
    keyMetric: 'Primary Push Factor Ratio',
    sentimentBreakdown: [
      { label: 'Armed Network Extortion & Violence Threats', percentage: 46, color: '#E34B4B' },
      { label: 'Lack of Living-Wage Employment', percentage: 32, color: '#FFBE2E' },
      { label: 'Agricultural Crop Failure / Drought', percentage: 14, color: '#FFBE2E' },
      { label: 'Family Reunification', percentage: 8, color: '#42BFA5' },
    ],
    strategicImplication: 'Direct threats of coercive recruitment are displacing younger demographics at twice the rate of purely economic factors.',
    dataPoints: generateClusterPoints('migration-drivers', [
      { label: 'Armed Violence Threats', color: '#E34B4B', score: 90 },
      { label: 'Job Scarcity', color: '#FFBE2E', score: 65 },
      { label: 'Drought / Crop Loss', color: '#FFBE2E', score: 48 },
    ]),
  },
  {
    id: 'migration-plans',
    name: 'Migration Plans',
    domain: 'Migration & Human Mobility',
    pmesii: 'Social',
    ascope: 'People',
    description: 'Surveyed civilian intentions to migrate within 30, 90, or 365 days, and readiness of travel logistics.',
    doctrinalReference: 'ATP 3-57.50 Chapter 4',
    keyMetric: 'Emigration Propensity',
    sentimentBreakdown: [
      { label: 'Active Departure Plans (<90 Days)', percentage: 31, color: '#E34B4B' },
      { label: 'Considering if Security Worsens', percentage: 43, color: '#FFBE2E' },
      { label: 'Committed to Remain / Anchor', percentage: 26, color: '#42BFA5' },
    ],
    strategicImplication: 'Over 40% of households are on a conditional trigger to flee if armed clashes breach the municipal perimeter.',
    dataPoints: generateClusterPoints('migration-plans', [
      { label: 'Active Departure Plans', color: '#E34B4B', score: 82 },
      { label: 'Conditional on Security', color: '#FFBE2E', score: 58 },
      { label: 'Committed to Remain', color: '#42BFA5', score: 20 },
    ]),
  },
  {
    id: 'migration-destinations',
    name: 'Migration Destinations',
    domain: 'Migration & Human Mobility',
    pmesii: 'Social',
    ascope: 'Areas',
    description: 'Targeted destination regions: US border ports of entry, northern manufacturing maquiladora hubs, or southern regional capitals.',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Destination Distribution',
    sentimentBreakdown: [
      { label: 'US Southwest Border Ports of Entry', percentage: 58, color: '#2378C3' },
      { label: 'Northern Industrial Cities (Monterrey/Juarez)', percentage: 27, color: '#39BCE5' },
      { label: 'Regional Capital (Durango/Zacatecas)', percentage: 15, color: '#42BFA5' },
    ],
    strategicImplication: 'Migrant routing aligns with contested toll highways where human smugglers (polleros) extract extortion fees.',
    dataPoints: generateClusterPoints('migration-destinations', [
      { label: 'US Border Ports', color: '#2378C3', score: 88 },
      { label: 'Northern Industrial Hubs', color: '#39BCE5', score: 62 },
      { label: 'Regional Capital', color: '#42BFA5', score: 38 },
    ]),
  },
  {
    id: 'migration-deterrents',
    name: 'Migration Deterrents',
    domain: 'Migration & Human Mobility',
    pmesii: 'Political',
    ascope: 'Structures',
    description: 'Effectiveness of border interdiction barriers, asylum processing restrictions, repatriation operations, and deterrent messaging.',
    doctrinalReference: 'JP 3-29 (Foreign Humanitarian Assistance)',
    keyMetric: 'Deterrence Efficacy Rating',
    sentimentBreakdown: [
      { label: 'High Risk / Apprehension Fear', percentage: 38, color: '#42BFA5' },
      { label: 'Smuggler Gang Kidnapping Risk', percentage: 35, color: '#E34B4B' },
      { label: 'Financial Cost Prohibitive', percentage: 19, color: '#FFBE2E' },
      { label: 'Undeterred / Absolute Intent', percentage: 8, color: '#9D5BD2' },
    ],
    strategicImplication: 'The risk of kidnap and extortion by rival armed gangs in transit states is now a larger deterrent than official border enforcement.',
    dataPoints: generateClusterPoints('migration-deterrents', [
      { label: 'Apprehension Risk', color: '#42BFA5', score: 72 },
      { label: 'Kidnapping Threat', color: '#E34B4B', score: 85 },
      { label: 'Cost Prohibitive', color: '#FFBE2E', score: 60 },
    ]),
  },

  // 5. Governance & Institutional Trust
  {
    id: 'institutional-trust',
    name: 'Institutional Trust',
    domain: 'Governance & Institutional Trust',
    pmesii: 'Political',
    ascope: 'Organizations',
    description: 'Civilian confidence ratings in core state institutions: Mexican Armed Forces (SEDENA/Batallón), National Guard, State Police, Municipal Police, and Judiciary.',
    doctrinalReference: 'ATP 3-57.50 Chapter 6 / FM 3-57',
    keyMetric: 'Net Institutional Trust Score',
    sentimentBreakdown: [
      { label: 'Armed Forces (Army / Navy / Batallón)', percentage: 68, color: '#42BFA5' },
      { label: 'National Guard (Guardia Nacional)', percentage: 54, color: '#2378C3' },
      { label: 'State Police (Policía Estatal)', percentage: 32, color: '#FFBE2E' },
      { label: 'Municipal Police (High Network Infiltration)', percentage: 14, color: '#E34B4B' },
    ],
    strategicImplication: 'Civil Affairs operations must partner exclusively with the Armed Forces and Batallón de Infantería; local municipal police suffer extreme distrust.',
    dataPoints: generateClusterPoints('institutional-trust', [
      { label: 'Armed Forces / Batallón', color: '#42BFA5', score: 88 },
      { label: 'National Guard', color: '#2378C3', score: 70 },
      { label: 'State Police', color: '#FFBE2E', score: 40 },
      { label: 'Municipal Police (Distrusted)', color: '#E34B4B', score: 18 },
    ]),
  },
  {
    id: 'corruption-domestic-issues',
    name: 'Corruption & Domestic Issues',
    domain: 'Governance & Institutional Trust',
    pmesii: 'Political',
    ascope: 'Organizations',
    description: 'Pervasiveness of systemic bribery, kickbacks in municipal contracts, impunity in criminal investigations, and civil service extortion.',
    doctrinalReference: 'ATP 3-57.50 Section 6-2',
    keyMetric: 'Perceived Corruption Index',
    sentimentBreakdown: [
      { label: 'Pervasive / Co-opted by Illicit Networks', percentage: 52, color: '#E34B4B' },
      { label: 'Moderate Bureaucratic Graft', percentage: 36, color: '#FFBE2E' },
      { label: 'Low / Transparent Administration', percentage: 12, color: '#42BFA5' },
    ],
    strategicImplication: 'CMOC aid funding must bypass municipal bank accounts directly into third-party NGO project escrow to avoid diversion.',
    dataPoints: generateClusterPoints('corruption-domestic-issues', [
      { label: 'Pervasive Corruption', color: '#E34B4B', score: 92 },
      { label: 'Moderate Graft', color: '#FFBE2E', score: 62 },
      { label: 'Transparent Oversight', color: '#42BFA5', score: 20 },
    ]),
  },
  {
    id: 'political-party',
    name: 'Political Party',
    domain: 'Governance & Institutional Trust',
    pmesii: 'Political',
    ascope: 'Organizations',
    description: 'Partisan political alignment, ruling coalition sway, opposition strongholds, and political violence targeting candidates.',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Electoral Alignment Split',
    sentimentBreakdown: [
      { label: 'National Ruling Coalition', percentage: 46, color: '#E34B4B' },
      { label: 'Traditional Opposition (PAN/PRI)', percentage: 38, color: '#2378C3' },
      { label: 'Independent / Disillusioned', percentage: 16, color: '#9D5BD2' },
    ],
    strategicImplication: 'Heightened electoral cycles trigger spike in targeted assassinations of municipal mayoral candidates by rival armed factions.',
    dataPoints: generateClusterPoints('political-party', [
      { label: 'Ruling Coalition', color: '#E34B4B', score: 65 },
      { label: 'Traditional Opposition', color: '#2378C3', score: 55 },
      { label: 'Disillusioned Non-Voters', color: '#9D5BD2', score: 35 },
    ]),
  },
  {
    id: 'priority-issue',
    name: 'Priority Issue',
    domain: 'Governance & Institutional Trust',
    pmesii: 'Social',
    ascope: 'Events',
    description: 'Rank-ordered critical concerns voiced by civilian community leaders and household heads in the AO.',
    doctrinalReference: 'ATP 3-57.50 Section 2-4',
    keyMetric: 'Top Issue Ranking',
    sentimentBreakdown: [
      { label: 'Violent Crime & Insecurity', percentage: 49, color: '#E34B4B' },
      { label: 'Food & Essential Goods Inflation', percentage: 24, color: '#FFBE2E' },
      { label: 'Potable Water & Power Outages', percentage: 18, color: '#39BCE5' },
      { label: 'Healthcare & Medicine Access', percentage: 9, color: '#42BFA5' },
    ],
    strategicImplication: 'Civil Affairs projects addressing water distribution create instant goodwill while reinforcing the primary mission of physical security.',
    dataPoints: generateClusterPoints('priority-issue', [
      { label: 'Insecurity / Violence', color: '#E34B4B', score: 94 },
      { label: 'Economic Inflation', color: '#FFBE2E', score: 72 },
      { label: 'Water & Power Outages', color: '#39BCE5', score: 65 },
    ]),
  },
  {
    id: 'favorability',
    name: 'Favorability',
    domain: 'Governance & Institutional Trust',
    pmesii: 'Political',
    ascope: 'People',
    description: 'Net favorability metrics for political leaders, military commanders, civic elders, and religious dignitaries.',
    doctrinalReference: 'ADP 3-13',
    keyMetric: 'Net Positive Favorability',
    sentimentBreakdown: [
      { label: 'Parish Clergy & Community Elders', percentage: 76, color: '#42BFA5' },
      { label: 'Batallón Commander & Military Officers', percentage: 64, color: '#2378C3' },
      { label: 'Federal Administration', percentage: 48, color: '#FFBE2E' },
      { label: 'Municipal Mayor & City Council', percentage: 22, color: '#E34B4B' },
    ],
    strategicImplication: 'Local Catholic parish priests are the highest-credibility key leader engagement (KLE) nodes in the entire sector.',
    dataPoints: generateClusterPoints('favorability', [
      { label: 'Clergy & Civic Elders', color: '#42BFA5', score: 86 },
      { label: 'Military Leadership', color: '#2378C3', score: 75 },
      { label: 'Municipal Mayor', color: '#E34B4B', score: 28 },
    ]),
  },
  {
    id: 'protective-factors',
    name: 'Protective Factors',
    domain: 'Governance & Institutional Trust',
    pmesii: 'Social',
    ascope: 'Organizations',
    description: 'Community resilience mechanisms: strong family networks, church youth shelters, agricultural cooperatives, and neighborhood defense comités.',
    doctrinalReference: 'ATP 3-57.50 Chapter 5',
    keyMetric: 'Community Resilience Score',
    sentimentBreakdown: [
      { label: 'Church Civic Networks & Food Pantries', percentage: 44, color: '#42BFA5' },
      { label: 'Agricultural Co-op Solidarity', percentage: 32, color: '#2378C3' },
      { label: 'Extended Family Safety Enclaves', percentage: 24, color: '#39BCE5' },
    ],
    strategicImplication: 'Empowering established church charity networks provides immediate humanitarian leverage without triggering adversary retribution.',
    dataPoints: generateClusterPoints('protective-factors', [
      { label: 'Church Civic Networks', color: '#42BFA5', score: 88 },
      { label: 'Agrarian Co-ops', color: '#2378C3', score: 74 },
      { label: 'Family Enclaves', color: '#39BCE5', score: 65 },
    ]),
  },

  // 6. Socio-Demographics & Human Terrain
  {
    id: 'education',
    name: 'Education',
    domain: 'Socio-Demographics & Human Terrain',
    pmesii: 'Social',
    ascope: 'People',
    description: 'Educational attainment levels: primary, lower secondary (secundaria), technical vocational, or university graduates.',
    doctrinalReference: 'ATP 3-57.50 Chapter 2',
    keyMetric: 'High School Completion Rate',
    sentimentBreakdown: [
      { label: 'Primary Only / Incomplete', percentage: 34, color: '#E34B4B' },
      { label: 'Lower Secondary (Secundaria)', percentage: 41, color: '#FFBE2E' },
      { label: 'Upper Secondary / Vocational', percentage: 19, color: '#2378C3' },
      { label: 'Higher Education / Degree', percentage: 6, color: '#42BFA5' },
    ],
    strategicImplication: 'High rates of secondary school abandonment at age 14-16 create a fertile recruitment pool for hostile militant cells.',
    dataPoints: generateClusterPoints('education', [
      { label: 'Incomplete Primary', color: '#E34B4B', score: 35 },
      { label: 'Lower Secondary', color: '#FFBE2E', score: 55 },
      { label: 'Vocational / Technical', color: '#2378C3', score: 70 },
    ]),
  },
  {
    id: 'ethnicity',
    name: 'Ethnicity',
    domain: 'Socio-Demographics & Human Terrain',
    pmesii: 'Social',
    ascope: 'People',
    description: 'Human terrain ethnic breakdown: Mestizo majorities, indigenous communities (Tepehuano, Huichol, Mexicanero), and migrant populations.',
    doctrinalReference: 'ATP 3-57.50 Appendix A',
    keyMetric: 'Indigenous Demographic Share',
    sentimentBreakdown: [
      { label: 'Mestizo Urban & Valley', percentage: 71, color: '#2378C3' },
      { label: 'Tepehuano (O\'dam) Mountain', percentage: 18, color: '#42BFA5' },
      { label: 'Huichol (Wixárika) Foothill', percentage: 8, color: '#FFBE2E' },
      { label: 'Transmigrant Cohorts', percentage: 3, color: '#9D5BD2' },
    ],
    strategicImplication: 'Indigenous communities in mountain redoubts operate under customary law (usos y costumbres) and require specialized tribal liaison protocols.',
    dataPoints: generateClusterPoints('ethnicity', [
      { label: 'Mestizo', color: '#2378C3', score: 65 },
      { label: 'Tepehuano (O\'dam)', color: '#42BFA5', score: 72 },
      { label: 'Huichol (Wixárika)', color: '#FFBE2E', score: 60 },
    ]),
  },
  {
    id: 'language',
    name: 'Language',
    domain: 'Socio-Demographics & Human Terrain',
    pmesii: 'Social',
    ascope: 'People',
    description: 'Primary linguistic spoken dialects: Spanish, O\'dam (Tepehuano), Wixárika, and bilingual proficiency.',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Bilingual Dialect Reach',
    sentimentBreakdown: [
      { label: 'Spanish Monolingual', percentage: 76, color: '#2378C3' },
      { label: 'Bilingual (Spanish + Indigenous)', percentage: 17, color: '#42BFA5' },
      { label: 'Indigenous Monolingual (Highlands)', percentage: 7, color: '#FFBE2E' },
    ],
    strategicImplication: 'Informational handouts for highland health clinics must be translated into O\'dam and Wixárika audio broadcasts.',
    dataPoints: generateClusterPoints('language', [
      { label: 'Spanish Monolingual', color: '#2378C3', score: 75 },
      { label: 'Bilingual Indigenous', color: '#42BFA5', score: 70 },
      { label: 'Highland Monolingual', color: '#FFBE2E', score: 45 },
    ]),
  },
  {
    id: 'religion',
    name: 'Religion',
    domain: 'Socio-Demographics & Human Terrain',
    pmesii: 'Social',
    ascope: 'People',
    description: 'Religious affiliations: Roman Catholicism, Evangelical Protestantism, and syncretic or narco-cult devotions (Santa Muerte, San Judas Tadeo).',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Religious Adherence Profile',
    sentimentBreakdown: [
      { label: 'Roman Catholic', percentage: 74, color: '#2378C3' },
      { label: 'Evangelical / Protestant', percentage: 14, color: '#42BFA5' },
      { label: 'Syncretic Shrines & Folk Beliefs', percentage: 9, color: '#E34B4B' },
      { label: 'Secular / None', percentage: 3, color: '#9D5BD2' },
    ],
    strategicImplication: 'The proliferation of unauthorized roadside shrines directly indicates active irregular armed gang territorial influence.',
    dataPoints: generateClusterPoints('religion', [
      { label: 'Roman Catholic', color: '#2378C3', score: 80 },
      { label: 'Evangelical', color: '#42BFA5', score: 65 },
      { label: 'Syncretic Shrines', color: '#E34B4B', score: 85 },
    ]),
  },

  // 7. Economic & Livelihood Resilience
  {
    id: 'income-monthly-mxn',
    name: 'Income (Monthly MXN)',
    domain: 'Economic & Livelihood Resilience',
    pmesii: 'Economic',
    ascope: 'Capabilities',
    description: 'Monthly household income tiers measured in Mexican Pesos (MXN) across agrarian, informal, and formal sectors.',
    doctrinalReference: 'ATP 3-57.50 Chapter 2',
    keyMetric: 'Median Monthly Income (MXN)',
    sentimentBreakdown: [
      { label: '< $5,000 MXN (Extreme Poverty)', percentage: 32, color: '#E34B4B' },
      { label: '$5,000 - $10,000 MXN (Subsistence)', percentage: 41, color: '#FFBE2E' },
      { label: '$10,000 - $20,000 MXN (Stable Informal)', percentage: 21, color: '#42BFA5' },
      { label: '> $20,000 MXN (Formal / Commercial)', percentage: 6, color: '#2378C3' },
    ],
    strategicImplication: 'Over 70% of households subsist on under $10,000 MXN (~$500 USD) monthly, making irregular militant cash stipends ($15,000 MXN/month) tempting.',
    dataPoints: generateClusterPoints('income-monthly-mxn', [
      { label: '< $5k MXN Poverty', color: '#E34B4B', score: 25 },
      { label: '$5k-$10k MXN Subsistence', color: '#FFBE2E', score: 45 },
      { label: '$10k-$20k MXN Moderate', color: '#42BFA5', score: 68 },
      { label: '> $20k MXN Upper', color: '#2378C3', score: 90 },
    ]),
  },
  {
    id: 'economic-outlook',
    name: 'Economic Outlook',
    domain: 'Economic & Livelihood Resilience',
    pmesii: 'Economic',
    ascope: 'Capabilities',
    description: 'Forward-looking 12-month civilian economic sentiment: deteriorating, static stagnation, or modest recovery.',
    doctrinalReference: 'ATP 3-57.50 Section 3-2',
    keyMetric: 'Net Economic Confidence Index',
    sentimentBreakdown: [
      { label: 'Deteriorating / Severe Crisis', percentage: 47, color: '#E34B4B' },
      { label: 'Stagnant / Uncertain', percentage: 38, color: '#FFBE2E' },
      { label: 'Improving / Optimistic', percentage: 15, color: '#42BFA5' },
    ],
    strategicImplication: 'Widespread economic pessimism directly drives emigration preparations and reduces investment in fixed agricultural assets.',
    dataPoints: generateClusterPoints('economic-outlook', [
      { label: 'Deteriorating Crisis', color: '#E34B4B', score: 85 },
      { label: 'Stagnant Outlook', color: '#FFBE2E', score: 50 },
      { label: 'Improving Sentiment', color: '#42BFA5', score: 25 },
    ]),
  },
  {
    id: 'economic-views',
    name: 'Economic Views',
    domain: 'Economic & Livelihood Resilience',
    pmesii: 'Economic',
    ascope: 'Capabilities',
    description: 'Public perspectives on price inflation, agricultural fertilizer costs, fuel accessibility, and predatory loan-sharking.',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Cost-of-Living Stress Score',
    sentimentBreakdown: [
      { label: 'Critical Food & Fuel Inflation', percentage: 51, color: '#E34B4B' },
      { label: 'Unaffordable Agricultural Inputs', percentage: 33, color: '#FFBE2E' },
      { label: 'Manageable Living Costs', percentage: 16, color: '#42BFA5' },
    ],
    strategicImplication: 'Illicit syndicate monopolies on local egg, chicken, and tortilla distribution artificially inflate food costs by 35%.',
    dataPoints: generateClusterPoints('economic-views', [
      { label: 'Critical Inflation Strain', color: '#E34B4B', score: 88 },
      { label: 'Input Cost Spikes', color: '#FFBE2E', score: 65 },
      { label: 'Manageable Costs', color: '#42BFA5', score: 30 },
    ]),
  },
  {
    id: 'employment',
    name: 'Employment',
    domain: 'Economic & Livelihood Resilience',
    pmesii: 'Economic',
    ascope: 'Capabilities',
    description: 'Workforce status: actively employed, unemployed and searching, discouraged non-participants, or seasonal farm labor.',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Labor Underutilization Rate',
    sentimentBreakdown: [
      { label: 'Employed (Formal & Informal)', percentage: 56, color: '#42BFA5' },
      { label: 'Underemployed / Seasonal Gaps', percentage: 28, color: '#FFBE2E' },
      { label: 'Unemployed / Seeking', percentage: 16, color: '#E34B4B' },
    ],
    strategicImplication: 'Seasonal dry periods leave up to 40% of young agricultural laborers without wages for four consecutive months.',
    dataPoints: generateClusterPoints('employment', [
      { label: 'Employed', color: '#42BFA5', score: 70 },
      { label: 'Underemployed', color: '#FFBE2E', score: 45 },
      { label: 'Unemployed', color: '#E34B4B', score: 20 },
    ]),
  },
  {
    id: 'employment-type',
    name: 'Employment Type',
    domain: 'Economic & Livelihood Resilience',
    pmesii: 'Economic',
    ascope: 'Capabilities',
    description: 'Distribution between formal payroll employment with social security (IMSS) and untaxed shadow informal livelihoods.',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Informality Percentage',
    sentimentBreakdown: [
      { label: 'Informal Economy / Cash-in-Hand', percentage: 62, color: '#E34B4B' },
      { label: 'Formal Salaried Payroll', percentage: 24, color: '#42BFA5' },
      { label: 'Ejido / Communal Agrarian', percentage: 14, color: '#2378C3' },
    ],
    strategicImplication: 'High informality prevents host-nation authorities from tracing revenue streams and makes workers dependent on cash transactions.',
    dataPoints: generateClusterPoints('employment-type', [
      { label: 'Informal Cash Economy', color: '#E34B4B', score: 85 },
      { label: 'Formal Salaried', color: '#42BFA5', score: 40 },
      { label: 'Communal Ejido', color: '#2378C3', score: 60 },
    ]),
  },
  {
    id: 'sector',
    name: 'Sector',
    domain: 'Economic & Livelihood Resilience',
    pmesii: 'Economic',
    ascope: 'Capabilities',
    description: 'Primary industry of occupation: agriculture and livestock, mineral mining, retail commerce, manufacturing maquilas, or public service.',
    doctrinalReference: 'ATP 3-57.50',
    keyMetric: 'Primary Economic Sector Split',
    sentimentBreakdown: [
      { label: 'Agriculture, Cattle & Forestry', percentage: 43, color: '#42BFA5' },
      { label: 'Local Commerce & Street Retail', percentage: 28, color: '#FFBE2E' },
      { label: 'Mining & Heavy Transport', percentage: 18, color: '#39BCE5' },
      { label: 'Public Services & Education', percentage: 11, color: '#2378C3' },
    ],
    strategicImplication: 'Illicit extortion rackets disproportionately target cattle transport trucks and commercial grain depots along the valley highway.',
    dataPoints: generateClusterPoints('sector', [
      { label: 'Agriculture & Cattle', color: '#42BFA5', score: 75 },
      { label: 'Commerce & Retail', color: '#FFBE2E', score: 62 },
      { label: 'Mining & Transport', color: '#39BCE5', score: 68 },
    ]),
  },
];
