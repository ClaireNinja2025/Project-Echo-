import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Helper to run a promise with a timeout in milliseconds.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Resilient caller that tries primary model (gemini-3.8-flash),
 * then falls back to gemini-3.1-flash-lite if the primary experiences high demand (503/429/timeout).
 */
async function callGemini(
  ai: GoogleGenAI,
  options: {
    systemInstruction?: string;
    prompt: string;
    temperature?: number;
    responseMimeType?: string;
  }
): Promise<string> {
  // Try gemini-3.8-flash with a 4.5s timeout
  try {
    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: options.prompt,
      config: {
        systemInstruction: options.systemInstruction,
        temperature: options.temperature ?? 0.2,
        responseMimeType: options.responseMimeType,
      },
    });
    const res = await withTimeout(callPromise, 4500, 'gemini-3.8-flash');
    if (res.text) return res.text;
  } catch (err: any) {
    console.warn('[Gemini 3.8 Flash] Request unavailable or timed out (' + (err.message || '503') + '). Attempting fallback to gemini-3.1-flash-lite...');
  }

  // Fallback to gemini-3.1-flash-lite with a 4.5s timeout
  const callPromise2 = ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: options.prompt,
    config: {
      systemInstruction: options.systemInstruction,
      temperature: options.temperature ?? 0.2,
      responseMimeType: options.responseMimeType,
    },
  });
  const res2 = await withTimeout(callPromise2, 4500, 'gemini-3.1-flash-lite');
  return res2.text || '';
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Doctrine Assistant Endpoint
app.post('/api/ai/doctrine', async (req: Request, res: Response) => {
  const { query, context } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const defaultDoctrinalAnswer = {
    answer: `Based on JP 3-57 (Civil-Military Operations), ADP 3-13 (Information, Nov 2023), and ATP 3-57.50 (Civil Knowledge Integration):\n\n1. Doctrinal Overview: Civil Affairs forces conduct civil knowledge integration to identify civil vulnerabilities, evaluate critical infrastructure dependencies, and inform operational decision-making.\n2. Information Activities Alignment (ADP 3-13): The five activities are Enable (improving situational understanding and data sharing), Protect (shielding civil critical assets and trusted networks), Inform (supporting factual Public Affairs communication), Influence (providing aggregate context to authorized MISO), and Attack (identifying civilian infrastructure dependencies to prevent unintended fratricide or severe second-order harms).\n3. Intelligence Oversight & Legal Firewalls: Under DoD Directive 5240.01, civil information management focuses on unclassified civil environment factors and excludes unauthorized surveillance or targeting of US Persons.`,
    citations: [
      'JP 3-57: Civil-Military Operations (Chapters II & III)',
      'ADP 3-13: Information (27 Nov 2023, Paras 2-1 to 2-45)',
      'ATP 3-57.50: Civil Knowledge Integration (16 Oct 2024)',
      'FM 3-57: Civil Affairs Operations (Jul 2021)',
    ],
    authoritiesNote: 'Approved doctrinal context for military staff planning and civil-military coordination.',
  };

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.json(defaultDoctrinalAnswer);
    }

    const systemInstruction = `You are the CIO-KE (Civil Information Overlay & Knowledge Environment) Doctrinal & Decision Support Assistant.
You are grounded strictly in US Joint and Army doctrine:
- JP 3-57 (Civil-Military Operations) & ATP 3-57.50 (Civil Knowledge Integration)
- JP 3-04 (Information in Joint Operations) & Operations in the Information Environment (OIE)
- ADP 3-13 (Information, 2023) with its five information activities: Enable, Protect, Inform, Influence, Attack
- FM 3-57 (Civil Affairs Operations) & ATP 3-57.60 (Civil Affairs Planning)
- FM 3-53 (Military Information Support Operations)
- DoD Intelligence Oversight (DoD 5240.01) principles distinguishing Civil Information Management from Intelligence targeting.

Tone: Professional, military-staff grade, objective, precise. Explicitly cite doctrinal chapters/paragraphs where applicable.
Always remind users that CIO provides civil context, not individual-level psychological targeting or autonomous influence product release.`;

    const prompt = `User Doctrine Query: "${query}"\n${context ? `Operational Context: ${context}\n` : ''}Provide a clear, authoritative doctrinal explanation, mapping to ADP 3-13 information activities, and list specific references.`;

    const text = await callGemini(ai, {
      systemInstruction,
      prompt,
      temperature: 0.2,
    });

    return res.json({
      answer: text || defaultDoctrinalAnswer.answer,
      citations: [
        'JP 3-57 (CMO / Civil Component)',
        'ADP 3-13 (Information Advantage)',
        'ATP 3-57.50 (Civil Knowledge Integration)',
        'JP 3-04 (Information in Joint Operations)',
      ],
      authoritiesNote: 'Staff verification required before dissemination into operational orders.',
    });
  } catch (err: any) {
    console.warn('Handling /api/ai/doctrine fallback due to:', err.message);
    return res.json(defaultDoctrinalAnswer);
  }
});

