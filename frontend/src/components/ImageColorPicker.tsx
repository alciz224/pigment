import { useRef, useState, useCallback, useEffect } from 'react'

interface ImageColorPickerProps {
  onColorPicked: (rgb: [number, number, number], hex: string) => void
  initialColor?: [number, number, number] | null
}

export default function ImageColorPicker({ onColorPicked, initialColor }: ImageColorPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [pickedColor, setPickedColor] = useState<[number, number, number] | null>(initialColor)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [hoverColor, setHoverColor] = useState<[number, number, number] | null>(null)
  const [magnifierPosition, setMagnifierPosition] = useState<{ x: number; y: number } | null>(null)

  const openDialog = () => {
    fileInputRef.current?.click()
  }

  const closePicker = () => {
    setIsPickerOpen(false)
    setImageUrl(null)
    setPickedColor(null)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setHoverColor(null)
    setMagnifierPosition(null)
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string)
        setIsPickerOpen(true)
        setPickedColor(null)
        setZoom(1)
        setPan({ x: 0, y: 0 })
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const getPixelColor = useCallback((clientX: number, clientY: number) => {
    const img = imageRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return null

    const rect = img.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    // Account for zoom and pan
    const scaledX = (x - pan.x) / zoom
    const scaledY = (y - pan.y) / zoom

    // Check if within image bounds
    if (scaledX < 0 || scaledY < 0 || scaledX >= img.naturalWidth || scaledY >= img.naturalHeight) {
      return null
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    ctx.drawImage(img, 0, 0)

    const pixel = ctx.getImageData(Math.floor(scaledX), Math.floor(scaledY), 1, 1).data
    return [pixel[0], pixel[1], pixel[2]] as [number, number, number]
  }, [zoom, pan])

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const rgb = getPixelColor(e.clientX, e.clientY)
    if (rgb) {
      setPickedColor(rgb)
      onColorPicked(rgb, `#${rgb.map(n => n.toString(16).padStart(2, '0')).join('')}`)
      setTimeout(closePicker, 500) // Close after a short delay to show feedback
    }
  }, [getPixelColor, onColorPicked])

  const handleImageMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const rgb = getPixelColor(e.clientX, e.clientY)
    if (rgb) {
      setHoverColor(rgb)
      setMagnifierPosition({ x: e.clientX, y: e.clientY })
    } else {
      setHoverColor(null)
      setMagnifierPosition(null)
    }
  }, [getPixelColor])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.min(Math.max(0.1, prev * delta), 10))
  }, [])

  const zoomIn = () => setZoom(prev => Math.min(10, prev * 1.5))
  const zoomOut = () => setZoom(prev => Math.max(0.1, prev / 1.5))
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPickerOpen) return
      if (e.key === 'Escape') closePicker()
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-') zoomOut()
      if (e.key === '0') resetZoom()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPickerOpen, zoomIn, zoomOut, resetZoom])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPickerOpen) {
        closePicker()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isPickerOpen])

  // Preload image for canvas extraction
  const imageLoaded = useRef(false)

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Picker Button */}
      <button
        onClick={openDialog}
        className="flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-xs font-medium text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.657a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Pick from Image
      </button>

      {/* Picked Color Indicator (shown when color is picked) */}
      {pickedColor && (
        <div
          className="absolute -right-2 -top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--surface)] shadow-lg ring-2 ring-[var(--lagoon)]/30 transition-all animate-bounce"
          style={{ backgroundColor: `rgb(${pickedColor[0]}, ${pickedColor[1]}, ${pickedColor[2]})` }}
          title={`Picked: #${pickedColor.map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`}
        />
      )}

      {/* Image Picker Modal */}
      {isPickerOpen && imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={closePicker}>
          <div
            className="relative flex max-h-[95vh] w-full max-w-6xl flex-col rounded-xl bg-[var(--surface)] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with controls */}
            <div className="flex items-center justify-between border-b border-[var(--line)] p-3">
              <h3 className="font-semibold text-[var(--sea-ink)]">Pick Color from Image</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetZoom}
                  className="rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-1 text-xs text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={closePicker}
                  className="rounded-full p-1.5 text-[var(--sea-ink-soft)] hover:bg-[var(--surface-strong)] transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-3 border-b border-[var(--line)] p-2">
              <button
                onClick={zoomOut}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={zoom}
                  onChange={e => setZoom(parseFloat(e.target.value))}
                  className="w-32 accent-[var(--lagoon)]"
                />
                <span className="w-12 text-center text-xs font-mono text-[var(--sea-ink-soft)]">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <button
                onClick={zoomIn}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <div className="ml-2 text-xs text-[var(--sea-ink-soft)]">
                Scroll or drag to pan • Click to pick • ESC to close
              </div>
            </div>

            {/* Image container with pan/zoom */}
            <div
              className="relative flex-1 overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <div
                className="absolute"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: '0 0'
                }}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Pick color"
                  className="max-w-none cursor-crosshair select-none"
                  onClick={handleImageClick}
                  onMouseMove={handleImageMouseMove}
                  draggable={false}
                />
              </div>

              {/* Crosshair cursor indicator */}
              {magnifierPosition && hoverColor && (
                <div
                  className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-lg"
                  style={{ left: magnifierPosition.x, top: magnifierPosition.y }}
                />
              )}

              {/* Floating magnifier preview */}
              {magnifierPosition && hoverColor && (
                <div
                  className="pointer-events-none absolute transform -translate-x-1/2 -translate-y-[120%] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 shadow-xl"
                  style={{ left: magnifierPosition.x, top: magnifierPosition.y }}
                >
                  <div
                    className="h-10 w-10 rounded-md border border-[var(--line)]"
                    style={{ backgroundColor: `rgb(${hoverColor[0]}, ${hoverColor[1]}, ${hoverColor[2]})` }}
                  />
                  <div className="mt-1 text-center">
                    <p className="text-xs font-mono text-[var(--sea-ink)]">
                      #{hoverColor.map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}
                    </p>
                    <p className="text-[10px] text-[var(--sea-ink-soft)]">
                      {hoverColor[0]}, {hoverColor[1]}, {hoverColor[2]}
                    </p>
                  </div>
                  <div
                    className="mt-1 h-1 w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: `rgb(${hoverColor[0]}, ${hoverColor[1]}, ${hoverColor[2]})` }}
                  />
                  <div className="mt-1 h-1 w-full" style={{ backgroundColor: `rgb(${255 - hoverColor[0]}, ${255 - hoverColor[1]}, ${255 - hoverColor[2]})` }} />
                </div>
              )}
            </div>

            {/* Footer with picked color */}
            {pickedColor && (
              <div className="flex items-center justify-center border-t border-[var(--line)] p-3 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border-2 border-[var(--line)] shadow-inner"
                    style={{ backgroundColor: `rgb(${pickedColor[0]}, ${pickedColor[1]}, ${pickedColor[2]})` }}
                  />
                  <div>
                    <p className="text-sm font-mono font-bold text-[var(--sea-ink)]">
                      #{pickedColor.map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}
                    </p>
                    <p className="text-xs text-[var(--sea-ink-soft)]">
                      RGB({pickedColor[0]}, {pickedColor[1]}, {pickedColor[2]})
                    </p>
                  </div>
                </div>
                <div className="ml-auto text-xs text-[var(--sea-ink-soft)]">
                  Click again to pick a different color
                </div>
              </div>
            )}

            {/* Instructions when no color picked yet */}
            {!pickedColor && (
              <div className="flex items-center justify-center border-t border-[var(--line)] p-3">
                <p className="text-center text-sm text-[var(--sea-ink-soft)]">
                  Click anywhere on the image to pick a color • Zoom: {Math.round(zoom * 100)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden canvas for color extraction */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
