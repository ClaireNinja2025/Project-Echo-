import React, { useState } from 'react';
import { SidebarNavigation } from './components/SidebarNavigation';
import { Header } from './components/Header';
import { GlobalAorWorldMap } from './components/GlobalAorWorldMap';
import { CivilCommonOperatingPicture, OperatingTheater } from './components/CivilCommonOperatingPicture';
import { AnalystNotebookCluster } from './components/AnalystNotebookCluster';
import { BaseballCardDossier } from './components/BaseballCardDossier';
import { TraitSentimentAnalysis } from './components/TraitSentimentAnalysis';
import { MoeMopAssessment } from './components/MoeMopAssessment';
import { NarrativeInterlocutorPaths } from './components/NarrativeInterlocutorPaths';
import { CoaWargamingAnalysis } from './components/CoaWargamingAnalysis';
import { PmesiiAscopeCogAnalysis } from './components/PmesiiAscopeCogAnalysis';
import { CivilKnowledgeIntegration } from './components/CivilKnowledgeIntegration';
import { CivilSystemsResilienceGraph } from './components/CivilSystemsResilienceGraph';
import { InformationAdvantageMatrix } from './components/InformationAdvantageMatrix';
import { DecisionSupportCOA } from './components/DecisionSupportCOA';
import { CMOCOperations } from './components/CMOCOperations';
import { DoctrineAssistantModal } from './components/DoctrineAssistantModal';
import { InformationOperationsWorkspace } from './components/InformationOperationsWorkspace';
import { ArmyOperationalDesign } from './components/ArmyOperationalDesign';
import {
  INITIAL_CIVIL_ENTITIES,
  INITIAL_DISRUPTION_NODES,
  INITIAL_FIELD_OBSERVATIONS,
  INITIAL_INFORMATION_ACTIVITIES,
  INITIAL_NARRATIVES,
  COURSES_OF_ACTION,
  INITIAL_CMOC_PROJECTS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import {
  CivilEntity,
  DisruptionNode,
  FieldObservation,
  UserRole,
  OperationalPhase,
  AuditLogEntry,
} from './types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('CA Team Leader (CAT 712)');
  const [currentPhase, setCurrentPhase] = useState<OperationalPhase>('Phase 1 - Crisis Response');
  const [activeTab, setActiveTab] = useState<string>('cop');
  const [selectedCopTheater, setSelectedCopTheater] = useState<OperatingTheater>('SECTOR_NORTH_BORDER');
  const [selectedCardId, setSelectedCardId] = useState<string>('card-soto');
  const [isDoctrineOpen, setIsDoctrineOpen] = useState<boolean>(false);

  // Core State
  const [entities, setEntities] = useState<CivilEntity[]>(INITIAL_CIVIL_ENTITIES);
  const [selectedEntity, setSelectedEntity] = useState<CivilEntity | null>(INITIAL_CIVIL_ENTITIES[0]);
  const [disruptionNodes, setDisruptionNodes] = useState<DisruptionNode[]>(INITIAL_DISRUPTION_NODES);
  const [observations, setObservations] = useState<FieldObservation[]>(INITIAL_FIELD_OBSERVATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Helper to append audit logs
  const logAction = (action: string, moduleName: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: '211715Z SEP 26',
      userRole: currentRole,
      action,
      module: moduleName,
      oversightCompliance: 'COMPLIANT',
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Update Entity Status
  const handleUpdateEntityStatus = (id: string, status: CivilEntity['status']) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status, freshnessDTG: '211710Z SEP 26' } : e))
    );
    if (selectedEntity?.id === id) {
      setSelectedEntity((prev) => (prev ? { ...prev, status } : null));
    }
    logAction('STATUS_UPDATE', 'Civil COP', `Updated status of entity ${id} to ${status}.`);
  };

  // Toggle Disruption Node Status
  const handleToggleNodeStatus = (nodeId: string) => {
    setDisruptionNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const nextStatus = n.status === 'Operational' ? 'Degraded' : 'Operational';
          const nextCap = nextStatus === 'Operational' ? 95 : 30;
          return { ...n, status: nextStatus, capacityPct: nextCap };
        }
        return n;
      })
    );
    logAction('SIMULATION_CASCADE', 'Resilience Model', `Toggled operational state of node ${nodeId}.`);
  };

  // Add Observation
  const handleAddObservation = (obs: FieldObservation) => {
    setObservations((prev) => [obs, ...prev]);
    logAction('OBSERVATION_INGEST', 'CKI Workspace', `Ingested observation: ${obs.title}`);
  };

  // Commit Extracted Entity into live Civil Picture
  const handleCommitExtractedEntity = (partialEntity: Partial<CivilEntity>) => {
    const newEnt: CivilEntity = {
      id: `ent-${Date.now()}`,
      name: partialEntity.name || 'Extracted Civil Facility',
      ascope: partialEntity.ascope || 'Structures',
      pmesii: partialEntity.pmesii || 'Infrastructure',
      infraType: 'Healthcare',
      coordinates: {
        x: Math.floor(Math.random() * 60) + 20,
        y: Math.floor(Math.random() * 50) + 25,
        lat: 34.51,
        lng: 43.15,
      },
      status: partialEntity.status || 'Operational',
      admiraltyCode: 'A2',
      confidence: partialEntity.confidence || 0.88,
      freshnessDTG: '211715Z SEP 26',
      classification: 'UNCLASSIFIED',
      sector: 'Sector Central',
      description: partialEntity.description || 'Discovered during CKI reconnaissance.',
      dependencies: ['ent-1'],
      servesPopulation: 35000,
    };

    setEntities((prev) => [...prev, newEnt]);
    setSelectedEntity(newEnt);
    logAction(
      'ENTITY_COMMIT',
      'CKI Workspace',
      `AI-extracted entity committed to Civil Common Operating Picture: ${newEnt.name}`
    );
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-row overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation: All Tabs and Icons on One Side */}
      <SidebarNavigation
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentPhase={currentPhase}
        onPhaseChange={setCurrentPhase}
        onOpenDoctrine={() => setIsDoctrineOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Operational Status & Security Classification Banner */}
        <Header
          currentRole={currentRole}
          currentPhase={currentPhase}
          onOpenGlobalMap={() => setActiveTab('global-aor')}
          onOpenTacticalCop={() => setActiveTab('cop')}
          onOpenIoWorkspace={() => setActiveTab('io-workspace')}
          onOpenOpDesign={() => setActiveTab('operational-design')}
        />

        {/* Main Content Body */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'operational-design' && (
          <ArmyOperationalDesign
            currentPhase={currentPhase}
            onPhaseChange={setCurrentPhase}
            onNavigateToCop={() => setActiveTab('cop')}
            onNavigateToCoa={() => setActiveTab('coa-wargame')}
            onNavigateToMoeMop={() => setActiveTab('moe-mop')}
          />
        )}

        {activeTab === 'io-workspace' && (
          <InformationOperationsWorkspace
            onNavigateToAorMap={(_aorId) => {
              setActiveTab('global-aor');
            }}
            onNavigateToOpDesign={() => {
              setActiveTab('operational-design');
            }}
          />
        )}

        {activeTab === 'global-aor' && (
          <GlobalAorWorldMap
            onNavigateToTacticalCop={(_aoName, aorId) => {
              if (aorId === 'aor-northcom') setSelectedCopTheater('SECTOR_NORTH_BORDER');
              else if (aorId === 'aor-centcom') setSelectedCopTheater('AO_GRIFFIN_CENTCOM');
              else if (aorId === 'aor-southcom') setSelectedCopTheater('DARIEN_GAP_SOUTHCOM');
              else if (aorId === 'aor-eucom') setSelectedCopTheater('SUWALKI_EUCOM');
              else if (aorId === 'aor-indopacom') setSelectedCopTheater('LUZON_INDOPACOM');
              else if (aorId === 'aor-africom') setSelectedCopTheater('SAHEL_AFRICOM');
              setActiveTab('cop');
            }}
            onNavigateToIoWorkspace={(_aorAcronym) => {
              setActiveTab('io-workspace');
            }}
          />
        )}

        {activeTab === 'cop' && (
          <CivilCommonOperatingPicture
            entities={entities}
            selectedEntity={selectedEntity}
            onSelectEntity={setSelectedEntity}
            onUpdateEntityStatus={handleUpdateEntityStatus}
            onOpenGlobalMap={() => setActiveTab('global-aor')}
            initialTheater={selectedCopTheater}
          />
        )}

        {activeTab === 'analyst-cluster' && (
          <AnalystNotebookCluster
            onSelectBaseballCard={(cardId) => {
              setSelectedCardId(cardId);
              setActiveTab('baseball-cards');
            }}
          />
        )}

        {activeTab === 'baseball-cards' && (
          <BaseballCardDossier
            initialSelectedCardId={selectedCardId}
            onOpenNetworkCluster={() => setActiveTab('analyst-cluster')}
          />
        )}

        {activeTab === 'trait-sentiment' && (
          <TraitSentimentAnalysis />
        )}

        {activeTab === 'moe-mop' && (
          <MoeMopAssessment
            onNavigateToOpDesign={() => setActiveTab('operational-design')}
          />
        )}

        {activeTab === 'narrative-paths' && (
          <NarrativeInterlocutorPaths />
        )}

        {activeTab === 'coa-wargame' && (
          <CoaWargamingAnalysis
            onNavigateToOpDesign={() => setActiveTab('operational-design')}
          />
        )}

        {activeTab === 'crosswalk-cog' && (
          <PmesiiAscopeCogAnalysis
            entities={entities}
            onSelectEntityOnCop={(ent) => {
              setSelectedEntity(ent);
              setActiveTab('cop');
            }}
            onNavigateToOpDesign={() => setActiveTab('operational-design')}
          />
        )}

        {activeTab === 'cki' && (
          <CivilKnowledgeIntegration
            observations={observations}
            onAddObservation={handleAddObservation}
            onCommitExtractedEntity={handleCommitExtractedEntity}
          />
        )}

        {activeTab === 'resilience' && (
          <CivilSystemsResilienceGraph
            nodes={disruptionNodes}
            onToggleNodeStatus={handleToggleNodeStatus}
          />
        )}

        {activeTab === 'info-adv' && (
          <InformationAdvantageMatrix
            activities={INITIAL_INFORMATION_ACTIVITIES}
            narratives={INITIAL_NARRATIVES}
          />
        )}

        {activeTab === 'decision' && (
          <DecisionSupportCOA coursesOfAction={COURSES_OF_ACTION} />
        )}

        {activeTab === 'cmoc' && (
          <CMOCOperations
            projects={INITIAL_CMOC_PROJECTS}
            auditLogs={auditLogs}
            currentRole={currentRole}
          />
        )}
      </main>
      </div>

      {/* Grounded AI Doctrine & Reference Assistant Modal */}
      <DoctrineAssistantModal
        isOpen={isDoctrineOpen}
        onClose={() => setIsDoctrineOpen(false)}
      />
    </div>
  );
}
