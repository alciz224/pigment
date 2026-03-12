import { useState, useEffect, useMemo, useCallback } from 'react'
import { fetchPigments } from '../api'
import type { Pigment } from '../types'
import { computeMix } from '../engine/mixEngine'

const MAX_SELECTED = 7
const MIN_SELECTED = 2

export function usePigmentMix() {
  const [pigments, setPigments] = useState<Pigment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [proportions, setProportions] = useState<Record<number, number>>({})

  // Fetch pigments on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPigments()
        setPigments(data)
      } catch (e) {
        setError(e as Error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // Auto-equalize proportions when selection changes
  useEffect(() => {
    if (selectedIds.length > 0) {
      const equalShare = 100 / selectedIds.length
      const newProportions = selectedIds.reduce((acc, id) => {
        acc[id] = equalShare
        return acc
      }, {} as Record<number, number>)
      setProportions(newProportions)
    } else {
      setProportions({})
    }
  }, [selectedIds])

  // Real-time local mixing
  const mixResult = useMemo(() => {
    if (selectedIds.length < 2) return null

    const selectedPigments = selectedIds
      .map(id => pigments.find(p => p.id === id))
      .filter((p): p is Pigment => p !== undefined)
      .map(p => ({
        K: p.K,
        S: p.S,
        weight: proportions[p.id] / 100,
      }))

    return computeMix(selectedPigments)
  }, [pigments, selectedIds, proportions])

  const hexColor = useMemo(() => {
    if (!mixResult) return null
    const [r, g, b] = mixResult.rgb
    return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')
  }, [mixResult])

  const togglePigment = useCallback((id: number) => {
    setSelectedIds(prev => {
      const isSelected = prev.includes(id)
      if (isSelected) {
        if (prev.length <= MIN_SELECTED) return prev
        return prev.filter(i => i !== id)
      } else {
        if (prev.length >= MAX_SELECTED) return prev
        return [...prev, id]
      }
    })
  }, [])

  const updateProportion = useCallback((id: number, value: number) => {
    setProportions(prev => {
      const clamped = Math.min(100, Math.max(0, value))
      const otherIds = selectedIds.filter(i => i !== id)
      const othersSum = otherIds.reduce((sum, i) => sum + (prev[i] || 0), 0)
      const remaining = 100 - clamped

      const result: Record<number, number> = { [id]: clamped }

      if (otherIds.length === 0) {
        result[id] = 100
      } else if (othersSum === 0) {
        const share = remaining / otherIds.length
        otherIds.forEach(i => { result[i] = share })
      } else {
        otherIds.forEach(i => {
          result[i] = ((prev[i] || 0) / othersSum) * remaining
        })
      }

      return result
    })
  }, [selectedIds])

  return {
    pigments,
    isLoading,
    error,
    selectedIds,
    proportions,
    mixResult,
    hexColor,
    togglePigment,
    updateProportion,
  }
}
