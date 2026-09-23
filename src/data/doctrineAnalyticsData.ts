import { ASCOPECategory, PMESIICategory } from '../types';

// ==========================================
// 1. ANALYTICAL NOTEBOOK LINK NETWORK DATA
// (Mirrors i2 Analyst's Notebook / Palantir Topology from image.png)
// ==========================================

export type NetworkClusterType = 
  | 'ADVERSARY_THREAT'        // Contested hostile cell (Red-linked cluster)
  | 'GOVERNANCE_ELITE'        // Municipal & formal civil leadership
  | 'TRIBAL_CLERICAL'         // Traditional elders, religious figures & community arbiters
  | 'ILLICIT_BROKERS'         // Financial, precursor chemical & smuggling facilitators
  | 'CIVIL_SOCIETY_HUMANITARIAN'; // Local clinics, NGOs, agricultural co-ops

export type NetworkLinkType = 
  | 'HOSTILE_COMMAND'         // Red solid lines (Command & Control, Extortion threat)
  | 'FINANCIAL_ILLICIT'       // Cyan/Green lines (Bribery, Money laundering, Precursor trade)
  | 'COMMUNICATION_INTERLOCUTOR' // Blue/Indigo lines (Advisory, Regular meetings, Backchannel)
  | 'KINSHIP_TRIBAL'          // Slate dashed lines (Family, Clan, Marriage ties)
  | 'CIVIL_FACILITATION';     // Emerald lines (Aid delivery, Public services, Medical support)

export interface NetworkNode {
  id: string;
  name: string;
  moniker: string;
  role: string;
  cluster: NetworkClusterType;
  x: number; // 0 - 1000 SVG space
  y: number; // 0 - 650 SVG space
  degreeCentrality: number;
  betweennessCentrality: number; // 0 - 1.0 (Broker Score)
  riskScore: number; // 0 - 100
  disposition: number; // -100 (Hostile) to +100 (Friendly)
  tier: 'TIER_1_HVI' | 'TIER_2_KEY_LEADER' | 'TIER_3_NODE';
  baseballCardId?: string;
  isCutPoint?: boolean; // Critical single point of failure in network
}

export interface NetworkLink {
  id: string;
  source: string;
  target: string;
  type: NetworkLinkType;
  weight: number; // 1 - 5
  description: string;
  confidence: number; // %
}

// 22 Interconnected Nodes matching image.png multi-cluster topology
export const ANALYST_NETWORK_NODES: NetworkNode[] = [
  // Cluster A: Threat / Adversary Syndicate Core (Central Red Triangle Cluster in image)
  {
    id: 'node-beltran',
    name: 'Don Hector Beltrán',
    moniker: '"El Sombra"',
    role: 'Regional Plaza Boss & Syndicate Commander',
    cluster: 'ADVERSARY_THREAT',
    x: 540,
    y: 330,
    degreeCentrality: 9,
    betweennessCentrality: 0.89,
    riskScore: 94,
    disposition: -88,
    tier: 'TIER_1_HVI',
    baseballCardId: 'card-beltran',
    isCutPoint: true,
  },
  {
    id: 'node-sicario-lead',
    name: 'Mateo "El Gavilán" Ruiz',
    moniker: '"El Gavilán"',
    role: 'Enforcer Wing Commander',
    cluster: 'ADVERSARY_THREAT',
    x: 620,
    y: 410,
    degreeCentrality: 6,
    betweennessCentrality: 0.42,
    riskScore: 90,
    disposition: -95,
    tier: 'TIER_2_KEY_LEADER',
    baseballCardId: 'card-gavilan',
  },
  {
    id: 'node-smuggler-rep',
    name: 'Alonso Varga',
    moniker: '"El Contador"',
    role: 'Plaza Money Launderer & Extortion Collector',
    cluster: 'ADVERSARY_THREAT',
    x: 480,
    y: 440,
    degreeCentrality: 7,
    betweennessCentrality: 0.74,
    riskScore: 82,
    disposition: -72,
    tier: 'TIER_2_KEY_LEADER',
    baseballCardId: 'card-varga',
  },
  {
    id: 'node-threat-cell-1',
    name: 'Plaza Lookout Network',
    moniker: '"Halcones Norte"',
    role: 'Surveillance & Forward Spotters',
    cluster: 'ADVERSARY_THREAT',
    x: 660,
    y: 530,
    degreeCentrality: 4,
    betweennessCentrality: 0.18,
    riskScore: 78,
    disposition: -80,
    tier: 'TIER_3_NODE',
  },
  {
    id: 'node-threat-cell-2',
    name: 'Ruta 45 Precursor Transit Cell',
    moniker: '"Corredor Sur"',
    role: 'Chemical Precursor Armed Escort',
    cluster: 'ADVERSARY_THREAT',
    x: 420,
    y: 520,
    degreeCentrality: 5,
    betweennessCentrality: 0.31,
    riskScore: 86,
    disposition: -90,
    tier: 'TIER_3_NODE',
  },

  // Cluster B: Municipal Governance & Elite (Top Center Cluster)
  {
    id: 'node-mayor-soto',
    name: 'Mayor Elena Soto-Rios',
    moniker: '"La Alcaldesa"',
    role: 'Municipal Mayor (Durango Corridor)',
    cluster: 'GOVERNANCE_ELITE',
    x: 510,
    y: 130,
    degreeCentrality: 8,
    betweennessCentrality: 0.82,
    riskScore: 48,
    disposition: 32,
    tier: 'TIER_1_HVI',
    baseballCardId: 'card-soto',
    isCutPoint: true,
  },
  {
    id: 'node-police-chief',
    name: 'Col. Javier Mendez (Ret.)',
    moniker: '"El Coronel"',
    role: 'Municipal Public Security Director',
    cluster: 'GOVERNANCE_ELITE',
    x: 420,
    y: 90,
    degreeCentrality: 7,
    betweennessCentrality: 0.68,
    riskScore: 62,
    disposition: 18,
    tier: 'TIER_1_HVI',
    baseballCardId: 'card-mendez',
    isCutPoint: true,
  },
  {
    id: 'node-public-works',
    name: 'Ing. Carlos Morales',
    moniker: '"El Ingeniero"',
    role: 'Municipal Water & Electrical Grid Superintendent',
    cluster: 'GOVERNANCE_ELITE',
    x: 580,
    y: 70,
    degreeCentrality: 5,
    betweennessCentrality: 0.45,
    riskScore: 35,
    disposition: 65,
    tier: 'TIER_2_KEY_LEADER',
    baseballCardId: 'card-morales',
  },
  {
    id: 'node-court-magistrate',
    name: 'Lic. Sofia Calderon',
    moniker: '"La Fiscal"',
    role: 'Regional District Court Magistrate',
    cluster: 'GOVERNANCE_ELITE',
    x: 350,
    y: 160,
    degreeCentrality: 4,
    betweennessCentrality: 0.28,
    riskScore: 55,
    disposition: 40,
    tier: 'TIER_2_KEY_LEADER',
  },

  // Cluster C: Tribal / Clerical / Moral Authorities (Left Wing)
  {
    id: 'node-padre-vega',
    name: 'Padre Mateo Vega',
    moniker: '"El Párroco"',
    role: 'Diocesan Vicar & Parish Mediator',
    cluster: 'TRIBAL_CLERICAL',
    x: 270,
    y: 280,
    degreeCentrality: 8,
    betweennessCentrality: 0.91,
    riskScore: 22,
    disposition: 85,
    tier: 'TIER_1_HVI',
    baseballCardId: 'card-vega',
    isCutPoint: true,
  },
  {
    id: 'node-elder-lucero',
    name: 'Don Braulio Lucero',
    moniker: '"El Comisariado"',
    role: 'Ejido Communal Council President',
    cluster: 'TRIBAL_CLERICAL',
    x: 180,
    y: 220,
    degreeCentrality: 5,
    betweennessCentrality: 0.52,
    riskScore: 28,
    disposition: 72,
    tier: 'TIER_2_KEY_LEADER',
    baseballCardId: 'card-lucero',
  },
  {
    id: 'node-sheikh-ibrahim',
    name: 'Sheikh Ibrahim Khalil',
    moniker: '"Al-Hajji"',
    role: 'Tribal Water Canal & Elder Council Lead',
    cluster: 'TRIBAL_CLERICAL',
    x: 170,
    y: 350,
    degreeCentrality: 4,
    betweennessCentrality: 0.44,
    riskScore: 38,
    disposition: 45,
    tier: 'TIER_2_KEY_LEADER',
    baseballCardId: 'card-khalil',
  },
  {
    id: 'node-youth-counselor',
    name: 'Maestra Luciana Cruz',
    moniker: '"La Maestra"',
    role: 'Regional Teachers Union & Youth Shelter Director',
    cluster: 'TRIBAL_CLERICAL',
    x: 110,
    y: 290,
    degreeCentrality: 3,
    betweennessCentrality: 0.21,
    riskScore: 19,
    disposition: 90,
    tier: 'TIER_3_NODE',
  },

  // Cluster D: Illicit Broker / Precursor Chemical Syndicate (Tightly Coupled Ring on Right in image.png)
  {
    id: 'node-chemical-broker',
    name: 'Dario "El Químico" Wong',
    moniker: '"El Químico"',
    role: 'Precursor Chemical Import Broker (Manzanillo-Durango)',
    cluster: 'ILLICIT_BROKERS',
    x: 840,
    y: 260,
    degreeCentrality: 7,
    betweennessCentrality: 0.78,
    riskScore: 88,
    disposition: -65,
    tier: 'TIER_1_HVI',
    baseballCardId: 'card-wong',
    isCutPoint: true,
  },
  {
    id: 'node-customs-fixer',
    name: 'Raul Montalvo',
    moniker: '"El Despachador"',
    role: 'Intermodal Port Freight Clearing Agent',
    cluster: 'ILLICIT_BROKERS',
    x: 770,
    y: 210,
    degreeCentrality: 5,
    betweennessCentrality: 0.35,
    riskScore: 76,
    disposition: -50,
    tier: 'TIER_2_KEY_LEADER',
  },
  {
    id: 'node-warehouse-distributor',
    name: 'Transportes Rápidos del Norte',
    moniker: '"Bodega Central"',
    role: 'Precursor Chemical Staging Depot',
    cluster: 'ILLICIT_BROKERS',
    x: 910,
    y: 210,
    degreeCentrality: 6,
    betweennessCentrality: 0.41,
    riskScore: 84,
    disposition: -78,
    tier: 'TIER_2_KEY_LEADER',
  },
  {
    id: 'node-shell-company',
    name: 'Agroquímica Sierra Madre S.A.',
    moniker: '"La Tapadera"',
    role: 'Dual-Use Fertilizer Import Front',
    cluster: 'ILLICIT_BROKERS',
    x: 820,
    y: 350,
    degreeCentrality: 5,
    betweennessCentrality: 0.29,
    riskScore: 80,
    disposition: -70,
    tier: 'TIER_3_NODE',
  },
  {
    id: 'node-courier-subcell',
    name: 'Ruta Montaña Smuggling Couriers',
    moniker: '"Los Pasadores"',
    role: 'Cross-Border Mule Network',
    cluster: 'ILLICIT_BROKERS',
    x: 920,
    y: 340,
    degreeCentrality: 4,
    betweennessCentrality: 0.15,
    riskScore: 85,
    disposition: -85,
    tier: 'TIER_3_NODE',
  },

  // Cluster E: Civil Society, Agricultural Co-ops & Medical Responders (Bottom Center-Left)
  {
    id: 'node-valeria-ramos',
    name: 'Valeria Ramos',
    moniker: '"La Presidenta"',
    role: 'Regional Agricultural Co-op President',
    cluster: 'CIVIL_SOCIETY_HUMANITARIAN',
    x: 340,
    y: 390,
    degreeCentrality: 8,
    betweennessCentrality: 0.85,
    riskScore: 25,
    disposition: 78,
    tier: 'TIER_1_HVI',
    baseballCardId: 'card-ramos',
    isCutPoint: true,
  },
  {
    id: 'node-dr-husseini',
    name: 'Dr. Tariq Al-Husseini',
    moniker: '"El Director Médico"',
    role: 'Provincial Hospital & Emergency Clinic Lead',
    cluster: 'CIVIL_SOCIETY_HUMANITARIAN',
    x: 260,
    y: 470,
    degreeCentrality: 6,
    betweennessCentrality: 0.62,
    riskScore: 18,
    disposition: 88,
    tier: 'TIER_1_HVI',
    baseballCardId: 'card-husseini',
  },
  {
    id: 'node-red-cross-lead',
    name: 'Cruz Roja Regional Logistics',
    moniker: '"Ambulancias Central"',
    role: 'Emergency Medical & Disaster Response Node',
    cluster: 'CIVIL_SOCIETY_HUMANITARIAN',
    x: 210,
    y: 540,
    degreeCentrality: 4,
    betweennessCentrality: 0.38,
    riskScore: 12,
    disposition: 95,
    tier: 'TIER_2_KEY_LEADER',
  },
  {
    id: 'node-merchant-guild',
    name: 'Mercado Benito Juárez Syndicate',
    moniker: '"Los Comerciantes"',
    role: 'Food Supply & Wholesale Commodity Guild',
    cluster: 'CIVIL_SOCIETY_HUMANITARIAN',
    x: 340,
    y: 530,
    degreeCentrality: 5,
    betweennessCentrality: 0.49,
    riskScore: 32,
    disposition: 68,
    tier: 'TIER_2_KEY_LEADER',
  },
];

