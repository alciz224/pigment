interface ProportionEntry {
  name: string
  weight: number
}

interface ColorPreviewProps {
  rgb: [number, number, number] | null
  proportions: ProportionEntry[]
}

export default function ColorPreview({ rgb, proportions }: ColorPreviewProps) {
  if (!rgb) {
    return (
      <section className="island-shell rounded-2xl p-6">
        <div className="flex h-64 items-center justify-center rounded-lg bg-[var(--surface)]">
          <p className="text-[var(--sea-ink-soft)]">
            Mixez au moins 2 pigments pour voir le résultat
          </p>
        </div>
      </section>
    )
  }

  const [r, g, b] = rgb
  const hex = '#' + rgb.map(n => n.toString(16).padStart(2, '0')).join('')
  const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 128
    ? 'text-[var(--sea-ink)]'
    : 'text-white'

  return (
    <section className="island-shell rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
        Résultat
      </h2>
      <div
        className="mb-4 flex h-56 items-center justify-center rounded-lg shadow-inner transition-colors duration-300"
        style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
      >
        <span className={`text-2xl font-bold ${textColor} drop-shadow-lg`}>
          {hex.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-[var(--surface)] p-3 text-center">
          <p className="text-xs text-[var(--sea-ink-soft)]">R</p>
          <p className="text-xl font-bold text-[var(--sea-ink)]">{r}</p>
        </div>
        <div className="rounded-lg bg-[var(--surface)] p-3 text-center">
          <p className="text-xs text-[var(--sea-ink-soft)]">G</p>
          <p className="text-xl font-bold text-[var(--sea-ink)]">{g}</p>
        </div>
        <div className="rounded-lg bg-[var(--surface)] p-3 text-center">
          <p className="text-xs text-[var(--sea-ink-soft)]">B</p>
          <p className="text-xl font-bold text-[var(--sea-ink)]">{b}</p>
        </div>
      </div>
      {proportions.length > 0 && (
        <div className="mt-4 border-t border-[var(--line)] pt-4">
          <p className="mb-2 text-sm font-medium text-[var(--sea-ink-soft)]">
            Mélange:
          </p>
          <ul className="space-y-1 text-sm text-[var(--sea-ink)]">
            {proportions.map(({ name, weight }) => (
              <li key={name}>
                {name}: {weight.toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