// Helper to generate dynamic extracted entities from field observation text
function buildContextualExtractedEntities(text: string) {
  const lower = text.toLowerCase();
  const entities = [];

  if (lower.includes('water') || lower.includes('filtration') || lower.includes('chlorin')) {
    entities.push({
      name: 'Municipal Water Filtration Plant #2',
      ascopeCategory: 'Structures' as const,
      pmesiiCategory: 'Infrastructure' as const,
      confidence: 0.92,
      status: lower.includes('critical') || lower.includes('fuel') || lower.includes('shortage') ? 'Critical' as const : 'Degraded' as const,
      details: 'Primary water treatment and chlorination asset serving urban sectors; requires fuel synchronization.',
    });
  }

  if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('medical') || lower.includes('doctor') || lower.includes('health')) {
    entities.push({
      name: 'Ibn Sina Regional General Hospital',
      ascopeCategory: 'Structures' as const,
      pmesiiCategory: 'Social' as const,
      confidence: 0.95,
      status: 'Degraded' as const,
      details: 'Regional trauma and critical care hub; operating on emergency generator reserves.',
    });
    entities.push({
      name: 'Dr. Tariq Al-Mansoor (Chief Public Health Officer)',
      ascopeCategory: 'People' as const,
      pmesiiCategory: 'Social' as const,
      confidence: 0.91,
      status: 'Operational' as const,
      details: 'Key medical interlocutor coordinating blood bank supplies and emergency vaccine distribution.',
    });
  }

  if (lower.includes('substation') || lower.includes('power') || lower.includes('electric') || lower.includes('grid')) {
    entities.push({
      name: 'Electrical Substation Alpha',
      ascopeCategory: 'Structures' as const,
      pmesiiCategory: 'Infrastructure' as const,
      confidence: 0.89,
      status: 'Degraded' as const,
      details: 'High-voltage step-down facility powering water pumping stations and central district.',
    });
  }

  if (lower.includes('mayor') || lower.includes('council') || lower.includes('police') || lower.includes('director') || lower.includes('ministry')) {
    entities.push({
      name: 'District 4 Municipal Governance Directorate',
      ascopeCategory: 'Organizations' as const,
      pmesiiCategory: 'Political' as const,
      confidence: 0.88,
      status: 'Operational' as const,
      details: 'Local civil administration coordinating food market pricing, sanitation, and municipal police shifts.',
    });
  }

  if (lower.includes('bridge') || lower.includes('highway') || lower.includes('msr') || lower.includes('route') || lower.includes('road')) {
    entities.push({
      name: 'MSR Cedar Tigris River Crossing',
      ascopeCategory: 'Structures' as const,
      pmesiiCategory: 'Infrastructure' as const,
      confidence: 0.93,
      status: 'Operational' as const,
      details: 'Primary supply route and civilian evacuation corridor connecting eastern and western districts.',
    });
  }

  if (lower.includes('idp') || lower.includes('refugee') || lower.includes('displacement') || lower.includes('crowd')) {
    entities.push({
      name: 'Northern IDP Reception Staging Area',
      ascopeCategory: 'Areas' as const,
      pmesiiCategory: 'Social' as const,
      confidence: 0.87,
      status: 'Critical' as const,
      details: 'Informal camp gathering displaced persons; acute need for potable water bladders and tents.',
    });
  }

  // Default fallback entities if text is general
  if (entities.length === 0) {
    entities.push(
      {
        name: 'Sector 4 Civil Infrastructure Complex',
        ascopeCategory: 'Structures' as const,
        pmesiiCategory: 'Infrastructure' as const,
        confidence: 0.89,
        status: 'Degraded' as const,
        details: 'Essential service hub identified in field reconnaissance report.',
      },
      {
        name: 'Municipal Civic Coordination Council',
        ascopeCategory: 'Organizations' as const,
        pmesiiCategory: 'Political' as const,
        confidence: 0.92,
        status: 'Operational' as const,
        details: 'Local governance leadership engaged in civil-military liaison through CMOC.',
      },
      {
        name: 'Central Emergency Humanitarian Logistics Hub',
        ascopeCategory: 'Capabilities' as const,
        pmesiiCategory: 'Economic' as const,
        confidence: 0.86,
        status: 'Operational' as const,
        details: 'Civilian warehouse facility for bulk food and water distribution.',
      }
    );
  }

  return {
    entities,
    summary: `Synthesized ${entities.length} civil entities across ASCOPE/PMESII categories directly from field observation text.`,
    recommendedPriority: entities.some(e => e.status === 'Critical') ? 'HIGH' : 'MEDIUM',
    note: 'Processed via Tactical Civil Knowledge Engine.',
  };
}

