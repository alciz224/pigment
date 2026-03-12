import { useState, useEffect } from 'react'
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

  // Clear picked color when result changes (optional - uncomment if desired)
  // useEffect(() => {
  //   setPickedFromImage(null)
  // }, [rgb])

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

  const getContrastColor = (rgb: [number, number, number]) => {
    const [r, g, b] = rgb
    return (r * 0.299 + g * 0.587 + b * 0.114) > 128
      ? 'text-[var(--sea-ink)]'
      : 'text-white'
  }

  return (
    <section className="island-shell relative rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
        Résultat
      </h2>

      {/* Large color preview with picked color badge */}
      <div
        className="mb-4 relative flex h-56 items-center justify-center rounded-lg shadow-inner transition-colors duration-300"
        style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
      >
        {/* Main HEX text - shifted when badge is present */}
        <span className={`text-2xl font-bold ${textColor} drop-shadow-lg ${pickedFromImage ? 'mr-16' : ''}`}>
          {hex.toUpperCase()}
        </span>

        {/* Picked color badge - positioned inside the color box, top-right */}
        {pickedFromImage && (
          <div
            className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-black/20 backdrop-blur-sm border-2 border-white/40 px-2.5 py-0.5 shadow-lg transition-all duration-200"
            title={`Picked: #${pickedFromImage.map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`}
          >
            <div
              className="h-4 w-4 rounded-full border-2 border-white/60"
              style={{ backgroundColor: `rgb(${pickedFromImage[0]}, ${pickedFromImage[1]}, ${pickedFromImage[2]})` }}
            />
            <span className={`text-[10px] font-bold uppercase ${getContrastColor(pickedFromImage)}`}>
              {pickedFromImage.map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}
            </span>
          </div>
        )}
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

      {/* Image Color Picker button */}
      <div className="my-4 flex justify-center border-t border-[var(--line)] pt-4">
        <ImageColorPicker
          onColorPicked={handlePickColor}
          pickedColor={pickedFromImage}
        />
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
