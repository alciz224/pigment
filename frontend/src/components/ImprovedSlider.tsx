import type { Pigment } from '../lib/types'

interface ImprovedSliderProps {
  pigment: Pigment
  value: number
  onChange: (id: number, value: number) => void
  mixRgb: [number, number, number] | null
  total: number
}

export default function ImprovedSlider({ pigment, value, onChange, mixRgb, total }: ImprovedSliderProps) {
  const estimateColor = estimatePigmentColor(pigment)

  // Compute the visual blend for the sliders fill
  const getTrackStyle = () => {
    if (mixRgb && total > 0) {
      const mixColor = `rgb(${mixRgb.join(',')})`
      return {
        background: `linear-gradient(to right, ${mixColor} 0%, ${mixColor} ${value}%, var(--surface) ${value}%, var(--surface) 100%)`,
      }
    }
    return {}
  }

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-[var(--line)] bg-white p-4 transition-all duration-200 hover:border-[var(--lagoon-deep)] hover:shadow-md dark:bg-[var(--surface-strong)]">
      {/* Avatar: color swatch + code */}
      <div className="flex flex-shrink-0 flex-col items-center gap-1">
        <div
          className="h-12 w-16 rounded-lg border-2 border-[var(--line)] shadow-sm transition-shadow group-hover:shadow-md"
          style={{ backgroundColor: estimateColor }}
        />
        <span className="text-[10px] font-mono font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">
          {pigment.code}
        </span>
      </div>

      {/* Content: title + slider (subtitle) */}
      <div className="flex flex-1 flex-col justify-center gap-2">
        <p className="font-semibold text-[var(--sea-ink)] leading-tight">
          {pigment.name}
        </p>

        {/* Horizontal slider track */}
        <div className="relative h-3 w-full cursor-pointer rounded-full bg-[var(--surface)]">
          {/* Fill portion */}
          <div
            className="absolute left-0 top-0 h-full rounded-l-full transition-all duration-150"
            style={{
              width: `${value}%`,
              backgroundColor: estimateColor,
              opacity: 0.5,
            }}
          />

          {/* Thumb */}
          <div
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-[var(--sea-ink)] bg-white shadow-sm transition-transform hover:scale-110 active:scale-100"
            style={{ left: `calc(${value}% - 10px)` }}
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
      </div>

      {/* Action area: percentage display */}
      <div className="flex flex-shrink-0 flex-col items-end gap-1">
        <button
          onClick={() => onChange(pigment.id, 0)}
          disabled={value === 0}
          className="text-xs font-medium text-[var(--sea-ink-soft)] hover:text-[var(--lagoon-deep)] disabled:opacity-30 transition-colors"
          title="Réinitialiser à 0%"
        >
          {value === 0 ? 'Inactif' : 'Effacer'}
        </button>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={value.toFixed(1)}
            onChange={e => onChange(pigment.id, parseFloat(e.target.value) || 0)}
            className="w-20 rounded-lg border border-[var(--line)] bg-transparent px-2 py-1 text-center text-lg font-bold text-[var(--lagoon-deep)] focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon-deep)]/30"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--sea-ink-soft)]">%</span>
        </div>
      </div>
    </div>
  )
}

function estimatePigmentColor(pigment: Pigment): string {
  const r = Math.round((1 - pigment.K[0] / 10) * 240 + 15)
  const g = Math.round((1 - pigment.K[1] / 10) * 240 + 15)
  const b = Math.round((1 - pigment.K[2] / 10) * 240 + 15)
  return `rgb(${r}, ${g}, ${b})`
}
