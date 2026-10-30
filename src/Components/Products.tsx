import { ChevronDown, ChevronLeft, ChevronRight, Plus, Star } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, type CurrencyCode } from './currency'
import ProductImageViewer from './ProductImageViewer'

export type Product = {
  id: number
  name: string
  category: 'Clothing' | 'Jewelry' | 'Shoes'
  prices: Record<CurrencyCode, number>
  stock: number
  featured: boolean
  image: string
  images?: string[]
  description: string
  specifications: { name: string; value: string }[]
  colorOptions?: { name: string; image: string }[]
  sizes?: string[]
  isNew?: boolean
}

export type CartItem = Product & { quantity: number; selectedSize?: string }

type ProductCardProps = {
  product: Product
  isWishlisted: boolean
  onAddToCart: (product: Product, selectedSize?: string) => void
  onToggleWishlist: (productId: number) => void
  compact?: boolean
  onSelectProduct: (product: Product) => void
  currency: CurrencyCode
}

function ProductCard({ product, isWishlisted, onAddToCart, onToggleWishlist, compact = false, onSelectProduct, currency }: ProductCardProps) {
  const isUnavailable = product.stock === 0
  const images = [...new Set([
    product.image,
    ...(product.images ?? []),
    ...(product.colorOptions?.map((option) => option.image) ?? []),
  ])]
  const [activeImage, setActiveImage] = useState(0)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)

  return (
    <article
      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-lime-500 dark:border-zinc-800 dark:bg-zinc-900"
      onClick={() => onSelectProduct(product)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelectProduct(product)
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${product.name} details`}
    >
      <div>
        <div className="relative aspect-square overflow-hidden">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setIsImageViewerOpen(true)
            }}
            aria-label={`View ${product.name} images`}
            className="absolute inset-0 h-full w-full cursor-zoom-in"
          >
            <img
              src={images[activeImage] ?? product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveImage((index) => (index - 1 + images.length) % images.length)
                }}
                aria-label={`Previous ${product.name} image`}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-zinc-900 shadow transition hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveImage((index) => (index + 1) % images.length)
                }}
                aria-label={`Next ${product.name} image`}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-zinc-900 shadow transition hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setActiveImage(index)
                    }}
                    aria-label={`Show ${product.name} image ${index + 1}`}
                    aria-current={index === activeImage}
                    className={`h-1.5 rounded-full transition-all ${index === activeImage ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
          {product.isNew && (
            <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow backdrop-blur-md">
              New Items
            </span>
          )}
          {!compact && <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggleWishlist(product.id)
            }}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-zinc-700 backdrop-blur-md transition hover:scale-110 dark:bg-zinc-900/80 dark:text-zinc-200"
          >
            <Star className={`h-4 w-4 ${isWishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>}
        </div>
        <div className="space-y-2 p-4">
          {!compact && <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{product.category}</span>}
          <h3 className="text-sm font-semibold">{product.name}</h3>
          {!compact && <>
          <p className={product.stock < 5 ? 'text-xs font-semibold text-red-600' : 'text-xs text-zinc-500 dark:text-zinc-400'}>
            {product.stock === 0 ? 'No Stock' : product.stock < 5 ? `Low Stock — ${product.stock} left` : `${product.stock} in stock`}
          </p>
          <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{product.description}</p>
          {product.specifications.length > 0 && (
            <ul className="space-y-1 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {product.specifications.map((specification) => (
                <li key={`${specification.name}-${specification.value}`}>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{specification.name}:</span> {specification.value}
                </li>
              ))}
            </ul>
          )}
          </>}
        </div>
      </div>
      <div className="flex items-center justify-between p-4 pt-0">
        <span className="text-base font-bold">{formatCurrency(product.prices[currency], currency)}</span>
        {!compact && <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onAddToCart(product, product.sizes?.[0])
          }}
          disabled={isUnavailable}
          className="flex items-center space-x-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-lime-400 dark:text-black"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{isUnavailable ? 'No Stock' : 'Add'}</span>
        </button>}
      </div>
      {isImageViewerOpen && (
        <ProductImageViewer
          images={images}
          activeImage={activeImage}
          productName={product.name}
          onClose={() => setIsImageViewerOpen(false)}
          onImageChange={setActiveImage}
        />
      )}
    </article>
  )
}

type ProductListProps = {
  products: Product[]
  wishlist: number[]
  onSelectProduct: (product: Product) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
  currency: CurrencyCode
}

export function FeaturedProducts({ products, wishlist, onAddToCart, onToggleWishlist, onSelectProduct, currency }: ProductListProps) {
  const featuredProducts = [
    ...products.filter((product) => product.isNew),
    ...products.filter((product) => product.featured && !product.isNew),
  ].slice(0, 4)

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlist.includes(product.id)}
            compact
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            currency={currency}
          />
        ))}
      </div>
    </section>
  )
}

type ProductsProps = ProductListProps & {
  searchQuery: string
  limit?: number
  compact?: boolean
  currency: CurrencyCode
}

export default function Products({ products, wishlist, searchQuery, onAddToCart, onToggleWishlist, onSelectProduct, limit, compact = false, currency }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch = product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
  const displayedProducts = limit === undefined ? filteredProducts : filteredProducts.slice(0, limit)

  return (
    <section className="space-y-6 border-t border-slate-200 pt-4 dark:border-zinc-800">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {limit === undefined ? `Browse all ${filteredProducts.length} products` : `Showing ${displayedProducts.length} of ${filteredProducts.length} products`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="category-select" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Category:
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-4 pr-10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-lime-400"
            >
              <option value="All">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Shoes">Shoes</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 opacity-60" />
          </div>
        </div>
      </div>

      {displayedProducts.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              compact={compact}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              currency={currency}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-zinc-500">No products found in this category.</div>
      )}
    </section>
  )
}
