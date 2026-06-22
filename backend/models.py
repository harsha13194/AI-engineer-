from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class IntentModel(BaseModel):
    app_type: str = Field(..., description="Calculated type of the app, e.g. CRM, CMS, Inventory")
    features: List[str] = Field(default_list=[])
    roles: List[str] = Field(default_list=[])
    entities: List[str] = Field(default_list=[])
    constraints: List[str] = Field(default_list=[])
    assumptions: List[str] = Field(default_list=[])

class EntityField(BaseModel):
    name: str
    type: str
    required: bool
    is_primary: bool = False
    references: Optional[str] = None

class EntityDefinition(BaseModel):
    name: str
    fields: List[EntityField]

class Relationship(BaseModel):
    from_entity: str
    to_entity: str
    type: str  # e.g., "one_to_many", "many_to_one"

class AccessControl(BaseModel):
    role: str
    permissions: List[Dict[str, Any]]

class WorkflowStep(BaseModel):
    step_number: int
    name: str
    actor: str
    action: str
    entities_involved: List[str]

class SystemDesign(BaseModel):
    entities: List[EntityDefinition]
    relationships: List[Relationship]
    roles: List[str]
    permissions: List[AccessControl]
    flows: List[WorkflowStep]

class DatabaseTableColumn(BaseModel):
    name: str
    type: str
    primary_key: bool = False
    nullable: bool = True
    references_table: Optional[str] = None
    references_column: Optional[str] = None

class DatabaseTable(BaseModel):
    name: str
    columns: List[DatabaseTableColumn]

class DatabaseSchema(BaseModel):
    tables: List[DatabaseTable]

class ApiEndpoint(BaseModel):
    path: str
    method: str
    request_body: Optional[Dict[str, str]] = None
    response_body: Dict[str, str]
    required_role: Optional[str] = None
    description: str

class ApiSchema(BaseModel):
    endpoints: List[ApiEndpoint]

class UiPage(BaseModel):
    name: str
    route: str
    components: List[Dict[str, Any]]

class UiSchema(BaseModel):
    pages: List[UiPage]

class AuthSchema(BaseModel):
    roles: List[str]
    permissions: Dict[str, List[str]]

class AppSchemas(BaseModel):
    database: DatabaseSchema
    api: ApiSchema
    ui: UiSchema
    auth: AuthSchema

class ValidationErrorDetail(BaseModel):
    ruleId: str
    category: str
    severity: str
    message: str

class ValidationReport(BaseModel):
    valid: bool
    score: int
    errors: List[ValidationErrorDetail]

class RepairLog(BaseModel):
    ruleId: str
    error_message: str
    action_taken: str
    section: str
    success: bool

class RepairReport(BaseModel):
    repairs: List[RepairLog]
