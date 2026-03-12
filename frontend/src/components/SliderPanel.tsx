import PigmentSlider from './PigmentSlider'
import type { Pigment } from '../lib/types'
import type { ProportionMap } from '../lib/types'

interface SliderPanelProps {
  pigments: Pigment[]
  proportions: ProportionMap
  onChange: (id: number, value: number) => void
}

export default function SliderPanel({ pigments, proportions, onChange }: SliderPanelProps) {
  const total = pigments.reduce((sum, p) => sum + (proportions[p.id] || 0), 0)
  const totalColor = total === 100 ? 'text-[var(--palm)]' : 'text-red-500'

  if (pigments.length === 0) {
    return (
      <section className="island-shell rounded-2xl p-5">
        <p className="text-center text-[var(--sea-ink-soft)]">
          Sélectionnez au moins 2 pigments pour commencer
        </p>
      </section>
    )
  }

  return (
    <section className="island-shell rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
          Proportions
        </h2>
        <div className={`text-lg font-bold ${totalColor}`}>
          {total.toFixed(1)}%
        </div>
      </div>
      <div className="space-y-4">
        {pigments.map(pigment => (
          <PigmentSlider
            key={pigment.id}
            pigment={pigment}
            value={proportions[pigment.id] || 0}
            onChange={onChange}
            isOnlyOne={pigments.length <= 1}
          />
        ))}
      </div>
    </section>
  )
}
