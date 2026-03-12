import type { Pigment } from '../lib/types'

interface PaletteSelectorProps {
  pigments: Pigment[]
  selectedIds: number[]
  onToggle: (id: number) => void
}

export default function PaletteSelector({ pigments, selectedIds, onToggle }: PaletteSelectorProps) {
  return (
    <section className="island-shell h-full flex flex-col overflow-hidden rounded-2xl">
      <div className="flex-shrink-0 border-b border-[var(--line)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
              Palette de Pigments
            </h2>
            <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
              {selectedIds.length}/7 sélectionnés
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => selectedIds.forEach(id => onToggle(id))}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--sea-ink)] transition hover:bg-[var(--surface-strong)]"
              disabled={selectedIds.length === 0}
            >
              Tout effacer
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--surface)]">
          <div
            className="h-full bg-gradient-to-r from-[var(--lagoon)] to-[var(--lagoon-deep)] transition-all duration-300"
            style={{ width: `${(selectedIds.length / 7) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pigments.map(pigment => {
            const isSelected = selectedIds.includes(pigment.id)
            const estimateColor = estimatePigmentColor(pigment)

            return (
              <button
                key={pigment.id}
                onClick={() => onToggle(pigment.id)}
                disabled={!isSelected && selectedIds.length >= 7}
                className={`
                  relative flex flex-col items-center gap-2 rounded-xl p-3 text-left
                  transition-all duration-200 ease-out
                  ${isSelected
                    ? 'bg-[var(--surface-strong)] ring-2 ring-[var(--lagoon-deep)] shadow-md scale-[1.02]'
                    : 'bg-[var(--bg)] hover:bg-[var(--surface)] hover:scale-[1.02]'
                  }
                  ${!isSelected && selectedIds.length >= 7
                    ? 'cursor-not-allowed opacity-40'
                    : 'cursor-pointer'
                  }
                `}
                title={`${pigment.name} (${pigment.code})`}
              >
                <div
                  className={`
                    h-12 w-12 rounded-xl border-2 transition-all
                    ${isSelected ? 'border-[var(--lagoon-deep)] shadow-lg' : 'border-[var(--line)]'}
                  `}
                  style={{ backgroundColor: estimateColor }}
                />
                <div className="min-w-0 flex-1 text-center">
                  <p className="truncate text-sm font-medium text-[var(--sea-ink)]">
                    {pigment.name}
                  </p>
                  <p className="truncate text-xs text-[var(--sea-ink-soft)] font-mono">
                    {pigment.code}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute right-2 top-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--lagoon-deep)] text-white">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.354 4.646a.5.5 0 0 1 0 .708L8.207 11.293l-2.647-2.646a.5.5 0 0 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"/>
                      </svg>
                    </div>
                  </div>
                )}
                {!isSelected && selectedIds.length < 7 && (
                  <div className="absolute right-2 top-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--sea-ink-soft)] text-[var(--sea-ink-soft)] text-xs opacity-0 transition-opacity hover:opacity-100">
                      +
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function estimatePigmentColor(pigment: Pigment): string {
  const r = Math.round((1 - pigment.K[0] / 10) * 240 + 15)
  const g = Math.round((1 - pigment.K[1] / 10) * 240 + 15)
  const b = Math.round((1 - pigment.K[2] / 10) * 240 + 15)
  return `rgb(${r}, ${g}, ${b})`
}
