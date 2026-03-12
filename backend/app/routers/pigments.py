from fastapi import APIRouter, HTTPException
from app.models.pigment import Pigment
from app.services.pigment_service import get_all_pigments

router = APIRouter()


@router.get("/pigments", response_model=list[Pigment])
async def get_pigments():
    """
    Get all available pigments with their K and S coefficients.
    """
    return get_all_pigments()
