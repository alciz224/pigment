export interface Pigment {
  id: number
  name: string
  code: string
  K: [number, number, number]
  S: [number, number, number]
}

export interface MixResult {
  rgb: [number, number, number]
}

export interface ProportionMap {
  [pigmentId: number]: number
}
