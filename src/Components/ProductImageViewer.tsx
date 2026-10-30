import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

type ProductImageViewerProps = {
  images: string[]
  activeImage: number
  productName: string
  onClose: () => void
  onImageChange: (index: number) => void
}

export default function ProductImageViewer({
  images,
  activeImage,
  productName,
  onClose,
  onImageChange,
}: ProductImageViewerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (images.length > 1 && event.key === 'ArrowLeft') {
        onImageChange((activeImage - 1 + images.length) % images.length)
      }
      if (images.length > 1 && event.key === 'ArrowRight') {
        onImageChange((activeImage + 1) % images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImage, images.length, onClose, onImageChange])

  if (images.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      role="presentation"
      onClick={(event) => {
        event.stopPropagation()
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${productName} images`}
        className="relative flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="absolute -top-2 right-0 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:-right-2"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          <img
            src={images[activeImage]}
            alt={`${productName} image ${activeImage + 1} of ${images.length}`}
            className="max-h-[75vh] max-w-full rounded-lg object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onImageChange((activeImage - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-2 rounded-full bg-white/90 p-2 text-zinc-900 shadow sm:left-4"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => onImageChange((activeImage + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-2 rounded-full bg-white/90 p-2 text-zinc-900 shadow sm:right-4"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
        <p className="text-sm text-white/80">{activeImage + 1} / {images.length}</p>
        {images.length > 1 && (
          <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => onImageChange(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeImage}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeImage ? 'border-lime-400' : 'border-transparent'}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
