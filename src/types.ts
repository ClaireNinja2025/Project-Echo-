/**
 * CIO-KE: Civil Information Overlay & Knowledge Environment
 * Domain TypeScript Types & Data Schemas
 */

export type ASCOPECategory = 'Areas' | 'Structures' | 'Capabilities' | 'Organizations' | 'People' | 'Events';
export type PMESIICategory = 'Political' | 'Military' | 'Economic' | 'Social' | 'Information' | 'Infrastructure';

export type InfrastructureType = 
  | 'Power' 
  | 'Water' 
  | 'Healthcare' 
  | 'Communications' 
  | 'Transportation' 
  | 'Food/Agriculture' 
  | 'Emergency Services' 
  | 'Governance';

export type OperationalStatus = 'Operational' | 'Degraded' | 'Critical' | 'Destroyed' | 'Restored';
export type ClassificationLevel = 'UNCLASSIFIED' | 'CUI' | 'REL TO USA/PARTNER';

export type UserRole = 
  | 'CA Team Leader (CAT 712)' 
  | 'CMOC Operations Director' 
  | 'J-39 Information Advantage Planner' 
  | 'Staff Judge Advocate (Legal/Oversight)' 
  | 'Public Affairs Officer (PAO)';

export type OperationalPhase = 
  | 'Phase 0 - Competition / Shaping' 
  | 'Phase 1 - Crisis Response' 
  | 'Phase 2 - Large-Scale Combat' 
  | 'Phase 3 - Stabilization & Consolidation' 
  | 'Phase 4 - Humanitarian Assistance';

export interface CivilEntity {
  id: string;
  name: string;
  ascope: ASCOPECategory;
  pmesii: PMESIICategory;
  infraType?: InfrastructureType;
  coordinates: { x: number; y: number; lat: number; lng: number };
  status: OperationalStatus;
  admiraltyCode: string; // e.g. 'A2', 'B1' (Source reliability A-F, Information credibility 1-6)
  confidence: number; // 0.0 - 1.0
  freshnessDTG: string;
  classification: ClassificationLevel;
  sector: string;
  description: string;
  dependencies: string[]; // ids of other entities this depends on
  servesPopulation: number;
  contactOrInterlocutor?: string;
}

export interface DisruptionNode {
  id: string;
  label: string;
  type: InfrastructureType;
  x: number;
  y: number;
  status: OperationalStatus;
  capacityPct: number;
  dependsOn: string[];
  downstreamCount: number;
  populationServed: number;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface FieldObservation {
  id: string;
  title: string;
  author: string;
  sourceType: 'CAT Patrol' | 'KLE Debrief' | 'Partner NGO' | 'OSINT' | 'Sensor/Telemetry';
  dtg: string;
  location: string;
  text: string;
  validated: boolean;
  reliability: string;
  tags: string[];
}

export interface InformationActivityItem {
  id: string;
  activity: 'Enable' | 'Protect' | 'Inform' | 'Influence' | 'Attack';
  title: string;
  summary: string;
  civilConnection: string;
  approvalStatus: 'Approved' | 'Staff Review' | 'Pre-Coordination';
  authority: string;
  lastUpdated: string;
}

export interface NarrativeIndicator {
  id: string;
  theme: string;
  velocity: 'Rising' | 'Stable' | 'Declining';
  sentiment: 'Positive' | 'Neutral' | 'Hostile' | 'Anxious';
  audienceSegment: string; // Aggregate only
  trustScore: number; // 0 - 100
  rumorFlag: boolean;
  recommendedCounteraction: string;
}

export interface CourseOfAction {
  id: string;
  name: string;
  description: string;
  serviceDisruptionScore: number; // 0-100 (lower is better)
  displacementRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  estimatedAffectedCivilians: number;
  publicHealthHazard: number; // 0-100
  governanceStabilityImpact: '+14%' | '+5%' | '-12%' | '-28%';
  transitionFeasibility: 'High' | 'Medium' | 'Low';
  keyMitigations: string[];
  secondThirdOrderEffects: string[];
}

export interface CMOCProject {
  id: string;
  title: string;
  sector: string;
  leadAgency: string;
  status: 'Planning' | 'Underway' | 'Completed' | 'Suspended';
  budgetCivilFunded: string;
  populationImpacted: number;
  mopStatus: string; // Measure of Performance
  moeMetric: string; // Measure of Effectiveness
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: string;
  action: string;
  module: string;
  oversightCompliance: 'COMPLIANT' | 'FLAGGED_MINIMIZATION' | 'PENDING_APPROVAL';
  details: string;
}

// PMESII-PT x ASCOPE Crosswalk & Center of Gravity (COG) Analysis
export interface CrosswalkCell {
  id: string;
  pmesii: PMESIICategory;
  ascope: ASCOPECategory;
  title: string;
  summary: string;
  civilConsiderations: string[];
  entityIds: string[];
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  keyVulnerabilities: string[];
  collectionPriority: 'CCIR' | 'PIR' | 'SIR' | 'ROUTINE';
}

export interface CriticalVulnerability {
  id: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  linkedAscopeEntityId?: string;
  ascopePmesiiTag: string;
  mitigationOrAction: string;
}

export interface CriticalRequirement {
  id: string;
  description: string;
  vulnerabilities: CriticalVulnerability[];
}

export interface CriticalCapability {
  id: string;
  description: string;
  requirements: CriticalRequirement[];
}

export interface DecisivePoint {
  id: string;
  name: string;
  lineOfEffort: string;
  targetedVulnerabilityId: string;
  caRole: string;
}

export interface CenterOfGravitySystem {
  id: string;
  name: string;
  systemType: 'Friendly Civil Stability' | 'Host Nation Governance' | 'Destabilizing Threat Actor';
  centerOfGravity: string;
  strategicObjective: string;
  criticalCapabilities: CriticalCapability[];
  decisivePoints: DecisivePoint[];
  doctrinalNotes: string;
}

