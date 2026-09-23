// U.S. Army Information Operations (IO) & Information Advantage Doctrine Data
// Standards: ADP 3-13 (Information), FM 3-13 (Information Operations), FM 3-53 (MISO),
// FM 3-12 (Cyberspace & EW), FM 3-61 (Public Affairs), FM 3-57 (Civil Affairs), JP 3-04 (Information in Joint Operations)

export type GeographicCombatantCommand = 
  | 'USINDOPACOM'
  | 'USEUCOM'
  | 'USCENTCOM'
  | 'USAFRICOM'
  | 'USNORTHCOM'
  | 'USSOUTHCOM';

export interface IoDoctrinalPublication {
  id: string;
  code: string;
  title: string;
  publicationDate: string;
  authority: string;
  summary: string;
  corePrinciples: string[];
  keyDoctrinalQuotes: string[];
  operationalApplication: string;
  classification: string;
}

export interface InformationAdvantageActivity {
  id: string;
  name: string;
  activityNumber: number;
  definition: string;
  doctrinalFocus: string;
  associatedArmyCapabilities: string[];
  tacticalExamples: string[];
  successIndicators: string[];
  colorTheme: {
    badge: string;
    border: string;
    bg: string;
    text: string;
  };
}

export interface InformationDimension {
  id: 'PHYSICAL' | 'INFORMATIONAL' | 'COGNITIVE';
  name: string;
  definition: string;
  components: string[];
  collectionMethods: string[];
  targetTypes: string[];
}

export interface HighPayoffInformationTarget {
  id: string;
  targetCategory: string;
  actorGroup: string;
  targetObjective: string;
  dimension: 'PHYSICAL' | 'INFORMATIONAL' | 'COGNITIVE';
  deliveryMeans: string[];
  riskAssessment: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  desiredBehavioralShift: string;
}

export interface AorIoFramework {
  aorId: GeographicCombatantCommand;
  commandName: string;
  hqLocation: string;
  geographicScope: string;
  defaultMissionStatement: {
    task: string;
    purpose: string;
    commandersIntent: {
      purpose: string;
      keyTasks: string[];
      desiredCognitiveEndState: string;
    };
    specifiedTasks: string[];
    impliedTasks: string[];
    essentialTasks: string[];
    pirs: string[];
  };
  osintInformationEnvironmentSummary: string;
  adversaryIoDoctrine: {
    doctrineName: string;
    adversaryState: string;
    primaryPlaybook: string;
    keyNarrativeThemes: string[];
    disseminationEcosystem: string[];
  };
  dimensionsBreakdown: {
    physical: {
      criticalNodes: string[];
      vulnerabilities: string[];
    };
    informational: {
      prevalentPlatforms: string[];
      algorithmicVectors: string[];
    };
    cognitive: {
      coreCulturalMentalModels: string[];
      exploitedGrievances: string[];
    };
  };
  informationAdvantageActivitiesOperationalized: {
    activityId: string;
    activityName: string;
    theaterSpecificTask: string;
    leadComponent: string;
    status: 'ACTIVE' | 'PLANNED' | 'MONITORED';
  }[];
  highPayoffTargets: HighPayoffInformationTarget[];
  synchronizationPhases: {
    phase: string;
    timeframe: string;
    keyIoEfforts: string[];
    decisiveInformationPoints: string;
    mops: string[];
    moes: string[];
  }[];
}

// 1. Core Army Information Operations Doctrinal Publications Repository
export const ARMY_IO_DOCTRINE_PUBLICATIONS: IoDoctrinalPublication[] = [
  {
    id: 'pub-adp313',
    code: 'ADP 3-13',
    title: 'Information',
    publicationDate: 'November 2023 / Updated 2024',
    authority: 'Headquarters, Department of the Army (HQDA)',
    summary: 'The foundational Army doctrine establishing the concept of "Information Advantage" and operations in the information dimension. Replaces legacy IO frameworks with five core activities across the physical, informational, and cognitive dimensions to achieve decision dominance in Multi-Domain Operations (MDO).',
    corePrinciples: [
      'Information is an operational element of combat power, intrinsic to all operations.',
      'Information advantage enables commanders to make decisions faster and more effectively than the adversary.',
      'The Information Environment comprises three interrelated dimensions: Physical, Informational, and Cognitive.',
      'Five core information advantage activities synchronize all military actions to affect behavior and decision-making.',
      'Everything the Army does, says, or fails to do transmits information and impacts perceptions.'
    ],
    keyDoctrinalQuotes: [
      '"Information advantage is the operational condition where a commander has the information needed to make decisions faster and more effectively than the adversary while protecting friendly decision making and affecting the adversary’s decision making and capabilities."',
      '"Military operations are fundamentally human endeavors. The cognitive dimension is the central focus of operations in the information dimension."'
    ],
    operationalApplication: 'Serves as the capstone operational doctrine for all Army formations from Corps to Battalion to integrate information advantage activities into the Military Decision Making Process (MDMP) and combined arms maneuvers.',
    classification: 'APPROVED FOR PUBLIC RELEASE; DISTRIBUTION UNLIMITED'
  },
  {
    id: 'pub-fm313',
    code: 'FM 3-13',
    title: 'Information Operations: Planning, Coordinating, and Assessing',
    publicationDate: 'October 2022 / In Revision for ADP 3-13',
    authority: 'U.S. Army Combined Arms Center (CAC)',
    summary: 'Doctrinal guidance on the organizational framework, staff coordination, and execution of Information Operations. Outlines the 14 core and related capabilities, the Information Operations Synchronization Matrix (IOSM), and Annex P creation.',
    corePrinciples: [
      'IO staff officers (G-7/S-7) synchronize information-related capabilities (IRCs) in support of the commander’s scheme of maneuver.',
      'Integration must occur at every step of the MDMP, from Mission Analysis through Assessment.',
      'Target Information Requests (TIR) and High-Payoff Information Targets (HPIT) drive the targeting cycle.',
      'Deconfliction between informing (Public Affairs) and influencing (MISO/PSYOP) is legally and ethically mandatory.'
    ],
    keyDoctrinalQuotes: [
      '"Information operations is the integrated employment, during military operations, of information-related capabilities in concert with other lines of operation to influence, disrupt, corrupt, or usurp the decision-making of adversaries and potential adversaries while protecting our own."'
    ],
    operationalApplication: 'Provides the day-to-day operational mechanics for the Information Operations Working Group (IOWG), battle rhythm integration, and staff synchronization matrices.',
    classification: 'APPROVED FOR PUBLIC RELEASE; DISTRIBUTION UNLIMITED'
  },
  {
    id: 'pub-fm353',
    code: 'FM 3-53',
    title: 'Military Information Support Operations (MISO)',
    publicationDate: 'January 2023',
    authority: 'U.S. Army John F. Kennedy Special Warfare Center and School (USAJFKSWCS)',
    summary: 'Covers doctrine and tactics for planned operations to convey selected information and indicators to foreign audiences to influence their emotions, motives, objective reasoning, and ultimately the behavior of foreign governments, organizations, groups, and individuals.',
    corePrinciples: [
      'Target Audience Analysis (TAA) is the cornerstone methodology of all psychological/behavioral influence operations.',
      'MISO must be truthful and credible; false propaganda compromises long-term strategic legitimacy.',
      'Requires presidential or secretarial approval authority (CJCS MISO Execute Orders) for geographic dissemination.',
      'Evaluation of MISO Impact Indicators (MII) distinguishes immediate exposure from sustained behavioral change.'
    ],
    keyDoctrinalQuotes: [
      '"The ultimate measure of MISO success is not what target audiences think or feel, but what they do—or cease doing—that impacts friendly mission objectives."'
    ],
    operationalApplication: 'Executes planned influence campaigns via audio broadcast, digital engagement, cellular distribution, print leaflets, and face-to-face engagements.',
    classification: 'APPROVED FOR PUBLIC RELEASE; DISTRIBUTION UNLIMITED'
  },
  {
    id: 'pub-fm312',
    code: 'FM 3-12',
    title: 'Cyberspace and Electronic Warfare Operations',
    publicationDate: 'August 2021',
    authority: 'U.S. Army Cyber Center of Excellence',
    summary: 'Provides doctrine for conducting cyberspace and electronic warfare operations within the electromagnetic spectrum (EMS) and digital network domain, linking physical emitters to informational conduits.',
    corePrinciples: [
      'Cyberspace Operations encompass Offensive Cyberspace Operations (OCO), Defensive Cyberspace Operations (DCO), and Department of Defense Information Network (DODIN) operations.',
      'Electronic Warfare includes Electronic Attack (EA), Electronic Protection (EP), and Electronic Warfare Support (ES).',
      'Convergence of Cyber and EW creates asymmetric opportunities to disrupt adversary command and control nodes without physical strikes.'
    ],
    keyDoctrinalQuotes: [
      '"Operations in cyberspace and the electromagnetic spectrum are inseparable from maneuver in the physical operational environment."'
    ],
    operationalApplication: 'Synchronizes tactical CEMA (Cyber Electromagnetic Activities) cells with Corps and Division IO staffs for non-kinetic fires and spectrum dominance.',
    classification: 'APPROVED FOR PUBLIC RELEASE; DISTRIBUTION UNLIMITED'
  },
  {
    id: 'pub-fm361',
    code: 'FM 3-61',
    title: 'Public Affairs Operations',
    publicationDate: 'April 2021',
    authority: 'Office of the Chief of Public Affairs (OCPA)',
    summary: 'Mandates the statutory and doctrinal boundaries for informing domestic and international publics. Enforces statutory restrictions (Title 10 USC and Smith-Mundt Act) preventing military psychological operations from targeting U.S. domestic audiences.',
    corePrinciples: [
      'Public Affairs informs; MISO influences. PA and MISO do not direct or control one another, but must deconflict.',
      'Maximum disclosure with minimum delay—credibility is the primary currency of public trust.',
      'Countering disinformation through rapid release of verified facts and high-fidelity combat imagery (Combat Camera).',
      'Protection of operational security (OPSEC) without misleading the public.'
    ],
    keyDoctrinalQuotes: [
      '"Public Affairs operations are based on truth and credible information. Under no circumstances will Army Public Affairs personnel engage in propaganda, deception, or covert dissemination of information."'
    ],
    operationalApplication: 'Maintains open dialogue with national and international media, counters adversary propaganda in real-time, and preserves domestic trust.',
    classification: 'APPROVED FOR PUBLIC RELEASE; DISTRIBUTION UNLIMITED'
  },
  {
    id: 'pub-fm357',
    code: 'FM 3-57',
    title: 'Civil Affairs Operations',
    publicationDate: 'July 2019 / Revalidated 2023',
    authority: 'U.S. Army Civil Affairs & Psychological Operations Command (USACAPOC)',
    summary: 'Doctrine governing how Civil Affairs forces engage the civil component of the operational environment, providing Civil Information Management (CIM) and key leader engagements that directly feed the information dimension.',
    corePrinciples: [
      'Civil Information Management (CIM) provides the socio-cultural, political, and economic ground truth necessary for operations in the cognitive dimension.',
      'Civil Affairs teams (CAT) execute Key Leader Engagements (KLE) that serve as high-trust, bilateral information conduits.',
      'Civil-Military Operations Centers (CMOC) act as the physical touchpoint between military commanders and civilian stakeholders, reinforcing host-nation institutional legitimacy.'
    ],
    keyDoctrinalQuotes: [
      '"Civil Affairs forces operate at the interface between the military and civil components, shaping perceptions, defusing grievances, and bolstering institutional legitimacy."'
    ],
    operationalApplication: 'Collects civil reconnaissance data, tracks civilian grievances and sentiment trends, and executes civil assistance projects to counter adversary influence.',
    classification: 'APPROVED FOR PUBLIC RELEASE; DISTRIBUTION UNLIMITED'
  },
  {
    id: 'pub-jp304',
    code: 'JP 3-04',
    title: 'Information in Joint Operations',
    publicationDate: 'September 2022',
    authority: 'Joint Chiefs of Staff',
    summary: 'Joint capstone doctrine describing how the Joint Force integrates information as the 7th joint function alongside command and control, intelligence, fires, movement and maneuver, protection, and sustainment.',
    corePrinciples: [
      'Information is designated as a joint warfighting function.',
      'Joint Force Commanders design operations with an information-centric mindset, recognizing that military actions communicate intent and capability.',
      'Synchronizes interagency and multinational strategic communications (STRATCOM) architecture.'
    ],
    keyDoctrinalQuotes: [
      '"The joint force must operate seamlessly in the information environment to achieve unified action and strategic goals."'
    ],
    operationalApplication: 'Governs theater-level campaign plan annexes and Joint Task Force (JTF) Information Warfare directives across all Combatant Commands.',
    classification: 'APPROVED FOR PUBLIC RELEASE; DISTRIBUTION UNLIMITED'
  }
];

