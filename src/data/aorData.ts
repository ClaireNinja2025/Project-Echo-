export interface CombatantCommandAOR {
  id: string;
  name: string;
  acronym: 'USCENTCOM' | 'USEUCOM' | 'USINDOPACOM' | 'USAFRICOM' | 'USNORTHCOM' | 'USSOUTHCOM';
  hqLocation: string;
  hqCoordinates: { lat: number; lng: number };
  mapCenter: { x: number; y: number }; // Relative percentage on 2D projection
  realCenter: [number, number]; // [Latitude, Longitude] for real GIS map
  zoomLevel: number;
  realPolygon: [number, number][]; // [Latitude, Longitude] boundary vertices
  colorTheme: {
    stroke: string;
    fill: string;
    badge: string;
    text: string;
  };
  geographicScope: string;
  countriesCount: number;
  populationCovered: string;
  assignedCivilAffairsUnits: {
    primaryCacom: string;
    homeStation: string;
    supportingBrigades: string[];
    specialOperationsComponent: string;
  };
  civilStabilityScore: number; // 0 - 100
  stabilityStatus: 'STABLE' | 'MODERATE_STRESS' | 'ELEVATED_CONTEST' | 'CRITICAL_DISRUPTION';
  activeCivilMissions: {
    name: string;
    location: string;
    focusArea: string;
    status: 'ACTIVE' | 'ONGOING' | 'PREPAREDNESS';
  }[];
  primaryCivilVulnerabilities: string[];
  strategicLinesOfEffort: string[];
  linkedTacticalAo?: {
    name: string;
    sector: string;
    coordinates: [number, number];
    description: string;
  };
}

export interface StrategicChokepoint {
  name: string;
  coordinates: [number, number];
  aor: string;
  threat: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE' | 'ROUTINE';
  description: string;
}

export const STRATEGIC_CHOKEPOINTS: StrategicChokepoint[] = [
  {
    name: 'Strait of Hormuz',
    coordinates: [26.5667, 56.25],
    aor: 'USCENTCOM',
    threat: 'HIGH',
    description: 'Vital energy transit artery connecting Persian Gulf to Gulf of Oman; 21M bpd oil flows through 21-mile width.',
  },
  {
    name: 'Bab el-Mandeb Strait',
    coordinates: [12.5833, 43.3333],
    aor: 'USCENTCOM',
    threat: 'CRITICAL',
    description: 'Southern gateway to Red Sea & Suez Canal; vulnerable to asymmetric drone and anti-ship missile strikes.',
  },
  {
    name: 'Suez Canal',
    coordinates: [30.705, 32.3442],
    aor: 'USCENTCOM',
    threat: 'MODERATE',
    description: '120-mile artificial waterway handling ~12% of global trade and 30% of global container traffic.',
  },
  {
    name: 'Strait of Malacca',
    coordinates: [4.0, 100.0],
    aor: 'USINDOPACOM',
    threat: 'HIGH',
    description: 'Primary sea lane connecting Indian Ocean and Pacific; conduit for 80% of East Asian crude petroleum imports.',
  },
  {
    name: 'Taiwan Strait',
    coordinates: [24.0, 119.5],
    aor: 'USINDOPACOM',
    threat: 'CRITICAL',
    description: '100-mile wide contested strait connecting South China Sea and East China Sea; critical semiconductor logistics hub.',
  },
  {
    name: 'Turkish Straits (Bosporus & Dardanelles)',
    coordinates: [41.1167, 29.0833],
    aor: 'USEUCOM',
    threat: 'ELEVATED',
    description: 'Regulated by Montreux Convention; only maritime outlet for Black Sea agricultural grain and regional exports.',
  },
  {
    name: 'Strait of Gibraltar',
    coordinates: [35.9667, -5.6],
    aor: 'USEUCOM / USAFRICOM',
    threat: 'ROUTINE',
    description: 'Strategic chokepoint between Atlantic Ocean and Mediterranean Sea; high commercial vessel density.',
  },
  {
    name: 'Panama Canal',
    coordinates: [9.08, -79.68],
    aor: 'USSOUTHCOM',
    threat: 'MODERATE',
    description: '51-mile canal linking Atlantic and Pacific; drought-induced freshwater lake shrinkage restricting draft depths.',
  },
];