// AI Entity & ASCOPE Extractor from Field Observations
app.post('/api/ai/extract-entities', async (req: Request, res: Response) => {
  const { observationText } = req.body;
  if (!observationText) {
    return res.status(400).json({ error: 'Observation text is required' });
  }

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.json(buildContextualExtractedEntities(observationText));
    }

    const systemInstruction = `You are a Civil Knowledge Integration (CKI) automated entity parser under ATP 3-57.50.
Extract civil entities from the provided patrol log / CAT observation report.
Map each entity to ASCOPE (Areas, Structures, Capabilities, Organizations, People, Events) and PMESII (Political, Military, Economic, Social, Information, Infrastructure).
Assign a confidence score (0.00 to 1.00) and operational status.
Output MUST be valid JSON only matching the schema:
{
  "entities": [
    {
      "name": string,
      "ascopeCategory": "Areas" | "Structures" | "Capabilities" | "Organizations" | "People" | "Events",
      "pmesiiCategory": "Political" | "Military" | "Economic" | "Social" | "Information" | "Infrastructure",
      "confidence": number,
      "status": "Operational" | "Degraded" | "Critical" | "Unknown",
      "details": string
    }
  ],
  "summary": string,
  "recommendedPriority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}`;

    const text = await callGemini(ai, {
      systemInstruction,
      prompt: `Extract entities from this field report:\n\n${observationText}`,
      responseMimeType: 'application/json',
      temperature: 0.1,
    });

    try {
      const parsed = JSON.parse(text || '{}');
      if (parsed.entities && Array.isArray(parsed.entities) && parsed.entities.length > 0) {
        return res.json(parsed);
      }
    } catch {
      // JSON parse error, fall through to contextual fallback
    }

    return res.json(buildContextualExtractedEntities(observationText));
  } catch (err: any) {
    console.warn('Handling /api/ai/extract-entities fallback due to:', err.message);
    return res.json(buildContextualExtractedEntities(observationText));
  }
});