// Links replicating the red, blue, and cyan lines seen in image.png
export const ANALYST_NETWORK_LINKS: NetworkLink[] = [
  // RED HOSTILE COMMAND & EXTORTION LINKS (Matches the prominent red triangle in image.png)
  { id: 'l-1', source: 'node-beltran', target: 'node-sicario-lead', type: 'HOSTILE_COMMAND', weight: 5, description: 'Direct Command & Operational Orders', confidence: 95 },
  { id: 'l-2', source: 'node-beltran', target: 'node-smuggler-rep', type: 'HOSTILE_COMMAND', weight: 4, description: 'Financial Oversight & Plaza Tax Enforcement', confidence: 90 },
  { id: 'l-3', source: 'node-beltran', target: 'node-police-chief', type: 'HOSTILE_COMMAND', weight: 4, description: 'Coercive Extortion & Compromise Pressure', confidence: 85 },
  { id: 'l-4', source: 'node-beltran', target: 'node-mayor-soto', type: 'HOSTILE_COMMAND', weight: 3, description: 'Extortion threat on Municipal Budget', confidence: 80 },
  { id: 'l-5', source: 'node-sicario-lead', target: 'node-threat-cell-1', type: 'HOSTILE_COMMAND', weight: 4, description: 'Tactical deployment of spotters', confidence: 92 },
  { id: 'l-6', source: 'node-sicario-lead', target: 'node-threat-cell-2', type: 'HOSTILE_COMMAND', weight: 4, description: 'Armed escort of precursor shipments', confidence: 88 },
  { id: 'l-7', source: 'node-smuggler-rep', target: 'node-threat-cell-2', type: 'HOSTILE_COMMAND', weight: 3, description: 'Payment of transit tolls', confidence: 85 },
  { id: 'l-8', source: 'node-beltran', target: 'node-valeria-ramos', type: 'HOSTILE_COMMAND', weight: 3, description: 'Extortion demand on Co-op Avocado/Corn Harvest', confidence: 82 },

  // CYAN/GREEN ILLICIT FINANCIAL & PRECURSOR LINKS (The right satellite cluster in image.png)
  { id: 'l-9', source: 'node-beltran', target: 'node-chemical-broker', type: 'FINANCIAL_ILLICIT', weight: 5, description: 'Exclusive Precursor Sourcing Contract', confidence: 88 },
  { id: 'l-10', source: 'node-chemical-broker', target: 'node-customs-fixer', type: 'FINANCIAL_ILLICIT', weight: 4, description: 'Bribe payment for manifest falsification', confidence: 90 },
  { id: 'l-11', source: 'node-chemical-broker', target: 'node-warehouse-distributor', type: 'FINANCIAL_ILLICIT', weight: 5, description: 'Bulk chemical drumming and transfer', confidence: 95 },
  { id: 'l-12', source: 'node-chemical-broker', target: 'node-shell-company', type: 'FINANCIAL_ILLICIT', weight: 4, description: 'Corporate entity laundering chemical bills', confidence: 87 },
  { id: 'l-13', source: 'node-customs-fixer', target: 'node-warehouse-distributor', type: 'FINANCIAL_ILLICIT', weight: 3, description: 'Cargo clearance receipts', confidence: 82 },
  { id: 'l-14', source: 'node-warehouse-distributor', target: 'node-shell-company', type: 'FINANCIAL_ILLICIT', weight: 4, description: 'Fertilizer blending manifest', confidence: 86 },
  { id: 'l-15', source: 'node-warehouse-distributor', target: 'node-courier-subcell', type: 'FINANCIAL_ILLICIT', weight: 4, description: 'Night transport courier dispatches', confidence: 89 },
  { id: 'l-16', source: 'node-shell-company', target: 'node-courier-subcell', type: 'FINANCIAL_ILLICIT', weight: 3, description: 'Secondary logistics route funding', confidence: 79 },
  { id: 'l-17', source: 'node-smuggler-rep', target: 'node-chemical-broker', type: 'FINANCIAL_ILLICIT', weight: 4, description: 'Cash settlement & crypto payout', confidence: 84 },

  // BLUE INTERLOCUTOR & GOVERNANCE LINKS
  { id: 'l-18', source: 'node-mayor-soto', target: 'node-police-chief', type: 'COMMUNICATION_INTERLOCUTOR', weight: 4, description: 'Municipal Security Cabinet Meetings', confidence: 95 },
  { id: 'l-19', source: 'node-mayor-soto', target: 'node-public-works', type: 'COMMUNICATION_INTERLOCUTOR', weight: 5, description: 'Infrastructure repair authorization', confidence: 98 },
  { id: 'l-20', source: 'node-mayor-soto', target: 'node-court-magistrate', type: 'COMMUNICATION_INTERLOCUTOR', weight: 3, description: 'Judicial coordination', confidence: 88 },
  { id: 'l-21', source: 'node-mayor-soto', target: 'node-padre-vega', type: 'COMMUNICATION_INTERLOCUTOR', weight: 4, description: 'Backchannel mediation on adversary threats', confidence: 91 },
  { id: 'l-22', source: 'node-police-chief', target: 'node-court-magistrate', type: 'COMMUNICATION_INTERLOCUTOR', weight: 3, description: 'Arrest warrant execution', confidence: 85 },
  { id: 'l-23', source: 'node-police-chief', target: 'node-valeria-ramos', type: 'COMMUNICATION_INTERLOCUTOR', weight: 3, description: 'Rural agricultural patrol requests', confidence: 78 },

  // MORAL & COMMUNITY BRIDGES (Padre Vega & Valeria Ramos as Key Interlocutors)
  { id: 'l-24', source: 'node-padre-vega', target: 'node-elder-lucero', type: 'COMMUNICATION_INTERLOCUTOR', weight: 5, description: 'Ejido communal land assembly mediation', confidence: 96 },
  { id: 'l-25', source: 'node-padre-vega', target: 'node-valeria-ramos', type: 'COMMUNICATION_INTERLOCUTOR', weight: 5, description: 'Co-op food bank & farmer protection council', confidence: 94 },
  { id: 'l-26', source: 'node-padre-vega', target: 'node-sheikh-ibrahim', type: 'COMMUNICATION_INTERLOCUTOR', weight: 4, description: 'Interfaith community water dispute resolution', confidence: 88 },
  { id: 'l-27', source: 'node-padre-vega', target: 'node-youth-counselor', type: 'COMMUNICATION_INTERLOCUTOR', weight: 4, description: 'Youth anti-recruitment sanctuary coordination', confidence: 92 },
  { id: 'l-28', source: 'node-elder-lucero', target: 'node-youth-counselor', type: 'COMMUNICATION_INTERLOCUTOR', weight: 3, description: 'Community school safeguarding', confidence: 86 },
  { id: 'l-29', source: 'node-sheikh-ibrahim', target: 'node-dr-husseini', type: 'COMMUNICATION_INTERLOCUTOR', weight: 4, description: 'Canal water purification & cholera prevention', confidence: 90 },

  // CIVIL SOCIETY & HUMANITARIAN LINKS
  { id: 'l-30', source: 'node-valeria-ramos', target: 'node-merchant-guild', type: 'CIVIL_FACILITATION', weight: 5, description: 'Daily crop delivery & price stabilizing pact', confidence: 95 },
  { id: 'l-31', source: 'node-valeria-ramos', target: 'node-dr-husseini', type: 'CIVIL_FACILITATION', weight: 4, description: 'Rural mobile medical clinic staging', confidence: 92 },
  { id: 'l-32', source: 'node-dr-husseini', target: 'node-red-cross-lead', type: 'CIVIL_FACILITATION', weight: 5, description: 'Mass casualty & ambulance dispatch protocol', confidence: 98 },
  { id: 'l-33', source: 'node-dr-husseini', target: 'node-public-works', type: 'COMMUNICATION_INTERLOCUTOR', weight: 4, description: 'Hospital emergency backup generator feed', confidence: 93 },
  { id: 'l-34', source: 'node-merchant-guild', target: 'node-red-cross-lead', type: 'CIVIL_FACILITATION', weight: 3, description: 'Displaced families ration supply', confidence: 85 },

  // KINSHIP & INFORMAL TIES
  { id: 'l-35', source: 'node-police-chief', target: 'node-valeria-ramos', type: 'KINSHIP_TRIBAL', weight: 2, description: 'First cousins (Shared family land in El Cazadero)', confidence: 95 },
  { id: 'l-36', source: 'node-smuggler-rep', target: 'node-merchant-guild', type: 'HOSTILE_COMMAND', weight: 3, description: 'Plaza extortive collection from market vendors', confidence: 88 },
  { id: 'l-37', source: 'node-elder-lucero', target: 'node-public-works', type: 'COMMUNICATION_INTERLOCUTOR', weight: 3, description: 'Ejido irrigation pump maintenance petitions', confidence: 84 },
];

