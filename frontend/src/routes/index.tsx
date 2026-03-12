import { createFileRoute } from '@tanstack/react-router'
import { usePigmentMix } from '../lib/hooks/usePigmentMix'
import PaletteSelector from '../components/PaletteSelector'
import MinimalSlider from '../components/MinimalSlider'
import ColorPreview from '../components/ColorPreview'
import { useMemo } from 'react'

export const Route = createFileRoute('/')({
  component: PigmentMixerPage,
})

function PigmentMixerPage() {
  const {
    pigments,
    isLoading,
    error,
    selectedIds,
    proportions,
    mixResult,
    togglePigment,
    updateProportion,
  } = usePigmentMix()

  const selectedPigments = useMemo(
    () => pigments.filter(p => selectedIds.includes(p.id)),
    [pigments, selectedIds]
  )

  // Split view mode: Section 1 (Palette) + Section 2 (Proportions + Result)
  const total = selectedPigments.reduce((sum, p) => sum + (proportions[p.id] ?? 0), 0)

  if (isLoading) {
    return (
      <main className="scroll-container min-h-screen overflow-y-auto">
        <section className="min-h-screen flex items-center justify-center">
          <div className="island-shell rounded-2xl p-10 text-center">
            <p className="text-[var(--sea-ink-soft)]">Chargement des pigments...</p>
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="scroll-container min-h-screen overflow-y-auto">
        <section className="min-h-screen flex items-center justify-center">
          <div className="island-shell rounded-2xl p-10 text-center">
            <p className="mb-4 text-red-500">Erreur: {error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]"
            >
              Réessayer
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="scroll-container min-h-screen overflow-y-auto">
      {/* Section 1: Hero + Palette */}
      <section className="min-h-screen bg-[var(--bg)] p-6 pb-12">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Hero */}
          <div className="text-center pt-6">
            <div className="mb-2 inline-block rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--kicker)]">
              Application de Mélange
            </div>
            <h1 className="display-title text-4xl leading-[1.02] font-bold text-[var(--sea-ink)] sm:text-5xl">
              Pigment Mixer
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-[var(--sea-ink-soft)]">
              Explorez le mélange de pigments selon le modèle Kubelka-Munk.
              Sélectionnez 2 à 7 pigments et ajustez leurs proportions.
            </p>
          </div>

          {/* Palette */}
          <div className="min-h-[400px]">
            <PaletteSelector
              pigments={pigments}
              selectedIds={selectedIds}
              onToggle={togglePigment}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Proportions + Result */}
      <section className="bg-[var(--surface-weak)] p-6 pb-12">
        <div className="min-h-full mx-auto grid h-full grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {/* Left: Minimal Proportions sliders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h2 className="text-base font-semibold text-[var(--sea-ink)]">
                Proportions
              </h2>
              <div className={`flex items-center gap-2 ${total === 100 ? 'text-[var(--palm)]' : 'text-[var(--lagoon-deep)]'}`}>
                <span className="text-lg font-bold">{total.toFixed(0)}%</span>
                {total !== 100 && (
                  <span className="text-xs text-[var(--sea-ink-soft)]">
                    (manque {((100 - total).toFixed(0))}%)
                  </span>
                )}
              </div>
            </div>

            {selectedPigments.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]">
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  Sélectionnez 2 à 7 pigments
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedPigments.map(pigment => (
                  <MinimalSlider
                    key={pigment.id}
                    pigment={pigment}
                    value={proportions[pigment.id] || 0}
                    onChange={updateProportion}
                    mixRgb={mixResult?.rgb ?? null}
                    total={total}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Result */}
          <div className="flex flex-col">
            <ColorPreview
              rgb={mixResult?.rgb ?? null}
              proportions={proportions.length > 0 ? Object.entries(proportions).map(([id, weight]) => ({
                name: selectedPigments.find(p => p.id === parseInt(id))?.name || '',
                weight
              })) : []}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
