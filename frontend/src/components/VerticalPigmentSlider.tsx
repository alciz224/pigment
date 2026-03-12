import type { Pigment } from '../lib/types'

interface VerticalPigmentSliderProps {
  pigment: Pigment
  value: number
  onChange: (id: number, value: number) => void
  isOnlyOne: boolean
  currentMixRgb: [number, number, number] | null
}

export default function VerticalPigmentSlider({
  pigment,
  value,
  onChange,
  isOnlyOne,
  currentMixRgb,
}: VerticalPigmentSliderProps) {
  const estimateColor = estimatePigmentColor(pigment)

  return (
    <div className="flex items-center gap-4 rounded-lg border border-[var(--line)] p-3">
      {/* Color swatch with code */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="h-12 w-12 rounded-lg border-2 border-[var(--line)] shadow-sm"
          style={{ backgroundColor: estimateColor }}
        />
        <span className="text-xs font-mono text-[var(--sea-ink-soft)]">
          {pigment.code}
        </span>
      </div>

      {/* Vertical slider */}
      <div className="relative flex h-10 w-24 items-center">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={value}
          onChange={e => onChange(pigment.id, parseFloat(e.target.value))}
          disabled={isOnlyOne}
          className={`
            absolute w-full cursor-pointer appearance-none
            bg-transparent
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[var(--lagoon)]
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-runnable-track]:w-10
            [&::-webkit-slider-runnable-track]:h-2
            [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-[var(--surface)]
            ${isOnlyOne ? 'cursor-not-allowed opacity-50' : ''}
          `}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* Label and value */}
      <div className="flex min-w-20 flex-1 flex-col justify-center">
        <div className="flex items-center justify-between">
          <p className="truncate font-medium text-[var(--sea-ink)]">{pigment.name}</p>
          <span className="ml-2 text-lg font-bold text-[var(--lagoon-deep)]">
            {value.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Mix result color */}
      {currentMixRgb && (
        <div className="flex flex-col items-center gap-1">
          <div
            className="h-10 w-10 rounded-lg border-2 border-[var(--line)] shadow-inner"
            style={{ backgroundColor: `rgb(${currentMixRgb[0]}, ${currentMixRgb[1]}, ${currentMixRgb[2]})` }}
          />
          <span className="text-xs text-[var(--sea-ink-soft)]">Mix</span>
        </div>
      )}
    </div>
  )
}

function estimatePigmentColor(pigment: Pigment): string {
  const r = Math.round((1 - pigment.K[0] / 10) * 240 + 15)
  const g = Math.round((1 - pigment.K[1] / 10) * 240 + 15)
  const b = Math.round((1 - pigment.K[2] / 10) * 240 + 15)
  return `rgb(${r}, ${g}, ${b})`
}
