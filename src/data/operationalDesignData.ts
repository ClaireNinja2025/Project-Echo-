/**
 * Army Operational Design Data Model & Doctrinal Presets
 * Grounded in:
 * - ADP 5-0 (The Operations Process, Chapter 2: Operational Design)
 * - JP 5-0 (Joint Planning, Chapter IV: Operational Design)
 * - FM 5-0 (Planning and Orders Production)
 * - ATP 5-0.1 (Army Design Methodology)
 */

import { OperationalPhase } from '../types';

export type DefeatMechanism = 'DESTROY' | 'DISLOCATE' | 'DISINTEGRATE' | 'ISOLATE';
export type StabilityMechanism = 'COMPEL' | 'CONTROL' | 'INFLUENCE' | 'SUPPORT';
export type ApproachType = 'DIRECT' | 'INDIRECT';
export type ConditionStatus = 'MET' | 'PARTIAL' | 'NOT_MET' | 'AT_RISK';
export type DecisivePointStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED' | 'AT_RISK';

export interface RequiredCondition {
  id: string;
  statement: string;
  loeId: string;
  status: ConditionStatus;
  assessmentNotes: string;
  evaluationDTG: string;
}

export interface DecisivePoint {
  id: string;
  name: string;
  description: string;
  phase: OperationalPhase;
  status: DecisivePointStatus;
  targetDTG: string;
  criticalVulnerabilityTargeted: string;
  leadUnit: string;
  successCriteria: string;
}

export interface LineOfEffort {
  id: string;
  number: number;
  name: string;
  category: 'CIVIL_SECURITY' | 'INFO_ADVANTAGE' | 'INFRASTRUCTURE' | 'GOVERNANCE' | 'HUMANITARIAN' | 'ECONOMIC';
  leadAgent: string;
  objective: string;
  color: string;
  decisivePoints: DecisivePoint[];
}

export interface CenterOfGravityElement {
  id: string;
  actor: 'ADVERSARY' | 'FRIENDLY';
  centerOfGravity: string;
  criticalCapabilities: string[]; // CC: What the COG can do
  criticalRequirements: string[]; // CR: Essential conditions/resources needed to perform CC
  criticalVulnerabilities: string[]; // CV: Vulnerable aspects of CR that can be influenced/neutralized
}

export interface OperationalRisk {
  id: string;
  title: string;
  category: 'TACTICAL' | 'CIVIL_INFORMATION' | 'STRATEGIC' | 'POLITICAL';
  probability: 'HIGH' | 'MEDIUM' | 'LOW';
  severity: 'CRITICAL' | 'SERIOUS' | 'MODERATE';
  mitigationMeasure: string;
  contingencyBranch: string;
}

export interface OperationalAssumption {
  id: string;
  statement: string;
  impactIfInvalid: string;
  validationMethod: string;
  status: 'VALIDATED' | 'UNVALIDATED' | 'INVALIDATED';
}

export interface OperationalDesignModel {
  aorId: string;
  aorAcronym: string;
  campaignTitle: string;
  doctrinalBasis: string;
  problemStatement: string;
  operationalEnvironmentSummary: string;
  approach: ApproachType;
  approachRationale: string;
  militaryEndState: string;
  civilPoliticalEndState: string;
  requiredConditions: RequiredCondition[];
  cogs: CenterOfGravityElement[];
  linesOfEffort: LineOfEffort[];
  defeatMechanism: {
    primary: DefeatMechanism;
    rationale: string;
  };
  stabilityMechanism: {
    primary: StabilityMechanism;
    rationale: string;
  };
  operationalReach: {
    baseOfOperations: string;
    forwardLogisticsBasing: string;
    enduranceWindow: string;
    culminationFactors: string;
    pauseRefitTriggers: string;
  };
  risks: OperationalRisk[];
  assumptions: OperationalAssumption[];
}

