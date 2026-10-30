import { useEffect, useState } from 'react'
import Cart from './Components/Cart'
import CodeInspector from './Components/CodeInspector'
import Header, { type AppTab } from './Components/Header'
import HeroSlider from './Components/HeroSlider'
import ProductDetail, { type ProductReview } from './Components/ProductDetail'
import { AddProductModal, WishlistDrawer } from './Components/ProductModals'
import Products, { FeaturedProducts, type CartItem, type Product } from './Components/Products'
import { initialProducts } from './Components/productData'
import type { CurrencyCode } from './Components/currency'

export default function App() {
  const [products, setProducts] = useState(initialProducts)
  const [activeTab, setActiveTab] = useState<AppTab>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [reviewsByProduct, setReviewsByProduct] = useState<Record<number, ProductReview[]>>({})
  const [currency, setCurrency] = useState<CurrencyCode>('USD')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    if (product.stock < quantity || quantity <= 0) return

    setProducts((items) => items.map((item) => item.id === product.id
      ? { ...item, stock: item.stock - quantity }
      : item))
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id && item.selectedSize === selectedSize)
      return existing
        ? items.map((item) => item.id === product.id
          && item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + quantity, stock: product.stock - quantity }
          : item)
        : [...items, { ...product, stock: product.stock - quantity, quantity, selectedSize }]
    })
  }

  const updateCartQuantity = (cartItem: CartItem, delta: number) => {
    const product = products.find((item) => item.id === cartItem.id)
    if (!product || !cartItem || delta === 0) return
    if (delta > 0 && product.stock < delta) return

    setProducts((items) => items.map((item) => item.id === cartItem.id
      ? { ...item, stock: item.stock - delta }
      : item))
    setCart((items) => items.flatMap((item) => {
      if (item.id !== cartItem.id || item.selectedSize !== cartItem.selectedSize) return [item]
      const quantity = item.quantity + delta
      return quantity > 0
        ? [{ ...item, quantity, stock: item.stock - delta }]
        : []
    }))
  }

  const removeCartItem = (cartItem: CartItem) => {
    if (!cartItem) return
    setProducts((items) => items.map((item) => item.id === cartItem.id
      ? { ...item, stock: item.stock + cartItem.quantity }
      : item))
    setCart((items) => items.filter((item) => item.id !== cartItem.id || item.selectedSize !== cartItem.selectedSize))
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((items) => items.includes(productId)
      ? items.filter((id) => id !== productId)
      : [...items, productId])
  }

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts((items) => [{ ...newProduct, id: Date.now(), featured: true, isNew: true }, ...items])
    setIsAddModalOpen(false)
  }

  const openProduct = (product: Product) => {
    setSelectedProductId(product.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedProduct = products.find((product) => product.id === selectedProductId)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header
        activeTab={activeTab}
        darkMode={darkMode}
        searchQuery={searchQuery}
        wishlistCount={wishlist.length}
        cartItemCount={cartItemCount}
        currency={currency}
        onTabChange={(tab) => {
          setSelectedProductId(null)
          setActiveTab(tab)
        }}
        onSearchChange={(query) => {
          setSearchQuery(query)
          if (query.trim()) {
            setSelectedProductId(null)
            setActiveTab('products')
          }
        }}
        onThemeToggle={() => setDarkMode((enabled) => !enabled)}
        onWishlistOpen={() => setIsWishlistOpen(true)}
        onInspectorToggle={() => setIsInspectorOpen((open) => !open)}
        onCurrencyChange={setCurrency}
      />

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {selectedProduct ? (
          <ProductDetail
            key={selectedProduct.id}
            product={selectedProduct}
            reviews={reviewsByProduct[selectedProduct.id] ?? []}
            onBack={() => {
              setSelectedProductId(null)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onAddToCart={addToCart}
            currency={currency}
            onAddReview={(review) => setReviewsByProduct((current) => ({
              ...current,
              [selectedProduct.id]: [
                ...(current[selectedProduct.id] ?? []),
                { ...review, id: Date.now(), createdAt: new Date().toLocaleDateString() },
              ],
            }))}
          />
        ) : activeTab === 'home' ? (
          <>
            <HeroSlider />
            <FeaturedProducts products={products} wishlist={wishlist} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} onSelectProduct={openProduct} currency={currency} />
            <Products
              products={products}
              wishlist={wishlist}
              searchQuery={searchQuery}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              onSelectProduct={openProduct}
              limit={4}
              compact
              currency={currency}
            />
          </>
        ) : !selectedProduct && activeTab === 'products' ? (
          <Products
            products={products}
            wishlist={wishlist}
            searchQuery={searchQuery}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            onSelectProduct={openProduct}
            currency={currency}
          />
        ) : !selectedProduct && activeTab === 'cart' ? (
          <Cart
            cart={cart}
            onQuantityChange={updateCartQuantity}
            onRemove={removeCartItem}
            onTabChange={setActiveTab}
            currency={currency}
          />
        ) : null}
      </main>

      <div className="fixed bottom-6 right-6 z-30">
        <button type="button" onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 rounded-full bg-lime-500 px-6 py-3.5 font-bold text-zinc-950 shadow-xl transition hover:scale-105 hover:bg-lime-400 active:scale-95">
          <span className="text-xl leading-none">+</span>
          <span>Add New</span>
        </button>
      </div>

      <AddProductModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onCreate={addProduct} />
      {isWishlistOpen && (
        <WishlistDrawer
          products={products}
          wishlist={wishlist}
          currency={currency}
          onClose={() => setIsWishlistOpen(false)}
          onToggleWishlist={toggleWishlist}
        />
      )}
      <CodeInspector open={isInspectorOpen} onClose={() => setIsInspectorOpen(false)} />
    </div>
  )
}
