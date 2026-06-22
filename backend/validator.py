import os
from typing import Dict, Any, List

class Validator:
    def validate_schemas(self, schemas: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates cross-schema consistency across DB, API, UI, and Auth schemas based on rules.
        """
        errors = []
        
        db_schema = schemas.get("database", {})
        api_schema = schemas.get("api", {})
        ui_schema = schemas.get("ui", {})
        auth_schema = schemas.get("auth", {})
        
        tables = db_schema.get("tables", [])
        endpoints = api_schema.get("endpoints", [])
        pages = ui_schema.get("pages", [])
        roles = auth_schema.get("roles", [])
        permissions = auth_schema.get("permissions", {})

        # Rule 1: Every UI page must have components referencing valid tables/endpoints
        # Rule 4: Every page must have a route
        for page in pages:
            page_name = page.get("name", "Unnamed")
            route = page.get("route", "")
            if not route:
                errors.append({
                    "ruleId": "RULE_4_PAGE_ROUTE",
                    "category": "consistency",
                    "severity": "critical",
                    "message": f"Page '{page_name}' is missing a valid browser route template."
                })
            
            # Check fields referenced in page components
            components = page.get("components", [])
            for comp in components:
                fields = comp.get("fields_referenced", [])
                for field in fields:
                    # Verify field exists in database columns or API bodies
                    field_exists = False
                    for table in tables:
                        for col in table.get("columns", []):
                            if col.get("name") == field:
                                field_exists = True
                                break
                    
                    for endpoint in endpoints:
                        req_body = endpoint.get("request_body", {}) or {}
                        resp_body = endpoint.get("response_body", {}) or {}
                        if field in req_body or field in resp_body:
                            field_exists = True
                            break
                            
                    if not field_exists:
                        errors.append({
                            "ruleId": "RULE_1_UI_FIELD_INTEGRITY",
                            "category": "missing_ref",
                            "severity": "warning",
                            "message": f"Component field '{field}' in page '{page_name}' does not map to any database table column or API parameter."
                        })

        # Rule 2: Every API body field should theoretically log to a database column (to prevent inconsistencies)
        db_columns = set()
        for table in tables:
            for col in table.get("columns", []):
                db_columns.add(col.get("name"))

        for endpoint in endpoints:
            path = endpoint.get("path", "")
            req_body = endpoint.get("request_body", {}) or {}
            for field in req_body.keys():
                # Allow standard auth credentials but warn of database mismatches
                if field not in db_columns and field not in ["password", "token", "role"]:
                    errors.append({
                        "ruleId": "RULE_2_API_FIELD_INTEGRITY",
                        "category": "consistency",
                        "severity": "warning",
                        "message": f"API request body key '{field}' in '{path}' does not map to any column in the database."
                    })

        # Rule 3: Every role must have permission policies declared
        for role in roles:
            if role not in permissions or not permissions.get(role):
                errors.append({
                    "ruleId": "RULE_3_ROLE_PERMISSIONS",
                    "category": "auth",
                    "severity": "critical",
                    "message": f"Role '{role}' is defined but has no permission scopes mapped under auth schema."
                })

        # Rule 5: No duplicate entities/tables
        table_names = [t.get("name") for t in tables]
        if len(table_names) != len(set(table_names)):
            errors.append({
                "ruleId": "RULE_5_DUPLICATE_TABLES",
                "category": "duplicate",
                "severity": "critical",
                "message": "Duplicate database tables were located in the current database definition schema."
            })

        # Rule 6: Relationships must match valid entities / references
        for table in tables:
            for col in table.get("columns", []):
                ref_table = col.get("references_table")
                if ref_table and ref_table not in table_names:
                    errors.append({
                        "ruleId": "RULE_6_RELATIONSHIP_VALIDITY",
                        "category": "missing_ref",
                        "severity": "critical",
                        "message": f"Table '{table.get('name')}' column '{col.get('name')}' references a non-existent table '{ref_table}'."
                    })

        # Rule 7: Orphan endpoints detection
        # Endpoints must have roles mapping or page correlation
        for endpoint in endpoints:
            req_role = endpoint.get("required_role")
            if req_role and req_role not in roles:
                errors.append({
                    "ruleId": "RULE_7_ORPHAN_ENDPOINT_ROLE",
                    "category": "auth",
                    "severity": "critical",
                    "message": f"API endpoint '{endpoint.get('path')}' requires role '{req_role}', which is not mapped in the roles list."
                })

        # Calculations
        failures_count = len(errors)
        critical_failures = sum(1 for e in errors if e["severity"] == "critical")
        score = max(0, 100 - (critical_failures * 15) - (failures_count * 5))

        return {
            "valid": len(errors) == 0,
            "score": score,
            "errors": errors
        }