export const INITIAL_OPERATIONAL_DESIGNS: Record<string, OperationalDesignModel> = {
  'aor-centcom': {
    aorId: 'aor-centcom',
    aorAcronym: 'USCENTCOM',
    campaignTitle: 'Operation Griffin Shield — Levant & Arabian Gulf Stability Campaign',
    doctrinalBasis: 'ADP 5-0 (Operations Process) / JP 5-0 (Joint Planning) / ATP 3-57.50',
    problemStatement:
      'How does USCENTCOM synchronize multi-domain operations and Civil Affairs forces to degrade non-state proxy weapon pipelines, counter cognitive influence vectors, and build partner nation institutional resilience without triggering regional escalatory escalation?',
    operationalEnvironmentSummary:
      'Dynamic hybrid operational environment characterized by dense urban coastal corridors, trans-Euphrates logistics lines, severe water and power infrastructure scarcity, and contested cognitive narratives across Arabic and Farsi digital platforms.',
    approach: 'INDIRECT',
    approachRationale:
      'An indirect approach leverages partner nation security institutions, indigenous municipal councils, and targeted information advantage to isolate proxy networks from popular support while building essential services resilience.',
    militaryEndState:
      'Proxy armed elements isolated from population nodes and resupply conduits; key civilian and military transit corridors secured; partner nation forces maintain autonomous border and critical infrastructure protection.',
    civilPoliticalEndState:
      'Legitimate municipal governance structures functioning transparently; essential water/power utilities restored above baseline resilience; civil population actively rejects adversary disinformation and illicit proxy extortion.',
    requiredConditions: [
      {
        id: 'cond-1',
        statement: 'Southern corridor transit routes secured with less than 2% illicit contraband interdiction leakage.',
        loeId: 'loe-1',
        status: 'PARTIAL',
        assessmentNotes: 'Checkpoints at Highway 45 and crossing sectors require upgraded biometric scanning.',
        evaluationDTG: '211200Z SEP 26',
      },
      {
        id: 'cond-2',
        statement: 'Adversary disinformation penetration reduced below 20% across regional social broadcast networks.',
        loeId: 'loe-2',
        status: 'NOT_MET',
        assessmentNotes: 'Hostile proxy botfarms currently generating 45% of localized trending sentiment regarding municipal water contamination.',
        evaluationDTG: '211400Z SEP 26',
      },
      {
        id: 'cond-3',
        statement: 'Municipal water treatment plants operating at 85%+ capacity across urban districts.',
        loeId: 'loe-3',
        status: 'MET',
        assessmentNotes: 'CAT 712 water purification generator delivery completed at Central Water Station #2.',
        evaluationDTG: '211600Z SEP 26',
      },
      {
        id: 'cond-4',
        statement: 'Civil-Military Operations Center (CMOC) operating with active NGO and tribal leader liaison participation.',
        loeId: 'loe-4',
        status: 'PARTIAL',
        assessmentNotes: 'Tribal councils attending weekly shura meetings; international red cross liaison established.',
        evaluationDTG: '211700Z SEP 26',
      },
    ],
    cogs: [
      {
        id: 'cog-adv-centcom',
        actor: 'ADVERSARY',
        centerOfGravity: 'Regional Proxy Command Network & Contraband Funding Arteries',
        criticalCapabilities: [
          'Ability to rapidly disperse weapons and funds through informal hawala networks',
          'Capability to exploit civil infrastructure distress via coercive cognitive propaganda',
          'Capacity to execute coordinated drone and rocket strikes against logistics corridors',
        ],
        criticalRequirements: [
          'Uncontested physical transit corridors across desert borders',
          'Monopoly on fuel and potable water black markets in neglected sectors',
          'Civilian compliance maintained through fear and lack of alternative authority',
        ],
        criticalVulnerabilities: [
          'Dependence on key logistics chokepoints and vulnerable illicit fuel depots',
          'Fragile legitimacy with local youth and tribal elders alienated by extortion',
          'Exposure of covert digital disinformation accounts to rapid fact-checking and public attribution',
        ],
      },
      {
        id: 'cog-friendly-centcom',
        actor: 'FRIENDLY',
        centerOfGravity: 'Coalition-Partner Force Legitimacy & Unified Civil-Military Synchronization',
        criticalCapabilities: [
          'Rapid deployment of multi-domain Civil Affairs and Information Advantage teams',
          'Precision interdiction of threat financing without disrupting legitimate local commerce',
          'Bilateral intelligence sharing and combined joint operational tempo',
        ],
        criticalRequirements: [
          'Sustained host nation public and political approval for Coalition presence',
          'Persistent access to shared civil-military information environment (CKI & COP)',
          'Hardened operational logistics hubs and air defense over vital bases',
        ],
        criticalVulnerabilities: [
          'Public sensitivity to perceived collateral damage and civil utility disruption',
          'Susceptibility of forward tactical nodes to cognitive influence and legal lawfare',
          'Supply line bottlenecks along single-lane unimproved highway corridors',
        ],
      },
    ],
    linesOfEffort: [
      {
        id: 'loe-1',
        number: 1,
        name: 'Civil Security & Transit Protection',
        category: 'CIVIL_SECURITY',
        leadAgent: 'TF Iron / Partner Border Guards',
        objective: 'Deny adversary access to population centers and sever illicit logistical pipelines.',
        color: '#E34B4B',
        decisivePoints: [
          {
            id: 'dp-101',
            name: 'DP 1.1: Border Gate Biometric Hardening',
            description: 'Install tactical biometrics and license plate recognition at Crossing Alpha.',
            phase: 'Phase 0 - Shape',
            status: 'COMPLETED',
            targetDTG: '150800Z SEP 26',
            criticalVulnerabilityTargeted: 'Adversary covert transit across unsecured crossings',
            leadUnit: 'CAT 712 / MP Bde',
            successCriteria: '100% vehicle screening and contraband alert integration with CKI.',
          },
          {
            id: 'dp-102',
            name: 'DP 1.2: Highway 45 Security Corridor Neutralization',
            description: 'Establish permanent combined partner checkpoints and mobile counter-IED patrols.',
            phase: 'Phase 1 - Crisis Response',
            status: 'IN_PROGRESS',
            targetDTG: '251800Z SEP 26',
            criticalVulnerabilityTargeted: 'Threat mobility along transit chokepoints',
            leadUnit: '1-68 AR / Partner QRF',
            successCriteria: 'Zero hostile kinetic interdictions against civilian convoys for 14 consecutive days.',
          },
          {
            id: 'dp-103',
            name: 'DP 1.3: Safe Zone Enclave Demilitarization',
            description: 'Transition security operations to host nation provincial police with Coalition overwatch.',
            phase: 'Phase 4 - Transition / Stabilize',
            status: 'PLANNED',
            targetDTG: '151200Z NOV 26',
            criticalVulnerabilityTargeted: 'Civilian reliance on foreign forces',
            leadUnit: 'Civil Police Advisory Team',
            successCriteria: 'Provincial police executing 95% of routine security patrols independently.',
          },
        ],
      },
      {
        id: 'loe-2',
        number: 2,
        name: 'Information Advantage & Cognitive Defense',
        category: 'INFO_ADVANTAGE',
        leadAgent: 'Information Operations Task Force (IOTF) / MISO',
        objective: 'Expose adversary falsehoods, build public trust in Coalition actions, and amplify local voices.',
        color: '#9D5BD2',
        decisivePoints: [
          {
            id: 'dp-201',
            name: 'DP 2.1: Disinformation Deconstruction Cell Active',
            description: 'Establish 24/7 OSINT and social monitoring cell to refute proxy propaganda within 90 minutes.',
            phase: 'Phase 0 - Shape',
            status: 'COMPLETED',
            targetDTG: '101200Z SEP 26',
            criticalVulnerabilityTargeted: 'Adversary reliance on uncontested digital lies',
            leadUnit: 'IOTF / 361st CA Bde',
            successCriteria: 'De-bunking narratives syndicated across 12 prominent radio and digital outlets.',
          },
          {
            id: 'dp-202',
            name: 'DP 2.2: Essential Service Fact-Delivery Network',
            description: 'Partner with local journalists and tribal elders to publicize legitimate infrastructure repairs.',
            phase: 'Phase 1 - Crisis Response',
            status: 'IN_PROGRESS',
            targetDTG: '281400Z SEP 26',
            criticalVulnerabilityTargeted: 'Adversary exploitation of public cynicism',
            leadUnit: 'CAT 712 / PAO',
            successCriteria: 'Public awareness of Coalition water projects rises from 28% to 65%.',
          },
          {
            id: 'dp-203',
            name: 'DP 2.3: Cognitive Resilience Certification',
            description: 'Train local civic and educational institutions on digital media verification.',
            phase: 'Phase 4 - Transition / Stabilize',
            status: 'PLANNED',
            targetDTG: '011200Z DEC 26',
            criticalVulnerabilityTargeted: 'Long-term civilian vulnerability to foreign cognitive manipulation',
            leadUnit: 'Civil Affairs Engagement Team',
            successCriteria: 'Over 500 municipal staff and educators certified in source verification.',
          },
        ],
      },
      {
        id: 'loe-3',
        number: 3,
        name: 'Critical Infrastructure & Essential Services',
        category: 'INFRASTRUCTURE',
        leadAgent: 'Civil Affairs Planning Team / USACE',
        objective: 'Restore water, electric grid, and clinic operations to strip adversary of illicit service leverage.',
        color: '#2563EB',
        decisivePoints: [
          {
            id: 'dp-301',
            name: 'DP 3.1: Central Water Station #2 Restoration',
            description: 'Deliver commercial backup generators and filtration membranes to provide 500k gal/day.',
            phase: 'Phase 1 - Crisis Response',
            status: 'IN_PROGRESS',
            targetDTG: '241600Z SEP 26',
            criticalVulnerabilityTargeted: 'Adversary control of black-market water distribution',
            leadUnit: 'CAT 712 / USACE',
            successCriteria: 'Continuous potable water flow verified to 45,000 residents.',
          },
          {
            id: 'dp-302',
            name: 'DP 3.2: Grid Intertie Resilience Hardening',
            description: 'Repair transmission substations and install remote SCADA cybersecurity telemetry.',
            phase: 'Phase 2 - Seize Initiative',
            status: 'PLANNED',
            targetDTG: '101800Z OCT 26',
            criticalVulnerabilityTargeted: 'Fragile centralized power lines vulnerable to sabotage',
            leadUnit: 'USACE / Host Ministry of Electricity',
            successCriteria: 'Substation operating without brownouts during peak temperature cycles.',
          },
        ],
      },
      {
        id: 'loe-4',
        number: 4,
        name: 'Governance Legitimacy & CMOC Synchronization',
        category: 'GOVERNANCE',
        leadAgent: 'Civil-Military Operations Center (CMOC)',
        objective: 'Empower indigenous administrators, enforce transparent aid distribution, and ensure legal compliance.',
        color: '#059669',
        decisivePoints: [
          {
            id: 'dp-401',
            name: 'DP 4.1: Multi-Agency CMOC Full Operational Capability',
            description: 'Stand up physical and virtual CMOC facility with UN OCHA, USAID, and local magistrate presence.',
            phase: 'Phase 1 - Crisis Response',
            status: 'IN_PROGRESS',
            targetDTG: '261200Z SEP 26',
            criticalVulnerabilityTargeted: 'Fragmented humanitarian and operational coordination',
            leadUnit: 'CMOC Director / S9',
            successCriteria: 'Weekly coordinated civil-military aid convoy clearances executed without delay.',
          },
          {
            id: 'dp-402',
            name: 'DP 4.2: Provincial Judicial Restoration Assembly',
            description: 'Facilitate tribal elder and formal court synchronization on property and water disputes.',
            phase: 'Phase 4 - Transition / Stabilize',
            status: 'PLANNED',
            targetDTG: '201400Z NOV 26',
            criticalVulnerabilityTargeted: 'Adversary informal courts arbitrating civil grievances',
            leadUnit: 'Judge Advocate General / CA Governance Officer',
            successCriteria: 'Over 80% of local land/water disputes resolved through recognized civil channels.',
          },
        ],
      },
    ],
    defeatMechanism: {
      primary: 'DISINTEGRATE',
      rationale:
        'By disrupting covert communication nodes and cutting extortion pipelines while simultaneously providing municipal public works, we shatter the proxy network coherence and separate armed cadres from civil acquiescence.',
    },
    stabilityMechanism: {
      primary: 'INFLUENCE',
      rationale:
        'Altering population perceptions through tangible delivery of potable water and truth-based counter-propaganda induces the local populace to reject threat intimidation and actively partner with civil authorities.',
    },
    operationalReach: {
      baseOfOperations: 'Al Udeid AB, Qatar & Forward Operating Site Griffin',
      forwardLogisticsBasing: 'Combat Outpost Falcon & Logistics Support Area Saber',
      enduranceWindow: '60 days sustained high-tempo civil reconnaissance without strategic airlift resupply',
      culminationFactors: 'Severe summer heat stress, depletion of commercial water filtration parts, fuel supply security along Highway 45',
      pauseRefitTriggers: 'Fuel reserve dropping below 7 days, water delivery interrupted for >48 hours, or kinetic threat density exceeding company-level defense capacity',
    },
    risks: [
      {
        id: 'risk-1',
        title: 'Adversary Kinetic Drone Strike on Water Station #2',
        category: 'TACTICAL',
        probability: 'MEDIUM',
        severity: 'CRITICAL',
        mitigationMeasure: 'Position C-UAS mobile defense system and deploy reinforced concrete revetments around pump generators.',
        contingencyBranch: 'Branch Plan Alpha: Activate secondary municipal gravity reservoir and deploy mobile tactical water purification units (TWPS).',
      },
      {
        id: 'risk-2',
        title: 'Cognitive Disinformation Campaign Triggering Civil Rioting',
        category: 'CIVIL_INFORMATION',
        probability: 'HIGH',
        severity: 'SERIOUS',
        mitigationMeasure: 'Pre-bunk contamination rumors with independent laboratory water testing certificates posted to public social channels.',
        contingencyBranch: 'Sequel Plan Beta: Convene emergency tribal shura at CMOC with live public water tasting demonstration.',
      },
      {
        id: 'risk-3',
        title: 'Inter-Agency Coordination Friction between Coalition Forces & International NGOs',
        category: 'POLITICAL',
        probability: 'MEDIUM',
        severity: 'MODERATE',
        mitigationMeasure: 'Maintain strict deconfliction protocols through neutral civilian CMOC liaison without requiring armed escorts.',
        contingencyBranch: 'Branch Plan Gamma: Facilitate UN OCHA humanitarian corridor notifications through encrypted web portal.',
      },
    ],
    assumptions: [
      {
        id: 'asmp-1',
        statement: 'Host nation municipal leadership will continue cooperating with Coalition Civil Affairs teams despite threat intimidation.',
        impactIfInvalid: 'Civil Affairs projects will face bureaucratic paralysis; projects will require direct Coalition military administration.',
        validationMethod: 'Weekly face-to-face engagements with mayor and municipal directorate heads.',
        status: 'VALIDATED',
      },
      {
        id: 'asmp-2',
        statement: 'Regional proxy forces lack the inventory to maintain high-tempo drone swarms for more than 10 consecutive days.',
        impactIfInvalid: 'Force protection posture will overwhelm Civil Affairs mobility, restricting field team operations to base perimeters.',
        validationMethod: 'Theater J2 intelligence estimates on contraband supply replenishment rate.',
        status: 'VALIDATED',
      },
    ],
  },
  'aor-eucom': {
    aorId: 'aor-eucom',
    aorAcronym: 'USEUCOM',
    campaignTitle: 'Operation Baltic Bastion — Suwalki Gap Deterrence & Civil Defense',
    doctrinalBasis: 'ADP 5-0 / JP 5-0 / NATO Comprehensive Defense Framework',
    problemStatement:
      'How does USEUCOM synchronize forward NATO multinational brigades with host nation total defense infrastructure to deter adversary cross-border coercion and neutralize sub-threshold cognitive sabotage?',
    operationalEnvironmentSummary:
      'Flat agricultural terrain with dense forests, critical highway choke points between Kaliningrad and Belarus, highly digitalized civilian populations vulnerable to GPS spoofing and deepfake cyber disruptions.',
    approach: 'DIRECT',
    approachRationale:
      'Direct approach provides unequivocal forward military presence combined with total civilian resistance hardening to deny adversary any quick fait-accompli ambitions.',
    militaryEndState:
      'Territorial integrity of NATO eastern flank safeguarded; adversary hybrid sabotage cells apprehended; multi-domain communication and logistics corridors fully open.',
    civilPoliticalEndState:
      'Allied civilian governance functioning with resilient digital infrastructure; public confidence in NATO collective defense exceeding 85%; civil defense mobilization mechanisms tested and operational.',
    requiredConditions: [
      {
        id: 'cond-eu-1',
        statement: 'Suwalki highway and railway corridors maintain 100% uninterrupted transport capacity.',
        loeId: 'loe-eu-1',
        status: 'MET',
        assessmentNotes: 'Joint military-police border patrols and drone surveillance operational.',
        evaluationDTG: '211100Z SEP 26',
      },
      {
        id: 'cond-eu-2',
        statement: 'Host nation cellular and fiber communication backbones hardened against cyber jamming.',
        loeId: 'loe-eu-2',
        status: 'PARTIAL',
        assessmentNotes: 'Satellite backup nodes deployed in 14 of 18 regional municipal centers.',
        evaluationDTG: '211500Z SEP 26',
      },
    ],
    cogs: [
      {
        id: 'cog-adv-eucom',
        actor: 'ADVERSARY',
        centerOfGravity: 'A2/AD Missile Enclaves & Integrated Hybrid Sabotage Units',
        criticalCapabilities: ['Long-range precision fires', 'Disinformation broadcasting', 'Critical undersea cable & energy pipeline sabotage'],
        criticalRequirements: ['Freedom of sub-threshold gray zone maneuver', 'Exploitation of minority grievances', 'Unchecked electronic warfare stations'],
        criticalVulnerabilities: ['Vulnerability of fixed radar and missile launchers to multi-domain counterfire', 'Dependence on unverified propaganda that collapses under forensic attribution'],
      },
      {
        id: 'cog-friendly-eucom',
        actor: 'FRIENDLY',
        centerOfGravity: 'Allied Political Cohesion & Host Nation Total Defense Integration',
        criticalCapabilities: ['Rapid multinational reinforcement', 'Hardened civilian society & cyber defense', 'Integrated air and missile defense umbrella'],
        criticalRequirements: ['Consensus among 32 member states', 'Interoperable C4ISR and civil-military data exchange', 'Host nation civilian willingness to resist coercion'],
        criticalVulnerabilities: ['Transit chokepoints along Suwalki corridor', 'Cyber vulnerabilities in municipal water and power SCADA networks'],
      },
    ],
    linesOfEffort: [
      {
        id: 'loe-eu-1',
        number: 1,
        name: 'Territorial Defense & Chokepoint Security',
        category: 'CIVIL_SECURITY',
        leadAgent: 'NATO Multinational Corps Northeast',
        objective: 'Deter military incursions and secure strategic mobility corridors.',
        color: '#E34B4B',
        decisivePoints: [
          {
            id: 'dp-eu-101',
            name: 'DP 1.1: Suwalki Corridor Defense Fortification',
            description: 'Integrate pre-planned defensive barriers and anti-tank obstacle belts with civilian transit routes.',
            phase: 'Phase 0 - Shape',
            status: 'COMPLETED',
            targetDTG: '010800Z SEP 26',
            criticalVulnerabilityTargeted: 'Vulnerability of open transit routes to armored spearhead',
            leadUnit: 'Task Force Iron / Polish 16th Mech Div',
            successCriteria: 'Barrier belts certified and interoperable with civilian traffic regulations.',
          },
        ],
      },
      {
        id: 'loe-eu-2',
        number: 2,
        name: 'Cyber & Cognitive Sovereignty',
        category: 'INFO_ADVANTAGE',
        leadAgent: 'NATO StratCom COE & Host Ministry of Defense',
        objective: 'Neutralize adversary cyber intrusions and cognitive influence operations.',
        color: '#9D5BD2',
        decisivePoints: [
          {
            id: 'dp-eu-201',
            name: 'DP 2.1: Unified Cognitive Defense Portal Active',
            description: 'Establish automated multi-lingual fact-checking and cyber telemetry dashboard.',
            phase: 'Phase 1 - Crisis Response',
            status: 'IN_PROGRESS',
            targetDTG: '271200Z SEP 26',
            criticalVulnerabilityTargeted: 'Adversary manipulation of local language social platforms',
            leadUnit: 'Cyber Command / CA Information Team',
            successCriteria: 'Malicious cyber incursions mitigated within 15 minutes of detection.',
          },
        ],
      },
    ],
    defeatMechanism: {
      primary: 'DISLOCATE',
      rationale:
        'By preparing defensive positions and hardening civilian infrastructure before any hostile action, we make adversary military plans irrelevant and force them into disadvantageous diplomatic postures.',
    },
    stabilityMechanism: {
      primary: 'SUPPORT',
      rationale:
        'Providing robust military support to host nation civil defense authorities strengthens societal resilience and prevents civil panic.',
    },
    operationalReach: {
      baseOfOperations: 'Ramstein AB & Powidz Forward Operating Site',
      forwardLogisticsBasing: 'Suwalki Railhead & Elk Logistics Hub',
      enduranceWindow: '90 days forward operations with NATO pre-positioned stocks',
      culminationFactors: 'Ammunition expenditure rate under prolonged high-intensity combat, railway bridge sabotage',
      pauseRefitTriggers: 'Air defense interceptor inventory falling below 25% or rail corridor disruption >72 hours',
    },
    risks: [
      {
        id: 'risk-eu-1',
        title: 'Cyber Blackout of Municipal Power Grid During Winter',
        category: 'CIVIL_INFORMATION',
        probability: 'HIGH',
        severity: 'CRITICAL',
        mitigationMeasure: 'Pre-position diesel generators and establish isolated islanded microgrids at hospitals and emergency centers.',
        contingencyBranch: 'Deploy NATO rapid engineering repair detachments with emergency mobile transformers.',
      },
    ],
    assumptions: [
      {
        id: 'asmp-eu-1',
        statement: 'Host nation population will maintain high morale and active participation in civilian volunteer defense units.',
        impactIfInvalid: 'Civil defense burden shifts completely to military forces, degrading combat readiness.',
        validationMethod: 'National polling and volunteer mobilization drill participation rates.',
        status: 'VALIDATED',
      },
    ],
  },
};
