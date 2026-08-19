"""Placeholder for follow-ups module routes"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_followups():
    return {"message": "Follow-ups module - coming soon"}
