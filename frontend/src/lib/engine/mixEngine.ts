export interface MixResult {
  rgb: [number, number, number]
}

/**
 * Kubelka-Munk two-constant model for pigment mixing.
 * K = absorption coefficient, S = scattering coefficient.
 */
export function computeMix(
  pigments: Array<{ K: [number, number, number]; S: [number, number, number]; weight: number }>
): MixResult {
  const K_mix = [0, 0, 0]
  const S_mix = [0, 0, 0]

  for (const p of pigments) {
    for (let c = 0; c < 3; c++) {
      K_mix[c] += p.weight * p.K[c]
      S_mix[c] += p.weight * p.S[c]
    }
  }

  const rgb: [number, number, number] = [0, 0, 0]

  for (let c = 0; c < 3; c++) {
    const ks = K_mix[c] / Math.max(S_mix[c], 1e-10)
    const R = ks <= 0 ? 1.0 : 1 + ks - Math.sqrt(ks * ks + 2 * ks)
    const R_clamped = Math.max(0, Math.min(1, R))
    rgb[c] = Math.round(linearToSrgb(R_clamped) * 255)
  }

  return { rgb }
}

/**
 * Convert linear RGB (0-1) to sRGB (0-255)
 */
function linearToSrgb(c: number): number {
  if (c <= 0.0031308) return 12.92 * c
  return 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055
}

/**
 * Convert RGB array to hex string
 */
export function rgbToHex(rgb: [number, number, number]): string {
  return '#' + rgb.map(n => n.toString(16).padStart(2, '0')).join('')
}