// ==========================================
// 2. MILITARY INTELLIGENCE BASEBALL CARDS
// (Standard US Army FM 3-57 / ATP 2-01.3 / JP 3-57 Format)
// ==========================================

export interface BaseballCardActor {
  id: string;
  name: string;
  moniker: string;
  photoUrl: string;
  role: string;
  organization: string;
  tier: 'TIER_1_HVI' | 'TIER_2_KEY_LEADER' | 'TIER_3_NODE';
  dispositionScore: number; // -100 Hostile to +100 Friendly
  dispositionLabel: 'HOSTILE' | 'OPPOSED' | 'CAUTIOUS_NEUTRAL' | 'COOPERATIVE' | 'ALIGNED_PARTNER';
  gridCoordinates: string; // MGRS
  geographicLocation: string;
  aorAffiliation: string;
  primaryCommunicationChannel: string;
  securityClassification: string;
  lastEngagementDTG: string;
  assignedCATeam: string;

  // Trait Analysis Matrix (0 - 100)
  traits: {
    riskTolerance: number;       // Willingness to confront adversary threats
    transactionalism: number;    // Motivated by economic/political payoff vs doctrine
    powerDistance: number;       // Adherence to hierarchy vs informal action
    publicPrivateDivergence: number; // Says one thing publicly, does opposite privately
    communityProtection: number; // Genuine commitment to civilian populace welfare
    ideologicalRigidity: number; // Inflexible dogma vs pragmatic negotiation
  };

  // Sentiment Analysis Trends (30-day tracking)
  sentiment: {
    currentScore: number; // -100 to +100
    thirtyDayTrend: 'SHARPLY_IMPROVING' | 'STEADY' | 'DEGRADING' | 'VOLATILE';
    sentimentTowardHostNation: number;
    sentimentTowardCoalition: number;
    sentimentTowardAdversary: number;
    primarySentimentDriver: string;
  };

  // Operational Context
  motivations: string[];
  vulnerabilities: string[];
  leveragePoints: string[];
  counterIntelligenceRisks: string[];
  interlocutorPath: string[]; // Recommended hop-sequence to engage safely

  // Historical Engagements
  engagementLog: {
    dtg: string;
    team: string;
    summary: string;
    sentimentOutcome: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    commitmentsMade: string;
  }[];
}

