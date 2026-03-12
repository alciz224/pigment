from typing import List
from app.models.pigment import Pigment
from app.services.mix_service import load_pigments

# This module exists for architectural clarity but could be merged
# It provides a clean separation between data access and business logic


def get_all_pigments() -> List[Pigment]:
    """Return all available pigments."""
    return load_pigments()
