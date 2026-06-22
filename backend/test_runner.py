import os
import json
import time
from typing import List, Dict, Any
from backend.intent_extractor import IntentExtractor
from backend.system_designer import SystemDesigner
from backend.schema_generator import SchemaGenerator
from backend.validator import Validator
from backend.repair_engine import RepairEngine
from backend.runtime_generator import RuntimeGenerator

class TestRunner:
    def __init__(self):
        self.standard_prompts = [
            {"id": "std_1", "title": "CRM Platform", "prompt": "Build a CRM with login, contacts, dashboard, role-based access, payments and analytics."},
            {"id": "std_2", "title": "Hospital Management", "prompt": "Hospital clinical management tool with secure EHR chart logs, doctor appointment rotations, and invoicing workflows."},
            {"id": "std_3", "title": "School portal", "prompt": "K-12 grading database portal linking students to classrooms, grading entities, and report cards modules."},
            {"id": "std_4", "title": "Inventory Manager", "prompt": "Supply warehouse tracker tracking item barcodes, vendor channels, stocks safety alerts levels, and stock purchase workflows."},
            {"id": "std_5", "title": "HR Platform", "prompt": "Corporate Human Resources vault managing employee records, timesheet rosters, performance logs, and salary payments details."},
            {"id": "std_6", "title": "E-Commerce System", "prompt": "Multi-category storefront with cart tracking, checkout billing pipeline, secure guest logins, and invoice delivery."},
            {"id": "std_7", "title": "Real-Estate Portal", "prompt": "Residential listings grid index matching brokers to land owners with interactive meeting calendars, offers, and budgets."},
            {"id": "std_8", "title": "Fitness Tracker", "prompt": "Workout diary logging athletic runs, heart rate, daily calories deficit metrics, and physical fitness goals charts."},
            {"id": "std_9", "title": "Ticket Desk", "prompt": "B2B helpdesk support tracker capturing issues, routing to tiers with priority indicators, and SLA tracking timelines."},
            {"id": "std_10", "title": "Creative Design Studio", "prompt": "Creative design studio template Viktor Oddy with infinite marquee scrolls, quote slide components, and bottom navigation."}
        ]

        self.edge_cases = [
            {"id": "edge_1", "title": "Build something useful", "prompt": "Build something highly useful and productive layout."},
            {"id": "edge_2", "title": "Login without users", "prompt": "Secure SSO login interface but has zero table entries for actual user objects."},
            {"id": "edge_3", "title": "Payments without customers", "prompt": "Process automatic credit collections but database lacks clear customer profiles mapping."},
            {"id": "edge_4", "title": "Dashboard without data", "prompt": "Stunning executive reporting graphical dashboard, but underlying data feeds are completely unpopulated."},
            {"id": "edge_5", "title": "Grades without students", "prompt": "Report card calculator with course grades but no students or classes tables associated."},
            {"id": "edge_6", "title": "Blank Prompt", "prompt": "   "},
            {"id": "edge_7", "title": "Single Char", "prompt": "?"},
            {"id": "edge_8", "title": "Conflicts", "prompt": "Read-only application that must support full database modifications and admin deletions."},
            {"id": "edge_9", "title": "Extremely Long Prompt", "prompt": "Build an app featuring " + ("CRM system " * 40)},
            {"id": "edge_10", "title": "No Role Authorization", "prompt": "Complex banking ledger requiring safe logs but does not map any authorization roles or administrator models."}
        ]

    def run_all_tests(self) -> Dict[str, Any]:
        """
        Executes compilation pipeline across all standard and edge prompts, evaluating metrics.
        """
        results = []
        start_time = time.time()

        intent_ext = IntentExtractor()
        sys_des = SystemDesigner()
        schema_gen = SchemaGenerator()
        validator = Validator()
        repair = RepairEngine()
        runtime = RuntimeGenerator()

        all_cases = self.standard_prompts + self.edge_cases

        repair_counts = 0
        validation_failures_count = 0
        success_count = 0

        for case in all_cases:
            case_start = time.time()
            had_failures = False
            was_repaired = False
            error_cat = "none"

            try:
                # 1. Intent
                intent = intent_ext.extract_intent(case["prompt"])
                # 2. Design
                design = sys_des.design_system(intent)
                # 3. Schemas
                schemas = schema_gen.generate_schemas(design)
                # 4. Validate
                val_report = validator.validate_schemas(schemas)
                
                # Check metrics
                if not val_report["valid"]:
                    had_failures = True
                    validation_failures_count += 1
                    
                    # 5. Repair
                    repair_res = repair.repair_schemas(schemas, val_report)
                    schemas = repair_res["repaired_schemas"]
                    was_repaired = len(repair_res["repairs"]) > 0
                    if was_repaired:
                        repair_counts += 1
                    
                    # Re-validate
                    val_report = validator.validate_schemas(schemas)
                
                # 6. Runtime App configs
                if val_report["valid"] or was_repaired:
                    success_count += 1
                    runtime.generate_runtime(schemas, case["title"])

                latency = (time.time() - case_start) * 1000 # to MS
                results.append({
                    "id": case["id"],
                    "title": case["title"],
                    "status": "passed" if val_report["valid"] else "failed",
                    "latency_ms": int(latency),
                    "repair_applied": was_repaired,
                    "score": val_report["score"]
                })
            except Exception as e:
                latency = (time.time() - case_start) * 1000
                results.append({
                    "id": case["id"],
                    "title": case["title"],
                    "status": "failed",
                    "latency_ms": int(latency),
                    "repair_applied": False,
                    "error": str(e),
                    "score": 0
                })

        total_time = (time.time() - start_time) * 1000
        success_rate = round((success_count / len(all_cases)) * 100, 1) if all_cases else 100

        report = {
            "total_executed": len(all_cases),
            "success_rate": success_rate,
            "validation_failures": validation_failures_count,
            "repair_counts": repair_counts,
            "average_latency": int(total_time / len(all_cases)) if all_cases else 0,
            "results": results
        }

        # Save to disk
        with open("backend/test_report.json", "w") as f:
            json.dump(report, f, indent=2)

        return report
