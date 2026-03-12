from pydantic import BaseModel, Field
from typing import List


class Pigment(BaseModel):
    id: int
    name: str
    code: str
    K: List[float] = Field(..., min_items=3, max_items=3)  # [K_R, K_G, K_B]
    S: List[float] = Field(..., min_items=3, max_items=3)  # [S_R, S_G, S_B]

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "name": "Blanc de Titane",
                "code": "PW6",
                "K": [0.005, 0.005, 0.005],
                "S": [3.0, 3.0, 3.0]
            }
        }