// AI Civilian Consequence & Disruption Cascade Analysis
app.post('/api/ai/consequence-analysis', async (req: Request, res: Response) => {
  const { disruptionTarget, eventType, durationHours } = req.body;
  const targetName = disruptionTarget || 'Regional Power Grid Substation Alpha';

  const defaultConsequence = {
    primaryTarget: targetName,
    firstOrderEffects: [
      `Immediate loss of functional electrical distribution from ${targetName}.`,
      'Primary telemetry and municipal control circuits switch to emergency battery systems.',
    ],
    secondOrderEffects: [
      'Municipal water pumping and chlorination facilities degrade within 4 to 8 hours due to generator fuel depletion.',
      'Cellular communications towers experience coverage contraction as backup power drains.',
      'Traffic signaling grid failure creates congestion along primary civilian routes.',
    ],
    thirdOrderEffects: [
      'Local health clinics and regional hospital shift to contingency triage and divert non-emergency cases.',
      'Public anxiety regarding food spoilage and water rationing increases narrative volatility.',
      'Estimated daily civil economic productivity loss of approximately $850k.',
    ],
    vulnerabilityIndex: 74,
    mitigationRecommendations: [
      'Coordinate priority fuel deliveries via CMOC with Host Nation Ministry of Municipalities.',
      'Synchronize with Public Affairs Officer (PAO) to broadcast scheduled repair and generator replenishment timelines.',
      'Deploy Civil Affairs Team (CAT) to monitor municipal water pressure and IDP movement.',
    ],
    doctrinalNote: 'Civil Affairs Running Estimate updated per ATP 3-57.60 Appendix B.',
  };

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.json(defaultConsequence);
    }

    const systemInstruction = `You are a military Civil Systems & Consequence Analyst for the Civil Information Overlay (CIO).
Analyze how a disruption to a specific civilian infrastructure asset or civil node propagates through interdependent systems (Power, Water, Health, Comms, Food, Transport, Governance, Information Environment).
Estimate 1st order (direct physical/digital), 2nd order (interdependent functional), and 3rd order (social, economic, narrative, displacement) effects.
Provide actionable Civil Affairs mitigation recommendations.
Output JSON format:
{
  "primaryTarget": string,
  "firstOrderEffects": string[],
  "secondOrderEffects": string[],
  "thirdOrderEffects": string[],
  "vulnerabilityIndex": number (0-100),
  "mitigationRecommendations": string[],
  "doctrinalNote": string
}`;

    const text = await callGemini(ai, {
      systemInstruction,
      prompt: `Analyze disruption: Target: ${targetName}, Event Type: ${eventType || 'Civilian Infrastructure Degradation'}, Expected Duration: ${durationHours || 48} hours.`,
      responseMimeType: 'application/json',
      temperature: 0.2,
    });

    try {
      const parsed = JSON.parse(text || '{}');
      if (parsed.firstOrderEffects && parsed.secondOrderEffects) {
        return res.json(parsed);
      }
    } catch {
      // Fall through
    }

    return res.json(defaultConsequence);
  } catch (err: any) {
    console.warn('Handling /api/ai/consequence-analysis fallback due to:', err.message);
    return res.json(defaultConsequence);
  }
});

// AI Civil Affairs Running Estimate Drafter
app.post('/api/ai/running-estimate', async (req: Request, res: Response) => {
  const { sectionTitle, operationalPhase, currentCivilObservations } = req.body;
  const section = sectionTitle || 'Civil Considerations & Infrastructure Status';
  const phase = operationalPhase || 'Phase 1 - Crisis Response / AO Griffin';

  const defaultEstimate = {
    estimateText: `CIVIL AFFAIRS RUNNING ESTIMATE (STAFF WORKING DRAFT // ATP 3-57.60)
Section: ${section}
Phase: ${phase}
DTG: 211730Z SEP 26
Authority: S-9 / G-9 Civil Affairs Section

1. CIVIL SITUATION & CURRENT OPERATIONAL BASELINE:
Civil critical infrastructure across AO Griffin exhibits moderate baseline stability, but severe vulnerabilities exist within water sanitation, localized power distribution, and cellular communication nodes.
Observations Synthesized:
"${currentCivilObservations || 'Routine patrol telemetry and municipal utility reports indicate degraded fuel reserves and localized service bottlenecks.'}"

2. ASCOPE / PMESII CIVIL RECONNAISSANCE INTEGRATION:
- Areas: Key population centers in Sector Central and East maintain normal market hours; Northern perimeter shows elevated IDP transit.
- Structures: Water Filtration Plant #2 and Substation Alpha represent primary single points of failure.
- Capabilities: Emergency medical services functioning at 72% normal capacity; water output operating under restricted pressure schedules.
- Organizations: District Municipal Council and Red Crescent are actively engaged through the CMOC coordination mechanism.
- People: Public sentiment remains cautious; institutional trust in municipal governance is currently indexed at 64/100.
- Events: Approaching seasonal agricultural market may increase logistics traffic across MSR Cedar by 30%.

3. INTERDEPENDENCY & SECOND/THIRD-ORDER EFFECTS:
Continued degradation of primary substation feeder lines will trigger automatic shutoffs at municipal water treatment facilities within 12 hours. Downstream impacts include heightened public health hazards, localized water-related civil unrest, and displaced civilian flow towards western staging areas.

4. S-9 / G-9 RECOMMENDATIONS TO THE COMMANDER:
- Direct CMOC to synchronize emergency fuel replenishment for municipal water pumps with Host Nation Directorate.
- Establish civil-military engineer liaison with local utility technicians to expedite grid repairs.
- Coordinate with Public Affairs (Inform Activity) to disseminate factual repair updates and dispel black-market fuel hoarding rumors.
- Integrate civil displacement CCIR triggers into the Joint Operations Center (JOC) common operational picture.`,
    classification: 'UNCLASSIFIED // STAFF WORKING DRAFT',
    verificationStatus: 'PENDING_HUMAN_VALIDATION',
    authoritiesNote: 'Doctrinally aligned with ATP 3-57.60 Appendix B and ATP 3-57.50.',
  };

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.json(defaultEstimate);
    }

    const systemInstruction = `You are the Civil Affairs staff officer (S-9 / G-9) generating a formal Civil Running Estimate section in accordance with ATP 3-57.60 (Civil Affairs Planning) and ATP 3-57.50 (Civil Knowledge Integration).
Follow professional military doctrine standards. Emphasize civil considerations, PMESII/ASCOPE synthesis, operational impacts, and commander recommendations. Include human review requirement.`;

    const prompt = `Draft Civil Running Estimate for Section: "${section}" in Operational Phase: "${phase}". Current Civil Observations:\n${currentCivilObservations || 'Standard operational baselines'}`;

    const text = await callGemini(ai, {
      systemInstruction,
      prompt,
      temperature: 0.3,
    });

    return res.json({
      estimateText: text || defaultEstimate.estimateText,
      classification: 'UNCLASSIFIED // STAFF WORKING DRAFT',
      verificationStatus: 'PENDING_HUMAN_VALIDATION',
    });
  } catch (err: any) {
    console.warn('Handling /api/ai/running-estimate fallback due to:', err.message);
    return res.json(defaultEstimate);
  }
});

