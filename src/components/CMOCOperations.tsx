import React, { useState } from 'react';
import { 
  Users, 
  CheckSquare, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  Clock, 
  ExternalLink, 
  Building, 
  HeartHandshake, 
  FileCheck2,
  FolderKanban,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CMOCProject, AuditLogEntry, UserRole } from '../types';

interface CMOCOperationsProps {
  projects: CMOCProject[];
  auditLogs: AuditLogEntry[];
  currentRole: UserRole;
}

export const CMOCOperations: React.FC<CMOCOperationsProps> = ({
  projects,
  auditLogs,
  currentRole,
}) => {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(5);

  const cmocWorkflowSteps = [
    { step: 1, name: 'Task & Frame', desc: 'Translate commander objectives and CCIRs into civil collection priorities.' },
    { step: 2, name: 'Collect', desc: 'CAT patrol observations, KLE debriefs, partner reports, sensor grid.' },
    { step: 3, name: 'Validate & Tag', desc: 'Verify source pedigree, Admiralty code (A1-F6), classification, data freshness.' },
    { step: 4, name: 'Fuse & Analyze', desc: 'Ontology mapping, civil systems dependencies, resilience graph modeling.' },
    { step: 5, name: 'Integrate', desc: 'Feed civil considerations into MDMP running estimates, protection, sustainment.' },
    { step: 6, name: 'Coordinate', desc: 'Synchronize with PA, PSYOP/MISO, cyber, EW, interagency, and humanitarian NGOs.' },
    { step: 7, name: 'Assess', desc: 'Evaluate civil changes against MOPs/MOEs, assumptions, and counter-factuals.' },
    { step: 8, name: 'Learn', desc: 'Capture civil observations, update baseline resilience, preserve auditable logs.' },
  ];

  const partners = [
    { name: 'UN OCHA (Humanitarian Affairs)', role: 'Civilian Protection & Camp Coordination', status: 'Active Synchronization', contact: 'Field Coordinator Elena Rostova' },
    { name: 'USAID / Bureau for Humanitarian Assistance (BHA)', role: 'Emergency Food, Water & Shelter Grants', status: 'Joint Planning', contact: 'Senior Humanitarian Advisor' },
    { name: 'Red Crescent Society', role: 'First Response & Primary Clinic Supplies', status: 'Operational', contact: 'Director of Relief Logistics' },
    { name: 'Host Nation Ministry of Municipalities', role: 'Water, Sewer & Power Utility Restoration', status: 'Bi-daily KLE Liaison', contact: 'Deputy Director Bassam Tariq' },
    { name: 'District 4 Municipal Police Command', role: 'Civilian Route Security & Checkpoint Protocol', status: 'Coordinating', contact: 'Col. Farhan (District Chief)' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6">
      {/* CMOC Command Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Civil-Military Operations Center (CMOC) & Governance Console
            </h2>
            <p className="text-xs text-slate-400">
              Unified action coordination with civilian authorities, international organizations, and governance oversight.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>OVERSIGHT AUDIT: ACTIVE</span>
          </span>
        </div>
      </div>

      {/* 8-Step CMOC Operational Workflow Tracker (Section 13) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>Notional CMOC 8-Step Civil Operations Workflow</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Current Focus: Step {activeWorkflowStep}</span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {cmocWorkflowSteps.map((s) => {
            const isActive = activeWorkflowStep === s.step;
            const isCompleted = s.step < activeWorkflowStep;
            return (
              <button
                key={s.step}
                onClick={() => setActiveWorkflowStep(s.step)}
                className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500/60 shadow-md'
                    : isCompleted
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-400">0{s.step}</span>
                  {isCompleted && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                </div>
                <h4 className={`text-xs font-bold leading-tight ${isActive ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {s.name}
                </h4>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <span className="font-mono text-emerald-400 font-bold shrink-0">STEP {activeWorkflowStep} GUIDANCE:</span>
          <span>{cmocWorkflowSteps[activeWorkflowStep - 1].desc}</span>
        </div>
      </div>

      {/* Unified Action Partner Synchronization Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-cyan-400" />
          <span>Unified Action Partner Synchronization Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {partners.map((p, idx) => (
            <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-xs">{p.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {p.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{p.role}</p>
              <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-500">
                Liaison: <span className="text-slate-300">{p.contact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Civil Affairs Projects & Assessment (MOP/MOE) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-emerald-400" />
            <span>Civil Affairs Project & Assessment Tracker (MOP / MOE)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">3 Active Civil Projects</span>
        </div>

        <div className="space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400">{proj.sector}</span>
                  <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                    {proj.budgetCivilFunded}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                    {proj.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                  <span className="font-mono text-emerald-400 block text-[10px] font-bold mb-0.5">
                    MEASURE OF PERFORMANCE (MOP):
                  </span>
                  <span className="text-slate-300">{proj.mopStatus}</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                  <span className="font-mono text-cyan-400 block text-[10px] font-bold mb-0.5">
                    MEASURE OF EFFECTIVENESS (MOE):
                  </span>
                  <span className="text-slate-300">{proj.moeMetric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 6: Legal, Ethical, Intelligence Oversight & Audit Console (Section 11) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Immutable Governance & Intelligence Oversight Ledger
              </h3>
              <p className="text-xs text-slate-400">
                Auditing user actions, AI queries, and US Person data minimization under DoD Directive 5240.01.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
            Active Operator Role: <strong className="text-emerald-400">{currentRole}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono divide-y divide-slate-800">
            <thead>
              <tr className="text-slate-400 text-[10px]">
                <th className="py-2 px-3">DTG</th>
                <th className="py-2 px-3">OPERATOR ROLE</th>
                <th className="py-2 px-3">ACTION</th>
                <th className="py-2 px-3">MODULE</th>
                <th className="py-2 px-3">OVERSIGHT STATUS</th>
                <th className="py-2 px-3">AUDIT DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-[11px] text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200 whitespace-nowrap">{log.userRole}</td>
                  <td className="py-2.5 px-3 text-cyan-400 whitespace-nowrap">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.module}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                      {log.oversightCompliance}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-md font-sans text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
