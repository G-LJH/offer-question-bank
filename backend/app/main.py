from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import Base, engine
from .routers import export, questions, tags

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Offer 题库助手 API")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOW_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


app.include_router(tags.router)
app.include_router(questions.router)
app.include_router(export.router)