export const COMBATANT_COMMANDS: CombatantCommandAOR[] = [
  {
    id: 'aor-centcom',
    name: 'United States Central Command',
    acronym: 'USCENTCOM',
    hqLocation: 'MacDill AFB, Tampa, FL (Forward HQ: Al Udeid AB, Qatar)',
    hqCoordinates: { lat: 25.12, lng: 51.31 },
    mapCenter: { x: 61, y: 39 },
    realCenter: [28.5, 48.0],
    zoomLevel: 4,
    realPolygon: [
      [31.5, 25.0],
      [22.0, 25.0],
      [22.0, 36.8],
      [12.0, 43.3],
      [12.5, 54.0],
      [16.5, 53.0],
      [24.0, 61.5],
      [23.5, 68.0],
      [28.0, 68.0],
      [37.0, 75.0],
      [55.0, 80.0],
      [55.0, 50.0],
      [40.0, 44.0],
      [37.0, 36.0],
      [31.5, 34.0],
      [31.5, 25.0],
    ],
    colorTheme: {
      stroke: '#f59e0b',
      fill: 'rgba(245, 158, 11, 0.22)',
      badge: 'bg-amber-950 text-amber-300 border-amber-700',
      text: 'text-amber-400',
    },
    geographicScope: '21 nations across the Middle East, Levant, Arabian Peninsula, and Central Asia (including Iraq, Syria, Yemen, Egypt, Iran, Afghanistan).',
    countriesCount: 21,
    populationCovered: '560 Million',
    assignedCivilAffairsUnits: {
      primaryCacom: '352nd Civil Affairs Command (USACAPOC)',
      homeStation: 'Fort Meade, Maryland',
      supportingBrigades: [
        '354th Civil Affairs Brigade (Riverdale, MD)',
        '308th Civil Affairs Brigade (Homestead, PA)',
      ],
      specialOperationsComponent: '95th Civil Affairs Brigade (SOF) / Task Force Civil Support',
    },
    civilStabilityScore: 48,
    stabilityStatus: 'CRITICAL_DISRUPTION',
    activeCivilMissions: [
      {
        name: 'AO Griffin Stability & Municipal Essential Services',
        location: 'Tigris River Valley / AO Griffin (Sector 4)',
        focusArea: 'Municipal water chlorination, electrical grid resilience, CMOC fuel distribution synchronization',
        status: 'ACTIVE',
      },
      {
        name: 'Bab el-Mandeb Civil Maritime Consequence Management',
        location: 'Southern Red Sea & Gulf of Aden',
        focusArea: 'Monitoring civilian shipping disruption, fishing community livelihoods, and port facility impacts',
        status: 'ONGOING',
      },
      {
        name: 'Northeast Syria Displaced Persons Rehabilitation',
        location: 'Al-Hasakah & Euphrates Basin',
        focusArea: 'Camp management support, essential civil infrastructure repair, water scarcity mitigation',
        status: 'ACTIVE',
      },
    ],
    primaryCivilVulnerabilities: [
      'Critical dependence of potable water pumps on degraded electrical power distribution',
      'Illicit fuel siphoning syndicates eroding municipal governance legitimacy',
      'High concentrations of internally displaced persons in urban peri-centers',
      'Transboundary Tigris-Euphrates riparian water management disputes',
    ],
    strategicLinesOfEffort: [
      'Maintain civilian life-support continuity to shield populations from coercive non-state exploitation',
      'Empower legitimate host-nation municipal directors and tribal dispute conciliation bodies',
      'Synchronize inter-agency civil information requirements with Joint Operations Center (JOC)',
    ],
    linkedTacticalAo: {
      name: 'AO Griffin / Sector 4',
      sector: 'Middle East Operational Corridor',
      coordinates: [33.3152, 44.3661],
      description: 'Active tactical Civil Common Operating Picture (COP) with 8 monitored critical infrastructure nodes and ASCOPE entities.',
    },
  },
  {
    id: 'aor-eucom',
    name: 'United States European Command',
    acronym: 'USEUCOM',
    hqLocation: 'Patch Barracks, Stuttgart, Germany',
    hqCoordinates: { lat: 48.73, lng: 9.08 },
    mapCenter: { x: 53, y: 26 },
    realCenter: [55.0, 20.0],
    zoomLevel: 4,
    realPolygon: [
      [36.0, -10.0],
      [35.0, 20.0],
      [36.0, 36.0],
      [42.0, 42.0],
      [55.0, 50.0],
      [55.0, 80.0],
      [75.0, 160.0],
      [82.0, 160.0],
      [82.0, -45.0],
      [60.0, -45.0],
      [60.0, -10.0],
      [36.0, -10.0],
    ],
    colorTheme: {
      stroke: '#3b82f6',
      fill: 'rgba(59, 130, 246, 0.20)',
      badge: 'bg-blue-950 text-blue-300 border-blue-700',
      text: 'text-blue-400',
    },
    geographicScope: '51 countries spanning Europe, Russia, Greenland, Arctic maritime approaches, and the Black Sea / Mediterranean basins.',
    countriesCount: 51,
    populationCovered: '830 Million',
    assignedCivilAffairsUnits: {
      primaryCacom: '353rd Civil Affairs Command (USACAPOC)',
      homeStation: 'Staten Island, New York',
      supportingBrigades: [
        '304th Civil Affairs Brigade (Bristol, PA)',
        '360th Civil Affairs Brigade (Fort Jackson, SC)',
      ],
      specialOperationsComponent: '10th Special Forces Group CA Detachments / NATO CIMIC COE Liaison',
    },
    civilStabilityScore: 72,
    stabilityStatus: 'ELEVATED_CONTEST',
    activeCivilMissions: [
      {
        name: 'Operation Atlantic Resolve Host Nation Civil Support',
        location: 'Eastern NATO Flank (Poland, Baltic States, Romania)',
        focusArea: 'Civil-military logistics transit clearance, rail gauge interoperability, host nation emergency shelter staging',
        status: 'ACTIVE',
      },
      {
        name: 'Black Sea Civil Resilience & Grain Transit Security',
        location: 'Danube Delta & Western Black Sea',
        focusArea: 'Civilian grain terminal protection, coastal sensor coordination, commercial port demining awareness',
        status: 'ONGOING',
      },
      {
        name: 'Arctic Civil Infrastructure Vulnerability Assessment',
        location: 'High North & Greenland',
        focusArea: 'Subsea fiber-optic resilience, permafrost thaw impact on dual-use airfield runways',
        status: 'PREPAREDNESS',
      },
    ],
    primaryCivilVulnerabilities: [
      'Civilian electrical grid vulnerability to hybrid cyber-physical sabotage',
      'Chokepoint dependencies in rail and highway bridges along military mobility corridors',
      'Weaponized migrant movements orchestrated across northeastern frontiers',
      'Undersea energy pipelines and data cable exposure in Baltic and North Seas',
    ],
    strategicLinesOfEffort: [
      'Bolster NATO Article 3 civil preparedness across telecommunications, food, and energy sectors',
      'Integrate Host Nation Support (HNS) agreements into theater reception and onward movement',
      'Counter foreign malign influence and disinformation targeting civilian linguistic minorities',
    ],
    linkedTacticalAo: {
      name: 'Suwalki Corridor (Lithuania-Poland Border Axis)',
      sector: 'Suwalki Gap & Baltic Civil Defense Corridor',
      coordinates: [54.103, 22.93],
      description: 'Critical 65-mile choke point between Belarus and Kaliningrad: civil telecommunications, rail transshipment, and hybrid cognitive defense.',
    },
  },
  {
    id: 'aor-indopacom',
    name: 'United States Indo-Pacific Command',
    acronym: 'USINDOPACOM',
    hqLocation: 'Camp H.M. Smith, Oahu, Hawaii',
    hqCoordinates: { lat: 21.38, lng: -157.9 },
    mapCenter: { x: 80, y: 46 },
    realCenter: [12.0, 115.0],
    zoomLevel: 3,
    realPolygon: [
      [37.0, 75.0],
      [28.0, 68.0],
      [23.5, 68.0],
      [6.0, 68.0],
      [-45.0, 68.0],
      [-45.0, 160.0],
      [-10.0, 175.0],
      [25.0, 175.0],
      [55.0, 140.0],
      [55.0, 80.0],
      [37.0, 75.0],
    ],
    colorTheme: {
      stroke: '#10b981',
      fill: 'rgba(16, 185, 129, 0.20)',
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-700',
      text: 'text-emerald-400',
    },
    geographicScope: '36 nations across the Asia-Pacific region, Indian subcontinent, Southeast Asia, Australia, Oceania, and Antarctica (covering 52% of the globe).',
    countriesCount: 36,
    populationCovered: '4.1 Billion (50%+ of World Population)',
    assignedCivilAffairsUnits: {
      primaryCacom: '351st Civil Affairs Command (USACAPOC)',
      homeStation: 'Mountain View, California',
      supportingBrigades: [
        '358th Civil Affairs Brigade (Salt Lake City, UT)',
        '364th Civil Affairs Brigade (Marysville, WA)',
      ],
      specialOperationsComponent: 'Special Operations Command Pacific (SOCPAC) CA Teams',
    },
    civilStabilityScore: 76,
    stabilityStatus: 'ELEVATED_CONTEST',
    activeCivilMissions: [
      {
        name: 'Pacific Partnership Humanitarian Assistance Pre-Positioning',
        location: 'Micronesia, Philippines, Solomon Islands',
        focusArea: 'Civilian medical clinic hardening, fresh water reverse-osmosis filtration, runway resilience',
        status: 'ACTIVE',
      },
      {
        name: 'Mekong River Basin Civil Hydrological Monitoring',
        location: 'Thailand, Laos, Cambodia, Vietnam',
        focusArea: 'Upstream dam flow disruption telemetry, agricultural drought impact, fishery civil livelihood surveys',
        status: 'ONGOING',
      },
      {
        name: 'First Island Chain Disaster Response Interoperability',
        location: 'Luzon & Ryukyu Archipelago',
        focusArea: 'Emergency civilian evacuation route deconfliction, port contingency repair teams',
        status: 'PREPAREDNESS',
      },
    ],
    primaryCivilVulnerabilities: [
      'Extreme exposure of low-lying island atolls to storm surges and saltwater aquifer intrusion',
      'Maritime communication chokepoints (Malacca Strait, Luzon Strait) vulnerable to blockade',
      'Heavily concentrated coastal urban population centers in tsunami/cyclone zones',
      'Economic coercion through foreign debt leverage over sovereign deep-water civilian ports',
    ],
    strategicLinesOfEffort: [
      'Strengthen archipelagic civil defense and rapid disaster response mechanisms with treaty allies',
      'Provide civil reconnaissance along contested coastal corridors to safeguard local maritime sovereignty',
      'Enhance water and telecommunications self-sufficiency in remote island communities',
    ],
    linkedTacticalAo: {
      name: 'Luzon Strait Arc (Northern Philippines / Batanes)',
      sector: 'Luzon Strait & First Island Chain Chokepoints',
      coordinates: [20.448, 121.97],
      description: 'Maritime civil coordination: artisanal fishery security, deep-water port tracking, and humanitarian island logistics resilience.',
    },
  },
  {
    id: 'aor-africom',
    name: 'United States Africa Command',
    acronym: 'USAFRICOM',
    hqLocation: 'Kelley Barracks, Stuttgart, Germany',
    hqCoordinates: { lat: 48.72, lng: 9.17 },
    mapCenter: { x: 54, y: 56 },
    realCenter: [4.0, 20.0],
    zoomLevel: 3,
    realPolygon: [
      [36.0, -6.0],
      [37.5, 10.0],
      [33.0, 25.0],
      [22.0, 25.0],
      [22.0, 36.8],
      [12.0, 43.3],
      [12.0, 51.0],
      [-26.0, 51.0],
      [-35.0, 20.0],
      [-15.0, 12.0],
      [5.0, 2.0],
      [15.0, -17.0],
      [28.0, -13.0],
      [36.0, -6.0],
    ],
    colorTheme: {
      stroke: '#ec4899',
      fill: 'rgba(236, 72, 153, 0.20)',
      badge: 'bg-pink-950 text-pink-300 border-pink-700',
      text: 'text-pink-400',
    },
    geographicScope: '53 African nations spanning the Maghreb, Sahel, Horn of Africa, Central Africa, and Southern Africa (all nations except Egypt).',
    countriesCount: 53,
    populationCovered: '1.4 Billion',
    assignedCivilAffairsUnits: {
      primaryCacom: 'Combined Joint Task Force – Horn of Africa (CJTF-HOA) CA Directorate',
      homeStation: 'Camp Lemonnier, Djibouti / USACAPOC Alignments',
      supportingBrigades: [
        '352nd / 353rd CA Regional Detachments',
        'Civil Affairs Planning Teams (CAPT)',
      ],
      specialOperationsComponent: 'Special Operations Command Africa (SOCAFRICA) CA Detachments',
    },
    civilStabilityScore: 52,
    stabilityStatus: 'MODERATE_STRESS',
    activeCivilMissions: [
      {
        name: 'Sahel Civil Resilience & Pastoralist Dispute Prevention',
        location: 'Niger, Chad, Northern Nigeria',
        focusArea: 'Water well solar electrification, nomadic transhumance corridor mapping, preventing farmer-herder violent clashes',
        status: 'ACTIVE',
      },
      {
        name: 'Horn of Africa Humanitarian Drought Synchronization',
        location: 'Somalia, Kenya, Djibouti',
        focusArea: 'Civilian livestock vaccination (VETCAP), IDP camp water sanitation, mobile clinic escorts',
        status: 'ONGOING',
      },
      {
        name: 'Gulf of Guinea Maritime Civil Infrastructure Protection',
        location: 'Coastal West Africa',
        focusArea: 'Artisanal fishery tracking, countering illicit bunkering, coastal community resilience',
        status: 'PREPAREDNESS',
      },
    ],
    primaryCivilVulnerabilities: [
      'Severe climate shocks leading to prolonged crop failure and famine risk in the Horn and Sahel',
      'Violent extremist organizations filling civil governance voids in neglected border regions',
      'Rapid urbanization outpacing baseline sewage, power, and healthcare capacities',
      'Mineral resource extraction corridors generating localized civil displacement',
    ],
    strategicLinesOfEffort: [
      'Disrupt violent extremist exploitation of civil grievances through targeted essential service projects',
      'Partner with African Union and regional economic communities (ECOWAS, IGAD) on crisis response',
      'Facilitate civil-military coordination between host-nation authorities and international aid agencies',
    ],
    linkedTacticalAo: {
      name: 'Liptako-Gourma (Sahel Tri-Border Zone)',
      sector: 'Niger-Mali-Burkina Faso Civil Corridor',
      coordinates: [13.513, 2.115],
      description: 'Trans-Saharan migration, pastoralist corridor water wells, and counter-VEO shadow governance stabilization.',
    },
  },
  {
    id: 'aor-northcom',
    name: 'United States Northern Command',
    acronym: 'USNORTHCOM',
    hqLocation: 'Peterson Space Force Base, Colorado Springs, Colorado',
    hqCoordinates: { lat: 38.82, lng: -104.7 },
    mapCenter: { x: 23, y: 32 },
    realCenter: [48.0, -98.0],
    zoomLevel: 3,
    realPolygon: [
      [14.5, -92.0],
      [18.0, -88.0],
      [25.0, -80.0],
      [24.0, -74.0],
      [35.0, -75.0],
      [45.0, -60.0],
      [60.0, -60.0],
      [82.0, -60.0],
      [82.0, -140.0],
      [72.0, -169.0],
      [52.0, -175.0],
      [32.0, -117.0],
      [14.5, -92.0],
    ],
    colorTheme: {
      stroke: '#8b5cf6',
      fill: 'rgba(139, 92, 246, 0.20)',
      badge: 'bg-purple-950 text-purple-300 border-purple-700',
      text: 'text-purple-400',
    },
    geographicScope: 'Continental United States, Alaska, Canada, Mexico, The Bahamas, Puerto Rico, U.S. Virgin Islands, and coastal air/maritime approaches.',
    countriesCount: 3,
    populationCovered: '510 Million',
    assignedCivilAffairsUnits: {
      primaryCacom: 'Defense Support of Civil Authorities (DSCA) / National Guard JFHQ',
      homeStation: 'Peterson SFB, CO / 54 State & Territory JFHQ Commands',
      supportingBrigades: [
        '350th Civil Affairs Command (Domestic Reserve Component Liaison)',
        'Civil Support Teams (WMD-CST) across all 50 states',
      ],
      specialOperationsComponent: 'Special Operations Command North (SOCNORTH)',
    },
    civilStabilityScore: 88,
    stabilityStatus: 'STABLE',
    activeCivilMissions: [
      {
        name: 'Defense Support of Civil Authorities (DSCA) Hurricane Relief Staging',
        location: 'U.S. Gulf Coast & Eastern Seaboard',
        focusArea: 'FEMA inter-agency integration, military logistics staging, potable water distribution generators',
        status: 'PREPAREDNESS',
      },
      {
        name: 'Southwest Border Civil Observation & Logistical Support',
        location: 'U.S.-Mexico Border Corridor',
        focusArea: 'Customs and Border Protection mobility engineering, humanitarian detention facility support',
        status: 'ONGOING',
      },
      {
        name: 'Arctic Approaches Critical Infrastructure Resilience',
        location: 'Alaska North Slope & Aleutian Chain',
        focusArea: 'Early warning radar permafrost stabilization, indigenous community disaster coordination',
        status: 'ACTIVE',
      },
    ],
    primaryCivilVulnerabilities: [
      'Complex cyber-threat vectors targeting continental electrical power and pipeline grids',
      'Severe weather events causing multi-state power outages and supply chain bottlenecks',
      'Fragility of remote Arctic community supply lines and satellite communications',
      'Port facility dependency on automated cargo management cranes vulnerable to manipulation',
    ],
    strategicLinesOfEffort: [
      'Provide rapid, decisive military support to civil authorities (FEMA, DHS) during catastrophic emergencies',
      'Safeguard the homeland defense perimeter across land, sea, air, and cyber domains',
      'Strengthen bilateral defense and civil protection partnerships with Canada (NORAD) and Mexico',
    ],
    linkedTacticalAo: {
      name: 'Sector North (Batallón de Infantería / Contested Transit Corridor)',
      sector: 'Sector North - Northern Transit Corridor',
      coordinates: [24.0312, -105.351],
      description: 'Active counter-trafficking and civil cognitive terrain: Batallón de Infantería, El Cazadero, El Torreón, and 36 indicator telemetry layers.',
    },
  },
  {
    id: 'aor-southcom',
    name: 'United States Southern Command',
    acronym: 'USSOUTHCOM',
    hqLocation: 'Doral, Florida',
    hqCoordinates: { lat: 25.82, lng: -80.35 },
    mapCenter: { x: 30, y: 64 },
    realCenter: [-14.0, -60.0],
    zoomLevel: 3,
    realPolygon: [
      [18.0, -88.0],
      [14.5, -92.0],
      [8.0, -83.0],
      [2.0, -79.0],
      [-18.0, -71.0],
      [-56.0, -68.0],
      [-56.0, -64.0],
      [-35.0, -54.0],
      [-23.0, -42.0],
      [-5.0, -35.0],
      [11.0, -60.0],
      [18.0, -65.0],
      [18.0, -88.0],
    ],
    colorTheme: {
      stroke: '#06b6d4',
      fill: 'rgba(6, 182, 212, 0.20)',
      badge: 'bg-cyan-950 text-cyan-300 border-cyan-700',
      text: 'text-cyan-400',
    },
    geographicScope: '31 countries and 10 territories across Central America, South America, and the Caribbean Sea basin (south of Mexico).',
    countriesCount: 31,
    populationCovered: '495 Million',
    assignedCivilAffairsUnits: {
      primaryCacom: '350th Civil Affairs Command',
      homeStation: 'Pensacola, Florida',
      supportingBrigades: [
        '321st Civil Affairs Brigade (San Antonio, TX)',
        'Civil Affairs Planning Teams (CAPT South)',
      ],
      specialOperationsComponent: 'Special Operations Command South (SOCSOUTH) CA Teams',
    },
    civilStabilityScore: 64,
    stabilityStatus: 'MODERATE_STRESS',
    activeCivilMissions: [
      {
        name: 'Darién Gap Civil Displacement Telemetry & Medical Support',
        location: 'Panama-Colombia Border Corridor',
        focusArea: 'Humanitarian transit monitoring, field water purification clinics, NGO safety deconfliction',
        status: 'ACTIVE',
      },
      {
        name: 'Caribbean Disaster Emergency Management Interoperability',
        location: 'Lesser Antilles & Hispaniola',
        focusArea: 'Regional hurricane rapid response kits, airfield runway assessment, desalination support',
        status: 'PREPAREDNESS',
      },
      {
        name: 'Promised Land Humanitarian Engineering Civic Action',
        location: 'Guatemala, Honduras, El Salvador (Northern Triangle)',
        focusArea: 'Rural medical readiness (MEDRETE), school construction, community well drilling',
        status: 'ONGOING',
      },
    ],
    primaryCivilVulnerabilities: [
      'Transnational criminal organizations co-opting local municipal law enforcement in transit corridors',
      'Extreme susceptibility of Caribbean island economies and infrastructure to category 5 hurricanes',
      'Mass irregular migration driven by economic collapse, violence, and institutional breakdown',
      'Deforestation and illegal mining poisoning indigenous river water systems with mercury',
    ],
    strategicLinesOfEffort: [
      'Build partner nation security force capacity to defend sovereign borders and critical infrastructure',
      'Counter illicit trafficking networks by strengthening civil institutions and alternative livelihoods',
      'Pre-position humanitarian disaster response assets to mitigate catastrophic climate impacts',
    ],
    linkedTacticalAo: {
      name: 'Darién Gap Transit Corridor (Necoclí / Bajo Chiquito)',
      sector: 'Darién Jungle & Transnational Migration Axis',
      coordinates: [8.423, -76.782],
      description: 'Primary transnational human mobility chokepoint: Clan del Golfo extortion, indigenous reception shelters, and health emergency nodes.',
    },
  },
];