export const BASEBALL_CARD_ACTORS: BaseballCardActor[] = [
  {
    id: 'card-soto',
    name: 'Elena Soto-Rios',
    moniker: '"La Alcaldesa"',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    role: 'Municipal Mayor',
    organization: 'Municipal Government of El Cazadero',
    tier: 'TIER_1_HVI',
    dispositionScore: 32,
    dispositionLabel: 'CAUTIOUS_NEUTRAL',
    gridCoordinates: '13R EH 4820 5410',
    geographicLocation: 'Durango-Zacatecas Corridor, Sector North',
    aorAffiliation: 'USNORTHCOM (CMOC-North)',
    primaryCommunicationChannel: 'Encrypted Signal / CMOC Liaison Officer',
    securityClassification: 'UNCLASSIFIED // FOUO // REL TO USA, FVEY',
    lastEngagementDTG: '201630Z SEP 26',
    assignedCATeam: 'CAT 712 / Alpha Co / 96th CA BN',

    traits: {
      riskTolerance: 35,
      transactionalism: 58,
      powerDistance: 70,
      publicPrivateDivergence: 75,
      communityProtection: 82,
      ideologicalRigidity: 20,
    },

    sentiment: {
      currentScore: 32,
      thirtyDayTrend: 'SHARPLY_IMPROVING',
      sentimentTowardHostNation: 45,
      sentimentTowardCoalition: 68,
      sentimentTowardAdversary: -80,
      primarySentimentDriver: 'Frustration over federal delays in police payroll and adversary threats against municipal water works.',
    },

    motivations: [
      'Protecting her extended family from adversary retaliatory assassination.',
      'Securing federal or coalition grant funding for town water filtration upgrade.',
      'Preserving reelection viability without appearing subordinate to foreign military forces.',
    ],
    vulnerabilities: [
      'Municipal treasury operates at 40% deficit due to extortive syndicate skimming.',
      'Public security force has 6 officers under active hostile network bribery investigation.',
      'Vulnerable municipal water station situated outside fortified military zone.',
    ],
    leveragePoints: [
      'Provision of emergency engineering support to restore municipal water pump.',
      'Interlocutor introduction through Padre Mateo Vega (her trusted confessor).',
      'Civil Affairs medical civic action program (MEDCAP) in Barrio Lomas del Río.',
    ],
    counterIntelligenceRisks: [
      'Deputy Mayor suspected of passing municipal schedule to hostile surveillance spotters.',
      'Mayor uses unencrypted cellular phone for family calls.',
    ],
    interlocutorPath: ['CAT 712', 'Padre Mateo Vega', 'Elena Soto-Rios'],
    engagementLog: [
      {
        dtg: '201630Z SEP 26',
        team: 'CAT 712',
        summary: 'Met in private chamber of Municipal Hall with CA Team Leader and Bilingual Interlocutor. Addressed water facility threats.',
        sentimentOutcome: 'POSITIVE',
        commitmentsMade: 'CA agreed to conduct technical power audit of Substation Alpha; Mayor agreed to share police dispatch logs.',
      },
      {
        dtg: '141000Z SEP 26',
        team: 'CAT 712',
        summary: 'Initial formal courtesy call with Municipal Council.',
        sentimentOutcome: 'NEUTRAL',
        commitmentsMade: 'Agreed to establish weekly Civil-Military Coordination Board.',
      },
    ],
  },
  {
    id: 'card-mendez',
    name: 'Col. Javier Mendez (Ret.)',
    moniker: '"El Coronel"',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    role: 'Municipal Public Security Director',
    organization: 'Municipal Police Department (Sector North)',
    tier: 'TIER_1_HVI',
    dispositionScore: 18,
    dispositionLabel: 'CAUTIOUS_NEUTRAL',
    gridCoordinates: '13R EH 4650 5380',
    geographicLocation: 'Batallón de Infantería Garrison Perimeter',
    aorAffiliation: 'USNORTHCOM',
    primaryCommunicationChannel: 'VHF Tactical Land Mobile Radio / In-person CMOC',
    securityClassification: 'UNCLASSIFIED // FOUO',
    lastEngagementDTG: '191100Z SEP 26',
    assignedCATeam: 'CAT 712 / CMOC North',

    traits: {
      riskTolerance: 62,
      transactionalism: 40,
      powerDistance: 90,
      publicPrivateDivergence: 65,
      communityProtection: 60,
      ideologicalRigidity: 50,
    },

    sentiment: {
      currentScore: 18,
      thirtyDayTrend: 'STEADY',
      sentimentTowardHostNation: 25,
      sentimentTowardCoalition: 55,
      sentimentTowardAdversary: -75,
      primarySentimentDriver: 'Severely outgunned by hostile enforcers carrying heavy weapons; desperate for tactical communications and armor support.',
    },

    motivations: [
      'Keeping his surviving 45 police officers alive.',
      'Honoring his former Army officer commission and restoring civic order.',
      'Shielding his family residing in Torreón from hostile kidnap squads.',
    ],
    vulnerabilities: [
      'Lack of armored patrol vehicles; 3 officers ambushed on Ruta 45 in August.',
      'High turnover among rank-and-file officers due to meager wages.',
    ],
    leveragePoints: [
      'Joint training on police community liaison techniques with CA.',
      'Equipment transfer of non-lethal riot control and tactical first aid trauma kits.',
      'Direct coordination through his cousin Valeria Ramos (President of Agricultural Co-op).',
    ],
    counterIntelligenceRisks: [
      'Heavy surveillance of police station by hostile motorcycle spotters.',
      'Potential penetration of police radio frequency band by adversary scanner.',
    ],
    interlocutorPath: ['CAT 712', 'Valeria Ramos (Cousin)', 'Col. Javier Mendez'],
    engagementLog: [
      {
        dtg: '191100Z SEP 26',
        team: 'CAT 712',
        summary: 'Security assessment at Municipal Police Headquarters. Inspected communication room.',
        sentimentOutcome: 'POSITIVE',
        commitmentsMade: 'CA agreed to repair 2 diesel backup generators; Mendez offered joint patrols along farm market route.',
      },
    ],
  },
  {
    id: 'card-vega',
    name: 'Padre Mateo Vega',
    moniker: '"El Párroco"',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    role: 'Diocesan Vicar & Parish Mediator',
    organization: 'Diocese of Durango / Parish of San Judas Tadeo',
    tier: 'TIER_1_HVI',
    dispositionScore: 85,
    dispositionLabel: 'ALIGNED_PARTNER',
    gridCoordinates: '13R EH 4790 5450',
    geographicLocation: 'San Judas Tadeo Parish Center',
    aorAffiliation: 'USNORTHCOM (Doctrinal Moral Arbiter)',
    primaryCommunicationChannel: 'Face-to-face in Parish Courtyard',
    securityClassification: 'UNCLASSIFIED // FOUO // REL TO USA, FVEY',
    lastEngagementDTG: '210900Z SEP 26',
    assignedCATeam: 'CAT 712',

    traits: {
      riskTolerance: 88,
      transactionalism: 12,
      powerDistance: 30,
      publicPrivateDivergence: 15,
      communityProtection: 98,
      ideologicalRigidity: 40,
    },

    sentiment: {
      currentScore: 85,
      thirtyDayTrend: 'SHARPLY_IMPROVING',
      sentimentTowardHostNation: 40,
      sentimentTowardCoalition: 82,
      sentimentTowardAdversary: -95,
      primarySentimentDriver: 'Desire to halt forced hostile recruitment of teenage altar boys and protect vulnerable migrant shelter residents.',
    },

    motivations: [
      'Sanctity of human life and shielding young parishioners from hostile armed gang induction.',
      'Facilitating peaceful conflict de-escalation without military crossfire.',
      'Sustaining the parish food pantry feeding 1,200 displaced families weekly.',
    ],
    vulnerabilities: [
      'Unprotected physical presence in community; walks through contested neighborhoods unarmed.',
      'Church charity funds frequently extorted by local illicit network bagmen.',
    ],
    leveragePoints: [
      'Direct coordination of humanitarian food and hygiene distribution through Catholic Relief Services.',
      'Moral standing allows him to bridge rival factions without fear of immediate assassination.',
      'Key access node to Mayor Elena Soto-Rios and Ejido Elders.',
    ],
    counterIntelligenceRisks: [
      'Hostile informants frequently attend confession to monitor church visitors.',
      'Over-association with US military forces could erode his perceived neutrality.',
    ],
    interlocutorPath: ['CAT 712', 'Padre Mateo Vega (Direct Entry Node)'],
    engagementLog: [
      {
        dtg: '210900Z SEP 26',
        team: 'CAT 712',
        summary: 'Met in church cloisters over coffee. Shared intelligence on forced youth recruitment by "El Gavilán" cell.',
        sentimentOutcome: 'POSITIVE',
        commitmentsMade: 'CA agreed to provide 500 family food parcels to church pantry; Padre agreed to arrange quiet meeting with Co-op President Ramos.',
      },
    ],
  },
  {
    id: 'card-ramos',
    name: 'Valeria Ramos',
    moniker: '"La Presidenta"',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    role: 'President, Regional Agricultural Syndicate',
    organization: 'Cooperativa Agrícola Valle de la Sauceda (1,400 Farmers)',
    tier: 'TIER_1_HVI',
    dispositionScore: 78,
    dispositionLabel: 'COOPERATIVE',
    gridCoordinates: '13R EH 4510 5280',
    geographicLocation: 'Co-op Grain Silo & Agricultural Market Depot',
    aorAffiliation: 'USNORTHCOM (Economic LOE Center of Gravity)',
    primaryCommunicationChannel: 'Signal Messenger / Co-op General Office',
    securityClassification: 'UNCLASSIFIED // FOUO',
    lastEngagementDTG: '201400Z SEP 26',
    assignedCATeam: 'CAT 712',

    traits: {
      riskTolerance: 75,
      transactionalism: 50,
      powerDistance: 45,
      publicPrivateDivergence: 25,
      communityProtection: 92,
      ideologicalRigidity: 30,
    },

    sentiment: {
      currentScore: 78,
      thirtyDayTrend: 'STEADY',
      sentimentTowardHostNation: 35,
      sentimentTowardCoalition: 75,
      sentimentTowardAdversary: -92,
      primarySentimentDriver: 'Illicit armed syndicate extortion demands 20% of corn harvest profits; desperate for legal security to keep co-op operational.',
    },

    motivations: [
      'Economic survival of smallholder farming families.',
      'Preventing armed factions from seizing fertile communal ejido land for chemical stash houses.',
      'Securing irrigation water rights and fertilizer supply chain.',
    ],
    vulnerabilities: [
      'Agricultural harvest convoys frequently hijacked along Highway 45.',
      'High debt burden due to inflated black-market precursor fertilizer prices.',
    ],
    leveragePoints: [
      'Facilitating certified fertilizer distribution bypass through USAID/Host-Nation agricultural program.',
      'Providing engineering grading for rural farm-to-market feeder roads.',
      'Her cousin is Col. Javier Mendez; her spiritual advisor is Padre Vega.',
    ],
    counterIntelligenceRisks: [
      'Adversary informants embedded among warehouse loading dock workers.',
    ],
    interlocutorPath: ['CAT 712', 'Padre Mateo Vega', 'Valeria Ramos'],
    engagementLog: [
      {
        dtg: '201400Z SEP 26',
        team: 'CAT 712',
        summary: 'Site visit to Grain Storage Silos. Discussed alternative logistics convoy security.',
        sentimentOutcome: 'POSITIVE',
        commitmentsMade: 'CA agreed to coordinate with Military Police for market-day route presence.',
      },
    ],
  },
  {
    id: 'card-beltran',
    name: 'Hector Beltrán',
    moniker: '"El Sombra"',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    role: 'Plaza Boss & Contested Threat Actor',
    organization: 'Cártel de Durango (Federation Plaza Lead)',
    tier: 'TIER_1_HVI',
    dispositionScore: -88,
    dispositionLabel: 'HOSTILE',
    gridCoordinates: '13R EH 5120 4890',
    geographicLocation: 'Ranchería El Mezquite (Contested Safehouse)',
    aorAffiliation: 'USNORTHCOM (Adversary Threat Node)',
    primaryCommunicationChannel: 'Burner SAT-Phone / Human Courier Only',
    securityClassification: 'SECRET // NOFORN (Threat Intelligence Profile)',
    lastEngagementDTG: 'NON-ENGAGED (SURVEILLANCE ONLY)',
    assignedCATeam: 'J-2 / S-2 Special Threat Tracking',

    traits: {
      riskTolerance: 95,
      transactionalism: 85,
      powerDistance: 95,
      publicPrivateDivergence: 90,
      communityProtection: 10,
      ideologicalRigidity: 65,
    },

    sentiment: {
      currentScore: -88,
      thirtyDayTrend: 'DEGRADING',
      sentimentTowardHostNation: -95,
      sentimentTowardCoalition: -99,
      sentimentTowardAdversary: 10,
      primarySentimentDriver: 'Viewing Civil Affairs economic alternative programs as direct existential threat to his chemical transit monopoly.',
    },

    motivations: [
      'Retaining absolute armed control of Highway 45 precursor chemical trafficking corridor.',
      'Eliminating municipal police interference through systematic assassination and intimidation.',
      'Laundering narco-profits through agricultural shell companies.',
    ],
    vulnerabilities: [
      'Heavily reliant on imported precursor chemicals cleared by Dario Wong.',
      'Bitter territorial dispute with rival armed syndicate on southern flank.',
      'Suffers from type-2 diabetes requiring regular pharmaceutical insulin deliveries.',
    ],
    leveragePoints: [
      'Interdiction of precursor chemical broker Dario Wong paralyzes his revenue.',
      'Exposing his extortive skimming to local farming communities through civil information broadcasts.',
    ],
    counterIntelligenceRisks: [
      'Commands 60+ heavily armed sicarios equipped with RPGs and armored technicals.',
      'Extensive corrupt informant ring in regional prosecutor office.',
    ],
    interlocutorPath: ['DO NOT ENGAGE DIRECTLY - NON-PERMISSIVE THREAT TARGET'],
    engagementLog: [],
  },
  {
    id: 'card-husseini',
    name: 'Dr. Tariq Al-Husseini',
    moniker: '"El Director Médico"',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    role: 'Chief Medical Officer & Trauma Director',
    organization: 'Ibn Sina Regional Trauma Hospital',
    tier: 'TIER_1_HVI',
    dispositionScore: 88,
    dispositionLabel: 'ALIGNED_PARTNER',
    gridCoordinates: '38T LN 2140 8120',
    geographicLocation: 'AO Griffin (USCENTCOM), Tigris River Valley',
    aorAffiliation: 'USCENTCOM (Civil Infrastructure Node)',
    primaryCommunicationChannel: 'Hospital Landline / Medical Officer Liaison',
    securityClassification: 'UNCLASSIFIED // FOUO',
    lastEngagementDTG: '211500Z SEP 26',
    assignedCATeam: 'CAT 731 / CMOC Griffin',

    traits: {
      riskTolerance: 80,
      transactionalism: 20,
      powerDistance: 40,
      publicPrivateDivergence: 10,
      communityProtection: 96,
      ideologicalRigidity: 15,
    },

    sentiment: {
      currentScore: 88,
      thirtyDayTrend: 'SHARPLY_IMPROVING',
      sentimentTowardHostNation: 50,
      sentimentTowardCoalition: 85,
      sentimentTowardAdversary: -95,
      primarySentimentDriver: 'Gratitude for CA fuel delivery powering surgical theater generators during municipal blackout.',
    },

    motivations: [
      'Maintaining continuous power and clean water for pediatric trauma ward.',
      'Securing certified pharmaceutical supplies free from counterfeit adulteration.',
      'Training local civilian nurses in mass casualty triage.',
    ],
    vulnerabilities: [
      'Hospital diesel reserves last only 48 hours without replenishment.',
      'Militia harassment of female medical staff during transit.',
    ],
    leveragePoints: [
      'Direct integration with Civil Affairs MEDCAP and medical resupply line.',
      'Close ally of Sheikh Ibrahim Khalil regarding municipal sanitary canal health.',
    ],
    counterIntelligenceRisks: [
      'Adversary cells attempt to extract wounded fighters by force at night.',
    ],
    interlocutorPath: ['CAT 731', 'Dr. Tariq Al-Husseini'],
    engagementLog: [
      {
        dtg: '211500Z SEP 26',
        team: 'CAT 731',
        summary: 'Emergency delivery of 5,000 liters of diesel fuel for ICU backup generators.',
        sentimentOutcome: 'POSITIVE',
        commitmentsMade: 'CA agreed to install solar hybrid panels; Hospital agreed to share epidemiological outbreak telemetry.',
      },
    ],
  },
  {
    id: 'card-khalil',
    name: 'Sheikh Ibrahim Khalil',
    moniker: '"Al-Hajji"',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    role: 'Tribal Water Canal & Elder Council Lead',
    organization: 'Tigris Valley Tribal Confederation',
    tier: 'TIER_2_KEY_LEADER',
    dispositionScore: 45,
    dispositionLabel: 'CAUTIOUS_NEUTRAL',
    gridCoordinates: '38T LN 1950 7980',
    geographicLocation: 'AO Griffin (USCENTCOM), Tigris River Valley',
    aorAffiliation: 'USCENTCOM',
    primaryCommunicationChannel: 'Tribal Majlis In-Person Sessions',
    securityClassification: 'UNCLASSIFIED // FOUO',
    lastEngagementDTG: '181400Z SEP 26',
    assignedCATeam: 'CAT 731',

    traits: {
      riskTolerance: 60,
      transactionalism: 70,
      powerDistance: 85,
      publicPrivateDivergence: 60,
      communityProtection: 80,
      ideologicalRigidity: 55,
    },

    sentiment: {
      currentScore: 45,
      thirtyDayTrend: 'STEADY',
      sentimentTowardHostNation: 20,
      sentimentTowardCoalition: 52,
      sentimentTowardAdversary: -60,
      primarySentimentDriver: 'Demands equitable canal water distribution between upstream and downstream agricultural clans.',
    },

    motivations: [
      'Preserving tribal prestige and honor of the Albu-Nimr clan.',
      'Preventing central government from seizing private tribal irrigation wells.',
      'Securing employment for tribal youth to prevent insurgent recruitment.',
    ],
    vulnerabilities: [
      'Tribal canal infrastructure severely silted and subject to salinization.',
      'Rivalry with neighboring downstream clan over water pumping quotas.',
    ],
    leveragePoints: [
      'Civil Affairs heavy equipment canal dredging initiative.',
      'Honoring tribal elders with traditional cultural respect in formal majlis.',
    ],
    counterIntelligenceRisks: [
      'Dual hedging: Maintains contacts with both Coalition forces and local militia commanders.',
    ],
    interlocutorPath: ['CAT 731', 'Dr. Tariq Al-Husseini', 'Sheikh Ibrahim Khalil'],
    engagementLog: [
      {
        dtg: '181400Z SEP 26',
        team: 'CAT 731',
        summary: 'Attended tribal majlis. Shared tea and discussed irrigation canal repair timeline.',
        sentimentOutcome: 'POSITIVE',
        commitmentsMade: 'CA agreed to provide excavator support for 10km canal clearing; Sheikh agreed to provide security for survey teams.',
      },
    ],
  },
  {
    id: 'card-wong',
    name: 'Dario "El Químico" Wong',
    moniker: '"El Químico"',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    role: 'Chemical Import Broker & Financial Intermediary',
    organization: 'Trans-Pacific Freight Solutions & Agroquímica S.A.',
    tier: 'TIER_1_HVI',
    dispositionScore: -65,
    dispositionLabel: 'OPPOSED',
    gridCoordinates: '13R EH 5840 5120',
    geographicLocation: 'Regional Commercial Hub / Warehouse Sector',
    aorAffiliation: 'USNORTHCOM / USINDOPACOM Nexus',
    primaryCommunicationChannel: 'WeChat / Encrypted ProtonMail',
    securityClassification: 'CONFIDENTIAL // REL TO USA, FVEY',
    lastEngagementDTG: 'NON-ENGAGED',
    assignedCATeam: 'Threat Finance Exploitation Unit',

    traits: {
      riskTolerance: 85,
      transactionalism: 98,
      powerDistance: 50,
      publicPrivateDivergence: 95,
      communityProtection: 5,
      ideologicalRigidity: 10,
    },

    sentiment: {
      currentScore: -65,
      thirtyDayTrend: 'VOLATILE',
      sentimentTowardHostNation: -50,
      sentimentTowardCoalition: -70,
      sentimentTowardAdversary: 30,
      primarySentimentDriver: 'Purely profit-driven; fears customs seizure of dual-use chemical shipping containers.',
    },

    motivations: [
      'Maximizing profit margin on methylamine, piperidine, and chemical precursor imports.',
      'Maintaining plausible deniability via legitimate industrial agricultural paperwork.',
    ],
    vulnerabilities: [
      'Over-reliance on three Pacific shipping container line manifests.',
      'Significant financial assets held in offshore bank accounts vulnerable to sanctions.',
    ],
    leveragePoints: [
      'Treasury sanctions and port customs manifests audit.',
      'Transactional vulnerability: Can be pressured if commercial import licenses are revoked.',
    ],
    counterIntelligenceRisks: [
      'Employs private armed corporate security with counter-surveillance technology.',
    ],
    interlocutorPath: ['DO NOT ENGAGE DIRECTLY - ECONOMIC INTERDICTION TARGET'],
    engagementLog: [],
  },
];

