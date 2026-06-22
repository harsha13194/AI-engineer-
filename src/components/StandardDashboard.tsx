import React, { useState, useEffect, FormEvent } from "react";
import { 
  Database, Play, Layers, Sparkles, Plus, Trash2, Code2, Cpu, 
  FileText, ArrowRight, HelpCircle, Users, CheckCircle2, Activity,
  Lock, Check, Trash
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Helper function to dynamically generate mock data based on custom database column definitions
function generateMockRows(tableName: string, columns: any[]): any[] {
  const rows = [];
  const names = ["Alexander Fleming", "Ada Lovelace", "Nikola Tesla", "Marie Curie", "Alan Turing", "Charles Babbage"];
  const emails = ["fleming@penicillin.org", "ada@analyticengine.net", "tesla@alternating.org", "marie@curie.fr", "turing@enigma.code", "babbage@difference.com"];
  const statusOptions = ["Active Partner", "Verification Cleared", "Pending Audit", "High-Priority Action", "Approved", "Pipeline Rerouted"];
  
  const textOptions: Record<string, string[]> = {
    title: ["Clinical Patient Intake", "Interactive Design Wireframe", "Payment Allocation Ledger", "Retro Sprite Animation", "Roster Assignment Shift"],
    description: ["Automated system compilation checking logs", "High-fidelity frontend project representations", "Structured patient historical references logs"],
    role: ["Administrator", "Clinic Lead Practitioner", "Creative Director", "Retro Game Mod", "Auditor"],
    tier: ["Premium Enterprise Gold Edition", "Standard Workspace Tier", "Corporate Sandbox core"],
    message: ["Submitting budget proposals for validation", "Reviewing background diagnostic records", "Timesheet times slot updates"]
  };

  const tableFactor = tableName.charCodeAt(0) + tableName.length;

  for (let i = 0; i < 3; i++) {
    const row: any = {};
    columns.forEach(col => {
      const colName = col.name.toLowerCase();
      
      if (colName === "id" || col.primary_key) {
        row[col.name] = i + 1;
      } else if (colName.includes("email")) {
        row[col.name] = emails[(i + tableFactor) % emails.length];
      } else if (colName.includes("name") || colName === "contact" || colName === "customer" || colName === "patient" || colName === "physician" || colName === "member") {
        row[col.name] = names[(i + tableFactor) % names.length];
      } else if (colName.includes("amount") || colName.includes("price") || colName.includes("val") || colName.includes("budget") || colName.includes("cost") || colName.includes("salary")) {
        row[col.name] = 850 * (i + 1) + 320;
      } else if (colName.includes("phone")) {
        row[col.name] = `+1 (555) 019-${8240 + i + tableFactor % 100}`;
      } else if (colName.includes("status")) {
        row[col.name] = statusOptions[(i + tableFactor) % statusOptions.length];
      } else if (colName.includes("role")) {
        row[col.name] = textOptions.role[(i + tableFactor) % textOptions.role.length];
      } else if (colName.includes("tier")) {
        row[col.name] = textOptions.tier[(i + tableFactor) % textOptions.tier.length];
      } else if (colName.includes("title")) {
        row[col.name] = textOptions.title[(i + tableFactor) % textOptions.title.length];
      } else if (colName.includes("desc")) {
        row[col.name] = textOptions.description[(i + tableFactor) % textOptions.description.length];
      } else if (colName.includes("msg") || colName.includes("message")) {
        row[col.name] = textOptions.message[(i + tableFactor) % textOptions.message.length];
      } else {
        if (col.type === "INTEGER" || col.type === "NUMBER" || col.type === "NUMERIC") {
          row[col.name] = 12 * (i + 1) + 8;
        } else if (col.type === "BOOLEAN") {
          row[col.name] = (i + tableFactor) % 2 === 0;
        } else {
          row[col.name] = `${tableName}_val_${i + 1}`;
        }
      }
    });
    rows.push(row);
  }
  return rows;
}

export default function StandardDashboard({ project }: { project: any }) {
  const appName = project?.runtime_config?.app_name || "Compiled Application Suite";
  
  // Extract database schema definitions
  const tables = project?.schemas?.database?.tables || [
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
  ];

  const endpoints = project?.schemas?.api?.endpoints || [
    { path: "/api/contacts", method: "GET", description: "Fetch all registered customers in the database" },
    { path: "/api/contacts", method: "POST", description: "Register a brand new custom database entity" }
  ];

  // In-memory relational database state tracking
  const [dbState, setDbState] = useState<Record<string, any[]>>({});
  const [activeTab, setActiveTab] = useState<string>(tables[0] ? `table_${tables[0].name}` : "dev_api");
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // Endpoint simulation output
  const [activeEndpointPath, setActiveEndpointPath] = useState<string>(endpoints[0]?.path || "");
  const [endpointMethod, setEndpointMethod] = useState<string>(endpoints[0]?.method || "GET");
  const [apiConsoleLogs, setApiConsoleLogs] = useState<string[]>([]);
  const [apiRequestBody, setApiRequestBody] = useState<string>("{}");
  const [apiResponsePayload, setApiResponsePayload] = useState<any>(null);

  // Re-generate in-memory database whenever a new compile triggers
  useEffect(() => {
    const initialState: Record<string, any[]> = {};
    tables.forEach((tbl: any) => {
      initialState[tbl.name] = generateMockRows(tbl.name, tbl.columns);
    });
    setDbState(initialState);
    if (tables.length > 0) {
      setActiveTab(`table_${tables[0].name}`);
    } else {
      setActiveTab("dev_api");
    }
    setApiConsoleLogs([`[System] Mock gateway router client initiated.`, `[System] Interactive sandbox databases conformed.`]);
    setApiResponsePayload(null);
  }, [project]);

  // Clean form variables when active table tab changes
  useEffect(() => {
    setFormData({});
  }, [activeTab]);

  // Handle creating real runtime entries dynamically in whichever table is active!
  const handleSubmitDynamicForm = (e: FormEvent, tableName: string, cols: any[]) => {
    e.preventDefault();
    const currentRows = dbState[tableName] || [];
    
    // Auto-calculate primary key ID increment
    const findIdCol = cols.find(c => c.primary_key || c.name.toLowerCase() === "id") || cols[0];
    let nextId = 1;
    if (findIdCol) {
      const ids = currentRows.map(r => Number(r[findIdCol.name])).filter(n => !isNaN(n));
      nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    const newRecord: Record<string, any> = {};
    cols.forEach(col => {
      if (col.primary_key || col.name.toLowerCase() === "id") {
        newRecord[col.name] = nextId;
      } else {
        const val = formData[col.name];
        if (col.type === "INTEGER" || col.type === "NUMBER" || col.type === "NUMERIC") {
          newRecord[col.name] = val ? parseFloat(val) : 0;
        } else if (col.type === "BOOLEAN") {
          newRecord[col.name] = val === "true";
        } else {
          newRecord[col.name] = val || `custom_${col.name}`;
        }
      }
    });

    setDbState({
      ...dbState,
      [tableName]: [newRecord, ...currentRows]
    });

    // Reset inputs
    setFormData({});
  };

  const handleDeleteRecord = (tableName: string, idVal: any, idKey: string) => {
    const currentRows = dbState[tableName] || [];
    const filtered = currentRows.filter(r => r[idKey] !== idVal);
    setDbState({
      ...dbState,
      [tableName]: filtered
    });
  };

  // Simulating API HTTP Calls on-the-fly dynamically
  const triggerEndpointPlayground = () => {
    const targetEp = endpoints.find((ep: any) => ep.path === activeEndpointPath && ep.method === endpointMethod) || endpoints[0];
    if (!targetEp) return;

    const nowStr = new Date().toLocaleTimeString();
    const newLogs = [...apiConsoleLogs, `[${nowStr}] INCOMING ${endpointMethod} ${activeEndpointPath}`];
    
    // Simulate retrieval or mutation
    let resData: any = {};
    const relevantTableName = tables.find((t: any) => activeEndpointPath.toLowerCase().includes(t.name.toLowerCase()))?.name || tables[0]?.name;
    const activeTableRows = dbState[relevantTableName] || [];

    if (endpointMethod === "GET") {
      resData = {
        success: true,
        entity: relevantTableName,
        count: activeTableRows.length,
        results: activeTableRows,
        timestamp: Date.now()
      };
      newLogs.push(`[${nowStr}] RESPONSE 200 OK - Sent ${activeTableRows.length} collection rows from active heap.`);
    } else {
      // POST simulate
      try {
        const parsedBody = JSON.parse(apiRequestBody || "{}");
        const nextIdVal = activeTableRows.length + 1;
        const mockNewRow = { id: nextIdVal, ...parsedBody };
        
        // Append to state dynamically
        setDbState(prev => ({
          ...prev,
          [relevantTableName]: [mockNewRow, ...(prev[relevantTableName] || [])]
        }));

        resData = {
          success: true,
          action_committed: "insert_table_row",
          target_entity: relevantTableName,
          assigned_id: nextIdVal,
          payload_conformed: mockNewRow
        };
        newLogs.push(`[${nowStr}] RESPONSE 201 CREATED - Aligned transactional parameters successfully added.`);
      } catch (err: any) {
        resData = {
          error: "INVALID_JSON_PAYLOAD",
          message: err.message
        };
        newLogs.push(`[${nowStr}] RESPONSE 400 BAD REQUEST - Malformed serialization parameters.`);
      }
    }

    setApiConsoleLogs(newLogs);
    setApiResponsePayload(resData);
  };

  const handleSelectEndpoint = (pathStr: string, methodStr: string) => {
    setActiveEndpointPath(pathStr);
    setEndpointMethod(methodStr);
    const targetEp = endpoints.find((ep: any) => ep.path === pathStr && ep.method === methodStr);
    if (targetEp && methodStr === "POST") {
      const template: Record<string, any> = {};
      const relevantTableName = tables.find((t: any) => pathStr.toLowerCase().includes(t.name.toLowerCase()))?.name || tables[0]?.name;
      const columns = tables.find((t: any) => t.name === relevantTableName)?.columns || [];
      columns.forEach((c: any) => {
        if (!c.primary_key && c.name.toLowerCase() !== "id") {
          template[c.name] = c.type === "INTEGER" || c.type === "NUMBER" ? 100 : c.type === "BOOLEAN" ? true : `Mock_${c.name}`;
        }
      });
      setApiRequestBody(JSON.stringify(template, null, 2));
    } else {
      setApiRequestBody("{}");
    }
  };

  // Find any numeric column across tables to plot a Recharts visualization
  let chartTable = tables[0];
  let chartCol = "";
  tables.forEach((t: any) => {
    t.columns.forEach((c: any) => {
      const cName = c.name.toLowerCase();
      if ((c.type === "INTEGER" || c.type === "NUMBER" || c.type === "NUMERIC") && 
          !c.primary_key && cName !== "id" && !cName.includes("id")) {
        chartTable = t;
        chartCol = c.name;
      }
    });
  });

  const chartRows = dbState[chartTable?.name] || [];
  // Build clean chart data mapping row index or names
  const visualChartData = chartRows.map((r: any, idx: number) => {
    let label = `Row #${idx + 1}`;
    const nameKey = Object.keys(r).find(k => k.toLowerCase().includes("name") || k.toLowerCase().includes("title") || k.toLowerCase().includes("label"));
    if (nameKey && r[nameKey]) {
      label = String(r[nameKey]).split(" ")[0]; // First name
    }
    return {
      name: label,
      [chartCol || "Valuation Indicator"]: r[chartCol] || (idx * 15 + 40)
    };
  });

  return (
    <div className="bg-[#f8fafd] min-h-[550px] text-slate-800 flex flex-col md:flex-row select-none">
      
      {/* Sandbox Left Sidebar - Custom Navigations */}
      <div className="w-full md:w-56 bg-[#0c1424] text-slate-300 p-4 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 font-sans">
        <div>
          {/* Header block with visual app category symbol */}
          <div className="flex items-center gap-2 pb-5 border-b border-slate-800/60 mb-5">
            <div className="bg-gradient-to-tr from-[#ff4d15] to-orange-400 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md">
              {appName[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="text-white text-xs font-bold truncate leading-tight">{appName}</h4>
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block">SANDBOX RUNTIME</span>
            </div>
          </div>

          <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2.5 px-1.5">App View Views</p>
          <nav className="space-y-1.5">
            {/* Dynamic tabs generated from the SQL schemas! */}
            {tables.map((t: any) => (
              <button
                key={t.name}
                onClick={() => setActiveTab(`table_${t.name}`)}
                className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-2 transition-all truncate ${
                  activeTab === `table_${t.name}`
                    ? "bg-[#ff4a1c]/20 border border-[#ff4a1c]/30 text-white font-extrabold"
                    : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                📁 {t.name} Ledger
              </button>
            ))}
          </nav>
        </div>

      </div>

      {/* Main Panel content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Horizontal Mini Address Bar */}
        <header className="h-11 border-b border-slate-200/60 bg-white px-5 flex items-center justify-between shadow-sm">
          <div className="font-bold text-slate-500 uppercase tracking-widest text-[9px] flex items-center gap-2">
            <span>Compiled view:</span>
            <span className="text-slate-800 font-mono italic uppercase">
              {activeTab === "dashboard" && "App Performance & Summary Portal"}
              {activeTab.startsWith("table_") && `${activeTab.replace("table_", "")} entity records form & grid`}
              {activeTab === "dev_api" && "Proxy endpoint controller execution"}
              {activeTab === "dev_db" && "Relational schema blueprints checks"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 font-sans">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>ONLINE</span>
          </div>
        </header>

        {/* Content Box */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[580px] text-left">
          
          {/* Dynamic Table Tabs detailing forms and listed entries */}
          {tables.map((t: any) => {
            if (activeTab !== `table_${t.name}`) return null;
            const rows = dbState[t.name] || [];
            
            // Exclude key ID from inputs
            const inputColumns = t.columns.filter((c: any) => !c.primary_key && c.name.toLowerCase() !== "id");
            const findIdCol = t.columns.find((c: any) => c.primary_key || c.name.toLowerCase() === "id") || t.columns[0];

            return (
              <div key={t.name} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Dynamic Submission Form for this Table */}
                  <div className="bg-white rounded-3xl border border-slate-200/50 p-5 shadow-sm space-y-4 md:col-span-1">
                    <div className="border-b pb-2.5">
                      <h4 className="text-xs font-bold text-[#ff4a1c] uppercase tracking-widest flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Append Row
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Conforms directly to table values types</p>
                    </div>

                    <form onSubmit={(e) => handleSubmitDynamicForm(e, t.name, t.columns)} className="space-y-3.5">
                      {inputColumns.map((col: any) => (
                        <div key={col.name}>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            {col.name} {col.nullable ? "(Optional)" : "*"}
                          </label>
                          {col.type === "BOOLEAN" ? (
                            <select
                              required={!col.nullable}
                              value={formData[col.name] || ""}
                              onChange={(e) => setFormData({ ...formData, [col.name]: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#ff4a1c]"
                            >
                              <option value="">Select true/false</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          ) : (
                            <input
                              type={col.type === "INTEGER" || col.type === "NUMBER" || col.type === "NUMERIC" ? "number" : "text"}
                              placeholder={col.type === "INTEGER" || col.type === "NUMBER" ? "e.g. 150" : `e.g. valid ${col.name}`}
                              required={!col.nullable}
                              value={formData[col.name] || ""}
                              onChange={(e) => setFormData({ ...formData, [col.name]: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#ff4a1c] font-medium"
                            />
                          )}
                        </div>
                      ))}

                      <button 
                        type="submit" 
                        className="w-full bg-[#ff4a1c] hover:bg-[#e13b10] text-white rounded-xl py-2 font-bold text-xs shadow-md shadow-orange-500/10 cursor-pointer transition-colors mt-2"
                      >
                        Commit Row record
                      </button>
                    </form>
                  </div>

                  {/* Dynamic Database Grid view */}
                  <div className="bg-white rounded-3xl border border-slate-200/50 p-5 shadow-sm md:col-span-2 overflow-hidden">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-3.5 mb-3.5">
                      Persistent Row Data Ledger: '{t.name}' list
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[9px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                            {t.columns.map((col: any) => (
                              <th key={col.name} className="pb-2.5 pr-2">{col.name}</th>
                            ))}
                            <th className="pb-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-slate-55 text-slate-600">
                          {rows.map((rowVal: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                              {t.columns.map((col: any) => {
                                const valString = rowVal[col.name] === undefined ? "null" : String(rowVal[col.name]);
                                return (
                                  <td key={col.name} className={`py-3 pr-2 text-wrap truncate max-w-[120px] ${
                                    col.primary_key || col.name.toLowerCase() === "id" 
                                      ? "font-mono text-slate-400 font-bold" 
                                      : col.type === "INTEGER" || col.type === "NUMBER" 
                                        ? "font-bold text-slate-800"
                                        : "text-slate-600"
                                  }`}>
                                    {valString}
                                  </td>
                                );
                              })}
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleDeleteRecord(t.name, rowVal[findIdCol.name], findIdCol.name)}
                                  className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {rows.length === 0 && (
                            <tr>
                              <td colSpan={t.columns.length + 1} className="py-6 text-center text-slate-400 italic">
                                No records committed yet. Use the sidebar append form.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}

          {/* Dev API tab */}
          {activeTab === "dev_api" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-left">
              
              {/* Endpoints triggers list */}
              <div className="bg-white rounded-3xl border border-slate-205 shadow-sm p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-3 flex items-center gap-1">
                  <Lock className="w-4 h-4 text-indigo-400" /> Gateway REST Endpoint mappings
                </h4>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {endpoints.map((ep: any, idx: number) => {
                    const isSelected = activeEndpointPath === ep.path && endpointMethod === ep.method;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectEndpoint(ep.path, ep.method)}
                        className={`w-full p-3 rounded-2xl border text-left flex justify-between items-start cursor-pointer transition-all ${
                          isSelected 
                            ? "bg-indigo-50/75 border-indigo-400 shadow-sm" 
                            : "bg-slate-50 hover:bg-slate-100/60 border-slate-200/50"
                        }`}
                      >
                        <div className="space-y-1 min-w-0 pr-2">
                          <code className="font-bold text-slate-800 text-[11px] font-mono block truncate">{ep.path}</code>
                          <p className="text-[10px] text-slate-500 leading-tight block">{ep.description}</p>
                          {ep.required_role && (
                            <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                              Auth: {ep.required_role}
                            </span>
                          )}
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono shrink-0 ${
                          ep.method === "GET" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-850"
                        }`}>
                          {ep.method}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Console Trigger block */}
              <div className="bg-[#090d16] rounded-3xl p-5 shadow-2xl flex flex-col justify-between text-indigo-100 font-mono space-y-4">
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-sans">
                      REST Console Launcher
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase font-sans">
                      interactive parameters
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div>Target Method: <span className="text-orange-400 font-bold">{endpointMethod}</span></div>
                    <div>Target Path: <span className="text-emerald-450 font-bold font-mono">{activeEndpointPath}</span></div>
                  </div>

                  {endpointMethod === "POST" ? (
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-sans block">Request HTTP JSON Body:</span>
                      <textarea
                        value={apiRequestBody}
                        onChange={(e) => setApiRequestBody(e.target.value)}
                        rows={5}
                        className="w-full bg-black/60 border border-slate-800 text-[#cae2ff] p-3 rounded-2xl text-[10px] focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-black/30 rounded-2xl border border-slate-800/40 text-[10px] text-slate-400">
                      GET requests do not support payload bodies on simple mock routers.
                    </div>
                  )}

                  <button
                    onClick={triggerEndpointPlayground}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2 font-bold font-sans text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" /> Execute Trigger request
                  </button>
                </div>

                {/* Console Outputs logs */}
                <div className="space-y-2">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider font-sans block">
                    Gateway Proxy Console Response Logs:
                  </span>
                  
                  {/* JSON Response display */}
                  <div className="bg-black/50 p-3 rounded-2xl border border-slate-850 h-36 overflow-y-auto text-[10px] text-emerald-400 space-y-1.5 leading-relaxed">
                    {apiResponsePayload ? (
                      <pre className="text-emerald-400 pr-1">{JSON.stringify(apiResponsePayload, null, 2)}</pre>
                    ) : (
                      <div className="text-slate-500 italic py-4 text-center select-none font-sans">
                        No responses registered. Click "Execute" to run transaction simulation.
                      </div>
                    )}
                  </div>

                  {/* Micro list of log messages */}
                  <div className="text-[9px] text-slate-400 space-y-0.5 border-t border-slate-800/50 pt-1.5 max-h-16 overflow-y-auto font-sans">
                    {apiConsoleLogs.slice(-3).map((l, idx) => (
                      <div key={idx} className="truncate">{l}</div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Dev DB Snapshots tab */}
          {activeTab === "dev_db" && (
            <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-5 space-y-4 text-left">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Relational SQL Database schemas blueprint
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  The compiled database schemas mapped below represent the relational storage model persistent tables. Unique serial key columns and foreign references key couplings prevent misalignment with gateway forms inputs.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {tables.map((tbl: any, idx: number) => (
                  <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                    <div className="bg-slate-50 px-4 py-2 border-b border-indigo-50 font-bold text-slate-800 font-mono">
                      📄 TABLE: {tbl.name}
                    </div>
                    <div className="p-4 space-y-1 divide-y divide-slate-100/50">
                      {tbl.columns?.map((col: any, cIdx: number) => (
                        <div key={cIdx} className="flex justify-between font-mono text-[11px] text-slate-600 py-2.5">
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            {col.name} {col.primary_key && <span className="bg-amber-100 border border-amber-200 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded font-sans scale-90">PRIMARY KEY 🔑</span>}
                          </span>
                          <span className="text-slate-400 scale-95 origin-right">
                            {col.type} {col.nullable ? "(nullable)" : "(required)"}
                            {col.references_table && ` ➡️ Mapped To references: ${col.references_table}.id`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
