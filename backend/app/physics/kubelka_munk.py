import math
from typing import List, Dict, Any

def mix_pigments(pigments_with_weights: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Entrée : [{"K": [..], "S": [..], "weight": float}, ...]
    Sortie : {"rgb": [R,G,B], "reflectance": [...], "ks_ratio": [...]}
    """
    K_mix = [0.0, 0.0, 0.0]
    S_mix = [0.0, 0.0, 0.0]

    for p in pigments_with_weights:
        for c in range(3):
            K_mix[c] += p["weight"] * p["K"][c]
            S_mix[c] += p["weight"] * p["S"][c]

    ks_ratio = [K_mix[c] / max(S_mix[c], 1e-10) for c in range(3)]
    refl = [reflectance(ks) for ks in ks_ratio]
    rgb = [linear_to_srgb_byte(r) for r in refl]

    return {
        "rgb": rgb,
        "reflectance": [round(r, 6) for r in refl],
        "ks_ratio": [round(ks, 6) for ks in ks_ratio],
    }


def reflectance(ks: float) -> float:
    """Réflectance Kubelka-Munk pour couche opaque."""
    if ks <= 0:
        return 1.0
    r = 1.0 + ks - math.sqrt(ks * ks + 2.0 * ks)
    return max(0.0, min(1.0, r))


def linear_to_srgb(c: float) -> float:
    """Correction gamma sRGB."""
    if c <= 0.0031308:
        return 12.92 * c
    return 1.055 * (c ** (1.0 / 2.4)) - 0.055


def linear_to_srgb_byte(c: float) -> int:
    """Linéaire → sRGB → 0-255."""
    return round(max(0.0, min(1.0, linear_to_srgb(c))) * 255)