// ==========================================
// 3. MEASURES OF EFFECTIVENESS (MOE) & MEASURES OF PERFORMANCE (MOP)
// (US Army JP 5-0 Chapter VI, FM 5-0, FM 3-57 / ATP 3-57.80 Doctrinal Standards)
// ==========================================

export interface MopItem {
  id: string;
  name: string;
  category: 'TASK_COMPLETION' | 'INPUT_OUTPUT' | 'RECON_SURVEY';
  lineOfEffort: string;
  target: number;
  actual: number;
  unit: string;
  percentComplete: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
  reportingUnit: string;
  lastUpdatedDTG: string;
  description: string;
}

export interface MoeItem {
  id: string;
  name: string;
  lineOfEffort: string;
  desiredEndState: string;
  baselineScore: number;
  targetScore: number;
  currentScore: number;
  trend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
  status: 'ON_TARGET' | 'MARGINAL' | 'CRITICAL_CONCERN';
  causalMopIds: string[]; // Tracing which MOP inputs drove this MOE outcome
  indicatorSource: string;
  doctrinalAssessment: string;
}

export const DOCTRINAL_MOPS: MopItem[] = [
  {
    id: 'mop-1',
    name: 'Key Leader Engagements (KLE) Conducted',
    category: 'TASK_COMPLETION',
    lineOfEffort: 'LOE 1: Civil Governance Legitimacy',
    target: 30,
    actual: 26,
    unit: 'Engagements',
    percentComplete: 87,
    status: 'ON_TRACK',
    reportingUnit: 'CAT 712 / CMOC North',
    lastUpdatedDTG: '211200Z SEP 26',
    description: 'Direct bilateral engagements with municipal mayors, police directors, and community elders.',
  },
  {
    id: 'mop-2',
    name: 'Critical Infrastructure Assessments Completed',
    category: 'RECON_SURVEY',
    lineOfEffort: 'LOE 2: Essential Services Resilience',
    target: 15,
    actual: 14,
    unit: 'Facilities',
    percentComplete: 93,
    status: 'ON_TRACK',
    reportingUnit: 'Civil Affairs Technical Specialist Team',
    lastUpdatedDTG: '201800Z SEP 26',
    description: 'Detailed SWEAT-MSO surveys of electrical substations, water pumping facilities, and regional hospitals.',
  },
  {
    id: 'mop-3',
    name: 'Certified Fertilizer & Seed Aid Distributed',
    category: 'INPUT_OUTPUT',
    lineOfEffort: 'LOE 4: Alternative Economic Livelihoods',
    target: 500,
    actual: 410,
    unit: 'Metric Tons',
    percentComplete: 82,
    status: 'ON_TRACK',
    reportingUnit: 'CAT 712 / USAID Interagency Partner',
    lastUpdatedDTG: '191600Z SEP 26',
    description: 'Distribution of legitimate agricultural inputs to Cooperativa Agrícola to replace illicit chemical dependence.',
  },
  {
    id: 'mop-4',
    name: 'Emergency Generator Diesel Refueling Missions',
    category: 'INPUT_OUTPUT',
    lineOfEffort: 'LOE 2: Essential Services Resilience',
    target: 20000,
    actual: 16500,
    unit: 'Liters',
    percentComplete: 83,
    status: 'ON_TRACK',
    reportingUnit: '96th CA BN Logistics Element',
    lastUpdatedDTG: '210600Z SEP 26',
    description: 'Fuel delivery to Ibn Sina Hospital and municipal water pumping backup generator bays.',
  },
  {
    id: 'mop-5',
    name: 'Civil Information Messages Broadcast via Local Radio',
    category: 'TASK_COMPLETION',
    lineOfEffort: 'LOE 3: Information Advantage & Cognitive Defense',
    target: 60,
    actual: 38,
    unit: 'Broadcasts',
    percentComplete: 63,
    status: 'AT_RISK',
    reportingUnit: 'Information Operations Cell / PAO',
    lastUpdatedDTG: '211000Z SEP 26',
    description: 'Verified civil advisories on potable water availability, safe humanitarian routes, and extortion reporting hotlines.',
  },
  {
    id: 'mop-6',
    name: 'Displaced Civilian Registrations Processed at CMOC',
    category: 'INPUT_OUTPUT',
    lineOfEffort: 'LOE 1: Civil Governance Legitimacy',
    target: 3500,
    actual: 3120,
    unit: 'Civilians',
    percentComplete: 89,
    status: 'ON_TRACK',
    reportingUnit: 'CMOC Intake & Protection Cell',
    lastUpdatedDTG: '202000Z SEP 26',
    description: 'Formal biometric screening, vulnerability triage, and humanitarian assistance card issuance.',
  },
];

