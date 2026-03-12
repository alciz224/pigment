from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import pigments, mixes

app = FastAPI(
    title="Pigment Mixer API",
    description="API for simulating pigment mixing using Kubelka-Munk theory",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pigments.router, prefix="/api")
app.include_router(mixes.router, prefix="/api")
