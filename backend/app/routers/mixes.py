from fastapi import APIRouter, HTTPException
from app.models.mix import MixRequest, MixResult, SavedMix, PigmentProportion
from app.services.mix_service import compute_mix, save_mix_to_storage, get_all_saved_mixes, get_saved_mix_by_id, delete_saved_mix

router = APIRouter()


@router.post("/compute", response_model=MixResult)
async def compute_mix(request: MixRequest):
    """
    Compute the resulting color from mixing selected pigments with given proportions.

    The weights in the request must sum to 1.0 (tolerance 0.01).
    Requires minimum 2 pigments.

    Returns RGB values (0-255), reflectance values (0.0-1.0), and K/S ratio.
    """
    try:
        # Convert to dict format expected by service
        proportions = [{'pigment_id': pp.pigment_id, 'weight': pp.weight}
                       for pp in request.pigments]
        return compute_mix(proportions)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


from pydantic import BaseModel


class SaveMixRequest(BaseModel):
    name: str
    pigments: list


@router.post("/mixes", response_model=SavedMix)
async def save_mix(request: dict):
    """
    Save a named mix to storage.

    Body should contain:
    - name: string
    - pigments: list of {pigment_id, weight}
    """
    try:
        name = request.get('name')
        pigments = request.get('pigments', [])

        if not name:
            raise HTTPException(status_code=400, detail="Name is required")

        # Validate total weight is 1.0
        total = sum(p['weight'] for p in pigments)
        if abs(total - 1.0) > 0.01:
            raise HTTPException(
                status_code=400,
                detail=f"Pigment weights must sum to 1.0, got {total:.6f}"
            )

        # First compute the mix to get RGB result
        result = compute_mix(pigments)

        # Save with result RGB
        saved = save_mix_to_storage(name, pigments, result.rgb)
        return saved
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving mix: {str(e)}")


@router.get("/mixes", response_model=list[SavedMix])
async def get_mixes():
    """
    Get all saved mixes.
    """
    return get_all_saved_mixes()


@router.get("/mixes/{mix_id}", response_model=SavedMix)
async def get_mix(mix_id: int):
    """
    Get a specific saved mix by ID.
    """
    try:
        return get_saved_mix_by_id(mix_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/mixes/{mix_id}")
async def delete_mix(mix_id: int):
    """
    Delete a saved mix.
    """
    deleted = delete_saved_mix(mix_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Mix with id {mix_id} not found")
    return {"deleted": True, "id": mix_id}