export const DOCTRINAL_MOES: MoeItem[] = [
  {
    id: 'moe-1',
    name: 'Civilian Population Trust in Host-Nation Law Enforcement',
    lineOfEffort: 'LOE 1: Civil Governance Legitimacy',
    desiredEndState: 'Civilian populace actively reports hostile intimidation and views police as legitimate security providers.',
    baselineScore: 24,
    targetScore: 65,
    currentScore: 54,
    trend: 'IMPROVING',
    status: 'ON_TARGET',
    causalMopIds: ['mop-1', 'mop-5'],
    indicatorSource: 'Civil Survey Sampling (n=450) & Anonymous Tip Line Volume',
    doctrinalAssessment: 'Trust index up +30% following visible joint community patrols and dismissal of compromised police deputies.',
  },
  {
    id: 'moe-2',
    name: 'Municipal Potable Water Continuity & Flow Reliability',
    lineOfEffort: 'LOE 2: Essential Services Resilience',
    desiredEndState: 'Municipal water distribution operates at >= 90% uptime without adversary extortion shutdown.',
    baselineScore: 42,
    targetScore: 90,
    currentScore: 84,
    trend: 'IMPROVING',
    status: 'ON_TARGET',
    causalMopIds: ['mop-2', 'mop-4'],
    indicatorSource: 'SCADA Flow Telemetry & Municipal Water Board Reports',
    doctrinalAssessment: 'Auxiliary generator installation at Substation Alpha stabilized water pressure for 45,000 residents.',
  },
  {
    id: 'moe-3',
    name: 'Illicit Network Coercive Extortion Freedom of Action Index',
    lineOfEffort: 'LOE 4: Alternative Economic Livelihoods',
    desiredEndState: 'Reduction of illicit syndicate harvest extortion tax to < 10% of local agricultural output.',
    baselineScore: 78, // High extortion
    targetScore: 15, // Low extortion
    currentScore: 38,
    trend: 'IMPROVING',
    status: 'ON_TARGET',
    causalMopIds: ['mop-1', 'mop-3'],
    indicatorSource: 'Co-op Ledger Audits & Key Informant Reports',
    doctrinalAssessment: 'Alternative convoy logistics routes and armed military police corridor patrols reduced farm hijackings by 62%.',
  },
  {
    id: 'moe-4',
    name: 'Counter-Disinformation Narrative Resonance Ratio',
    lineOfEffort: 'LOE 3: Information Advantage & Cognitive Defense',
    desiredEndState: 'Local population belief in host-nation/coalition civil advisories outpaces adversary rumors 3:1.',
    baselineScore: 0.8,
    targetScore: 3.0,
    currentScore: 1.9,
    trend: 'STABLE',
    status: 'MARGINAL',
    causalMopIds: ['mop-5'],
    indicatorSource: 'WhatsApp/Telegram Cognitive Monitor & Interlocutor Survey',
    doctrinalAssessment: 'Adversary network broadcasts deepfake allegations of water poisoning. Local radio broadcasts helped stabilize public calm but social media resonance remains contested.',
  },
];

// ==========================================
// 4. NARRATIVE & INTERLOCUTOR PATHWAYS
// (ADP 3-13 Information Advantage & FM 3-57 Doctrine)
// ==========================================

export interface CompetingNarrative {
  id: string;
  theme: string;
  narrativeType: 'ADVERSARY_MALIGN' | 'COALITION_HOST_NATION' | 'GRASSROOTS_CIVIL';
  coreMessage: string;
  targetAudience: string;
  channels: string[];
  velocity: 'RAPID' | 'STEADY' | 'WANING';
  resonanceScore: number; // 0 - 100
  counterNarrativeVector: string;
  verificationEvidence: string;
}

export interface InterlocutorPathway {
  id: string;
  targetActorName: string;
  targetRole: string;
  objective: string;
  frictionLevel: 'LOW' | 'MODERATE' | 'HIGH';
  steps: {
    hop: number;
    actor: string;
    action: string;
    trustScore: number;
    culturalProtocol: string;
  }[];
}

