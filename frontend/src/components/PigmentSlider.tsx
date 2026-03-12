import type { Pigment } from '../lib/types'

interface PigmentSliderProps {
  pigment: Pigment
  value: number
  onChange: (id: number, value: number) => void
  isOnlyOne: boolean
}

export default function PigmentSlider({ pigment, value, onChange, isOnlyOne }: PigmentSliderProps) {
  return (
    <div className="rounded-lg border border-[var(--line)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-medium text-[var(--sea-ink)]">{pigment.name}</p>
          <p className="text-sm text-[var(--sea-ink-soft)]">{pigment.code}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[var(--lagoon-deep)]">
            {value.toFixed(1)}
          </span>
          <span className="ml-1 text-sm text-[var(--sea-ink-soft)]">%</span>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={value}
        onChange={e => onChange(pigment.id, parseFloat(e.target.value))}
        disabled={isOnlyOne}
        className={`
          h-2 w-full cursor-pointer appearance-none rounded-lg
          bg-[var(--surface)]
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[var(--lagoon)]
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          ${isOnlyOne ? 'cursor-not-allowed opacity-50' : ''}
        `}
      />
    </div>
  )
}
