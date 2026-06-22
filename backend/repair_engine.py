import os
import copy
from typing import Dict, Any, List

class RepairEngine:
    def repair_schemas(self, schemas: Dict[str, Any], validation_report: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes validation failures and performs surgical corrections to ensure schema integrity.
        """
        repaired_schemas = copy.deepcopy(schemas)
        repairs = []
        
        errors = validation_report.get("errors", [])
        
        # Keep an index of existing db columns
        db_tables = repaired_schemas.setdefault("database", {}).setdefault("tables", [])
        table_names = [t.get("name") for t in db_tables]
        
        for error in errors:
            rule_id = error.get("ruleId")
            
            # Strategy 1: Repair RULE_1_UI_FIELD_INTEGRITY
            if rule_id == "RULE_1_UI_FIELD_INTEGRITY":
                # Find the field mentioned in error summary
                msg = error.get("message", "")
                field_name = ""
                # Try to extract 'field' format
                if "field '" in msg:
                    field_name = msg.split("field '")[1].split("'")[0]
                
                if field_name:
                    # Inject missing database column to the primary table (usually the second table or the singular form of it)
                    target_table = db_tables[1] if len(db_tables) > 1 else (db_tables[0] if db_tables else None)
                    if target_table:
                        # Append the column 
                        cols = target_table.setdefault("columns", [])
                        if not any(c.get("name") == field_name for c in cols):
                            cols.append({
                                "name": field_name,
                                "type": "STRING",
                                "primary_key": False,
                                "nullable": True
                            })
                            repairs.append({
                                "ruleId": rule_id,
                                "error_message": msg,
                                "action_taken": f"Appended missing column '{field_name}' to database table '{target_table.get('name')}' to resolve UI mismatch.",
                                "section": "database",
                                "success": True
                            })

            # Strategy 2: Repair RULE_2_API_FIELD_INTEGRITY
            elif rule_id == "RULE_2_API_FIELD_INTEGRITY":
                msg = error.get("message", "")
                field_name = ""
                if "key '" in msg:
                    field_name = msg.split("key '")[1].split("'")[0]
                
                if field_name:
                    # Align API key fields back to DB tables
                    target_table = db_tables[1] if len(db_tables) > 1 else (db_tables[0] if db_tables else None)
                    if target_table:
                        cols = target_table.setdefault("columns", [])
                        if not any(c.get("name") == field_name for c in cols):
                            cols.append({
                                "name": field_name,
                                "type": "STRING",
                                "primary_key": False,
                                "nullable": True
                            })
                            repairs.append({
                                "ruleId": rule_id,
                                "error_message": msg,
                                "action_taken": f"Mapped API parameter '{field_name}' down into database schema column for table '{target_table.get('name')}' model matching.",
                                "section": "database",
                                "success": True
                            })

            # Strategy 3: Repair RULE_3_ROLE_PERMISSIONS
            elif rule_id == "RULE_3_ROLE_PERMISSIONS":
                msg = error.get("message", "")
                role_name = ""
                if "Role '" in msg:
                    role_name = msg.split("Role '")[1].split("'")[0]
                
                if role_name:
                    auth_perms = repaired_schemas.setdefault("auth", {}).setdefault("permissions", {})
                    auth_perms[role_name] = ["read:own", "write:own"]
                    repairs.append({
                        "ruleId": rule_id,
                        "error_message": msg,
                        "action_taken": f"Auto-bootstrapped target role permissions and scopes for '{role_name}' as basic read:own/write:own fallback credentials policy.",
                        "section": "auth",
                        "success": True
                    })

            # Strategy 4: Repair RULE_7_ORPHAN_ENDPOINT_ROLE
            elif rule_id == "RULE_7_ORPHAN_ENDPOINT_ROLE":
                msg = error.get("message", "")
                role_name = ""
                if "role '" in msg:
                    role_name = msg.split("role '")[1].split("'")[0]
                
                if role_name:
                    roles_list = repaired_schemas.setdefault("auth", {}).setdefault("roles", [])
                    if role_name not in roles_list:
                        roles_list.append(role_name)
                    
                    auth_perms = repaired_schemas.setdefault("auth", {}).setdefault("permissions", {})
                    auth_perms[role_name] = ["execute:api"]
                    
                    repairs.append({
                        "ruleId": rule_id,
                        "error_message": msg,
                        "action_taken": f"Created user role definition entry '{role_name}' to eliminate dangling/orphan API endpoint locks.",
                        "section": "auth",
                        "success": True
                    })

        return {
            "repaired_schemas": repaired_schemas,
            "repairs": repairs
        }
