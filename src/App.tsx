import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, Code2, Cpu, Database, Play, CheckCircle2, 
  BarChart4, ArrowRight, RefreshCw, Layers, Sparkles,
  Globe, Mic, ArrowUp, Info, Plus, ChevronDown, Trash2,
  Lock, FileCode, PlayCircle, Layers3, Activity, Command, ArrowLeft, Copy,
  Minus, Maximize2, Minimize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import ViktorOddy from "./components/ViktorOddy";
import StandardDashboard from "./components/StandardDashboard";
import { 
  CompilationProject, 
  EvaluationPrompt, 
  ProjectMetrics 
} from "./types";

// Suggestion badges mirroring luxury cards
const SUGGESTION_BADGES = [
  { 
    id: "badge-dashboard", 
    label: "Reporting Dashboard", 
    appName: "Reporting & CRM Dashboard",
    prompt: "Build an elegant CRM workspace with customer metrics, transactional data logging, dynamic analytics charts, and client role access controls." 
  },
  { 
    id: "badge-gaming", 
    label: "Gaming Platform", 
    appName: "Retro Game Vault",
    prompt: "A retro gaming platform lobby that registers server latency tables, stores active player rosters, logs premium shop credit transactions, and handles developer privilege locks." 
  },
  { 
    id: "badge-onboarding", 
    label: "Onboarding Portal", 
    appName: "Corporate Onboarding Vault",
    prompt: "HR Onboarding Vault managing employee profiles, training checklists, background validations logs, and career level grades reviews." 
  },
  { 
    id: "badge-visualizer", 
    label: "Room Visualizer", 
    appName: "Viktor Oddy Creative Studio",
    prompt: "Create a landing page layout for a creative design studio called 'Viktor Oddy' using React, TS, and Tailwind. White background, testimonies, project budget slider forms." 
  },
  { 
    id: "badge-networking", 
    label: "Networking App", 
    appName: "Hospital Operations Router",
    prompt: "Secure clinic routing scheduler supporting clinical practitioner rotations, patient referral records, health charts log, and invoice generation logs structure." 
  }
];

function extractAppNameFromPrompt(prompt: string): string {
  const p = prompt.trim();
  if (!p) return "Custom App Workspace";

  // Try to find custom name patterns like: called "X", named "X", "X" app
  const calledMatches = p.match(/(?:called|named|branding|brand)\s+["']?([a-zA-Z0-9\s-_]+)["']?/i);
  if (calledMatches && calledMatches[1]) {
    const name = calledMatches[1].trim();
    if (name.length > 2 && name.length < 40) {
      return name;
    }
  }

  // Fallback to beautiful key noun extraction
  const words = p.split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, ""));
  const stopwords = new Set([
    "build", "create", "make", "a", "an", "the", "with", "for", "elegant", 
    "beautiful", "dynamic", "interactive", "workspace", "application", "app", 
    "system", "platform", "of", "and", "to", "in", "some", "custom", "secure", 
    "fully", "functional", "called", "named"
  ]);
  const keywords = words.filter(w => w && !stopwords.has(w.toLowerCase()));

  if (keywords.length >= 2) {
    const titleWords = keywords.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    return titleWords.join(" ");
  } else if (keywords.length === 1) {
    return keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1).toLowerCase() + " Portal";
  }

  return "Custom Sandbox App";
}