// 2. The Five Information Advantage Activities (ADP 3-13)
export const INFORMATION_ADVANTAGE_ACTIVITIES: InformationAdvantageActivity[] = [
  {
    id: 'ENABLE',
    name: 'Enable Decision Making',
    activityNumber: 1,
    definition: 'Activities that facilitate friendly decision making by providing commanders and staffs with relevant, accurate, and timely information while preserving cognitive decision velocity.',
    doctrinalFocus: 'Situational understanding, intelligence synchronization, unified data fabric, C2 network survivability, and cognitive fatigue reduction.',
    associatedArmyCapabilities: [
      'Command and Control (C2) Information Systems',
      'Intelligence Preparation of the Battlefield (IPB / JIPOE)',
      'Civil Information Management (CIM)',
      'Sensor-to-Shooter Digital Links',
      'Automated Decision-Support Algorithms'
    ],
    tacticalExamples: [
      'Fusing multi-INT civil data and cyber telemetry into a unified Common Operating Picture (COP).',
      'Hardening tactical headquarters against electromagnetic geolocation and drone strikes to maintain continuous command authority.',
      'Establishing redundant satellite and troposcatter communication paths during adversary electronic jamming.'
    ],
    successIndicators: [
      'Command decision cycle (OODA loop) faster than adversary reaction time.',
      'Zero interruption in command and control during electronic attack.',
      'High fidelity situational understanding of civilian collateral risk.'
    ],
    colorTheme: {
      badge: 'bg-blue-950 text-blue-300 border-blue-700',
      border: 'border-blue-500',
      bg: 'bg-blue-950/30',
      text: 'text-blue-400'
    }
  },
  {
    id: 'PROTECT',
    name: 'Protect Friendly Information',
    activityNumber: 2,
    definition: 'Activities that preserve friendly freedom of action in the information environment by denying adversaries access to critical friendly information and shielding friendly forces from cognitive manipulation.',
    doctrinalFocus: 'Operations Security (OPSEC), Defensive Cyberspace Operations (DCO-IDM), Electronic Protection (EP), signature management, and cognitive inoculation against disinformation.',
    associatedArmyCapabilities: [
      'Operations Security (OPSEC) Program',
      'Defensive Cyberspace Operations - Internal Defense Measures (DCO-IDM)',
      'Electromagnetic Signature Control / Camouflage',
      'Counter-Deception Analysis',
      'Force Inoculation & Cognitive Resilience Training'
    ],
    tacticalExamples: [
      'Strict RF emission control (EMCON) protocols to prevent adversary SIGINT geolocation of forward tactical bases.',
      'Deploying automated endpoint detection to neutralize foreign ransomware and wiper malware in coalition logistical networks.',
      'Pre-bunking adversary deepfakes and fabricated surrender orders among friendly troops.'
    ],
    successIndicators: [
      'Zero unauthorized leaks of operational orders or tactical deployment vectors.',
      'Friendly network intrusion attempts stopped at perimeter.',
      'Friendly troops maintain discipline when confronted with adversary cognitive warfare.'
    ],
    colorTheme: {
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-700',
      border: 'border-emerald-500',
      bg: 'bg-emerald-950/30',
      text: 'text-emerald-400'
    }
  },
  {
    id: 'INFORM',
    name: 'Inform Audiences',
    activityNumber: 3,
    definition: 'Activities that provide truthful, accurate, and contextually grounded information to domestic, regional, and international audiences to build public trust, foster host-nation legitimacy, and counter hostile falsehoods.',
    doctrinalFocus: 'Public Affairs (PAO) operations, transparent civil-military interaction, rapid rebuttal of adversary propaganda, and Combat Camera documentation.',
    associatedArmyCapabilities: [
      'Public Affairs Operations (FM 3-61)',
      'Visual Information & Combat Camera (COMCAM)',
      'Civil Affairs Community Relations (FM 3-57)',
      'Defense Support to Public Diplomacy (DSPD)',
      'Host-Nation Media Cooperation'
    ],
    tacticalExamples: [
      'Rapid declassification and public broadcast of gun-camera video exposing adversary violations of the Law of Armed Conflict (LOAC).',
      'Hosting daily televised press briefings with municipal mayors and regional leaders to report infrastructure restoration progress.',
      'Publishing verifiable humanitarian aid distribution manifests to neutralize claims of resource hoarding.'
    ],
    successIndicators: [
      'Adversary disinformation debunked in international media within 2 hours of broadcast.',
      'Host-nation public approval ratings of coalition stabilization forces exceed 65%.',
      'Broad international consensus supporting coalition operational legitimacy.'
    ],
    colorTheme: {
      badge: 'bg-cyan-950 text-cyan-300 border-cyan-700',
      border: 'border-cyan-500',
      bg: 'bg-cyan-950/30',
      text: 'text-cyan-400'
    }
  },
  {
    id: 'INFLUENCE',
    name: 'Influence Target Audiences',
    activityNumber: 4,
    definition: 'Activities designed to affect the emotions, motives, objective reasoning, and ultimately the behavior of foreign target audiences (adversary, neutral, and friendly) to support commander objectives.',
    doctrinalFocus: 'Military Information Support Operations (MISO/PSYOP), behavioral influence campaigns, targeted social messaging, leaflet/radio distribution, and Key Leader Engagements.',
    associatedArmyCapabilities: [
      'Military Information Support Operations (FM 3-53)',
      'Target Audience Analysis (TAA)',
      'Civil Affairs Key Leader Engagements (KLE)',
      'Special Operations Forces (SOF) Information Warfare',
      'Tactical Loudspeaker & Mobile Broadcast Operations'
    ],
    tacticalExamples: [
      'Disseminating localized radio broadcasts and text alerts highlighting safe passage corridors for adversary conscripts wishing to surrender.',
      'Engaging respected tribal elders and religious clerics to issue public decrees condemning illicit syndicate extortion and violence.',
      'Highlighting financial corruption among senior adversary leaders to sow distrust among frontline fighters.'
    ],
    successIndicators: [
      'Measurable increase in enemy surrender/desertion rates (e.g., +30% following leaflet/radio drop).',
      'Civilian refusal to provide sanctuary or logistics to adversary insurgent cells.',
      'Tribal elder public condemnation of adversary violence.'
    ],
    colorTheme: {
      badge: 'bg-amber-950 text-amber-300 border-amber-700',
      border: 'border-amber-500',
      bg: 'bg-amber-950/30',
      text: 'text-amber-400'
    }
  },
  {
    id: 'AFFECT',
    name: 'Affect Adversary Decision-Making & Capabilities',
    activityNumber: 5,
    definition: 'Activities that degrade, disrupt, deny, deceive, or destroy adversary information systems, communication links, sensor networks, and cognitive decision processes.',
    doctrinalFocus: 'Offensive Cyberspace Operations (OCO), Electronic Attack (EA), Military Deception (MILDEC), and physical destruction of information nodes synchronized with kinetic fires.',
    associatedArmyCapabilities: [
      'Offensive Cyberspace Operations (OCO)',
      'Electronic Attack (EA) / High-Power RF Jamming',
      'Military Deception (MILDEC) Operations',
      'Special Technical Operations (STO)',
      'Precision Kinetic Strikes on High-Value C2 Targets'
    ],
    tacticalExamples: [
      'Broadband jamming of adversary tactical radio repeaters and cellular relays during an assault breach.',
      'Deploying a deceptive electronic signature (phantom radio traffic and decoy antennas) to mislead adversary planners regarding the main effort location.',
      'Cyberspace payload injection that corrupts adversary artillery automated fire-direction servers.'
    ],
    successIndicators: [
      'Adversary headquarters unable to transmit operational orders to maneuver brigades for >12 hours.',
      'Adversary commits operational reserves to wrong axis based on friendly deception scheme.',
      'Adversary air defense radar network blind during friendly air package insertion.'
    ],
    colorTheme: {
      badge: 'bg-rose-950 text-rose-300 border-rose-700',
      border: 'border-rose-500',
      bg: 'bg-rose-950/30',
      text: 'text-rose-400'
    }
  }
];

