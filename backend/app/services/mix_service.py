import json
import os
from typing import List, Dict, Any
from app.models.pigment import Pigment
from app.models.mix import MixResult
from app.physics.kubelka_munk import mix_pigments

# In-memory storage for pigment data
_pigments_cache: List[Pigment] = []
_saved_mixes: Dict[int, Dict[str, Any]] = {}
_next_mix_id: int = 1


def load_pigments() -> List[Pigment]:
    """Load pigments from JSON data file."""
    global _pigments_cache
    if not _pigments_cache:
        data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'pigments.json')
        with open(data_path, 'r') as f:
            data = json.load(f)
        _pigments_cache = [Pigment(**p) for p in data['pigments']]
    return _pigments_cache


def get_pigment_by_id(pigment_id: int) -> Pigment:
    """Get a single pigment by ID."""
    pigments = load_pigments()
    for p in pigments:
        if p.id == pigment_id:
            return p
    raise ValueError(f"Pigment with id {pigment_id} not found")


def compute_mix(pigment_proportions: List[Dict[str, Any]]) -> MixResult:
    """
    Compute color mix result using Kubelka-Munk theory.

    Args:
        pigment_proportions: List of dicts with 'pigment_id' and 'weight'

    Returns:
        MixResult with rgb, reflectance, and ks_ratio
    """
    pigments_data = []
    for pp in pigment_proportions:
        pigment = get_pigment_by_id(pp['pigment_id'])
        pigments_data.append({
            'K': pigment.K,
            'S': pigment.S,
            'weight': pp['weight']
        })

    result = mix_pigments(pigments_data)
    return MixResult(**result)


def save_mix_to_storage(name: str, pigment_proportions: List[Dict[str, Any]], rgb: List[int]) -> Dict[str, Any]:
    """Save a mix to in-memory storage."""
    global _next_mix_id, _saved_mixes
    saved_mix = {
        'id': _next_mix_id,
        'name': name,
        'pigments': pigment_proportions,
        'rgb': rgb
    }
    _saved_mixes[_next_mix_id] = saved_mix
    _next_mix_id += 1
    return saved_mix


def get_all_saved_mixes() -> List[Dict[str, Any]]:
    """Get all saved mixes."""
    return list(_saved_mixes.values())


def get_saved_mix_by_id(mix_id: int) -> Dict[str, Any]:
    """Get a saved mix by ID."""
    if mix_id not in _saved_mixes:
        raise ValueError(f"Mix with id {mix_id} not found")
    return _saved_mixes[mix_id]


def delete_saved_mix(mix_id: int) -> bool:
    """Delete a saved mix."""
    if mix_id in _saved_mixes:
        del _saved_mixes[mix_id]
        return True
    return False
