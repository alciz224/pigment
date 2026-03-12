from pydantic import BaseModel, Field, validator
from typing import List


class PigmentProportion(BaseModel):
    pigment_id: int = Field(..., gt=0)
    weight: float = Field(..., ge=0.0, le=1.0)


class MixRequest(BaseModel):
    pigments: List[PigmentProportion]

    @validator("pigments")
    def validate_weights(cls, v):
        if len(v) < 2:
            raise ValueError("Minimum 2 pigments requis")
        total = sum(p.weight for p in v)
        if abs(total - 1.0) > 0.01:
            raise ValueError(f"Les poids doivent sommer a 1.0, recu {total:.6f}")
        return v

    class Config:
        schema_extra = {
            "example": {
                "pigments": [
                    {"pigment_id": 3, "weight": 0.6},
                    {"pigment_id": 5, "weight": 0.4}
                ]
            }
        }


class MixResult(BaseModel):
    rgb: List[int]
    reflectance: List[float]
    ks_ratio: List[float]


class SavedMix(BaseModel):
    id: int
    name: str
    pigments: List[PigmentProportion]
    rgb: List[int]