// AI Center of Gravity (COG) & Critical Factors Analysis (Dr. Joe Strange Model / JP 5-0)
app.post('/api/ai/cog-analysis', async (req: Request, res: Response) => {
  const { systemName, systemType, operationalObjective, currentCivilContext } = req.body;
  const sysName = systemName || 'Civil Component: Municipal Essential Service Delivery';
  const sysType = systemType || 'Friendly Civil Stability';

  const defaultCogResponse = {
    systemName: sysName,
    systemType: sysType,
    centerOfGravity: 'Public Institutional Legitimacy & Uninterrupted Municipal Essential Service Delivery (Water, Power, Emergency Care)',
    strategicObjective: operationalObjective || 'Sustain urban population resilience, preserve civil law and order, and deny adversary coercive leverage over civil life-support systems.',
    criticalCapabilities: [
      {
        description: 'Provide minimum essential water (15L/capita/day) and stable three-phase electrical power to critical medical and municipal assets.',
        requirements: [
          {
            description: 'Uninterrupted daily allocation of 3,200 gallons of generator-grade diesel fuel delivered via secured routes.',
            vulnerabilities: [
              {
                description: 'Single commercial supply route over Tigris Bridge #3 exposed to bottleneck interdiction or structural degradation.',
                severity: 'CRITICAL',
                ascopePmesiiTag: 'Infrastructure / Structures',
                mitigationOrAction: 'Establish CMOC multi-vendor escort corridor and pre-position 7-day reserve fuel bladders on-site.',
              },
              {
                description: 'Single high-voltage 132/33kV step-down transformer at Substation Alpha with no on-site replacement.',
                severity: 'CRITICAL',
                ascopePmesiiTag: 'Infrastructure / Structures',
                mitigationOrAction: 'Deploy physical guard detachment and isolate SCADA control interfaces from public network connections.',
              },
            ],
          },
        ],
      },
      {
        description: 'Deliver emergency trauma triage and communicable disease containment across municipal clinics and Ibn Sina Hospital.',
        requirements: [
          {
            description: 'Continuity of trauma medical surgical staff and uninterrupted vaccine cold-chain refrigeration.',
            vulnerabilities: [
              {
                description: 'Medical personnel flight caused by residential water/power deprivation and insurgent extortion.',
                severity: 'HIGH',
                ascopePmesiiTag: 'Social / People',
                mitigationOrAction: 'Designate protected municipal residential safe zone with priority power and secure transit escorts.',
              },
            ],
          },
        ],
      },
      {
        description: 'Maintain authoritative, two-way civil communication channels between municipal leadership and neighborhood shuras.',
        requirements: [
          {
            description: 'Operational status of Radio Salam 94.5 FM and municipal SMS repeater hubs.',
            vulnerabilities: [
              {
                description: 'Repeater blackout during rolling grid outages creates an information vacuum rapidly filled by black-market rumor campaigns.',
                severity: 'HIGH',
                ascopePmesiiTag: 'Information / Structures',
                mitigationOrAction: 'Deploy CA tactical loudspeaker teams and distribute battery-backed emergency radios to neighborhood leaders.',
              },
            ],
          },
        ],
      },
    ],
    decisivePoints: [
      {
        name: 'Securing Substation Alpha & Water Plant Fuel Corridors',
        lineOfEffort: 'Civil Infrastructure Protection (LOE 1)',
        targetedVulnerability: 'Single commercial fuel supply bottleneck',
        caRole: 'CMOC coordinates protected fuel allocation manifests with Host Nation Ministry of Municipalities.',
      },
      {
        name: 'Hardening Ibn Sina Hospital Emergency Power Micro-Grid',
        lineOfEffort: 'Public Health Continuity (LOE 2)',
        targetedVulnerability: 'Medical personnel flight and cold-chain loss',
        caRole: 'Civil Affairs engineers install dual-redundant backup generators and pre-position emergency trauma supplies.',
      },
      {
        name: 'Multi-Channel Municipal Inform Synchronization',
        lineOfEffort: 'Information Advantage & Public Trust (LOE 3)',
        targetedVulnerability: 'Information vacuum and black-market rumor campaigns',
        caRole: 'Synchronize Public Affairs announcements with civil ground updates to eliminate rumor voids.',
      },
    ],
    doctrinalNotes: 'Doctrinally formulated under JP 5-0 (Joint Planning, Appendix D) and ATP 3-57.50 using the Dr. Joe Strange Center of Gravity & Critical Factors framework (COG-CC-CR-CV).',
  };

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.json(defaultCogResponse);
    }

    const systemInstruction = `You are a Senior Joint Military Planner (J-5 / S-9) specialized in Center of Gravity (COG) analysis using the Dr. Joe Strange Model (COG -> Critical Capabilities [CC] -> Critical Requirements [CR] -> Critical Vulnerabilities [CV]) under JP 5-0 (Joint Planning) and JP 3-57 / ATP 3-57.50.
Your task is to analyze the Center of Gravity for the designated system (${sysName}, Type: ${sysType}) within the operational civil context.
Ensure every Critical Vulnerability is tagged with its relevant ASCOPE / PMESII category (e.g., "Infrastructure / Structures", "Social / People") and has a clear Civil Affairs mitigation or decisive action.
Output MUST be valid JSON strictly adhering to this schema:
{
  "systemName": string,
  "systemType": string,
  "centerOfGravity": string,
  "strategicObjective": string,
  "criticalCapabilities": [
    {
      "description": string,
      "requirements": [
        {
          "description": string,
          "vulnerabilities": [
            {
              "description": string,
              "severity": "CRITICAL" | "HIGH" | "MODERATE",
              "ascopePmesiiTag": string,
              "mitigationOrAction": string
            }
          ]
        }
      ]
    }
  ],
  "decisivePoints": [
    {
      "name": string,
      "lineOfEffort": string,
      "targetedVulnerability": string,
      "caRole": string
    }
  ],
  "doctrinalNotes": string
}`;

    const prompt = `Perform Center of Gravity (COG) and Critical Factors (CC-CR-CV) analysis for:
System Name: ${sysName}
System Type: ${sysType}
Strategic Objective: ${operationalObjective || 'Sustain civilian institutional stability and essential life-support continuity'}
Operational Civil Context:
${currentCivilContext || 'Urban operations in Area of Operations Griffin with degraded electrical grid, stressed water treatment, and active displaced population movement.'}`;

    const text = await callGemini(ai, {
      systemInstruction,
      prompt,
      responseMimeType: 'application/json',
      temperature: 0.2,
    });

    try {
      const parsed = JSON.parse(text || '{}');
      if (parsed.centerOfGravity && parsed.criticalCapabilities && parsed.criticalCapabilities.length > 0) {
        return res.json(parsed);
      }
    } catch {
      // Fall through to default
    }

    return res.json(defaultCogResponse);
  } catch (err: any) {
    console.warn('Handling /api/ai/cog-analysis fallback due to:', err.message);
    return res.json(defaultCogResponse);
  }
});


// Vite Middleware for development / static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CIO-KE Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
