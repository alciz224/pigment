import { useEffect, useState } from 'react'
import ImageColorPicker from './ImageColorPicker'

interface ProportionEntry {
  name: string
  weight: number
}

interface ColorPreviewProps {
  rgb: [number, number, number] | null
  proportions: ProportionEntry[]
}

export default function ColorPreview({ rgb, proportions }: ColorPreviewProps) {
  const [pickedFromImage, setPickedFromImage] = useState<[number, number, number] | null>(null)

  const handlePickColor = (rgb: [number, number, number], hex: string) => {
    setPickedFromImage(rgb)
    console.log('Picked color from image:', { rgb, hex })
  }

  // Clear picked color when result changes significantly (optional)
  useEffect(() => {
    // You could reset the picked color if the mix result changes
    // setPickedFromImage(null)
  }, [rgb])

  if (!rgb) {
    return (
      <section className="island-shell rounded-2xl p-6">
        <div className="relative flex h-64 items-center justify-center rounded-lg bg-[var(--surface)]">
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
    <section className="island-shell relative rounded-2xl p-6">
      {/* Floating picked color indicator - fixed to the card's top-right */}
      {pickedFromImage && (
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full bg-[var(--surface)]/80 backdrop-blur-sm border border-[var(--line)] px-3 py-1.5 shadow-lg">
          <div
            className="h-6 w-6 rounded-full border-2 border-white/50 shadow-sm"
            style={{ backgroundColor: `rgb(${pickedFromImage[0]}, ${pickedFromImage[1]}, ${pickedFromImage[2]})` }}
          />
          <span className="text-xs font-mono font-semibold text-[var(--sea-ink)]">
            #{pickedFromImage.map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}
          </span>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
        Résultat
      </h2>

      {/* Large color preview */}
      <div
        className="mb-4 flex h-56 items-center justify-center rounded-lg shadow-inner transition-colors duration-300"
        style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
      >
        <span className={`text-2xl font-bold ${textColor} drop-shadow-lg`}>
          {hex.toUpperCase()}
        </span>
      </div>

      {/* Image Color Picker button */}
      <div className="my-4 flex justify-center border-t border-[var(--line)] pt-4">
        <ImageColorPicker onColorPicked={handlePickColor} />
      </div>

      {/* RGB values grid */}
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

      {/* Mix proportions */}
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