export default function App() {
  const [activePrompt, setActivePrompt] = useState(SUGGESTION_BADGES[0].prompt);
  const [appName, setAppName] = useState(SUGGESTION_BADGES[0].appName);
  const [currentPromptLabel, setCurrentPromptLabel] = useState(SUGGESTION_BADGES[0].label);

  const [customCodeOverrides, setCustomCodeOverrides] = useState<Record<string, string>>({});

  // Workspace Mode (true = show Split screen Google AI Studio developer layout, false = show Landing input page)
  const [workspaceMode, setWorkspaceMode] = useState(false);

  // Sandbox view size states
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Compilation state trackers
  const [project, setProject] = useState<CompilationProject | null>(null);
  const [compStep, setCompStep] = useState<"idle" | "extracting" | "designing" | "schemas" | "validating" | "repairing" | "runtime" | "completed">("idle");
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Interactive configurations
  const [planToggle, setPlanToggle] = useState(true);
  const [devResultTab, setDevResultTab] = useState<"sandbox" | "code">("sandbox");
  const [selectedSourceFile, setSelectedSourceFile] = useState<"schema.ts" | "api.ts" | "App.tsx" | "package.json">("schema.ts");

  // Global metrics stats
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    requests_processed: 38,
    success_rate: 95.0,
    validation_failures: 6,
    repairs_applied: 6,
    average_latency: 790
  });

  // Automated scroll ref
  const pageTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.warn("Metrics api not found, keeping fallback stats:", e);
    }
  };

  const log = (msg: string) => {
    setLogMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Pre-seed a beautiful default compiled project state
  const preLoadSampleProject = () => {
    const mockProj: CompilationProject = {
      id: "ai_eng_default",
      prompt: SUGGESTION_BADGES[0].prompt,
      status: "completed",
      intent: {
        app_type: "Reporting & CRM Management Suite",
        features: ["Customer registry grids", "Security authorization tiers", "Transaction invoicing checklists", "Performance metric charts"],
        roles: ["Manager", "Sales Advisor", "Finance Reviewer"],
        entities: ["contacts", "payments", "system_logs", "priorities_roster"],
        constraints: ["Payment amount checks must validate non-zero", "Administrator privilege required for role updates"],
        assumptions: ["Standard values mapped offline", "Currency configured to United States Dollars"]
      },
      design: {
        entities: [],
        relationships: [
          { from_entity: "contacts", to_entity: "payments", type: "one_to_many" }
        ],
        roles: ["Manager", "Advisor"],
        permissions: [],
        flows: [
          { step_number: 1, name: "Staff Sign-in", actor: "Advisor", action: "Inspects client profiles alignment", entities_involved: ["contacts"] },
          { step_number: 2, name: "Commit Audit", actor: "Manager", action: "Submits invoiced client values payment", entities_involved: ["payments"] }
        ]
      },
      schemas: {
        database: {
          tables: [
            {
              name: "contacts",
              columns: [
                { name: "id", type: "INTEGER", primary_key: true, nullable: false },
                { name: "name", type: "STRING", nullable: false },
                { name: "email", type: "STRING", nullable: false },
                { name: "status", type: "STRING", nullable: true }
              ]
            },
            {
              name: "payments",
              columns: [
                { name: "id", type: "INTEGER", primary_key: true, nullable: false },
                { name: "amount", type: "NUMBER", nullable: false },
                { name: "status", type: "STRING", nullable: false }
              ]
            }
          ]
        },
        api: {
          endpoints: [
            { path: "/api/contacts", method: "GET", response_body: {}, description: "Fetch all customer register contacts ledger" },
            { path: "/api/payments/create", method: "POST", response_body: {}, required_role: "Manager", description: "Record structured transactional payment invoices" }
          ]
        },
        ui: { pages: [] },
        auth: { roles: [], permissions: {} }
      },
      validation: {
        valid: true,
        score: 100,
        errors: []
      },
      repairs: {
        repairs: []
      },
      runtime_config: {
        app_name: "Reporting & CRM Dashboard",
        theme: "light",
        nav_items: [],
        sidebar_enabled: true
      },
      latency_ms: {
        intent: 140,
        design: 180,
        schemas: 110,
        validation: 80,
        runtime: 120
      }
    };
    setProject(mockProj);
  };

  // Core model execution compiler
  const triggerCompilation = async (overridePrompt?: string, overrideName?: string) => {
    const promptToUse = (overridePrompt || activePrompt).trim();
    
    // Auto-detect a matching name based on suggestion list or extract from prompt beautifully
    const matchedBadge = SUGGESTION_BADGES.find(b => b.prompt === promptToUse);
    const nameToUse = overrideName || matchedBadge?.appName || extractAppNameFromPrompt(promptToUse);

    if (!promptToUse) return;

    setIsCompiling(true);
    setCompStep("extracting");
    setLogMessages([]);
    setCustomCodeOverrides({});
    setAppName(nameToUse);
    setWorkspaceMode(true); // Instant navigation transition to workspace developer split screen!
    log("Initializing AI Engineer dynamic compilation pipeline...");

    const targetProject: CompilationProject = {
      id: "compile_" + Math.random().toString(36).substring(2, 9),
      prompt: promptToUse,
      status: "extracting_intent",
      intent: null,
      design: null,
      schemas: null,
      validation: null,
      repairs: null,
      runtime_config: null,
      latency_ms: {}
    };
    setProject(targetProject);

    let finalSchemas: any = null;

    try {
      // 1. Intent Extraction
      const start1 = Date.now();
      log("Analyzing functional requirements and parsing intent model...");
      const res1 = await fetch("/api/stage1/extract-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToUse })
      });
      if (!res1.ok) throw new Error("Intent Recognition Model failed to parse prompt.");
      const intentData = await res1.json();
      const lat1 = Date.now() - start1;

      targetProject.intent = intentData;
      targetProject.latency_ms.intent = lat1;
      log(`Discovered App Class: '${intentData.app_type}' in ${lat1}ms.`);
      setProject({ ...targetProject });

      // 2. Structured Workflows Layout
      setCompStep("designing");
      const start2 = Date.now();
      log("Configuring security permissions grids and operations sequence flows...");
      const res2 = await fetch("/api/stage2/design-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: intentData })
      });
      if (!res2.ok) throw new Error("Workflows mapping architecture design phase failed.");
      const designData = await res2.json();
      const lat2 = Date.now() - start2;

      targetProject.design = designData;
      targetProject.latency_ms.design = lat2;
      log(`Designed pathways list and ${designData.flows?.length} workflows sequences.`);
      setProject({ ...targetProject });

      // 3. Dual Relational & API Schema compile
      setCompStep("schemas");
      const start3 = Date.now();
      log("Compiling PostgreSQL table structures and REST HTTP gateway router models...");
      const res3 = await fetch("/api/stage3/generate-schemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design: designData })
      });
      if (!res3.ok) throw new Error("Schema generations compilation failed.");
      const schemasData = await res3.json();
      const lat3 = Date.now() - start3;

      targetProject.schemas = schemasData;
      targetProject.latency_ms.schemas = lat3;
      finalSchemas = schemasData;
      log(`Compiled table relations and HTTP endpoint body structures successfully.`);
      setProject({ ...targetProject });

      // 4. Schema consistency validations checker
      setCompStep("validating");
      const start4 = Date.now();
      log("Validating schemas constraints against normal form integrity checks...");
      const res4 = await fetch("/api/stage4/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemas: schemasData })
      });
      if (!res4.ok) throw new Error("Relational database schema consistency validation crashed.");
      const validationReport = await res4.json();
      const lat4 = Date.now() - start4;

      targetProject.validation = validationReport;
      targetProject.latency_ms.validation = lat4;
      log(`Consistency Score: ${validationReport.score}/100. Discovered ${validationReport.errors?.length} coupling check warnings.`);
      setProject({ ...targetProject });

      // 5. Automatic schema-repairs (runs structural fixes if validations fail)
      if (!validationReport.valid && planToggle) {
        setCompStep("repairing");
        log("Discrepancies identified. Dispatched integrated auto-repair engine script...");
        const start5 = Date.now();
        const res5 = await fetch("/api/stage5/repair", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schemas: schemasData, validation_report: validationReport })
        });
        if (!res5.ok) throw new Error("Auto-repair alignment optimization script failed.");
        const repairReport = await res5.json();
        const lat5 = Date.now() - start5;

        targetProject.repairs = repairReport;
        targetProject.schemas = repairReport.repaired_schemas;
        finalSchemas = repairReport.repaired_schemas;
        targetProject.latency_ms.repairs = lat5;

        log(`Repairs Applied: ${repairReport.repairs?.length} modifications resolved inside database schema lists.`);
        
        // Re-validate conformed schema
        const reVal = await fetch("/api/stage4/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schemas: repairReport.repaired_schemas })
        });
        if (reVal.ok) {
          const reValData = await reVal.json();
          targetProject.validation = reValData;
        }
        setProject({ ...targetProject });
      }

      // 6. Dynamic browser Sandboxing output trigger
      setCompStep("runtime");
      const start6 = Date.now();
      log("Injecting variables into Sandbox execution components...");
      const res6 = await fetch("/api/stage6/generate-runtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemas: finalSchemas, app_name: nameToUse })
      });
      if (!res6.ok) throw new Error("Interactive sandbox client initialization failed.");
      const runtimeData = await res6.json();
      const lat6 = Date.now() - start6;

      targetProject.runtime_config = {
        app_name: nameToUse,
        theme: runtimeData.theme === "studio" ? "studio" : "light",
        nav_items: [],
        sidebar_enabled: true
      };
      targetProject.status = "completed";
      targetProject.latency_ms.runtime = lat6;
      setCompStep("completed");
      log(`Compiling finished successfully! Dynamic Sandbox and code bundles ready.`);
      setProject({ ...targetProject });

      // Refresh telemetry statistics
      fetchMetrics();

    } catch (e: any) {
      log(`COMPILATION EXCEPTION: ${e.message}`);
      targetProject.status = "failed";
      targetProject.error = e.message;
      setProject({ ...targetProject });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleBadgeClick = (badge: typeof SUGGESTION_BADGES[0]) => {
    setActivePrompt(badge.prompt);
    setAppName(badge.appName);
    setCurrentPromptLabel(badge.label);
    triggerCompilation(badge.prompt, badge.appName);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Source code copied to workspace key clipboard!");
  };

  // Generate synthetic source code aligned completely with what they've built!
  const getDynamicSourceCodeText = () => {
    const tablesList = project?.schemas?.database?.tables || [];
    const apiList = project?.schemas?.api?.endpoints || [];
    
    if (selectedSourceFile === "schema.ts") {
      return `import { pgTable, serial, varchar, integer, doublePrecision, boolean, timestamp } from "drizzle-orm/pg-core";

// Dynamic SQL Schema definitions generated by AI Engineer
${tablesList.map((t: any) => `export const ${t.name}Table = pgTable("${t.name}", {
  ${t.columns.map((c: any) => {
    let line = `${c.name}: `;
    if (c.primary_key || c.name === "id") {
      line += `serial("${c.name}").primaryKey()`;
    } else {
      const typeStr = c.type.toLowerCase();
      if (typeStr === "integer" || typeStr === "number") {
        line += `integer("${c.name}")`;
      } else if (typeStr === "boolean") {
        line += `boolean("${c.name}")`;
      } else {
        line += `varchar("${c.name}", { length: 255 })`;
      }
      if (!c.nullable) {
        line += `.notNull()`;
      }
    }
    return line;
  }).join(",\n  ")}
});`).join("\n\n")}`;
    }

    if (selectedSourceFile === "api.ts") {
      return `import express from "express";
import { db } from "../db/connection";
import { ${tablesList.map((t: any) => `${t.name}Table`).join(", ")} } from "./schema";

const router = express.Router();

// AI Engineer REST Gateway Router pathways
${apiList.map((ep: any) => `
/**
 * ${ep.description}
 * Required Scope privileges: ${ep.required_role || "any"}
 */
router.${ep.method.toLowerCase()}("${ep.path}", async (req, res) => {
  try {
    ${ep.method === "POST" ? `const payload = req.body;
    console.log("Committed payload params write:", payload);` : ""}
    res.status(${ep.method === "POST" ? "201" : "200"}).json({
      status: "success",
      timestamp: Date.now()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});`).join("\n")}`;
    }

    if (selectedSourceFile === "App.tsx") {
      return `import React, { useState } from "react";
import { Plus, Check, Play, Database, Shield } from "lucide-react";

// Interactive React Application layout referencing conformed entities
export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState("${appName}");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 flex flex-col justify-between">
      <header className="border-b border-indigo-50 pb-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{activeWorkspace}</h1>
        <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
          Compiled Live Build (AI Engineer v1.0)
        </span>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dynamic Cards generated based on tables schema */}
        ${tablesList.map((t: any) => `
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Table</h3>
          <h2 className="text-lg font-bold text-slate-800 mt-1">${t.name} Ledger</h2>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
            Columns: ${t.columns.map((c: any) => c.name).join(", ")}
          </div>
        </div>`).join("\n        ")}
      </main>
    </div>
  );
}`;
    }

    return `{
  "name": "${appName.toLowerCase().replace(/\s+/g, "-")}",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.12.7",
    "lucide-react": "^0.395.0",
    "express": "^4.19.2",
    "drizzle-orm": "^0.30.10",
    "motion": "^12.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "vite": "^5.2.0",
    "tsx": "^4.7.1"
  }
}`;
  };

  return (
    <div ref={pageTopRef} className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans flex flex-col justify-between overflow-x-hidden selection:bg-orange-500/10">
      
      {/* Dynamic luxury top-header line */}
      <div className="w-full max-w-7xl mx-auto px-4 mt-5">
        <header className="bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-full py-2 px-6 flex items-center justify-between shadow-sm">
          
          {/* Rebranded "AI Engineer" core trademark name & symbol representation */}
          <div 
            onClick={() => setWorkspaceMode(false)}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="relative w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-slate-900 border border-slate-750 shadow-sm text-yellow-400">
              <Sparkles className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            </div>
            <div className="leading-none text-left">
              <span className="font-extrabold text-[17px] text-slate-900 tracking-tight block">
                AI Engineer
              </span>
            </div>
          </div>

          {/* Right actions block */}
          <div className="flex items-center gap-3">
            {/* Action to toggle workspace view or trigger landing */}
            <button 
              onClick={() => {
                if (workspaceMode) {
                  setWorkspaceMode(false);
                } else {
                  const searchArea = document.getElementById("search-prompt-input");
                  searchArea?.focus();
                  searchArea?.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              {workspaceMode ? (
                <>New Prompt Layout</>
              ) : (
                <>Start Building</>
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Main Content Areas Renderers */}
      <div className={`flex-1 w-full ${workspaceMode ? "max-w-[1600px]" : "max-w-7xl"} mx-auto px-4 mt-6 pb-12 transition-all duration-300`}>
        <AnimatePresence mode="wait">
          
          {/* VIEW A: BRAND NEW SPLIT SCREEN GOOGLE AI STUDIO DEVELOPER WORKSPACE PAGE */}
          {workspaceMode ? (
            <motion.div
              key="workspace-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
            >
              
              {/* Left Column: Processing Methods & Terminal Logs (40% width, hidden if maximized) */}
              {!isMaximized && (
                <div className="md:col-span-5 flex flex-col gap-5 text-left">
                
                {/* Back button header navigation bar to take them home */}
                <div className="bg-white/85 border border-slate-200/60 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                  <button
                    onClick={() => setWorkspaceMode(false)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Prompt Home
                  </button>
                  <span className="bg-[#ff4a1c]/10 text-[#ff4a1c] font-mono text-[9px] font-black px-2 py-0.5 rounded uppercase">
                    Developer Mode
                  </span>
                </div>

                {/* Prompt Review Panel */}
                <div className="bg-white rounded-3xl border border-slate-200/50 p-5 shadow-sm space-y-3.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block">Active Application Prompt</span>
                  <p className="text-xs text-slate-700 leading-normal font-sans border-l-2 border-[#ff4a1c] pl-3.5 italic bg-slate-50/50 py-2.5 rounded-r-xl">
                    "{project?.prompt}"
                  </p>
                  
                  {/* Active rename block */}
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block">Configure App Name</label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setAppName(newName);
                        if (project) {
                          setProject({
                            ...project,
                            runtime_config: {
                              ...project.runtime_config,
                              app_name: newName
                            }
                          });
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#ff4a1c] focus:bg-white transition-all shadow-inner"
                      placeholder="e.g. My Custom Tracker Suite"
                    />
                  </div>

                  {/* Dynamic stats logs blocks */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[8px] text-slate-400 font-bold uppercase block">App Classification</span>
                      <span className="font-bold text-slate-800 text-[11px] truncate block leading-normal">{project?.intent?.app_type || "Dynamic Platform"}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[8px] text-slate-400 font-bold uppercase block">Integrity Score</span>
                      <span className="font-extrabold text-emerald-600 text-[11px] block leading-normal">{project?.validation?.score || 100}/100 PASS</span>
                    </div>
                  </div>
                </div>

                {/* Processing Methods Stream VM box */}
                <div className="bg-[#090e1a] text-slate-300 rounded-3xl p-5 shadow-2.5xl border border-indigo-950/40 font-mono flex flex-col justify-between h-[250px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-2 font-sans tracking-wide">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Virtual Machine Compiler Log
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest font-sans">
                        {isCompiling ? "COMPILING ROUTE" : "COMPILED PASS"}
                      </span>
                    </div>

                    <div className="bg-black/45 rounded-xl p-3 h-36 overflow-y-auto text-[11px] space-y-2 text-indigo-100/90 leading-relaxed scrollbar-thin">
                      {logMessages.map((msg, idx) => (
                        <div key={idx} className="border-l-2 border-indigo-500/40 pl-2.5">
                          {msg}
                        </div>
                      ))}
                      {logMessages.length === 0 && (
                        <div className="text-slate-500 italic py-6 text-center select-none font-sans">
                          Compilation parameters conformed. Sandbox execution active.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-500 font-sans flex justify-between pt-1 border-t border-slate-800/40">
                    <span>Engine: AI-Compiler v1.07</span>
                    <span>State: STABLE</span>
                  </div>

                </div>

              </div>
            )}

              {/* Right Column: Dynamic Apps Viewer & Source Code Sandbox */}
              <div className={`flex flex-col gap-5 text-left transition-all duration-300 ${isMaximized ? "md:col-span-12" : "md:col-span-7"}`}>
                
                {/* Application output visual controls tab */}
                <div className="bg-slate-900 rounded-3xl p-1.5 flex flex-wrap gap-1 shadow-sm font-sans select-none">
                  <button
                    onClick={() => setDevResultTab("sandbox")}
                    className={`text-xs font-bold px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      devResultTab === "sandbox" 
                        ? "bg-white text-slate-950 font-extrabold shadow-sm" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <PlayCircle className="w-4 h-4 text-orange-500 animate-pulse" /> Preview
                  </button>
                  <button
                    onClick={() => setDevResultTab("code")}
                    className={`text-xs font-bold px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      devResultTab === "code" 
                        ? "bg-white text-slate-950 font-extrabold shadow-sm" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileCode className="w-4 h-4 text-indigo-400" /> Code
                  </button>
                </div>

                <div className={`bg-white rounded-[32px] border border-slate-200/60 overflow-hidden shadow-xl flex flex-col transition-all duration-300 ${isMinimized ? "min-h-0 h-auto" : "min-h-[580px] flex-1"}`}>
                  
                  {/* Shared OS Window Top Bar with Minimize & Maximize on Right */}
                  <div className="bg-slate-950 px-5 py-3 flex items-center justify-between border-b border-indigo-950/20 select-none shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                        {devResultTab === "sandbox" ? "Interactive Preview" : "Source Code"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Minimize Button */}
                      <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        title={isMinimized ? "Restore Sandbox Window" : "Minimize Sandbox Window"}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer"
                        id="btn-sandbox-minimize"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      {/* Maximize Button */}
                      <button
                        onClick={() => {
                          setIsMaximized(!isMaximized);
                          setIsMinimized(false);
                        }}
                        title={isMaximized ? "Split Screen View" : "Fullscreen Preview"}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer"
                        id="btn-sandbox-maximize"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Inner Wrapper */}
                  {!isMinimized && (
                    <div className="flex-1 flex flex-col min-h-0">
                      
                      {/* TAB CONTENT 1: Dynamic compiled Sandbox Preview */}
                      {devResultTab === "sandbox" && (
                        <div className="flex-1 flex flex-col min-h-0">
                          {isCompiling ? (
                            <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-300 font-sans min-h-[500px]">
                              <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Terminal className="w-6 h-6 text-indigo-400 animate-pulse" />
                                </div>
                              </div>
                              
                              <h3 className="font-extrabold text-base text-white tracking-tight mb-2">
                                Compiling & Generating Codebase...
                              </h3>
                              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                                Please wait while our compiler parses requirements, designs the SQL/API structures, and runs code generation pipelines using the AI engine...
                              </p>
                              
                              {/* Live step indicator */}
                              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 w-full max-w-sm text-left font-mono text-[11px] space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500">Pipeline Stage:</span>
                                  <span className="text-indigo-400 font-bold uppercase tracking-wider">{compStep}</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-[#ff4e1a] h-full transition-all duration-500" 
                                    style={{
                                      width: 
                                        compStep === "extracting" ? "20%" :
                                        compStep === "designing" ? "40%" :
                                        compStep === "schemas" ? "65%" :
                                        compStep === "validating" ? "85%" :
                                        compStep === "repairing" ? "95%" : "5%"
                                    }}
                                  />
                                </div>
                                <div className="text-slate-400 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                                  <span className="text-[10px] truncate text-slate-300">
                                    {compStep === "extracting" && "Extracting user requirements & intent..."}
                                    {compStep === "designing" && "Synthesizing schema relationships & permissions..."}
                                    {compStep === "schemas" && "Assembling endpoints and UI schemas..."}
                                    {compStep === "validating" && "Running rigorous lint, import & format passes..."}
                                    {compStep === "repairing" && "Refining and packaging source code elements..."}
                                    {!["extracting", "designing", "schemas", "validating", "repairing"].includes(compStep) && "Warming up compile pipelines..."}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : !project ? (
                            <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-500 font-sans min-h-[500px]">
                              <Terminal className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                              <h3 className="font-bold text-sm text-slate-700 mb-1">Compiler Idle</h3>
                              <p className="text-xs text-slate-400 max-w-xs leading-normal">
                                Enter a prompt and hit "Generate Application" to compile code databases and build custom interactive dashboards.
                              </p>
                            </div>
                          ) : (
                            <div className="flex-1 bg-slate-50 p-2 sm:p-4">
                              {project?.runtime_config?.theme === "studio" ? (
                                <ViktorOddy />
                              ) : (
                                <StandardDashboard project={project} />
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB CONTENT 2: Simulated Code Editor Workspace */}
                      {devResultTab === "code" && (
                        <div className="flex-1 flex flex-col bg-[#050a14] text-slate-300 font-mono text-xs min-h-[500px]">
                          {isCompiling ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans bg-[#0c1220]/20">
                              <div className="w-12 h-12 bg-indigo-950/45 rounded-xl border border-indigo-500/25 flex items-center justify-center mb-4">
                                <FileCode className="w-5 h-5 text-indigo-400 animate-pulse" />
                              </div>
                              <h3 className="font-bold text-sm text-slate-200 mb-1.5">Synthesizing Codebase Modules...</h3>
                              <p className="text-xs text-slate-500 max-w-xs leading-normal">
                                The compiler is currently mapping entity properties, configuring the REST gateway pathways, and formatting your TypeScript files.
                              </p>
                            </div>
                          ) : !project ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans bg-[#0c1220]/20">
                              <Terminal className="w-10 h-10 text-slate-600 mb-3" />
                              <h3 className="font-bold text-sm text-slate-300 mb-1">Source Code Offline</h3>
                              <p className="text-xs text-slate-500 max-w-xs leading-normal">
                                Trigger sandbox compilation to design live code routes and database models.
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* Editor top menu bar listing conformed files */}
                              <div className="bg-[#0b1220] border-b border-slate-850 p-2 flex flex-wrap gap-1.5 shrink-0 select-none">
                                <button
                                  onClick={() => setSelectedSourceFile("schema.ts")}
                                  className={`px-3 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-all ${
                                    selectedSourceFile === "schema.ts" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  📄 drizzle/schema.ts
                                </button>
                                <button
                                  onClick={() => setSelectedSourceFile("api.ts")}
                                  className={`px-3 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-all ${
                                    selectedSourceFile === "api.ts" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  📄 server/api.ts
                                </button>
                                <button
                                  onClick={() => setSelectedSourceFile("App.tsx")}
                                  className={`px-3 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-all ${
                                    selectedSourceFile === "App.tsx" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  📄 src/App.tsx
                                </button>
                                <button
                                  onClick={() => setSelectedSourceFile("package.json")}
                                  className={`px-3 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-all ${
                                    selectedSourceFile === "package.json" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  📄 package.json
                                </button>
                              </div>

                              {/* Code body block */}
                              <div className="p-4 flex-1 overflow-hidden leading-relaxed relative flex flex-col">
                                <button
                                  onClick={() => handleCopyCode(customCodeOverrides[selectedSourceFile] || getDynamicSourceCodeText())}
                                  className="absolute top-4 right-4 bg-slate-800 hover:bg-[#ff4d15] text-white p-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[10px] select-none z-10"
                                >
                                  <Copy className="w-3.5 h-3.5" /> Copy Code
                                </button>

                                <textarea
                                  value={customCodeOverrides[selectedSourceFile] || getDynamicSourceCodeText()}
                                  onChange={(e) => {
                                    setCustomCodeOverrides({
                                      ...customCodeOverrides,
                                      [selectedSourceFile]: e.target.value
                                    });
                                  }}
                                  className="w-full h-full flex-1 bg-transparent text-left font-mono text-slate-200 outline-none resize-none overflow-y-auto leading-relaxed select-text scrollbar-thin rounded-xl p-2 focus:ring-1 focus:ring-indigo-500/20"
                                  spellCheck={false}
                                />
                              </div>

                              {/* Editor Status tray */}
                              <div className="bg-[#0b1220] border-t border-slate-850 p-2 px-4 text-[10px] text-slate-400 flex justify-between">
                                  <span>TypeScript Language Service: Active</span>
                                  <span>Lines: {(customCodeOverrides[selectedSourceFile] || getDynamicSourceCodeText()).split("\n").length}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </div>

            </motion.div>
          ) : (
            
            /* VIEW B: CORE LANDING PROMPT VIEW COMPONENT (REBRANDED TO AI ENGINEER) */
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-14 sm:mt-20 flex flex-col items-center"
            >
              
              {/* Luxury title tagline */}
              <div className="text-center space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-[#ff4a1c]/15 px-3 py-1 rounded-full border border-[#ff4a1c]/20 text-xs text-[#ff4a1c] font-black uppercase tracking-widest leading-none">
                  <Cpu className="w-3.5 h-3.5" /> Dynamic AI Code Engine 
                </div>
                <h2 className="text-[40px] sm:text-[54px] lg:text-[62px] font-black text-slate-900 tracking-tight leading-[1.06] font-sans">
                  Turn your ideas into apps
                </h2>
                <p className="text-slate-500 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-lg sm:max-w-xl mx-auto font-normal">
                  AI Engineer compiles fully-functional relational databases, dynamic REST gateway routers, and modular interactive dashboards inside our sandboxed environment.
                </p>
              </div>

              {/* The elegant query container input */}
              <div className="w-full max-w-3xl mt-10">
                <div className="bg-white border border-slate-200/70 rounded-[32px] p-4 shadow-xl shadow-slate-200/40 relative group focus-within:border-slate-300 transition-all duration-300">
                  
                  {/* Status upper indicator */}
                  <div className="flex items-center justify-between px-3 pb-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold border-b border-slate-50/80 mb-3">
                    <span>Target Workspace</span>
                    <span className="text-[#ff4a1c] font-bold lowercase">
                      {currentPromptLabel} layout
                    </span>
                  </div>

                  {/* Input textarea */}
                  <textarea
                    id="search-prompt-input"
                    rows={4}
                    value={activePrompt}
                    onChange={(e) => setActivePrompt(e.target.value)}
                    placeholder="Describe your target CRM, clinical roster scheduler, game vaults or inventory app..."
                    className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base leading-relaxed focus:outline-none resize-none px-3 font-normal"
                  />

                  {/* Lower action line */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100/80 mt-2 px-1">
                    
                    {/* Left Actions */}
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer">
                        <Plus className="w-4 h-4" />
                      </button>

                      {/* Custom Plan toggler check slider */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                        <button 
                          onClick={() => setPlanToggle(!planToggle)}
                          type="button"
                          className="relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                          style={{ backgroundColor: planToggle ? "#ff4d15" : "#cbd5e1" }}
                        >
                          <span
                            className="pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            style={{ transform: planToggle ? "translateX(14px)" : "translateX(0px)" }}
                          />
                        </button>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Verification Check Plan</span>
                        <div className="group/tooltip relative">
                          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900 text-white text-[9px] rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                            Ensures strict conformed DB and router alignments schemas
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right action controls */}
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
                        <Mic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => triggerCompilation()}
                        disabled={isCompiling || !activePrompt.trim()}
                        className="w-10 h-10 rounded-full bg-[#ff4d15] hover:bg-[#e13b10] disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-md shadow-orange-500/15 cursor-pointer active:scale-95 transition-all"
                      >
                        {isCompiling ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <ArrowUp className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Badges suggestion buttons */}
              <div className="w-full max-w-4xl text-center mt-9 space-y-3">
                <p className="text-[9px] tracking-widest text-[#ff4a1c] font-black uppercase leading-normal">
                  CHOOSE A DEVELOPMENT PRESET TEMPLATE:
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto px-4">
                  {SUGGESTION_BADGES.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleBadgeClick(b)}
                      className={`text-xs px-4 py-2 border shadow-sm font-semibold rounded-full cursor-pointer transition-all ${
                        currentPromptLabel === b.label
                          ? "bg-[#ff4d15] border-[#ff4d15] text-white"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Developer Workspace Link Quick Tip */}
              {project && (
                <div className="mt-12 bg-indigo-50/60 rounded-2xl border border-indigo-100 p-4 max-w-md w-full text-slate-700 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-800">Dynamic Sandbox Active</span>
                    <button 
                      onClick={() => setWorkspaceMode(true)}
                      className="text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer border-b border-indigo-250 pb-0.5"
                    >
                      Enter Developer Studio →
                    </button>
                  </div>
                  <p className="text-slate-500 mt-1 leading-normal text-left">
                    You have compiled an active build. Access the schema snapshot, interactive forms, and API controller router directly inside the developer workspace.
                  </p>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