export const COMPETING_NARRATIVES: CompetingNarrative[] = [
  {
    id: 'nar-1',
    theme: 'Government Abandonment & Adversary Protector Myth',
    narrativeType: 'ADVERSARY_MALIGN',
    coreMessage: '"The central government and American military forces are here to steal your land and poison your water; only the Syndicate provides order, jobs, and security."',
    targetAudience: 'Unemployed rural youth and ejido farming families along Highway 45 corridor.',
    channels: ['Militant ballad recordings on TikTok/YouTube', 'WhatsApp forward chains', 'Banner display on overpasses'],
    velocity: 'RAPID',
    resonanceScore: 68,
    counterNarrativeVector: 'Expose adversary extortion ledger showing 20% tax on farmers; showcase real municipal water upgrades delivered by local workers.',
    verificationEvidence: 'Water quality laboratory certs posted publicly in church courtyard by Padre Vega.',
  },
  {
    id: 'nar-2',
    theme: 'Sovereign Civic Restoration & Communal Dignity',
    narrativeType: 'COALITION_HOST_NATION',
    coreMessage: '"We stand beside your lawful municipal leaders and teachers to rebuild clean water, reliable power, and lawful farming livelihoods free from extortion."',
    targetAudience: 'Municipal civil servants, merchant syndicate members, mothers, and parish congregants.',
    channels: ['Radio La Sauceda 94.1 FM', 'Parish pulpit announcements', 'CMOC Town Hall assemblies'],
    velocity: 'STEADY',
    resonanceScore: 72,
    counterNarrativeVector: 'Reinforce through visible civil deeds (generators running, medicine delivered) rather than mere verbal rhetoric.',
    verificationEvidence: 'Physical operation of Ibn Sina Clinic trauma unit with 24/7 continuous lighting.',
  },
  {
    id: 'nar-3',
    theme: 'Caught in the Crossfire / Plea for Civilian Sanctuary',
    narrativeType: 'GRASSROOTS_CIVIL',
    coreMessage: '"Do not fight your battles in our streets; leave our schools, clinics, and children alone."',
    targetAudience: 'General civilian population, regional NGOs, and international humanitarian observers.',
    channels: ['Community word of mouth', 'Parish prayer vigils', 'Local teachers union assemblies'],
    velocity: 'STEADY',
    resonanceScore: 89,
    counterNarrativeVector: 'Acknowledge legitimacy of civil grievance; establish strict no-fire humanitarian deconfliction zones around schools and clinics.',
    verificationEvidence: 'CMOC publication of Protected Civil Infrastructure No-Strike List with exact MGRS coordinates.',
  },
];

export const INTERLOCUTOR_PATHWAYS: InterlocutorPathway[] = [
  {
    id: 'path-mayor',
    targetActorName: 'Mayor Elena Soto-Rios',
    targetRole: 'Municipal Mayor',
    objective: 'Gain formal municipal authorization to harden municipal water facility and deploy civil-military quick-impact projects.',
    frictionLevel: 'MODERATE',
    steps: [
      {
        hop: 1,
        actor: 'CAT 712 Team Leader',
        action: 'Engage Padre Mateo Vega during morning parish charity distribution.',
        trustScore: 92,
        culturalProtocol: 'Bring civilian medical supplies for parish pantry; meet informally in cloister with no body armor.',
      },
      {
        hop: 2,
        actor: 'Padre Mateo Vega',
        action: 'Personally vouch for CA team integrity to Mayor Elena Soto-Rios during private family pastoral visit.',
        trustScore: 88,
        culturalProtocol: 'Emphasize humanitarian and community protection benefits, ensuring mayor will not be labeled a collaborator.',
      },
      {
        hop: 3,
        actor: 'Mayor Elena Soto-Rios',
        action: 'Host bilateral Civil-Military Security Working Session in private municipal library.',
        trustScore: 75,
        culturalProtocol: 'Respect formal civic protocol; present formal written request signed by Task Force Commander.',
      },
    ],
  },
  {
    id: 'path-police-chief',
    targetActorName: 'Col. Javier Mendez (Ret.)',
    targetRole: 'Municipal Public Security Director',
    objective: 'Establish joint deconfliction protocol and tactical radio relay between police dispatch and CMOC.',
    frictionLevel: 'LOW',
    steps: [
      {
        hop: 1,
        actor: 'CAT 712 Team Sergeant',
        action: 'Conduct joint site survey of Co-op grain storage with Valeria Ramos (Mendez\'s cousin).',
        trustScore: 85,
        culturalProtocol: 'Discuss family ties respectfully; highlight desire to protect rural farmers.',
      },
      {
        hop: 2,
        actor: 'Valeria Ramos',
        action: 'Call Col. Mendez to confirm Coalition engineering team is authentic and supportive of local families.',
        trustScore: 94,
        culturalProtocol: 'Informal family phone call outside police station.',
      },
      {
        hop: 3,
        actor: 'Col. Javier Mendez',
        action: 'Conduct formal security coordination meeting at Batallón Garrison CMOC.',
        trustScore: 82,
        culturalProtocol: 'Military officer courtesies (salute, formal title, address as "Mi Coronel").',
      },
    ],
  },
];

// ==========================================
// 5. COA DEVELOPMENT & WARGAMING
// (FM 5-0 MDMP Step 3 COA Development & Step 4 COA Analysis/Wargaming)
// ==========================================

export interface WargameTurn {
  turnNumber: number;
  timeframe: string;
  action: string;             // Friendly Civil-Military Action
  threatReaction: string;     // Adversary / Hostile Malign Reaction
  civilReaction: string;      // Civilian Population Behavior & Impact
  counteraction: string;      // Coalition / Host-Nation Counteraction
  secondThirdOrderEffects: string[];
  decisionPoint: string;      // Commander Decision Point & Trigger
  ccirTriggered: string;      // CCIR / PIR verification
}

export interface DetailedCoa {
  id: string;
  name: string;
  doctrineType: string;
  leadLineOfEffort: string;
  commandersIntent: string;
  keyCivilAffairsTasks: string[];
  civilVulnerabilityMitigation: string;
  wargameTurns: WargameTurn[];
  feasibilityScore: number; // 0 - 100
  acceptabilityScore: number;
  suitabilityScore: number;
  completenessScore: number;
  distinguishabilityScore: number;
  residualCivilianRisk: 'LOW' | 'MODERATE' | 'HIGH';
}

