import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List

from backend.intent_extractor import IntentExtractor
from backend.system_designer import SystemDesigner
from backend.schema_generator import SchemaGenerator
from backend.validator import Validator
from backend.repair_engine import RepairEngine
from backend.runtime_generator import RuntimeGenerator
from backend.metrics import MetricsTracker
from backend.test_runner import TestRunner

app = FastAPI(title="AI App Compiler Core Pipeline Engine", version="1.0.0")

# Enable CORS for frontend accessibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared Service instances
intent_extractor = IntentExtractor()
system_designer = SystemDesigner()
schema_generator = SchemaGenerator()
validator = Validator()
repair_engine = RepairEngine()
runtime_generator = RuntimeGenerator()
metrics_tracker = MetricsTracker()
test_runner = TestRunner()

# Request Models
class PromptRequest(BaseModel):
    prompt: str

class DesignRequest(BaseModel):
    intent: Dict[str, Any]

class SchemasRequest(BaseModel):
    design: Dict[str, Any]

class ValidateRequest(BaseModel):
    schemas: Dict[str, Any]

class RepairRequest(BaseModel):
    schemas: Dict[str, Any]
    validation_report: Dict[str, Any]

class GenerateRequest(BaseModel):
    schemas: Dict[str, Any]
    app_name: str

@app.get("/api/health")
def health_check():
    return {"status": "operational", "engine": "FastAPI + Llama NIM"}

@app.post("/api/stage1/extract-intent")
def extract_intent(req: PromptRequest):
    try:
        res = intent_extractor.extract_intent(req.prompt)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stage2/design-system")
def design_system(req: DesignRequest):
    try:
        res = system_designer.design_system(req.intent)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stage3/generate-schemas")
def generate_schemas(req: SchemasRequest):
    try:
        res = schema_generator.generate_schemas(req.design)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stage4/validate")
def validate_schemas(req: ValidateRequest):
    try:
        res = validator.validate_schemas(req.schemas)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stage5/repair")
def repair_schemas(req: RepairRequest):
    try:
        res = repair_engine.repair_schemas(req.schemas, req.validation_report)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stage6/generate-runtime")
def generate_runtime(req: GenerateRequest):
    try:
        res = runtime_generator.generate_runtime(req.schemas, req.app_name)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics")
def get_metrics():
    return metrics_tracker.get_metrics()

@app.post("/api/evaluations/run")
def run_evaluations():
    try:
        res = test_runner.run_all_tests()
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
