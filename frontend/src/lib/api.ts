const API_BASE = 'http://localhost:8000/api'

export interface Pigment {
  id: number
  name: string
  code: string
  K: [number, number, number]
  S: [number, number, number]
}

export async function fetchPigments(): Promise<Pigment[]> {
  const res = await fetch(`${API_BASE}/pigments`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export async function validateCompute(
  pigments: Array<{pigment_id: number; weight: number}>
): Promise<{
  rgb: [number, number, number]
  reflectance?: [number, number, number]
  ks_ratio?: [number, number, number]
}> {
  const res = await fetch(`${API_BASE}/compute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pigments }),
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}
