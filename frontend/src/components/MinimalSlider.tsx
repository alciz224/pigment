import type { Pigment } from '../lib/types'

interface MinimalSliderProps {
  pigment: Pigment
  value: number
  onChange: (id: number, value: number) => void
  mixRgb: [number, number, number] | null
  total: number
}

function estimatePigmentColor(pigment: Pigment): string {
  const r = Math.round((1 - pigment.K[0] / 10) * 240 + 15)
  const g = Math.round((1 - pigment.K[1] / 10) * 240 + 15)
  const b = Math.round((1 - pigment.K[2] / 10) * 240 + 15)
  return `rgb(${r}, ${g}, ${b})`
}

export default function MinimalSlider({ pigment, value, onChange, mixRgb, total }: MinimalSliderProps) {
  const estimateColor = estimatePigmentColor(pigment)

  const getTrackStyle = () => {
    if (mixRgb && total > 0) {
      const mixColor = `rgb(${mixRgb.join(',')})`
      return {
        background: `linear-gradient(to right, ${mixColor} 0%, ${mixColor} ${value}%, var(--surface) ${value}%, var(--surface) 100%)`,
      }
    }
    return { background: 'var(--surface)' }
  }

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 transition-all duration-150">
      {/* Left: Small color avatar (no code) */}
      <div
        className="h-8 w-8 flex-shrink-0 rounded-full border-2 border-[var(--line)] shadow-sm"
        style={{ backgroundColor: estimateColor }}
        title={pigment.name}
      />

      {/* Middle: Full width slider */}
      <div className="relative flex-1">
        <div className="relative h-4 w-full cursor-pointer rounded-full bg-[var(--surface-strong)] overflow-visible">
          {/* Fill portion */}
          {value > 0 && (
            <div
              className="absolute left-0 top-0 h-full transition-all duration-75"
              style={{
                width: `${value}%`,
                backgroundColor: mixRgb ? `rgba(${mixRgb[0]}, ${mixRgb[1]}, ${mixRgb[2]}, 0.5)` : estimateColor,
              }}
            />
          )}
          {/* Thumb */}
          <div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[var(--sea-ink)] bg-white shadow-sm transition-transform hover:scale-110 active:scale-100"
            style={{ left: `calc(${value}% - 8px)` }}
          />
          {/* Invisible range input */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={value}
            onChange={e => onChange(pigment.id, parseFloat(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
            aria-label={`Proportion de ${pigment.name}`}
          />
        </div>
        {/* Name below slider */}
        <p className="mt-1 truncate text-xs font-medium text-[var(--sea-ink)]">
          {pigment.name}
        </p>
      </div>

      {/* Right: Small percentage text */}
      <div className="flex w-10 flex-shrink-0 flex-col items-center">
        <span className={`text-sm font-bold ${value > 0 ? 'text-[var(--lagoon-deep)]' : 'text-[var(--sea-ink-soft)]'}`}>
          {value.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}
