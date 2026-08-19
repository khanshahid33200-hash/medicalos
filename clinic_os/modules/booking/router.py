"""Placeholder for booking module routes"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_appointments():
    return {"message": "Booking module - coming soon"}