// 3. The Three Dimensions of the Information Environment (ADP 3-13)
export const INFORMATION_DIMENSIONS: InformationDimension[] = [
  {
    id: 'PHYSICAL',
    name: 'Physical Dimension',
    definition: 'The tangible world composed of human beings, command and control facilities, physical networks, undersea cables, broadcast antennas, cellular towers, and computing hardware.',
    components: [
      'Command & Control (C2) Headquarters & Bunkers',
      'Submarine Telecommunications Fiber-Optic Cables & Landing Stations',
      'Satellite Earth Ground Terminals & Downlink Arrays',
      'Cellular 4G/5G Base Stations & Microwave Relays',
      'Human Beings (Decision-makers, operators, communicators)',
      'Commercial Data Centers, Server Farms & Power Substations'
    ],
    collectionMethods: [
      'Imagery Intelligence (IMINT) & Geospatial Intelligence (GEOINT)',
      'Physical Civil Reconnaissance (CR) by Civil Affairs Teams',
      'Open Source Intelligence (OSINT) infrastructure mapping',
      'Signals Intelligence (SIGINT) emitter geolocation'
    ],
    targetTypes: [
      'Radio & TV transmission towers',
      'Fiber-optic junction hubs',
      'SATCOM transportable terminals',
      'Server data repositories'
    ]
  },
  {
    id: 'INFORMATIONAL',
    name: 'Informational Dimension',
    definition: 'The dimension where data and information are collected, processed, stored, formatted, transmitted, and displayed. It represents the content, protocols, algorithms, and digital logic flows.',
    components: [
      'Data Streams, Databases & Cloud Storage Repositories',
      'Network Protocols (TCP/IP, BGP, DNS, SS7 cellular routing)',
      'Software Algorithms, Recommendation Engines & Botnets',
      'Encrypted Messaging Channels (Telegram, Signal, WhatsApp)',
      'Social Media Feeds, News Agency Feeds & Darknet Forums',
      'Synthetic Media (Deepfakes, audio clones, generative text)'
    ],
    collectionMethods: [
      'Open Source Social Media Monitoring (SOCMINT)',
      'Cyber Network Exploitation (CNE)',
      'Natural Language Processing (NLP) narrative stream analysis',
      'Automated sentiment crawler algorithms'
    ],
    targetTypes: [
      'Adversary command databases',
      'Propaganda web distribution servers',
      'Botnet command-and-control servers',
      'Firewall routing tables'
    ]
  },
  {
    id: 'COGNITIVE',
    name: 'Cognitive Dimension',
    definition: 'The realm of human perception, emotion, worldview, belief systems, psychological heuristics, cultural mental models, and decision-making calculus. It is the central focus of operations in the information dimension.',
    components: [
      'Leadership Decision-Making Biases & Heuristics',
      'Public Morale, Fear, Hope & Resistance Will',
      'Cultural, Religious & Historical Memory Narratives',
      'Ideological Affiliation & Group Identity Trust',
      'Sovereignty, Legitimacy & Rule of Law Perceptions',
      'Risk Tolerance & Personal Self-Preservation Instincts'
    ],
    collectionMethods: [
      'Target Audience Analysis (TAA)',
      'Civil Affairs Key Leader Engagements (KLE)',
      'Demographic Sentiment Polling & Cohort Sampling',
      'Human Intelligence (HUMINT) psychological debriefs'
    ],
    targetTypes: [
      'Adversary political/military leadership confidence',
      'Civilian population trust in municipal government',
      'Allied military willingness to sustain coalition cohesion',
      'Frontline soldier resolve and morale'
    ]
  }
];

