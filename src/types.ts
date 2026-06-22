export interface IntentModel {
  app_type: string;
  features: string[];
  roles: string[];
  entities: string[];
  constraints: string[];
  assumptions: string[];
}

export interface EntityField {
  name: string;
  type: string;
  required: boolean;
  is_primary?: boolean;
  references?: string;
}

export interface EntityDefinition {
  name: string;
  fields: EntityField[];
}

export interface Relationship {
  from_entity: string;
  to_entity: string;
  type: "one_to_many" | "many_to_one" | "one_to_one" | "many_to_many";
}

export interface AccessControl {
  role: string;
  permissions: {
    entity: string;
    actions: ("create" | "read" | "update" | "delete")[];
  }[];
}

export interface WorkflowStep {
  step_number: number;
  name: string;
  actor: string;
  action: string;
  entities_involved: string[];
}

export interface SystemDesign {
  entities: EntityDefinition[];
  relationships: Relationship[];
  roles: string[];
  permissions: AccessControl[];
  flows: WorkflowStep[];
}

export interface DatabaseTable {
  name: string;
  columns: {
    name: string;
    type: string;
    primary_key?: boolean;
    foreign_key?: {
      references_table: string;
      references_column: string;
    };
    nullable?: boolean;
  }[];
}

export interface DatabaseSchema {
  tables: DatabaseTable[];
}

export interface ApiEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  request_body?: Record<string, string>;
  response_body: Record<string, string>;
  required_role?: string;
  description: string;
}

export interface ApiSchema {
  endpoints: ApiEndpoint[];
}

export interface UiPage {
  name: string;
  route: string;
  components: {
    type: "form" | "table" | "chart" | "grid" | "header" | "sidebar";
    title: string;
    fields_referenced: string[];
    actions?: string[];
  }[];
}

export interface UiSchema {
  pages: UiPage[];
}

export interface AuthSchema {
  roles: string[];
  permissions: Record<string, string[]>;
}

export interface AppSchemas {
  database: DatabaseSchema;
  api: ApiSchema;
  ui: UiSchema;
  auth: AuthSchema;
}

export interface ValidationError {
  ruleId: string;
  category: "consistency" | "missing_ref" | "orphan" | "auth" | "duplicate";
  severity: "critical" | "warning";
  message: string;
  details?: any;
}

export interface ValidationReport {
  valid: boolean;
  score: number; // 0 to 100
  errors: ValidationError[];
}

export interface RepairLog {
  ruleId: string;
  error_message: string;
  action_taken: string;
  section: "database" | "api" | "ui" | "auth";
  success: boolean;
}

export interface RepairReport {
  repairs: RepairLog[];
}

export interface RuntimeAppConfig {
  app_name: string;
  theme: "dark" | "light" | "studio";
  nav_items: { label: string; path: string; icon: string }[];
  sidebar_enabled: boolean;
}

export interface ProjectMetrics {
  requests_processed: number;
  success_rate: number;
  validation_failures: number;
  repairs_applied: number;
  average_latency: number;
}

export interface CompilationProject {
  id: string;
  prompt: string;
  status: "idle" | "extracting_intent" | "designing_system" | "generating_schemas" | "validating" | "repairing" | "compiling" | "completed" | "failed";
  intent: IntentModel | null;
  design: SystemDesign | null;
  schemas: AppSchemas | null;
  validation: ValidationReport | null;
  repairs: RepairReport | null;
  runtime_config: RuntimeAppConfig | null;
  latency_ms: Record<string, number>;
  error?: string;
}

export interface EvaluationPrompt {
  id: string;
  title: string;
  prompt: string;
  category: "standard" | "edge_case";
}