export const DOCTRINAL_COAS: DetailedCoa[] = [
  {
    id: 'coa-1',
    name: 'COA 1: Institutional Citadel & Infrastructure Hardening',
    doctrineType: 'FM 3-57 / FM 5-0 Synchronized Conventional Stabilization',
    leadLineOfEffort: 'LOE 1: Formal Civil Governance & LOE 2: Critical Infrastructure',
    commandersIntent: 'Anchor civil stabilization around fortified municipal garrison and formal institutions. Harden Substation Alpha, water distribution hubs, and hospital corridors. Provide direct security escort to municipal police.',
    keyCivilAffairsTasks: [
      'Install perimeter security and blast walls around Substation Alpha and Water Pump Station 1.',
      'Embed Civil Affairs Liaison Officer in Municipal Mayor Elena Soto-Rios office.',
      'Deploy 100kW diesel generators to Ibn Sina Trauma Hospital with 30-day fuel reserve.',
      'Establish central CMOC at Batallón de Infantería garrison.',
    ],
    civilVulnerabilityMitigation: 'Reduces civilian power and water loss risks by 85%; concentrates security resources around essential lifelines.',
    wargameTurns: [
      {
        turnNumber: 1,
        timeframe: 'D-Day to D+30 (Fortification Phase)',
        action: 'Engineer units erect HESCO barriers and automated sensor suites at Substation Alpha; CAT 712 delivers hospital generator fuel.',
        threatReaction: 'Adversary Beltrán cell avoids direct confrontation at fortified facilities; pivots to ambushing isolated rural farm convoys on Highway 45.',
        civilReaction: 'Urban population feels immediate reassurance; rural farmers in outer ejidos complain that military is ignoring their security.',
        counteraction: 'Establish mobile Civil-Military Quick Reaction patrols along Highway 45 during morning farm transit hours.',
        secondThirdOrderEffects: [
          'Urban market food prices drop by 15% due to reliable refrigeration.',
          'Hostile extortion demands spike on outlying farms to compensate for lost urban revenue.',
        ],
        decisionPoint: 'DP 1: If adversary shifts to attacking power pylons in unfortified mountain passes, transition engineering teams to rapid line repair teams.',
        ccirTriggered: 'PIR 1: Indications of hostile heavy weapons (RPGs, .50 cal) positioned along Highway 45 bridge crossings.',
      },
      {
        turnNumber: 2,
        timeframe: 'D+30 to D+90 (Municipal Integration Phase)',
        action: 'Transfer security monitoring of fortified infrastructure to trained municipal police officers under Col. Mendez.',
        threatReaction: 'Hostile cell conducts targeted cyber-doxxing and text message death threats against family members of police officers.',
        civilReaction: 'Six police officers submit resignation letters; Padre Vega convenes emergency prayer sanctuary for police families.',
        counteraction: 'Provide emergency family relocation sanctuary at Batallón Garrison safe housing; deploy civil information counter-messaging.',
        secondThirdOrderEffects: [
          'Strengthens moral solidarity between Church and municipal police.',
          'Police morale stabilizes once families are protected in garrison housing.',
        ],
        decisionPoint: 'DP 2: If police resignations exceed 20%, deploy Coalition Military Police for co-patrolling.',
        ccirTriggered: 'FFIR 1: Any assassination or serious injury of municipal leadership or CA personnel.',
      },
      {
        turnNumber: 3,
        timeframe: 'D+90 to D+180 (Sustained Transition Phase)',
        action: 'Full integration of municipal public works into computerized SCADA telemetry connected to CMOC civil monitoring dashboard.',
        threatReaction: 'Adversary attempts bribery of public works technicians to introduce SCADA industrial malware.',
        civilReaction: 'Technicians report bribery attempt directly to CMOC due to newly established trust and competitive salary stipends.',
        counteraction: 'Cyber Defense team isolates municipal SCADA network; prosecutor issues arrest warrant for chemical broker Dario Wong.',
        secondThirdOrderEffects: [
          'Precursor chemical smuggling network loses insider municipal access.',
          'Municipal water uptime achieves 96% operational stability.',
        ],
        decisionPoint: 'DP 3: Authorize handover of municipal governance oversight to State Civil Protection Secretariat.',
        ccirTriggered: 'PIR 2: Identification of external cyber-attack signatures targeting municipal SCADA systems.',
      },
    ],
    feasibilityScore: 92,
    acceptabilityScore: 85,
    suitabilityScore: 90,
    completenessScore: 88,
    distinguishabilityScore: 85,
    residualCivilianRisk: 'LOW',
  },
  {
    id: 'coa-2',
    name: 'COA 2: Asymmetric Civic Interception & Decentralized Stabilization',
    doctrineType: 'FM 3-57 / ATP 3-57.50 Special Warfare & Grassroots Civil Action',
    leadLineOfEffort: 'LOE 4: Alternative Economic Livelihoods & Informal Interlocutors',
    commandersIntent: 'Bypass compromised and rigid municipal bureaucracy. Partner directly with Cooperativa Agrícola (Valeria Ramos), church charity networks (Padre Vega), and tribal councils. Deploy decentralized solar water pumps and distribute micro-fertilizer grants directly to farming families.',
    keyCivilAffairsTasks: [
      'Deliver 500 metric tons of certified agricultural fertilizer directly to 1,400 co-op farm members.',
      'Equip 12 rural ejido communities with off-grid solar water purification trailers.',
      'Fund parish youth sports leagues and technical vocational training to eliminate illicit recruitment pool.',
      'Establish decentralized CMOC satellite clinics in church parish halls.',
    ],
    civilVulnerabilityMitigation: 'Directly undermines the adversary financial and recruitment base; eliminates civilian economic reliance on hostile precursor smuggling.',
    wargameTurns: [
      {
        turnNumber: 1,
        timeframe: 'D-Day to D+30 (Direct Empowerment Phase)',
        action: 'CA teams deliver certified organic fertilizer directly to co-op warehouses; Padre Vega blesses seed distribution.',
        threatReaction: 'Hostile armed enforcers attempt to intimidate co-op truck drivers at night; threaten to burn grain silos.',
        civilReaction: 'Farmers assemble communal self-defense watch ("Ronda Comunitaria"); alert municipal police and CA team.',
        counteraction: 'Deploy visible Coalition presence and UAV overhead surveillance along co-op harvest transit corridor.',
        secondThirdOrderEffects: [
          'Farmers retain 100% of harvest profits; household purchasing power increases by 35%.',
          'Militant recruitment among young farm laborers drops by 60%.',
        ],
        decisionPoint: 'DP 1: If adversary attempts violent attack on grain silo, deploy Host-Nation National Guard quick reaction force.',
        ccirTriggered: 'PIR 1: Physical mobilization of armed hostile technicals toward agricultural co-op depot.',
      },
      {
        turnNumber: 2,
        timeframe: 'D+30 to D+90 (Decentralized Energy & Water Phase)',
        action: 'Install 12 solar water pumping micro-grids in outlying rural villages.',
        threatReaction: 'Hostile extortionists attempt to impose "water taxes" on solar pump stations.',
        civilReaction: 'Village elders refuse payment; women\'s committee guards water distribution points and reports extortionists to church radio.',
        counteraction: 'Broadcast names of extortionist spotters on Radio La Sauceda; expose extortion tactics publicly.',
        secondThirdOrderEffects: [
          'Adversary suffers severe loss of legitimacy among rural population.',
          'Two hostile plaza lookouts surrender to local authorities.',
        ],
        decisionPoint: 'DP 2: Expand solar water micro-grid program to southern municipal districts.',
        ccirTriggered: 'PIR 2: Interlocutor reports of internal leadership dispute between Beltrán and local enforcers.',
      },
      {
        turnNumber: 3,
        timeframe: 'D+90 to D+180 (Economic Consolidation Phase)',
        action: 'Establish formal agricultural export contracts linking Cooperativa Agrícola to national supermarket chains.',
        threatReaction: 'Hostile precursor chemical transit route is completely starved of local labor and forced into remote desert trails.',
        civilReaction: 'Ejido communal assembly formally votes to ban illicit syndicate presence from communal lands.',
        counteraction: 'Provide legal support and land tenure security documentation through municipal magistrate.',
        secondThirdOrderEffects: [
          'Permanent reduction in illicit poppy and precursor production in Sector North.',
          'Creation of 450 permanent legal agricultural jobs.',
        ],
        decisionPoint: 'DP 3: Transition CA focus from emergency relief to long-term economic development liaison.',
        ccirTriggered: 'PIR 3: Complete cessation of adversary precursor chemical warehousing in target sector.',
      },
    ],
    feasibilityScore: 88,
    acceptabilityScore: 92,
    suitabilityScore: 94,
    completenessScore: 86,
    distinguishabilityScore: 95,
    residualCivilianRisk: 'MODERATE',
  },
  {
    id: 'coa-3',
    name: 'COA 3: Cognitive & Narrative Counter-Encirclement',
    doctrineType: 'ADP 3-13 Information Advantage / OIE Focus',
    leadLineOfEffort: 'LOE 3: Information Advantage & Cognitive Defense',
    commandersIntent: 'Wage an aggressive, information-led campaign to delegitimize the adversary hierarchy, protect civilian cognitive space from terror threats, and synchronize public transparency across radio, digital platforms, and community leaders.',
    keyCivilAffairsTasks: [
      'Deploy mobile FM radio broadcast transmitters to saturate contested frequencies with verified civil notices.',
      'Publicly publish real-time SCADA water quality and power restoration telemetry to disprove adversary poison rumors.',
      'Partner with regional journalists and teachers union to conduct digital literacy and counter-disinformation workshops.',
      'Establish anonymous civilian grievance and extortion reporting SMS hotline.',
    ],
    civilVulnerabilityMitigation: 'Immunizes civilian populace against panic, false alarms, and psychological surrender to adversary threats.',
    wargameTurns: [
      {
        turnNumber: 1,
        timeframe: 'D-Day to D+30 (Cognitive Shielding)',
        action: 'Launch daily Civil Information Radio Hour hosted jointly by Padre Vega and Dr. Husseini.',
        threatReaction: 'Adversary deploys localized radio jamming and spreads viral voice notes claiming Coalition is poisoning water supply.',
        civilReaction: 'Initial panic buying of bottled water in downtown markets; long queues form at public fountains.',
        counteraction: 'Dr. Husseini conducts live televised chemical testing of municipal tap water; Mayor Soto drinks tap water on live stream.',
        secondThirdOrderEffects: [
          'Adversary voice-note campaign thoroughly debunked within 48 hours.',
          'Civilian trust in Radio La Sauceda surges to 84%.',
        ],
        decisionPoint: 'DP 1: If jamming persists, shift broadcast frequencies and deploy loudhailer civilian notification vans.',
        ccirTriggered: 'PIR 1: Detection of commercial-off-the-shelf radio jamming equipment in Sector North.',
      },
      {
        turnNumber: 2,
        timeframe: 'D+30 to D+90 (Truth & Transparency Infiltration)',
        action: 'Declassify and publish drone video of hostile enforcers dumping toxic precursor chemical waste into irrigation canals.',
        threatReaction: 'Severe public backlash against illicit syndicate; Beltrán enforcers attempt to burn local print newspaper office.',
        civilReaction: 'Widespread public outrage; 1,500 citizens stage peaceful protest in municipal square demanding criminal arrests.',
        counteraction: 'Municipal police under Col. Mendez protect protesters; state police arrest chemical transit spotters.',
        secondThirdOrderEffects: [
          'Total destruction of adversary "benefactor" narrative.',
          'Surge in anonymous civilian tips on hostile safehouse locations (+340%).',
        ],
        decisionPoint: 'DP 2: Coordinate with Host-Nation judicial task force to unseal federal indictment against Hector Beltrán.',
        ccirTriggered: 'PIR 2: Severe threat of retaliatory arson against civil infrastructure by fleeing hostile members.',
      },
      {
        turnNumber: 3,
        timeframe: 'D+90 to D+180 (Institutional Consensus)',
        action: 'Facilitate signing of "Pact for Civic Dignity" signed by Mayor, Police Chief, Church, Co-op, and Youth Union.',
        threatReaction: 'Isolated adversary remnants retreat south into Sierra Madre mountains.',
        civilReaction: 'Civil society groups establish permanent independent civic monitoring council.',
        counteraction: 'Transition information support to local municipal public affairs team.',
        secondThirdOrderEffects: [
          'Durable civic resilience independent of external military presence.',
          'Precursor chemical smuggling corridor collapsed.',
        ],
        decisionPoint: 'DP 3: Complete mission handover and retrograde of specialized information operations personnel.',
        ccirTriggered: 'PIR 3: Confirmation of adversary command structure displacement from municipal district.',
      },
    ],
    feasibilityScore: 84,
    acceptabilityScore: 90,
    suitabilityScore: 86,
    completenessScore: 82,
    distinguishabilityScore: 92,
    residualCivilianRisk: 'MODERATE',
  },
];
