"""Placeholder for queue & triage module routes"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_queue_status():
    return {"message": "Queue & Triage module - coming soon"}
