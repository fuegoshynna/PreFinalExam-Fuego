import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Star } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { Product } from './Products'
import { formatCurrency, type CurrencyCode } from './currency'

export type ProductReview = {
  id: number
  rating: number
  comment: string
  createdAt: string
}

type ProductDetailProps = {
  product: Product
  reviews: ProductReview[]
  onBack: () => void
  onAddToCart: (product: Product, quantity: number, selectedSize?: string) => void
  onAddReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void
  currency: CurrencyCode
}

export default function ProductDetail({
  product,
  reviews,
  onBack,
  onAddToCart,
  onAddReview,
  currency,
}: ProductDetailProps) {
  const colorOptions = product.colorOptions ?? []
  const images = [...new Set([...(product.images?.length ? product.images : [product.image]), ...colorOptions.map((option) => option.image)])]
  const [activeImage, setActiveImage] = useState(() => {
    const firstColorImage = colorOptions[0]?.image
    return firstColorImage ? images.indexOf(firstColorImage) : 0
  })
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.name ?? '')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [quantityError, setQuantityError] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const availableStock = product.stock
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedComment = comment.trim()
    if (!trimmedComment) return
    onAddReview({ rating, comment: trimmedComment })
    setComment('')
    setRating(5)
  }

  return (
    <section className="space-y-10">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 dark:bg-zinc-900">
            <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImage((index) => (index - 1 + images.length) % images.length)}
                  aria-label="Previous product image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-900 shadow"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage((index) => (index + 1) % images.length)}
                  aria-label="Next product image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-900 shadow"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show product image ${index + 1}`}
                  aria-current={index === activeImage}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${activeImage === index ? 'border-lime-500' : 'border-transparent'}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:py-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{product.category}</p>
            <h1 className="font-serif text-3xl font-semibold md:text-4xl">{product.name}</h1>
            <p className="text-2xl font-semibold">{formatCurrency(product.price, currency)}</p>
            <p className={product.stock < 5 ? 'font-semibold text-red-600' : 'text-zinc-600 dark:text-zinc-300'}>
              {availableStock === 0
                ? 'No Stock'
                : product.stock < 5
                  ? `Low Stock — ${availableStock} available`
                  : `${availableStock} in stock`}
            </p>
          </div>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{product.description}</p>

          {colorOptions.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold">
                Color{selectedColor ? `: ${selectedColor}` : ''}
              </legend>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={`${option.name}-${option.image}`}
                    type="button"
                    onClick={() => {
                      setSelectedColor(option.name)
                      setActiveImage(images.indexOf(option.image))
                    }}
                    aria-label={`Select ${option.name} color`}
                    aria-pressed={selectedColor === option.name}
                    className={`overflow-hidden rounded-xl border-2 transition ${selectedColor === option.name ? 'border-lime-500 ring-2 ring-lime-500/30' : 'border-transparent hover:border-slate-400'}`}
                  >
                    <img src={option.image} alt={option.name} className="h-16 w-16 object-cover" />
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {(product.sizes?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <legend className="text-sm font-semibold">
                Size{selectedSize ? `: ${selectedSize}` : ' — choose a size'}
              </legend>
              <select
                value={selectedSize}
                onChange={(event) => {
                  setSelectedSize(event.target.value)
                  setQuantityError('')
                }}
                aria-label="Choose product size"
                className="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="">Choose a size</option>
                {product.sizes?.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
          )}

          {product.specifications.length > 0 && (
            <dl className="grid grid-cols-2 gap-3 border-y border-slate-200 py-4 text-sm dark:border-zinc-800">
              {product.specifications.map((specification) => (
                <div key={`${specification.name}-${specification.value}`}>
                  <dt className="text-zinc-500">{specification.name}</dt>
                  <dd className="font-medium">{specification.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-slate-300 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => {
                  setQuantity((value) => Math.max(0, value - 1))
                  setQuantityError('')
                }}
                disabled={quantity <= 0}
                aria-label="Decrease quantity"
                className="p-3 disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center font-semibold" aria-live="polite">{quantity}</span>
              <button
                type="button"
                onClick={() => {
                  setQuantity((value) => Math.min(availableStock, value + 1))
                  setQuantityError('')
                }}
                disabled={quantity >= availableStock}
                aria-label="Increase quantity"
                className="p-3 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (quantity === 0) {
                  setQuantityError('Please add a quantity before adding this product to your cart.')
                  return
                }
                if (product.sizes?.length && !selectedSize) {
                  setQuantityError('Please choose a size before adding this product to your cart.')
                  return
                }
                onAddToCart(product, quantity, selectedSize || undefined)
                setQuantityError('')
              }}
              disabled={availableStock === 0}
              className="min-w-48 flex-1 rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-lime-400 dark:text-zinc-950"
            >
              {availableStock === 0 ? 'No Stock' : 'Add to Cart'}
            </button>
          </div>
          {quantityError && <p role="alert" className="text-sm font-medium text-red-600">{quantityError}</p>}
        </div>
      </div>

      <section className="space-y-6 border-t border-slate-200 pt-8 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-semibold">Customer Reviews</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
            {reviews.length ? (
              <><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {averageRating.toFixed(1)} out of 5 · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</>
            ) : 'Be the first to review this product.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={submitReview} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="font-semibold">Write a review</h3>
            <fieldset>
              <legend className="mb-2 text-sm text-zinc-500">Your rating</legend>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`Rate ${value} out of 5`}
                    aria-pressed={rating === value}
                    className="p-1"
                  >
                    <Star className={`h-5 w-5 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-medium">
              Comment
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share your experience..."
                className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent p-3 font-normal dark:border-zinc-700"
              />
            </label>
            <button type="submit" className="rounded-full bg-lime-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-lime-400">
              Submit Review
            </button>
          </form>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
                No reviews yet. Your review will appear here.
              </p>
            ) : reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-200 p-5 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star key={value} className={`h-4 w-4 ${value <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                    ))}
                  </div>
                  <time className="text-xs text-zinc-500">{review.createdAt}</time>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{review.comment}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}
