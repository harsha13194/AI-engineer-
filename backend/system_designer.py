import os
import json
import requests
from typing import Dict, Any, List

class SystemDesigner:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("NVIDIA_API_KEY")
        self.endpoint = "https://integrate.api.nvidia.com/v1/chat/completions"
        self.model = "meta/llama-3.1-405b-instruct"

    def design_system(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes Intent JSON and outputs systemic architectural design: entities, relationships, permissions, flows.
        """
        if self.api_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                
                system_instruction = (
                    "You are a Senior AI Systems Design Architect.\n"
                    "Convert the provided Intent Extraction JSON into a complete system design.\n"
                    "Return a JSON object matching:\n"
                    "{\n"
                    "  \"entities\": [ {\"name\": \"...\", \"fields\": [{\"name\": \"...\", \"type\": \"...\", \"required\": true/false, \"is_primary\": true/false, \"references\": \"...\"}]} ],\n"
                    "  \"relationships\": [ {\"from_entity\": \"...\", \"to_entity\": \"...\", \"type\": \"one_to_many\"} ],\n"
                    "  \"roles\": [\"...\"],\n"
                    "  \"permissions\": [ {\"role\": \"...\", \"permissions\": [{\"entity\": \"...\", \"actions\": [\"read\",\"create\"]}]} ],\n"
                    "  \"flows\": [ {\"step_number\": 1, \"name\": \"...\", \"actor\": \"...\", \"action\": \"...\", \"entities_involved\": [\"...\"]} ]\n"
                    "}\n"
                    "Format should be clean, deterministic JSON only."
                )

                payload = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": f"Design a system from this intent: {json.dumps(intent)}"}
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

        return self._heuristic_designer(intent)

    def _heuristic_designer(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        app_type = intent.get("app_type", "").lower()
        entities_list = intent.get("entities", ["users"])
        roles_list = intent.get("roles", ["Administrator"])

        # Infer missing base tables
        if "users" not in entities_list:
            entities_list.append("users")

        entities_schemas = []
        relationships = []
        permissions = []
        flows = []

        # Create rich attributes based on app types
        if "crm" in app_type:
            # entities
            entities_schemas = [
                {
                    "name": "users",
                    "fields": [
                        {"name": "id", "type": "INTEGER", "required": True, "is_primary": True},
                        {"name": "email", "type": "STRING", "required": True},
                        {"name": "role", "type": "STRING", "required": True}
                    ]
                },
                {
                    "name": "contacts",
                    "fields": [
                        {"name": "id", "type": "INTEGER", "required": True, "is_primary": True},
                        {"name": "name", "type": "STRING", "required": True},
                        {"name": "email", "type": "STRING", "required": True},
                        {"name": "phone", "type": "STRING", "required": False},
                        {"name": "owner_id", "type": "INTEGER", "required": True, "references": "users"}
                    ]
                },
                {
                    "name": "payments",
                    "fields": [
                        {"name": "id", "type": "INTEGER", "required": True, "is_primary": True},
                        {"name": "contact_id", "type": "INTEGER", "required": True, "references": "contacts"},
                        {"name": "amount", "type": "NUMBER", "required": True},
                        {"name": "status", "type": "STRING", "required": True},
                        {"name": "created_at", "type": "STRING", "required": True}
                    ]
                }
            ]

            relationships = [
                {"from_entity": "users", "to_entity": "contacts", "type": "one_to_many"},
                {"from_entity": "contacts", "to_entity": "payments", "type": "one_to_many"}
            ]

            permissions = [
                {
                    "role": "Administrator",
                    "permissions": [
                        {"entity": "users", "actions": ["create", "read", "update", "delete"]},
                        {"entity": "contacts", "actions": ["create", "read", "update", "delete"]},
                        {"entity": "payments", "actions": ["create", "read", "update", "delete"]}
                    ]
                },
                {
                    "role": "Sales Representative",
                    "permissions": [
                        {"entity": "contacts", "actions": ["create", "read", "update"]},
                        {"entity": "payments", "actions": ["read", "create"]}
                    ]
                }
            ]

            flows = [
                {"step_number": 1, "name": "Login", "actor": "Sales Representative", "action": "Enters credentials to access CRM dashboard", "entities_involved": ["users"]},
                {"step_number": 2, "name": "Log Contact", "actor": "Sales Representative", "action": "Creates a new contact and sets owner_id to current user", "entities_involved": ["contacts"]},
                {"step_number": 3, "name": "Process Payment", "actor": "Administrator", "action": "Logs a customer payment associated with the contact", "entities_involved": ["payments"]}
            ]

        elif "creative" in app_type or "viktor" in app_type:
            entities_schemas = [
                {
                    "name": "leads",
                    "fields": [
                        {"name": "id", "type": "INTEGER", "required": True, "is_primary": True},
                        {"name": "name", "type": "STRING", "required": True},
                        {"name": "email", "type": "STRING", "required": True},
                        {"name": "message", "type": "STRING", "required": True},
                        {"name": "budget", "type": "STRING", "required": True}
                    ]
                },
                {
                    "name": "projects",
                    "fields": [
                        {"name": "id", "type": "INTEGER", "required": True, "is_primary": True},
                        {"name": "title", "type": "STRING", "required": True},
                        {"name": "description", "type": "STRING", "required": True},
                        {"name": "image_url", "type": "STRING", "required": True}
                    ]
                }
            ]

            relationships = []

            permissions = [
                {
                    "role": "Visitor",
                    "permissions": [
                        {"entity": "projects", "actions": ["read"]},
                        {"entity": "leads", "actions": ["create"]}
                    ]
                },
                {
                    "role": "Creative Director",
                    "permissions": [
                        {"entity": "projects", "actions": ["create", "read", "update", "delete"]},
                        {"entity": "leads", "actions": ["read", "update"]}
                    ]
                }
            ]

            flows = [
                {"step_number": 1, "name": "Explore Portfolio", "actor": "Visitor", "action": "Browses high-fidelity projects and animations", "entities_involved": ["projects"]},
                {"step_number": 2, "name": "Submit Lead / Agency Inquiry", "actor": "Visitor", "action": "Signs up to start a chat/partnership, providing project budget requirements", "entities_involved": ["leads"]}
            ]

        else:
            # Generic
            entities_schemas = [
                {
                    "name": "users",
                    "fields": [
                        {"name": "id", "type": "INTEGER", "required": True, "is_primary": True},
                        {"name": "username", "type": "STRING", "required": True},
                        {"name": "role", "type": "STRING", "required": True}
                    ]
                },
                {
                    "name": "records",
                    "fields": [
                        {"name": "id", "type": "INTEGER", "required": True, "is_primary": True},
                        {"name": "title", "type": "STRING", "required": True},
                        {"name": "description", "type": "STRING", "required": False},
                        {"name": "userId", "type": "INTEGER", "required": True, "references": "users"}
                    ]
                }
            ]

            relationships = [
                {"from_entity": "users", "to_entity": "records", "type": "one_to_many"}
            ]

            permissions = [
                {
                    "role": "Administrator",
                    "permissions": [
                        {"entity": "users", "actions": ["create", "read", "update", "delete"]},
                        {"entity": "records", "actions": ["create", "read", "update", "delete"]}
                    ]
                }
            ]

            flows = [
                {"step_number": 1, "name": "System Audit", "actor": "Administrator", "action": "Reviews active enterprise records log", "entities_involved": ["users", "records"]}
            ]

        return {
            "entities": entities_schemas,
            "relationships": relationships,
            "roles": roles_list,
            "permissions": permissions,
            "flows": flows
        }
