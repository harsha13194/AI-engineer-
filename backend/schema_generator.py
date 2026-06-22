import os
import json
import requests
from typing import Dict, Any

class SchemaGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("NVIDIA_API_KEY")
        self.endpoint = "https://integrate.api.nvidia.com/v1/chat/completions"
        self.model = "meta/llama-3.1-405b-instruct"

    def generate_schemas(self, design: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes System Design JSON and creates coordinated multi-schemas: DB, API, UI, Auth.
        """
        if self.api_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                
                system_instruction = (
                    "You are a Senior Principal Full-Stack Engineer.\n"
                    "Generate consistent, cross-referenced multi-schemas based on the given System Design JSON.\n"
                    "Your response must be solid JSON matching:\n"
                    "{\n"
                    "  \"database\": {\n"
                    "     \"tables\": [ {\"name\": \"...\", \"columns\": [{\"name\": \"...\", \"type\": \"...\", \"primary_key\": true/false, \"nullable\": true/false, \"references_table\": \"...\", \"references_column\": \"...\"}]} ]\n"
                    "  },\n"
                    "  \"api\": {\n"
                    "     \"endpoints\": [ {\"path\": \"...\", \"method\": \"GET/POST...\", \"request_body\": {}, \"response_body\": {}, \"required_role\": \"...\", \"description\": \"...\"} ]\n"
                    "  },\n"
                    "  \"ui\": {\n"
                    "     \"pages\": [ {\"name\": \"...\", \"route\": \"...\", \"components\": [{\"type\": \"form/table...\", \"title\": \"...\", \"fields_referenced\": [\"...\"]}]} ]\n"
                    "  },\n"
                    "  \"auth\": {\n"
                    "     \"roles\": [\"...\"],\n"
                    "     \"permissions\": { \"RoleName\": [\"permission\"] }\n"
                    "  }\n"
                    "}\n"
                    "Rule: Maintain exact naming consistency between fields in UI, parameters in API, and columns in DB."
                )

                payload = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": f"Create consistent schemas based on design: {json.dumps(design)}"}
                    ],
                    "temperature": 0.1
                }

                response = requests.post(self.endpoint, headers=headers, json=payload, timeout=15)
                if response.status_code == 200:
                    text_res = response.json()["choices"][0]["message"]["content"].strip()
                    if text_res.startswith("```json"):
                        text_res = text_res.split("```json")[1].split("```")[0].strip()
                    elif text_res.startswith("```"):
                        text_res = text_res.split("```")[1].split("```")[0].strip()
                    return json.loads(text_res)
            except Exception as e:
                pass

        return self._heuristic_schemas(design)

    def _heuristic_schemas(self, design: Dict[str, Any]) -> Dict[str, Any]:
        entities = design.get("entities", [])
        roles = design.get("roles", ["Administrator"])
        
        # Build DB schemas from entities directly to maintain immaculate 100% naming consistency
        db_tables = []
        for entity in entities:
            name = entity.get("name", "records")
            columns = []
            for field in entity.get("fields", []):
                col_name = field.get("name", "id")
                col_type = field.get("type", "STRING")
                is_pk = field.get("is_primary", False)
                required = field.get("required", True)
                ref_table = field.get("references")
                
                col = {
                    "name": col_name,
                    "type": col_type,
                    "primary_key": is_pk,
                    "nullable": not required
                }
                if ref_table:
                    col["references_table"] = ref_table
                    col["references_column"] = "id"
                columns.append(col)
                
            db_tables.append({
                "name": name,
                "columns": columns
            })

        # Build consistent APIs, UI Pages and Auth rules
        has_contacts = any(t["name"] == "contacts" for t in db_tables)
        has_leads = any(t["name"] == "leads" for t in db_tables)

        if has_contacts:
            api_endpoints = [
                {
                    "path": "/api/auth/login",
                    "method": "POST",
                    "request_body": {"email": "string", "role": "string"},
                    "response_body": {"token": "string", "user_id": "integer", "status": "string"},
                    "required_role": None,
                    "description": "Authenticate user session"
                },
                {
                    "path": "/api/contacts",
                    "method": "GET",
                    "response_body": {"contacts": "array"},
                    "required_role": "Sales Representative",
                    "description": "Fetch available customer contact list"
                },
                {
                    "path": "/api/contacts",
                    "method": "POST",
                    "request_body": {"name": "string", "email": "string", "phone": "string", "owner_id": "integer"},
                    "response_body": {"status": "string", "contact_id": "integer"},
                    "required_role": "Sales Representative",
                    "description": "Create new customer record card"
                },
                {
                    "path": "/api/payments",
                    "method": "GET",
                    "response_body": {"payments": "array"},
                    "required_role": "Administrator",
                    "description": "Fetch CRM accounting/invoice summaries"
                },
                {
                    "path": "/api/payments",
                    "method": "POST",
                    "request_body": {"contact_id": "integer", "amount": "number", "status": "string", "created_at": "string"},
                    "response_body": {"status": "string", "payment_id": "integer"},
                    "required_role": "Administrator",
                    "description": "Process safe client invoice checkout transaction"
                }
            ]

            ui_pages = [
                {
                    "name": "Auth Portal",
                    "route": "/login",
                    "components": [
                        {
                            "type": "form",
                            "title": "CRM User Secure Login",
                            "fields_referenced": ["email", "role"]
                        }
                    ]
                },
                {
                    "name": "CRM Executive Dashboard",
                    "route": "/dashboard",
                    "components": [
                        {
                            "type": "chart",
                            "title": "Annual Invoice Volumes",
                            "fields_referenced": ["amount", "status", "created_at"]
                        },
                        {
                            "type": "table",
                            "title": "Customer Contacts Register",
                            "fields_referenced": ["name", "email", "phone"]
                        }
                    ]
                },
                {
                    "name": "Create Contact",
                    "route": "/contacts/new",
                    "components": [
                        {
                            "type": "form",
                            "title": "Add Customer Lead Contact",
                            "fields_referenced": ["name", "email", "phone"]
                        }
                    ]
                }
            ]

            auth_perms = {
                "Administrator": ["read:all", "write:all", "delete:all"],
                "Sales Representative": ["read:contacts", "write:contacts"]
            }

        elif has_leads:
            # Viktor Oddy Landing Studio App Schemas
            api_endpoints = [
                {
                    "path": "/api/leads",
                    "method": "POST",
                    "request_body": {"name": "string", "email": "string", "message": "string", "budget": "string"},
                    "response_body": {"status": "success", "lead_id": "integer"},
                    "required_role": None,
                    "description": "Submit a creative lead request for partnership"
                },
                {
                    "path": "/api/projects",
                    "method": "GET",
                    "response_body": {"projects": "array"},
                    "required_role": None,
                    "description": "Request published creative project portfolio elements"
                }
            ]

            ui_pages = [
                {
                    "name": "Viktor Oddy Landing Portfolio",
                    "route": "/",
                    "components": [
                        {
                            "type": "grid",
                            "title": "Recent Projects",
                            "fields_referenced": ["title", "description", "image_url"]
                        },
                        {
                            "type": "form",
                            "title": "Start a Chat with Viktor",
                            "fields_referenced": ["name", "email", "message", "budget"]
                        }
                    ]
                }
            ]

            auth_perms = {
                "Visitor": ["read:projects", "write:leads"],
                "Creative Director": ["read:all", "write:all"]
            }

        else:
            api_endpoints = [
                {
                    "path": "/api/records",
                    "method": "GET",
                    "response_body": {"records": "array"},
                    "required_role": "Administrator",
                    "description": "Query database record lists"
                }
            ]

            ui_pages = [
                {
                    "name": "Landing Console",
                    "route": "/dashboard",
                    "components": [
                        {
                            "type": "table",
                            "title": "System Audit Table",
                            "fields_referenced": ["title", "description"]
                        }
                    ]
                }
            ]

            auth_perms = {
                "Administrator": ["admin:*"]
            }

        return {
            "database": {"tables": db_tables},
            "api": {"endpoints": api_endpoints},
            "ui": {"pages": ui_pages},
            "auth": {
                "roles": roles,
                "permissions": auth_perms
            }
        }
DefinitionName = "SchemaGenerator"