// 4. Global AOR Information Operations Frameworks (Comprehensive OSINT Grounding across All 6 Combatant Commands)
export const GLOBAL_AOR_IO_FRAMEWORKS: Record<GeographicCombatantCommand, AorIoFramework> = {
  USINDOPACOM: {
    aorId: 'USINDOPACOM',
    commandName: 'United States Indo-Pacific Command',
    hqLocation: 'Camp H.M. Smith, Oahu, Hawaii',
    geographicScope: 'Spanning from the U.S. West Coast to the western border of India and from Antarctica to the North Pole; covers >50% of the Earth’s surface and 36 nations.',
    defaultMissionStatement: {
      task: 'Task Force Information Advantage (TF-IA INDOPACOM) conducts synchronized operations in the information dimension across the Indo-Pacific Theater NLT 220001Z OCT 26',
      purpose: 'To counter PRC coercive revisionist narratives, protect critical subsea and space command links, reinforce allied cognitive cohesion (Japan, Republic of Korea, Philippines, Australia, Taiwan), and degrade PLA decision velocity in order to establish favorable cognitive conditions for combined theater deterrence.',
      commandersIntent: {
        purpose: 'Establish persistent information advantage across the First and Second Island Chains to deter PRC escalation and assure regional partners.',
        keyTasks: [
          'Expose and rapidly attribute PRC gray-zone maritime coercion and illegal fishing in the South China Sea using unclassified high-resolution satellite imagery.',
          'Harden distributed command nodes against PLA Strategic Support Force (SSF) electromagnetic jamming and cyber degradation.',
          'Execute bilateral information synchronization with the Armed Forces of the Philippines (AFP) and Japan Self-Defense Forces (JSDF).',
          'Deploy behavioral influence products countering defeatist narrative themes in key partner coastal communities.'
        ],
        desiredCognitiveEndState: 'Allied leadership and populations possess unshakeable confidence in coalition defense commitments; regional neutrals actively reject PRC maritime hegemony; PLA operational commanders experience profound uncertainty regarding coalition retaliatory capabilities.'
      },
      specifiedTasks: [
        'Establish 24/7 Information Operations Coordination Cell (IOCC) with Australian and Philippine counterparts in Manila and Okinawa.',
        'Protect subsea fiber landing stations in Guam, Hawaii, and Luzon against cyber/physical disruption.',
        'Publish daily unclassified counter-narrative bulletins refuting state-sponsored propaganda.'
      ],
      impliedTasks: [
        'Provide multilingual media training to forward-deployed Civil Affairs teams and littoral combat regiments.',
        'Pre-position expeditionary Starlink and troposcatter backup relays across northern Luzon and the Ryukyu arc.'
      ],
      essentialTasks: [
        'Neutralize PLA Three Warfares cognitive narrative dominance before D-Day.',
        'Preserve PACAF/INDOPACOM operational C2 decision speed during opening electronic salvos.'
      ],
      pirs: [
        'PIR-IO-01: What specific disinformation vectors is the PRC Ministry of State Security deploying to divide US-Philippine defense agreements in Palawan and Batanes?',
        'PIR-IO-02: Which subsea telecommunication cable landing stations show anomalous cyber probing or acoustic sensor tampering by foreign research vessels?'
      ]
    },
    osintInformationEnvironmentSummary: 'The Indo-Pacific information environment is characterized by intense cognitive warfare waged by the PRC under its doctrinal "Three Warfares" (Psychological, Media/Public Opinion, and Legal Warfare). Physical communication hinges heavily on trans-oceanic subsea fiber cables (e.g., SEA-US, SJC2) and space SATCOM constellations. Informational conduits are dominated by WeChat, TikTok algorithmic distribution, and state-sponsored bot farms (Spamouflage), targeting regional diaspora and ASEAN civilian audiences to depict U.S. presence as destabilizing.',
    adversaryIoDoctrine: {
      doctrineName: 'PLA Three Warfares (San Zhan) & Intelligentized Warfare',
      adversaryState: 'People’s Republic of China (PRC)',
      primaryPlaybook: 'Simultaneous deployment of Public Opinion Warfare (saturating global media with historical revisionism), Psychological Warfare (demoralizing adversary troops with overwhelming force demonstrations), and Legal Warfare (weaponizing domestic laws and UNCLOS interpretations).',
      keyNarrativeThemes: [
        'U.S. is an extra-regional imperialist power dragging Asia into unnecessary war.',
        'Reunification of Taiwan is historically inevitable and resistance is futile.',
        'PRC South China Sea territorial claims are rooted in undeniable antiquity.',
        'Economic prosperity in Asia depends entirely on compliance with Beijing’s Belt and Road.'
      ],
      disseminationEcosystem: [
        'Global Times, Xinhua, CGTN multi-language broadcasts',
        'WeChat ecosystem within diaspora communities',
        'State-directed TikTok content recommendation suppression',
        'Co-opted academic institutions and Chinese-language local radio syndicates'
      ]
    },
    dimensionsBreakdown: {
      physical: {
        criticalNodes: [
          'Guam Submarine Cable Landing Station (Piti / Tumon)',
          'Okinawa Joint Tactical Network Gateway (Torii Station)',
          'Hawaii SATCOM Master Ground Relay (Wahiawa)',
          'Northern Luzon Telecommunications Hub (San Fernando / Batanes)'
        ],
        vulnerabilities: [
          'High physical concentration of trans-Pacific fiber trunks at shallow landing shores.',
          'Commercial power grid vulnerabilities in Pacific island nodes.',
          'Reliance on commercial maritime space launch facilities.'
        ]
      },
      informational: {
        prevalentPlatforms: ['WeChat', 'LINE', 'TikTok', 'Facebook (Philippines)', 'X/Twitter', 'Telegram'],
        algorithmicVectors: [
          'Micro-targeted anti-treaty advertising campaigns.',
          'Automated coordinated inauthentic behavior (CIB) boosting anti-basing hashtags.',
          'Deepfake video creation mimicking Taiwanese military leadership surrender broadcasts.'
        ]
      },
      cognitive: {
        coreCulturalMentalModels: [
          'ASEAN principle of neutrality and avoidance of great-power alignment.',
          'Deep cultural memory of WW2 devastation in Pacific Island and Southeast Asian populations.',
          'National pride in maritime fishing heritage among Filipino and Vietnamese populations.'
        ],
        exploitedGrievances: [
          'Fears of economic retaliation and trade embargoes from Beijing.',
          'Civilian casualties or environmental damage from military exercises.',
          'Historical post-colonial suspicion of Western military interventions.'
        ]
      }
    },
    informationAdvantageActivitiesOperationalized: [
      {
        activityId: 'ENABLE',
        activityName: 'Enable Decision Making',
        theaterSpecificTask: 'Maintain distributed low-probability-of-intercept (LPI/LPD) communications between INDOPACOM HQ, 7th Fleet, and III MEF across island chains.',
        leadComponent: 'J6 Communications & Army Cyber Command',
        status: 'ACTIVE'
      },
      {
        activityId: 'PROTECT',
        activityName: 'Protect Friendly Information',
        theaterSpecificTask: 'Enforce strict RF emission control across all littoral expeditionary bases and hunt for adversary malware within allied port infrastructure.',
        leadComponent: 'Task Force Cyber Protection Brigade',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFORM',
        activityName: 'Inform Audiences',
        theaterSpecificTask: 'Publish unclassified drone and satellite footage of PRC Coast Guard water-cannon attacks on Philippine resupply boats within 60 minutes of occurrence.',
        leadComponent: 'INDOPACOM Public Affairs & AFP Media Center',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFLUENCE',
        activityName: 'Influence Target Audiences',
        theaterSpecificTask: 'Execute psychological influence campaigns reinforcing Taiwanese civilian civil defense resolve and highlighting economic risks to mainland China.',
        leadComponent: '8th Military Information Support Group (Airborne)',
        status: 'PLANNED'
      },
      {
        activityId: 'AFFECT',
        activityName: 'Affect Adversary Decision-Making',
        theaterSpecificTask: 'Coordinate airborne and surface electronic attack to blind PLA over-the-horizon radars and inject navigational errors into unmanned maritime drone swarms.',
        leadComponent: 'Joint Electromagnetic Warfare Center & 1st Multi-Domain Task Force (MDTF)',
        status: 'PLANNED'
      }
    ],
    highPayoffTargets: [
      {
        id: 'HPIT-PAC-01',
        targetCategory: 'Adversary Operational C2',
        actorGroup: 'Eastern Theater Command PLA Air Force Combined Operations Center',
        targetObjective: 'Degrade situational awareness and delay air sortie execution by >90 minutes.',
        dimension: 'PHYSICAL',
        deliveryMeans: ['High-power stand-in EW jamming', 'Cyber network injection', 'Precision kinetic strike on auxiliary power'],
        riskAssessment: 'CRITICAL',
        desiredBehavioralShift: 'Commanders abort or postpone mass bomber strikes due to loss of common air picture.'
      },
      {
        id: 'HPIT-PAC-02',
        targetCategory: 'Foreign Civilian Target Audience',
        actorGroup: 'Philippine Batanes Islands Coastal Fishing Communities',
        targetObjective: 'Inoculate against PRC maritime militia intimidation and mobilize local maritime domain reporting.',
        dimension: 'COGNITIVE',
        deliveryMeans: ['Civil Affairs Key Leader Engagements', 'Tagalog radio broadcasts', 'Direct community satellite messaging'],
        riskAssessment: 'LOW',
        desiredBehavioralShift: 'Local fishermen continuously report illegal maritime incursions to Philippine Coast Guard and refuse bribery.'
      }
    ],
    synchronizationPhases: [
      {
        phase: 'Phase 0: Shape / Persistent Competition',
        timeframe: 'D-365 to D-30',
        keyIoEfforts: [
          'Establish allied information sharing network with Five Eyes + Japan and Philippines.',
          'Execute pre-bunking media campaigns exposing illegal PRC maritime activities.',
          'Conduct cyber vulnerability assessments of critical allied civilian ports.'
        ],
        decisiveInformationPoints: 'Public exposure of covert PLA missile deployment in South China Sea artificial reefs.',
        mops: ['52 unclassified intelligence releases published', '180 Civil Affairs KLEs held with maritime mayors'],
        moes: ['Public support for US-Philippine basing agreements increases from 58% to 76%', 'Zero undetected maritime incursions']
      },
      {
        phase: 'Phase 1: Deter / Crisis Response',
        timeframe: 'D-30 to D-Day',
        keyIoEfforts: [
          'Surge MISO broadcasts to adversary invasion staging ports detailing defensive preparations.',
          'Enforce strict operational security and deceptive electromagnetic emissions.',
          'Deploy commercial satellite imagery debunking false-flag biological or border provocations.'
        ],
        decisiveInformationPoints: 'Adversary postponement of maritime amphibious mobilization due to operational exposure.',
        mops: ['12 counter-disinformation press conferences', '100% CEMA units deployed to island sectors'],
        moes: ['Adversary internal communications reflect strategic hesitation', 'Zero panic buying or civic unrest in allied capitals']
      }
    ]
  },

  USEUCOM: {
    aorId: 'USEUCOM',
    commandName: 'United States European Command',
    hqLocation: 'Patch Barracks, Stuttgart, Germany',
    geographicScope: '50 countries including Greenland, the Russian Federation, and the Mediterranean; covers 21 million square miles and over 1 billion people.',
    defaultMissionStatement: {
      task: 'Joint Information Warfare Force EUCOM executes full-spectrum operations in the information dimension across the European Theater NLT 220001Z OCT 26',
      purpose: 'To neutralize Russian hybrid information confrontation (Informatsionnoye Protivoborstvo), safeguard NATO Article 5 cohesion, harden critical Baltic and Nordic physical infrastructure against sabotage, and disrupt GRU/FSB psychological operations in order to preserve alliance decision dominance.',
      commandersIntent: {
        purpose: 'Defeat Russian gray-zone cognitive subversion and assure NATO eastern flank allies of immediate, overwhelming collective defense response.',
        keyTasks: [
          'Pre-bunk and rapidly attribute Russian false-flag provocations along the Suwalki Corridor and Narva border.',
          'Synchronize strategic communications with NATO StratCom COE (Riga) and the European Centre of Excellence for Countering Hybrid Threats (Helsinki).',
          'Protect allied fiber-optic backbone cables and Starlink terminals from electronic jamming and physical cut attempts.',
          'Execute targeted influence campaigns highlighting Russian casualty metrics to undermine frontline soldier morale.'
        ],
        desiredCognitiveEndState: 'NATO publics remain unified and resilient against energy/economic blackmail; Russian political and military planners recognize that any asymmetric hybrid provocation will trigger instant attribution and catastrophic conventional escalation.'
      },
      specifiedTasks: [
        'Coordinate bilateral IO liaison teams with Polish, Estonian, Latvian, and Lithuanian defense forces.',
        'Monitor and counter Russian Telegram channels (Rybar, Grey Zone) in 6 languages.',
        'Conduct cyber defense sweeps of Polish and Romanian rail transport networks.'
      ],
      impliedTasks: [
        'Deploy mobile FM radio transmitters to Baltic border regions in the event of fiber outages.',
        'Inoculate Russian-speaking diaspora communities against Kremlin narrative manipulation.'
      ],
      essentialTasks: [
        'Prevent adversary from achieving reflexive control over NATO political decision-makers.',
        'Maintain unbroken logistical C2 from Antwerp and Bremerhaven to eastern forward staging bases.'
      ],
      pirs: [
        'PIR-IO-01: What false-flag chemical or civilian casualty narratives is the Russian Foreign Intelligence Service (SVR) staging in the border zone?',
        'PIR-IO-02: Which Baltic undersea power and data links are being surveyed by Russian maritime intelligence collection vessels (Yantar)?'
      ]
    },
    osintInformationEnvironmentSummary: 'The European information environment represents the most active theater of sustained gray-zone cognitive warfare. The Russian Federation utilizes "Informatsionnoye Protivoborstvo" (Information Confrontation), combining state-directed cyber operations (Sandworm, APT28/Fancy Bear), Telegram propaganda networks, hacktivist proxies (Killnet, NoName057), and reflexive control techniques. Key terrain includes undersea data cables in the Baltic and North Seas, cellular grids in the Suwalki Corridor, and media spaces in Eastern European borderlands.',
    adversaryIoDoctrine: {
      doctrineName: 'Russian Information Confrontation & Reflexive Control (Refleksivnoe Upravlenie)',
      adversaryState: 'Russian Federation (GRU, FSB, SVR, Presidential Administration)',
      primaryPlaybook: 'Conveying specially prepared information to an opponent to incline them to voluntarily make predetermined decisions desired by Moscow; weaponizing energy prices, nuclear escalation threats, and historical grievances.',
      keyNarrativeThemes: [
        'NATO is an aggressive expansionist bloc threatening Russian survival.',
        'Western financial support for Ukraine is depleting domestic European wealth.',
        'Nuclear escalation is imminent if Western weapons strike Russian soil.',
        'Baltic states are fascist regimes oppressing Russian minorities.'
      ],
      disseminationEcosystem: [
        'Telegram military correspondent (Voenkor) networks',
        'RT, Sputnik, and TASS multi-lingual clone portals (Pravda network)',
        'Social media bot swarms using AI-generated avatars and cloned news portals (Doppelgänger campaign)',
        'Co-opted European political commentators and fringe fringe movements'
      ]
    },
    dimensionsBreakdown: {
      physical: {
        criticalNodes: [
          'Suwalki Gap Microwave & Fiber Relay Corridor (Poland-Lithuania)',
          'Baltic Subsea Cable Landing Hubs (Helsinki, Tallinn, Stockholm)',
          'Grafenwoehr / Ramstein C2 Air Operations Center',
          'Rzeszów-Jasionka Logistics Transshipment Data Hub'
        ],
        vulnerabilities: [
          'Vulnerability of unmonitored undersea gas/data infrastructure in the Baltic Sea.',
          'Heavy reliance on commercial civilian rail signal systems.',
          'Susceptibility of border cellular base stations to Russian GPS spoofing and Borisoglebsk-2 EW jamming.'
        ]
      },
      informational: {
        prevalentPlatforms: ['Telegram', 'WhatsApp', 'VKontakte (VK)', 'X/Twitter', 'TikTok', 'YouTube'],
        algorithmicVectors: [
          'Coordinated bot attacks amplifying pro-Kremlin peace protest videos.',
          'Fabricated official European ministerial letters and leaked NATO training documents.',
          'DDoS attacks overwhelming Baltic government e-services during military exercises.'
        ]
      },
      cognitive: {
        coreCulturalMentalModels: [
          'Traumatic historical memory of Soviet occupation across the Baltic states and Poland.',
          'Deep pacifist sentiment and fear of continental nuclear war in Central/Western Europe.',
          'High public commitment to democratic values, rule of law, and institutional transparency.'
        ],
        exploitedGrievances: [
          'Inflation, energy heating costs, and economic fatigue with prolonged conflict.',
          'Friction between local populations and Ukrainian refugee communities.',
          'Language and citizenship status debates among Russian-speaking minorities.'
        ]
      }
    },
    informationAdvantageActivitiesOperationalized: [
      {
        activityId: 'ENABLE',
        activityName: 'Enable Decision Making',
        theaterSpecificTask: 'Integrate real-time NATO ISR data with commercial satellite imagery (Planet, Maxar) to maintain continuous unclassified common operating picture.',
        leadComponent: 'USEUCOM J2/J3 & NATO SHAPE Intelligence Fusion Center',
        status: 'ACTIVE'
      },
      {
        activityId: 'PROTECT',
        activityName: 'Protect Friendly Information',
        theaterSpecificTask: 'Deploy cyber quick-reaction teams to harden Polish and Romanian railway logistics servers against Russian wiper malware.',
        leadComponent: 'U.S. Army Cyber Command & European Cyber Defense Fleet',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFORM',
        activityName: 'Inform Audiences',
        theaterSpecificTask: 'Declassify and publish satellite photos of Russian sabotage staging operations before adversary can execute false-flag provocations.',
        leadComponent: 'EUCOM Directorate of Public Affairs & NATO StratCom',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFLUENCE',
        activityName: 'Influence Target Audiences',
        theaterSpecificTask: 'Execute Russian-language counter-narrative messaging highlighting severe front-line officer incompetence and casualty rates.',
        leadComponent: 'Special Operations Command Europe (SOCEUR) MISO Detachment',
        status: 'ACTIVE'
      },
      {
        activityId: 'AFFECT',
        activityName: 'Affect Adversary Decision-Making',
        theaterSpecificTask: 'Conduct targeted cyber-electronic disruptions against GRU Unit 29155 communication nodes coordinating sabotage cells in Europe.',
        leadComponent: 'Joint Cyber Task Force & 2nd Multi-Domain Task Force (MDTF)',
        status: 'PLANNED'
      }
    ],
    highPayoffTargets: [
      {
        id: 'HPIT-EU-01',
        targetCategory: 'Adversary Disinformation Network',
        actorGroup: 'Russian Doppelgänger Disinformation Infrastructure & Botnet Hubs',
        targetObjective: 'Dismantle server networks cloning legitimate European news sites.',
        dimension: 'INFORMATIONAL',
        deliveryMeans: ['Offensive Cyberspace Operations', 'International law enforcement domain seizures', 'Public exposure of hosting providers'],
        riskAssessment: 'HIGH',
        desiredBehavioralShift: 'Adversary campaign loses 80% distribution reach before European parliamentary elections.'
      },
      {
        id: 'HPIT-EU-02',
        targetCategory: 'Key Border Civilian Demographic',
        actorGroup: 'Russian-Speaking Minority Population in Narva (Estonia) and Latgale (Latvia)',
        targetObjective: 'Inoculate against Russian separatist narratives and demonstrate tangible EU/NATO civil benefits.',
        dimension: 'COGNITIVE',
        deliveryMeans: ['Local Russian-language independent media funding', 'Civil Affairs town halls', 'Rapid public infrastructure grants'],
        riskAssessment: 'LOW',
        desiredBehavioralShift: 'Civilians reject Kremlin annexation overtures and actively report suspicious border reconnaissance.'
      }
    ],
    synchronizationPhases: [
      {
        phase: 'Phase 0: Hybrid Deterrence / Peacetime Competition',
        timeframe: 'Continuous Operations',
        keyIoEfforts: [
          'Pre-bunk Russian energy crisis and border sabotage disinformation narratives.',
          'Execute joint cyber exercises (Locked Shields) with Baltic and Nordic partners.',
          'Map all physical undersea fiber routes with autonomous maritime gliders.'
        ],
        decisiveInformationPoints: 'Attribution of Baltic seabed cable tampering to specific foreign vessel within 24 hours.',
        mops: ['340 disinformation campaigns debunked', '45 cyber threat bulletins issued to civilian utility operators'],
        moes: ['Public confidence in NATO collective defense exceeds 80% across frontline states']
      },
      {
        phase: 'Phase 1: Alert & Forward Staging',
        timeframe: 'D-15 to D-Day',
        keyIoEfforts: [
          'Activate Annex P emergency communications plan across V Corps and 10th Mountain Division.',
          'Execute electronic protection measures shielding allied air defense radars from Krasukha-4 jamming.',
          'Disseminate live video of NATO rapid deployment forces arriving at forward combat posts.'
        ],
        decisiveInformationPoints: 'Adversary aborts border penetration due to verified presence of NATO multinational battlegroups.',
        mops: ['100% C2 nodes equipped with anti-jam antennas', '24-hour bilingual press center active in Vilnius'],
        moes: ['Russian frontline units report reluctance to advance against prepared defensive lines']
      }
    ]
  },

  USCENTCOM: {
    aorId: 'USCENTCOM',
    commandName: 'United States Central Command',
    hqLocation: 'MacDill Air Force Base, Tampa, Florida',
    geographicScope: '21 countries in the Middle East, Central Asia, and parts of South Asia; over 550 million people, strategic chokepoints including Suez Canal, Bab el-Mandeb, and Strait of Hormuz.',
    defaultMissionStatement: {
      task: 'Task Force Information Warfare CENTCOM conducts integrated operations in the information dimension across the Central Theater NLT 220001Z OCT 26',
      purpose: 'To dismantle Iranian proxy narrative networks (Axis of Resistance), counter Violent Extremist Organization (VEO/ISIS) digital radicalization, secure international maritime transit legitimacy in the Red Sea and Arabian Gulf, and empower sovereign host-nation security forces in order to preserve regional stability.',
      commandersIntent: {
        purpose: 'Establish persistent cognitive and informational superiority that delegitimizes maritime terrorism, separates civilian populations from Iranian-backed militias, and protects coalition expeditionary forces.',
        keyTasks: [
          'Expose Iranian illicit weapons and drone smuggling to Houthi and Iraqi militia forces using declassified maritime interdiction forensics.',
          'Counter extremist recruitment narratives by highlighting civilian economic suffering caused by militia extortion and infrastructure destruction.',
          'Harden coalition base C2 networks (Al Udeid, Al Dhafra, Ain al-Asad) against Iranian cyber and EW attacks.',
          'Execute Civil Affairs Key Leader Engagements with tribal and clerical authorities to build grass-roots civil defense compacts.'
        ],
        desiredCognitiveEndState: 'Regional Arab and Central Asian populations recognize Iranian proxy violence as the primary impediment to economic prosperity; maritime commercial shipping maintains faith in coalition naval protection; extremist online networks are severely fractured.'
      },
      specifiedTasks: [
        'Deploy mobile broadcast teams to support Operation Prosperity Guardian maritime communications.',
        'Synchronize messaging with the International Maritime Security Construct (IMSC).',
        'Produce Arabic and Persian digital counter-narratives exposing IRGC-QF financial embezzlement.'
      ],
      impliedTasks: [
        'Engage regional commercial satellite providers to terminate illegal militia broadcasting licenses.',
        'Protect local civil communication towers from retaliatory militia rocket and drone strikes.'
      ],
      essentialTasks: [
        'Strip the Houthis of their self-styled moral narrative regarding maritime shipping interdiction.',
        'Preserve coalition early warning radar and counter-UAS data links across the Gulf.'
      ],
      pirs: [
        'PIR-IO-01: Which Telegram and WhatsApp channels are being utilized by Iranian proxy groups to coordinate tactical rocket attacks on coalition bases?',
        'PIR-IO-02: How are local civilian populations in Hodeidah and Aden responding to coalition humanitarian assistance announcements?'
      ]
    },
    osintInformationEnvironmentSummary: 'The CENTCOM information environment is dominated by sectarian geopolitical narratives, Iranian state-sponsored proxy media conglomerates (Union of Islamic Radio and Television - IRTVU), active Houthi TikTok/Telegram video propaganda glorifying maritime drone strikes, and residual ISIS/Al-Qaeda clandestine digital propaganda cells. Physical chokepoints (Strait of Hormuz, Bab el-Mandeb) are coupled with dense commercial satellite downlinks (Arabsat, Nilesat) and widespread WhatsApp community networks.',
    adversaryIoDoctrine: {
      doctrineName: 'Iranian Axis of Resistance Cognitive Warfare & Asymmetric Information Operations',
      adversaryState: 'Islamic Republic of Iran (IRGC-QF, MOIS) & Proxy Network (Houthis, Hezbollah, Iraqi militias)',
      primaryPlaybook: 'Framing all military resistance as a religious and anti-colonial obligation; weaponizing low-cost drone and missile footage to generate outsized strategic perception of power; exploiting Palestinian solidarity to recruit youth.',
      keyNarrativeThemes: [
        'The Axis of Resistance is the sole defender of regional sovereignty and Islamic sanctity.',
        'Coalition presence is the root cause of all economic deprivation and instability in the Middle East.',
        'U.S. and Israeli military technology is vulnerable and defeatable by asymmetric martyr tactics.',
        'Arab governments cooperating with the West are illegitimate traitors to their people.'
      ],
      disseminationEcosystem: [
        'Al-Masirah, Al-Manar, and Al-Mayadeen satellite television networks',
        'Thousands of coordinated Arabic Telegram and WhatsApp channels',
        'TikTok viral video accounts publishing slickly produced combat drone footage with martial music',
        'Friday prayer clerical networks and tribal assemblies'
      ]
    },
    dimensionsBreakdown: {
      physical: {
        criticalNodes: [
          'Al Udeid Combined Air Operations Center (CAOC) SATCOM Node (Qatar)',
          'Bab el-Mandeb Coastal Radar and AIS Transceiver Stations',
          'Djibouti Trans-African Fiber Landing Station',
          'Strait of Hormuz Early Warning Radar Facilities (UAE / Oman)'
        ],
        vulnerabilities: [
          'Commercial shipping reliance on unencrypted AIS and GPS navigation.',
          'Vulnerability of remote desert communication towers to one-way attack drones.',
          'Heavy reliance on commercial satellite transponders vulnerable to uplink jamming.'
        ]
      },
      informational: {
        prevalentPlatforms: ['Telegram', 'WhatsApp', 'TikTok', 'X/Twitter', 'Facebook', 'YouTube'],
        algorithmicVectors: [
          'Algorithmic amplification of violent anti-shipping combat footage.',
          'Deepfake audio mimicking Gulf state officials.',
          'Coordinated bot swarms harassing commercial shipping companies that comply with coalition guidance.'
        ]
      },
      cognitive: {
        coreCulturalMentalModels: [
          'Profound cultural pride in independence from foreign domination.',
          'Honor, hospitality, and tribal kinship ties paramount in dispute resolution.',
          'Deep religious reverence for moral and clerical authority.'
        ],
        exploitedGrievances: [
          'Civilian casualties from regional conflict and food/water insecurity.',
          'Economic inequality and high youth unemployment in Yemen, Iraq, and Lebanon.',
          'Frustration with perceived double standards in international law enforcement.'
        ]
      }
    },
    informationAdvantageActivitiesOperationalized: [
      {
        activityId: 'ENABLE',
        activityName: 'Enable Decision Making',
        theaterSpecificTask: 'Maintain fused maritime domain awareness between US, UK, and regional partners using unclassified AI automated tracking.',
        leadComponent: 'Task Force 59 (Unmanned & AI Integration) & NAVCENT',
        status: 'ACTIVE'
      },
      {
        activityId: 'PROTECT',
        activityName: 'Protect Friendly Information',
        theaterSpecificTask: 'Harden base SATCOM dishes and GPS receivers against Iranian electronic jamming and spoofing in the Persian Gulf.',
        leadComponent: 'Army Space and Missile Defense Command (SMDC) & CENTCOM J6',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFORM',
        activityName: 'Inform Audiences',
        theaterSpecificTask: 'Release unclassified chemical and forensic proof demonstrating that intercepted weaponry originates directly from Iranian state factories.',
        leadComponent: 'CENTCOM Public Affairs & US Department of State Global Engagement Center',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFLUENCE',
        activityName: 'Influence Target Audiences',
        theaterSpecificTask: 'Broadcast localized Yemeni dialect radio messaging highlighting Houthi theft of UN food aid for elite militia commanders.',
        leadComponent: 'Combined Joint Special Operations Task Force (CJSOTF) MISO Cell',
        status: 'ACTIVE'
      },
      {
        activityId: 'AFFECT',
        activityName: 'Affect Adversary Decision-Making',
        theaterSpecificTask: 'Execute precision cyber-electronic disruption against Houthi coastal surveillance radars directing anti-ship ballistic missile launches.',
        leadComponent: 'Joint Force Headquarters-Cyber (Air Force / CENTCOM)',
        status: 'ACTIVE'
      }
    ],
    highPayoffTargets: [
      {
        id: 'HPIT-CENT-01',
        targetCategory: 'Adversary Tactical Drone C2 Node',
        actorGroup: 'Houthi Unmanned Surface Vessel (USV) Ground Control Station',
        targetObjective: 'Sever satellite and RF control links to attacking drone boats.',
        dimension: 'PHYSICAL',
        deliveryMeans: ['Precision electronic jamming', 'Tactical OCO exploit', 'Kinetic strike on antenna trailer'],
        riskAssessment: 'HIGH',
        desiredBehavioralShift: 'USVs drift harmlessly off-course without striking commercial vessels.'
      },
      {
        id: 'HPIT-CENT-02',
        targetCategory: 'Tribal Leadership Audience',
        actorGroup: 'Tribal Elders of Marib and Shabwah Governorates (Yemen)',
        targetObjective: 'Secure tribal agreements barring Houthi missile launch teams from tribal territory.',
        dimension: 'COGNITIVE',
        deliveryMeans: ['Civil Affairs Key Leader Engagements', 'Water infrastructure project commitments', 'Direct elder council dialogues'],
        riskAssessment: 'MODERATE',
        desiredBehavioralShift: 'Tribal militias physically expel Houthi rocket crews attempting to deploy on their land.'
      }
    ],
    synchronizationPhases: [
      {
        phase: 'Phase 0: Freedom of Navigation & Regional Partnership',
        timeframe: 'Ongoing Theater Campaign Plan',
        keyIoEfforts: [
          'Expose Iranian maritime proliferation through international press briefings.',
          'Support Combined Maritime Forces (CMF) multinational public communications.',
          'Execute Civil Affairs humanitarian medical clinics in remote partner districts.'
        ],
        decisiveInformationPoints: 'UN Security Council resolution condemning attacks backed by coalition forensic proof.',
        mops: ['85 maritime interdiction forensic dossiers published', '140 tribal engagements completed'],
        moes: ['Commercial shipping traffic maintains transit confidence', 'Militia recruitment in target districts declines by 25%']
      },
      {
        phase: 'Phase 1: Active Interdiction & Degradation',
        timeframe: 'D-Day to D+90',
        keyIoEfforts: [
          'Broadcast real-time combat camera footage of defensive interception of adversary missiles.',
          'Jam illegal militia radio repeaters broadcasting threats against civilian mariners.',
          'Deliver emergency humanitarian messages to civilians caught near militia launch sites.'
        ],
        decisiveInformationPoints: 'Neutralization of primary militia command media broadcast facility in Sanaa.',
        mops: ['100% of shootdowns corroborated with declassified video within 4 hours'],
        moes: ['Civilian avoidance of militia launch sites increases by 60%']
      }
    ]
  },

  USAFRICOM: {
    aorId: 'USAFRICOM',
    commandName: 'United States Africa Command',
    hqLocation: 'Kelley Barracks, Stuttgart, Germany',
    geographicScope: '53 African nations (excluding Egypt); over 1.4 billion people, 11 million square miles, thousands of distinct ethnic groups and languages.',
    defaultMissionStatement: {
      task: 'Special Operations Command Africa (SOCAFRICA) & USAFRICOM Information Operations Division execute synchronized information advantage activities across the African Theater NLT 220001Z OCT 26',
      purpose: 'To counter Russian Africa Corps (former Wagner) cognitive subversion and neo-colonial exploitation, defeat Violent Extremist Organization (Al-Shabaab, ISIS, JNIM) radicalization, protect host-nation democratic partnerships, and enhance humanitarian security in order to build long-term African civil resilience.',
      commandersIntent: {
        purpose: 'Expose predatory mercenary exploitation of African natural resources and build enduring host-nation partner capacity through truthful, transparent information engagement.',
        keyTasks: [
          'Expose human rights atrocities and resource looting perpetrated by Russian Africa Corps forces in the Sahel and Central Africa.',
          'Counter Al-Shabaab and JNIM extremist recruitment by amplifying moderate Islamic scholars and former militant testimonials.',
          'Strengthen African civilian trust in partner armed forces through transparent Civil Affairs civil-military reporting.',
          'Harden partner communications networks against PRC Digital Silk Road surveillance and algorithmic suppression.'
        ],
        desiredCognitiveEndState: 'African civil populations and youth cohorts reject extremist and mercenary narratives; partner armed forces are viewed as professional protectors of civilian safety; U.S. and allied security assistance is recognized as sovereign-respecting and enduring.'
      },
      specifiedTasks: [
        'Produce multi-lingual radio and digital broadcasts in French, Arabic, Somali, Hausa, and Swahili.',
        'Track and counter Kremlin-backed meme factories operating out of Bamako and Bangui.',
        'Coordinate information operations with the African Union and ECOWAS peace support missions.'
      ],
      impliedTasks: [
        'Partner with local independent investigative journalists exposing illicit gold and diamond extraction.',
        'Provide emergency communications gear to remote health clinics in areas contested by Al-Shabaab.'
      ],
      essentialTasks: [
        'Dismantle the false narrative that Russian mercenaries provide effective security against jihadist insurgencies.',
        'Maintain open channels of communication with key African military leadership despite political coups.'
      ],
      pirs: [
        'PIR-IO-01: What anti-Western propaganda narratives are being disseminated by Russian state media (RT Afrique) following military juntas in the Sahel?',
        'PIR-IO-02: Which local radio frequencies are being co-opted by Al-Shabaab in Lower Shabelle to intimidate village elders?'
      ]
    },
    osintInformationEnvironmentSummary: 'The USAFRICOM information environment is shaped by an acute youth demographic boom (median age under 19), rapid cellular mobile phone proliferation (mobile money, WhatsApp, TikTok), and the persistent primacy of local community FM radio in rural areas. The Russian Federation’s Africa Corps (successor to Wagner Group) runs aggressive anti-Western disinformation campaigns capitalizing on anti-colonial sentiment, while the PRC has constructed the physical telecommunication backbone (Huawei/ZTE) across much of the continent under the Digital Silk Road initiative.',
    adversaryIoDoctrine: {
      doctrineName: 'Russian Africa Corps Cognitive Subversion & VEO Digital Radicalization',
      adversaryState: 'Russian Federation (Africa Corps / PMC Wagner) & VEOs (Al-Shabaab, JNIM)',
      primaryPlaybook: 'Weaponizing anti-French and anti-Western grievances; presenting mercenary forces as anti-imperialist liberators while securing lucrative gold/mining concessions; VEOs use localized sermons and intimidation to enforce sharia.',
      keyNarrativeThemes: [
        'Western presence in Africa is purely extractive and perpetuates poverty.',
        'Democracy is a Western imposition unsuited for African governance.',
        'Russian forces provide immediate, unconditional security without human rights lectures.',
        'Jihad is an obligation to overthrow corrupt apostate regimes supported by the West.'
      ],
      disseminationEcosystem: [
        'RT Afrique and Sputnik Afrique French-language services',
        'Coordinated pan-African social media influencer networks financed by Russian cutouts',
        'WhatsApp audio memo chains and local community FM stations',
        'Al-Kataib Media Foundation (Al-Shabaab media wing) video releases'
      ]
    },
    dimensionsBreakdown: {
      physical: {
        criticalNodes: [
          'Camp Lemonnier Strategic Communications Hub (Djibouti)',
          'Subsea Cable Landing Hubs in Mombasa (Kenya) and Lagos (Nigeria)',
          'Trans-Saharan Microwave Cellular Tower Relays',
          'Community FM Radio Transmitter Towers in rural Somalia and Niger'
        ],
        vulnerabilities: [
          'Heavy reliance on commercial telecommunications hardware manufactured by PRC state-owned enterprises.',
          'Physical vulnerability of remote cellular towers to VEO sabotage.',
          'Frequent electrical grid collapses necessitating generator power for communication stations.'
        ]
      },
      informational: {
        prevalentPlatforms: ['WhatsApp', 'Facebook', 'TikTok', 'X/Twitter', 'Telegram', 'Local FM Radio'],
        algorithmicVectors: [
          'Viral dissemination of edited video clips depicting military juntas defying Western diplomats.',
          'Audio voice notes circulating rumors of Western disease spread or resource theft.',
          'Coordinated bot manipulation of hashtag trends in major capitals (Nairobi, Dakar, Lagos).'
        ]
      },
      cognitive: {
        coreCulturalMentalModels: [
          'Deep suspicion of former European colonial powers and foreign military bases.',
          'Primacy of local communal consensus, elder authority, and village palaver discussions.',
          'Desire of African youth for rapid technological and economic mobility.'
        ],
        exploitedGrievances: [
          'Failure of host-nation governments to provide basic security, education, and jobs.',
          'Excesses and corruption of national security forces.',
          'Environmental damage from foreign-owned mining operations.'
        ]
      }
    },
    informationAdvantageActivitiesOperationalized: [
      {
        activityId: 'ENABLE',
        activityName: 'Enable Decision Making',
        theaterSpecificTask: 'Provide forward-deployed Civil Affairs teams with low-bandwidth satellite links to report real-time civil conditions from remote villages.',
        leadComponent: 'USAFRICOM J6 & 352nd Civil Affairs Command',
        status: 'ACTIVE'
      },
      {
        activityId: 'PROTECT',
        activityName: 'Protect Friendly Information',
        theaterSpecificTask: 'Ensure operational security for African partner commando teams during counter-terror raids to prevent intelligence leaks to VEOs.',
        leadComponent: 'Special Operations Command Africa (SOCAFRICA)',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFORM',
        activityName: 'Inform Audiences',
        theaterSpecificTask: 'Publish verified civilian casualty reports and forensic satellite imagery documenting massacres perpetrated by Russian mercenaries in central Mali.',
        leadComponent: 'USAFRICOM Public Affairs & US Embassy Public Affairs Sections',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFLUENCE',
        activityName: 'Influence Target Audiences',
        theaterSpecificTask: 'Broadcast radio testimonies from former Al-Shabaab child soldiers highlighting forced conscription and deception within militant camps.',
        leadComponent: 'MISO Task Force Horn of Africa',
        status: 'ACTIVE'
      },
      {
        activityId: 'AFFECT',
        activityName: 'Affect Adversary Decision-Making',
        theaterSpecificTask: 'Execute electronic jamming against Al-Shabaab tactical handheld radios during Somali National Army clearing operations.',
        leadComponent: 'Joint Special Operations Task Force Electronic Warfare Cell',
        status: 'ACTIVE'
      }
    ],
    highPayoffTargets: [
      {
        id: 'HPIT-AFR-01',
        targetCategory: 'Adversary Mercenary Propaganda Front',
        actorGroup: 'Russian-backed Pan-Africanist Social Media Influencer Network',
        targetObjective: 'Expose illicit funding lines and disconnect fabricated social accounts.',
        dimension: 'INFORMATIONAL',
        deliveryMeans: ['Public exposure via State Department GEC', 'Platform de-platforming requests', 'Investigative journalism partnerships'],
        riskAssessment: 'HIGH',
        desiredBehavioralShift: 'Influencers lose credibility among African youth followers and engagement drops by >70%.'
      },
      {
        id: 'HPIT-AFR-02',
        targetCategory: 'Vulnerable Rural Youth Demographic',
        actorGroup: 'Youth in Contested Rural Districts of Jubaland (Somalia)',
        targetObjective: 'Inoculate against Al-Shabaab forced recruitment and provide alternative vocational hope.',
        dimension: 'COGNITIVE',
        deliveryMeans: ['Local FM radio drama series', 'Civil Affairs sports equipment distributions', 'Elder council mentorship programs'],
        riskAssessment: 'LOW',
        desiredBehavioralShift: 'Youth actively reject extremist overtures and alert community elders to infiltrators.'
      }
    ],
    synchronizationPhases: [
      {
        phase: 'Phase 0: Partner Institutional Capacity & Civil Trust',
        timeframe: 'Multi-Year Theater Security Cooperation',
        keyIoEfforts: [
          'Train partner military media cells in transparent human rights reporting.',
          'Execute Civil Affairs medical and veterinarian civic action programs (MEDCAP/VETCAP).',
          'Deploy radio listening posts to track extremist narrative trends.'
        ],
        decisiveInformationPoints: 'Partner armed forces successfully counter rebel disinformation following border clash.',
        mops: ['210 radio episodes broadcast in 4 languages', '85 Civil Affairs projects documented and publicized'],
        moes: ['Civilian reporting of VEO IED emplacements increases by 45%']
      },
      {
        phase: 'Phase 1: Crisis Containment & Counter-VEO Surge',
        timeframe: 'D-Day to D+60',
        keyIoEfforts: [
          'Deploy mobile radio transmitters to broadcast emergency defection guidelines.',
          'Expose mercenary retreat and looting following defensive defeats.',
          'Coordinate rapid humanitarian food aid delivery with real-time video documentation.'
        ],
        decisiveInformationPoints: 'Public defection of prominent Al-Shabaab regional commander broadcast across national media.',
        mops: ['Over 1 million text alerts distributed to mobile phones in target sector'],
        moes: ['Defection rate among rank-and-file militants increases by 35%']
      }
    ]
  },

  USNORTHCOM: {
    aorId: 'USNORTHCOM',
    commandName: 'United States Northern Command',
    hqLocation: 'Peterson Space Force Base, Colorado Springs, Colorado',
    geographicScope: 'United States, Canada, Mexico, the Bahamas, Puerto Rico, the Virgin Islands, and Arctic approaches; covers over 500 million people and North American airspace/maritime approaches.',
    defaultMissionStatement: {
      task: 'Joint Task Force Civil Support & NORTHCOM Information Dominance Cell execute homeland defense operations in the information dimension across the Northern Theater NLT 220001Z OCT 26',
      purpose: 'To defend North American critical infrastructure against adversarial cognitive and cyber subversion, counter Transnational Criminal Organization (TCO) narco-intimidation and disinformation, harden Arctic communication corridors, and synchronize interagency public communications (DHS/FEMA/DoD) in order to preserve national defense freedom of action.',
      commandersIntent: {
        purpose: 'Maintain unshakeable public trust and institutional decision superiority for homeland defense, critical infrastructure protection, and defense support to civil authorities (DSCA).',
        keyTasks: [
          'Protect North American defense early warning (NORAD) networks and commercial power grid SCADA systems against foreign state cyber/cognitive sabotage.',
          'Counter foreign adversarial influence operations designed to exacerbate domestic social polarization and civil panic during emergencies.',
          'Synchronize factual, rapid public information during natural disasters or CBRN incidents in support of FEMA and DHS.',
          'Expose TCO weaponized disinformation and violent intimidation targeting border communities.'
        ],
        desiredCognitiveEndState: 'The American and Canadian publics maintain high institutional trust in homeland defense readiness; critical infrastructure operators are resilient against cognitive panic; adversaries recognize that covert subversion will be instantly exposed and countered.'
      },
      specifiedTasks: [
        'Establish 24/7 information coordination with NORAD, DHS Cybersecurity and Infrastructure Security Agency (CISA), and Canadian Joint Operations Command (CJOC).',
        'Monitor Arctic high-frequency and satellite communications for foreign electronic interference.',
        'Deliver transparent public information on military Defense Support of Civil Authorities (DSCA) missions.'
      ],
      impliedTasks: [
        'Strictly adhere to Title 10 USC and DoD Directive 5122.05 prohibiting military information operations from targeting U.S. domestic audiences.',
        'Counter foreign state deepfakes aimed at creating panic during weather catastrophes.'
      ],
      essentialTasks: [
        'Defend the homeland against non-kinetic information warfare targeting election systems and power grids.',
        'Preserve National Command Authorities communication survivability under all conditions.'
      ],
      pirs: [
        'PIR-IO-01: What foreign state-sponsored cyber actors are probing industrial control systems of electrical grids in the northern defense sector?',
        'PIR-IO-02: Which synthetic media or deepfake narratives are being seeded into social platforms to disrupt emergency disaster evacuations?'
      ]
    },
    osintInformationEnvironmentSummary: 'The USNORTHCOM information environment encompasses the most advanced digital network ecosystem on Earth, featuring massive cloud hyper-scalers, fiber backbones, and ubiquitous high-speed internet. However, this high connectivity creates acute asymmetric vulnerability to foreign cognitive warfare (PRC, Russian, Iranian bot networks exploiting domestic polarization), ransomware targeting critical municipal water/energy infrastructure, and TCO narco-propaganda along the southern border. The Arctic represents an emerging contested frontier characterized by fragile satellite links and strategic high-frequency radar corridors.',
    adversaryIoDoctrine: {
      doctrineName: 'Adversarial Homeland Cognitive Subversion & TCO Intimidation Tactics',
      adversaryState: 'Adversary State Actors (PRC, Russia, Iran) & Transnational Criminal Organizations (TCOs)',
      primaryPlaybook: 'Amplifying existing political, racial, and social divisions within North American society; staging cyber-ransomware attacks on hospitals and utilities to trigger public panic; TCOs use gruesome social media execution videos to intimidate local officials and law enforcement.',
      keyNarrativeThemes: [
        'Democratic institutions are hopelessly corrupt, polarized, and unable to protect citizens.',
        'Military and emergency services will abandon minority or rural populations during crises.',
        'The adversary syndicate is the true sovereign power and cooperation with police brings certain death.',
        'North American energy and financial grids are on the brink of imminent collapse.'
      ],
      disseminationEcosystem: [
        'Coordinated troll and bot farms on X/Twitter, Facebook, and Reddit',
        'TikTok algorithmic manipulation boosting civil unrest videos',
        'Encrypted adversary syndicate channels and illicit blog networks',
        'State-sponsored spear-phishing and credential theft networks'
      ]
    },
    dimensionsBreakdown: {
      physical: {
        criticalNodes: [
          'NORAD Cheyenne Mountain Complex & Peterson SFB (Colorado)',
          'North American Electric Reliability Corporation (NERC) SCADA Grid Hubs',
          'Arctic High-Frequency Early Warning Radar Stations (Thule, Alert, Clear SFS)',
          'Trans-Pacific and Trans-Atlantic Undersea Cable Terminals (New York, Virginia, California)'
        ],
        vulnerabilities: [
          'High concentration of commercial civilian cloud data centers in single geographic corridors.',
          'Legacy SCADA infrastructure at water treatment and electrical sub-stations.',
          'Vulnerability of Arctic communications to solar electromagnetic disturbances.'
        ]
      },
      informational: {
        prevalentPlatforms: ['X/Twitter', 'Facebook', 'TikTok', 'Instagram', 'YouTube', 'Reddit', 'Nextdoor'],
        algorithmicVectors: [
          'Algorithmic hyper-polarization boosting rage-inducing fabricated content.',
          'High-velocity deepfake audio mimicking senior military commanders.',
          'Spear-phishing campaigns distributing credential-stealing malware to utility technicians.'
        ]
      },
      cognitive: {
        coreCulturalMentalModels: [
          'High value placed on individual freedom of speech and skepticism of government authority.',
          'Expectation of instant, reliable emergency services (911, power, potable water).',
          'Deep civic volunteerism and community solidarity during natural disasters.'
        ],
        exploitedGrievances: [
          'Political polarization and mutual distrust between demographic cohorts.',
          'Economic anxiety regarding inflation, job displacement, and border security.',
          'Historical skepticism toward federal military presence in domestic jurisdictions.'
        ]
      }
    },
    informationAdvantageActivitiesOperationalized: [
      {
        activityId: 'ENABLE',
        activityName: 'Enable Decision Making',
        theaterSpecificTask: 'Ensure survivable, redundant NC3 (Nuclear Command, Control, and Communications) and homeland defense data feeds under electromagnetic attack.',
        leadComponent: 'USSTRATCOM, USNORTHCOM J6 & NORAD',
        status: 'ACTIVE'
      },
      {
        activityId: 'PROTECT',
        activityName: 'Protect Friendly Information',
        theaterSpecificTask: 'Support CISA and National Guard Cyber Protection Teams in monitoring and safeguarding critical civilian election and energy infrastructure.',
        leadComponent: 'Army National Guard Cyber Units & USCYBERCOM',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFORM',
        activityName: 'Inform Audiences',
        theaterSpecificTask: 'Provide rapid, factual public affairs broadcasts during major natural disasters or aerospace defense incidents to dispel rumors and foreign deepfakes.',
        leadComponent: 'NORTHCOM Public Affairs Office & FEMA Interagency Affairs',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFLUENCE',
        activityName: 'Influence Target Audiences',
        theaterSpecificTask: 'Execute bilateral defense communications with Mexican military counterparts to coordinate cross-border interdiction of threat network logistics.',
        leadComponent: 'Civil Affairs Key Leader Engagement Teams (CAT 712)',
        status: 'ACTIVE'
      },
      {
        activityId: 'AFFECT',
        activityName: 'Affect Adversary Decision-Making',
        theaterSpecificTask: 'Conduct active cyber defense and counter-intrusion operations to neutralize foreign botnet infrastructure operating within global transit networks.',
        leadComponent: 'Joint Force Headquarters-Cyber & interagency partners',
        status: 'ACTIVE'
      }
    ],
    highPayoffTargets: [
      {
        id: 'HPIT-NORTH-01',
        targetCategory: 'Foreign State Cyber Infiltration Actor',
        actorGroup: 'Volt Typhoon (PRC State-Sponsored Critical Infrastructure Infiltration Group)',
        targetObjective: 'Identify and expel pre-positioned persistence malware in port and utility networks.',
        dimension: 'INFORMATIONAL',
        deliveryMeans: ['Defensive Cyberspace Operations', 'CISA emergency directives', 'Automated endpoint remediation'],
        riskAssessment: 'CRITICAL',
        desiredBehavioralShift: 'Adversary loses pre-positioned disruptive options against North American military deployment ports.'
      },
      {
        id: 'HPIT-NORTH-02',
        targetCategory: 'Border Community Leadership Demographic',
        actorGroup: 'Civic and Law Enforcement Leaders in Contested Southern Border Municipalities',
        targetObjective: 'Inoculate against illicit threat network bribery/intimidation and establish secure interagency communication channels.',
        dimension: 'COGNITIVE',
        deliveryMeans: ['Civil Affairs Key Leader Engagements', 'Encrypted civilian-military interoperability portals', 'Community resilience workshops'],
        riskAssessment: 'MODERATE',
        desiredBehavioralShift: 'Municipal leaders maintain operational coordination with federal security forces despite adversary intimidation.'
      }
    ],
    synchronizationPhases: [
      {
        phase: 'Phase 0: Persistent Homeland Defense & Critical Infrastructure Assurance',
        timeframe: 'Continuous Operations',
        keyIoEfforts: [
          'Execute annual Cyber Shield exercises with National Guard and private utility operators.',
          'Monitor public sphere for foreign-origin synthetic media during high-profile national events.',
          'Harden Arctic SATCOM ground stations against solar and electronic degradation.'
        ],
        decisiveInformationPoints: 'Zero successful foreign cyber disruptions of national power grid or defense mobilization ports.',
        mops: ['520 critical infrastructure vulnerability scans completed', '100% DSCA missions accompanied by verified PAO coverage'],
        moes: ['Public confidence in homeland defense readiness remains above 75%']
      },
      {
        phase: 'Phase 1: Major Crisis Response / Emergency DSCA Surge',
        timeframe: 'D-Day to D+30',
        keyIoEfforts: [
          'Establish Joint Information Center (JIC) with FEMA and State Emergency Management Agencies.',
          'Deploy mobile Starlink and emergency cellular trailers to disaster-affected zones.',
          'Rapidly debunk foreign disinformation campaigns designed to provoke civil unrest or evacuation panic.'
        ],
        decisiveInformationPoints: 'Immediate public adoption of official evacuation routes, preventing gridlock and panic.',
        mops: ['100% of emergency directives broadcast simultaneously across 12 languages'],
        moes: ['Zero loss of life attributable to fraudulent emergency evacuation instructions']
      }
    ]
  },

  USSOUTHCOM: {
    aorId: 'USSOUTHCOM',
    commandName: 'United States Southern Command',
    hqLocation: 'Doral, Florida',
    geographicScope: '31 countries and 16 dependencies in Latin America and the Caribbean; over 500 million people, vast biodiversity, strategic transit through the Panama Canal and Strait of Magellan.',
    defaultMissionStatement: {
      task: 'Joint Interagency Task Force South (JIATF-S) & SOUTHCOM Information Warfare Division conduct persistent operations in the information dimension across the Southern Theater NLT 220001Z OCT 26',
      purpose: 'To counter PRC economic statecraft and predatory narrative expansion, dismantle Russian Spanish-language disinformation dominance (RT en Español), disrupt Transnational Criminal Organization illicit networks in the Tri-Border Area, and highlight enduring humanitarian partnerships (USNS Comfort) in order to safeguard regional democratic sovereignty.',
      commandersIntent: {
        purpose: 'Build enduring hemispheric security partnerships by championing the rule of law, exposing authoritarian disinformation, and demonstrating that the U.S. remains the partner of choice in the Americas.',
        keyTasks: [
          'Expose illegal, unreported, and unregulated (IUU) fishing by foreign PRC-flagged maritime fleets off the coasts of Ecuador, Peru, and Argentina.',
          'Counter Russian state media disinformation (RT en Español and Sputnik Mundo) targeting Latin American democratic institutions.',
          'Publicize humanitarian engineering, disaster response, and medical civic action programs to reinforce democratic legitimacy.',
          'Facilitate bilateral intelligence and civil information sharing with Colombian, Brazilian, and Panamanian defense forces.'
        ],
        desiredCognitiveEndState: 'Latin American and Caribbean citizens recognize foreign authoritarian investment as debt-trap exploitation; democratic institutions maintain high public trust; illicit trafficking networks lose community tolerance.'
      },
      specifiedTasks: [
        'Deploy Civil Affairs teams to Amazonian and Andean border communities for Key Leader Engagements.',
        'Publish unclassified satellite tracking of foreign illicit maritime fleets in the Pacific and South Atlantic.',
        'Synchronize public messaging with partner nations regarding Panama Canal operational security.'
      ],
      impliedTasks: [
        'Support local partner nation military public affairs training to counter adversary disinformation.',
        'Provide humanitarian health messaging during USNS Comfort hospital ship dockings.'
      ],
      essentialTasks: [
        'Preserve free and secure maritime transit through the Panama Canal and Caribbean sea lanes.',
        'Neutralize foreign authoritarian efforts to establish dual-use military ports in South America.'
      ],
      pirs: [
        'PIR-IO-01: What false anti-U.S. narratives are being amplified by Russian and Venezuelan state media regarding regional security cooperation?',
        'PIR-IO-02: Where are foreign deep-water port infrastructure projects (e.g. Chancay) being constructed with integrated military-grade SIGINT and satellite tracking capabilities?'
      ]
    },
    osintInformationEnvironmentSummary: 'The USSOUTHCOM information environment features the highest per capita consumption of Spanish- and Portuguese-language social media in the world, with WhatsApp, Facebook, and TikTok acting as primary news sources. The Russian Federation holds unprecedented cognitive influence through RT en Español and Sputnik Mundo (millions of organic social followers), which are widely rebroadcast by local regional television and radio networks. Concurrently, the PRC is expanding its "Belt and Road" narrative while constructing critical logistics infrastructure (deep-water ports, space tracking stations in Neuquén, Argentina, and 5G cellular grids).',
    adversaryIoDoctrine: {
      doctrineName: 'Russian Spanish-Language Cognitive Penetration & PRC Belt and Road Narrative Diplomacy',
      adversaryState: 'Russian Federation (RT en Español, Sputnik Mundo) & PRC (MFA, Xinhua América)',
      primaryPlaybook: 'Positioning Russia and China as benevolent alternatives to "U.S. imperialism and hegemony"; weaponizing historical Monroe Doctrine grievances; providing free news feeds to underfunded Latin American media outlets.',
      keyNarrativeThemes: [
        'U.S. security cooperation is a cover for extracting Latin American natural resources (lithium, fresh water, oil).',
        'Western sanctions on authoritarian regimes are acts of war causing civilian poverty.',
        'PRC infrastructure investment comes with no political strings and guarantees modern prosperity.',
        'Democratic systems in Latin America are dysfunctional and authoritarian state capitalism is superior.'
      ],
      disseminationEcosystem: [
        'RT en Español television syndication across hundreds of cable providers',
        'Sputnik Mundo news wire feeds integrated into major regional newspapers',
        'Massive WhatsApp community viral forwarded audio and video messages',
        'Chinese Confucius Institutes and media training junkets for Latin American journalists'
      ]
    },
    dimensionsBreakdown: {
      physical: {
        criticalNodes: [
          'Panama Canal Transit Monitoring Hub (Balboa / Miraflores)',
          'JIATF-South Joint Operations Center (Key West, Florida)',
          'Deep-Water Mega-Port Facilities (Chancay, Peru; Santos, Brazil)',
          'PRC Deep-Space Tracking Facility (Las Lajas, Neuquén, Argentina)'
        ],
        vulnerabilities: [
          'Vulnerability of remote riverine and jungle communication repeaters.',
          'Heavy civilian reliance on commercial telecommunications built by Huawei and ZTE.',
          'Limited radar coverage across the vast Amazonian interior facilitating illicit air smuggling.'
        ]
      },
      informational: {
        prevalentPlatforms: ['WhatsApp', 'Facebook', 'TikTok', 'Instagram', 'X/Twitter', 'YouTube'],
        algorithmicVectors: [
          'Viral forward chains in family and community WhatsApp groups spreading fabricated news.',
          'YouTube recommendation algorithms funneling viewers toward sensationalist RT en Español documentaries.',
          'Targeted anti-mining and anti-infrastructure protest mobilization via Facebook groups.'
        ]
      },
      cognitive: {
        coreCulturalMentalModels: [
          'Deep pride in national sovereignty and rejection of foreign paternalism.',
          'Family and church as core social units of moral trust and stability.',
          'Aspiration for economic equality, transparent governance, and personal safety.'
        ],
        exploitedGrievances: [
          'Historical memory of Cold War-era foreign military interventions.',
          'Rampant public corruption among political elites.',
          'Severe wealth inequality and lack of economic opportunity in rural and indigenous areas.'
        ]
      }
    },
    informationAdvantageActivitiesOperationalized: [
      {
        activityId: 'ENABLE',
        activityName: 'Enable Decision Making',
        theaterSpecificTask: 'Maintain fused maritime and aerial counter-narcotics tracking across the Caribbean and Eastern Pacific via JIATF-South.',
        leadComponent: 'JIATF-South & US Coast Guard District 7',
        status: 'ACTIVE'
      },
      {
        activityId: 'PROTECT',
        activityName: 'Protect Friendly Information',
        theaterSpecificTask: 'Assist partner nation defense ministries (Colombia, Ecuador) in hardening operational military networks against foreign cyber espionage.',
        leadComponent: 'SOUTHCOM J6 & Army Cyber Command',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFORM',
        activityName: 'Inform Audiences',
        theaterSpecificTask: 'Publish unclassified satellite tracking documenting illegal environmental damage and oceanic resource destruction by foreign fishing armadas.',
        leadComponent: 'SOUTHCOM Public Affairs & US State Department Bureau of Western Hemisphere Affairs',
        status: 'ACTIVE'
      },
      {
        activityId: 'INFLUENCE',
        activityName: 'Influence Target Audiences',
        theaterSpecificTask: 'Highlight successful bilateral interdictions to demonstrate host-nation sovereignty enforcement and deter threat network recruitment.',
        leadComponent: 'Special Operations Command South (SOCSOUTH) MISO Detachment',
        status: 'ACTIVE'
      },
      {
        activityId: 'AFFECT',
        activityName: 'Affect Adversary Decision-Making',
        theaterSpecificTask: 'Coordinate cyber and financial disruption targeting illicit money laundering syndicates operating in the Tri-Border Area (Argentina-Brazil-Paraguay).',
        leadComponent: 'Joint Interagency Cyber Task Force & US Treasury OFAC',
        status: 'ACTIVE'
      }
    ],
    highPayoffTargets: [
      {
        id: 'HPIT-SOUTH-01',
        targetCategory: 'Foreign State Influence Outlet',
        actorGroup: 'RT en Español Digital Distribution Hub in Latin America',
        targetObjective: 'Expose undisclosed state financing and debunk anti-democratic conspiracy propaganda.',
        dimension: 'INFORMATIONAL',
        deliveryMeans: ['Public exposure of editorial control by Kremlin intelligence', 'Fact-checking partnerships with Latin American journalists', 'Independent university media research'],
        riskAssessment: 'MODERATE',
        desiredBehavioralShift: 'Mainstream Latin American news networks drop RT wire services and adopt verified independent journalism.'
      },
      {
        id: 'HPIT-SOUTH-02',
        targetCategory: 'Coastal Fishing & Maritime Community Audience',
        actorGroup: 'Artisanal Coastal Fishermen and Port Authorities in Ecuador, Peru, and Chile',
        targetObjective: 'Mobilize citizen maritime domain reporting against illegal foreign super-trawlers.',
        dimension: 'COGNITIVE',
        deliveryMeans: ['Spanish-language mobile reporting app', 'Civil Affairs port engagements', 'Radio bulletins on maritime conservation'],
        riskAssessment: 'LOW',
        desiredBehavioralShift: 'Fishermen actively log and transmit geographic coordinates of foreign incursions to maritime defense authorities.'
      }
    ],
    synchronizationPhases: [
      {
        phase: 'Phase 0: Hemispheric Partnership & Sovereign Resilience',
        timeframe: 'Continuous Theater Campaign Plan',
        keyIoEfforts: [
          'Execute annual UNITAS and PANAMAX multilateral exercises with full information operations play.',
          'Deploy USNS Comfort to 8 Latin American ports providing medical care with extensive transparent media documentation.',
          'Execute Civil Affairs civic action projects in indigenous and rural border sectors.'
        ],
        decisiveInformationPoints: 'Joint regional declaration by Pacific Alliance nations establishing strict transparency requirements for foreign port investments.',
        mops: ['45 unclassified maritime tracking bulletins released', '120 community healthcare clinics documented'],
        moes: ['Public favorability toward U.S. partnership in host ports exceeds 78%']
      },
      {
        phase: 'Phase 1: Canal Security & Humanitarian Crisis Surge',
        timeframe: 'D-Day to D+45',
        keyIoEfforts: [
          'Synchronize real-time defensive operations with Panama Canal Authority media center.',
          'Counter adversary cyber attacks on Canal logistics scheduling servers.',
          'Broadcast humanitarian assistance distribution schedules to prevent migrant exploitation.'
        ],
        decisiveInformationPoints: 'Demonstration of continuous, uninterrupted ship transit through the Panama Canal despite crisis.',
        mops: ['100% of false-flag canal disruption rumors debunked within 90 minutes'],
        moes: ['Zero commercial shipping diversion from the Panama Canal due to security concerns']
      }
    ]
  }
};
