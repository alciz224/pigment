import { createFileRoute } from '@tanstack/react-router'
import { usePigmentMix } from '../lib/hooks/usePigmentMix'
import PaletteSelector from '../components/PaletteSelector'
import ImprovedSlider from '../components/ImprovedSlider'
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
      <main className="scroll-container h-screen overflow-y-scroll snap-y snap-mandatory">
        <section className="h-screen flex items-center justify-center snap-start">
          <div className="island-shell rounded-2xl p-10 text-center">
            <p className="text-[var(--sea-ink-soft)]">Chargement des pigments...</p>
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="scroll-container h-screen overflow-y-scroll snap-y snap-mandatory">
        <section className="h-screen flex items-center justify-center snap-start">
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
    <main className="scroll-container h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* Section 1: Hero + Palette */}
      <section className="snap-start min-h-screen overflow-y-auto bg-[var(--bg)] p-6">
        <div className="mx-auto h-full max-w-6xl space-y-6">
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
          <div className="flex-1 min-h-0 [&>*]:min-h-full">
            <PaletteSelector
              pigments={pigments}
              selectedIds={selectedIds}
              onToggle={togglePigment}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Proportions + Result */}
      <section className="snap-start min-h-screen overflow-y-auto bg-[var(--surface-weak)] p-6">
        <div className="min-h-full mx-auto grid h-full grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {/* Top/Left: Proportions (vertical sliders) */}
          <div className="island-shell rounded-2xl p-6 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
                  Proportions
                </h2>
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  {selectedPigments.length} pigment{selectedPigments.length !== 1 ? 's' : ''} sélectionné{selectedPigments.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className={`text-right`}>
                <div className={`text-2xl font-bold ${total === 100 ? 'text-[var(--palm)]' : 'text-[var(--lagoon-deep)]'}`}>
                  {total.toFixed(0)}%
                </div>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  {total === 100 ? '✓ Somme à 100%' : `Manque ${(100 - total).toFixed(0)}%`}
                </p>
              </div>
            </div>

            {selectedPigments.length === 0 ? (
              <div className="flex h-[calc(100%-80px)] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-strong)]">
                  <svg className="h-8 w-8 text-[var(--lagoon-deep)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-[var(--sea-ink)]">
                  Aucun pigment sélectionné
                </p>
                <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                  Sélectionnez des pigments pour créer votre mélange
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="mt-4 rounded-full border border-[var(--lagoon-deep)] bg-[var(--lagoon-deep)]/10 px-4 py-2 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:bg-[var(--lagoon-deep)] hover:text-white"
                >
                  Voir la palette
                </button>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {selectedPigments.map(pigment => (
                  <ImprovedSlider
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
            {/* Large color preview */}
            <div className="island-shell rounded-2xl p-6 flex-1 flex flex-col overflow-hidden">
              <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
                Résultat
              </h2>
              <div className="flex-1 flex items-center justify-center">
                {mixResult ? (
                  <div className="w-full flex flex-col items-center gap-4">
                    <div
                      className="w-full h-48 rounded-lg shadow-inner transition-colors duration-300"
                      style={{ backgroundColor: `rgb(${mixResult.rgb[0]}, ${mixResult.rgb[1]}, ${mixResult.rgb[2]})` }}
                    />
                    <div className="text-center">
                      <p className="text-3xl font-bold font-mono tracking-wider text-[var(--sea-ink)]">
                        #{mixResult.rgb.map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}
                      </p>
                      <div className="mt-2 flex justify-center gap-4">
                        <span className="text-lg">
                          <span className="font-bold text-[var(--sea-ink)]">R:</span> {mixResult.rgb[0]}
                        </span>
                        <span className="text-lg">
                          <span className="font-bold text-[var(--sea-ink)]">G:</span> {mixResult.rgb[1]}
                        </span>
                        <span className="text-lg">
                          <span className="font-bold text-[var(--sea-ink)]">B:</span> {mixResult.rgb[2]}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[var(--sea-ink-soft)]">
                    <p className="text-lg">Sélectionnez au moins 2 pigments</p>
                    <p className="text-sm mt-2">pour voir le résultat du mélange</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
