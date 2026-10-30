import { Code2, Coins, Moon, Search, ShoppingBag, Star, Sun } from 'lucide-react'
import { currencies, type CurrencyCode } from './currency'

export type AppTab = 'home' | 'products' | 'cart'

type HeaderProps = {
  activeTab: AppTab
  darkMode: boolean
  searchQuery: string
  wishlistCount: number
  cartItemCount: number
  currency: CurrencyCode
  onTabChange: (tab: AppTab) => void
  onSearchChange: (query: string) => void
  onThemeToggle: () => void
  onWishlistOpen: () => void
  onInspectorToggle: () => void
  onCurrencyChange: (currency: CurrencyCode) => void
}

export default function Header({
  activeTab,
  darkMode,
  searchQuery,
  wishlistCount,
  cartItemCount,
  currency,
  onTabChange,
  onSearchChange,
  onThemeToggle,
  onWishlistOpen,
  onInspectorToggle,
  onCurrencyChange,
}: HeaderProps) {
  const tabClass = (tab: AppTab) =>
    `rounded-full px-4 py-2 transition ${activeTab === tab ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-slate-200 text-slate-900') : 'hover:opacity-70'}`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className="font-serif text-2xl font-extrabold uppercase tracking-widest transition hover:opacity-80"
          >
            FLÂNEUR
          </button>
          <nav className="hidden space-x-1 text-sm font-medium md:flex" aria-label="Main navigation">
            <button type="button" onClick={() => onTabChange('home')} className={tabClass('home')}>Home</button>
            <button type="button" onClick={() => onTabChange('products')} className={tabClass('products')}>Products</button>
            <button type="button" onClick={() => onTabChange('cart')} className={tabClass('cart')}>
              Cart ({cartItemCount})
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4 opacity-70" aria-hidden="true" />
            <select
              aria-label="Select currency"
              title="Change currency"
              value={currency}
              onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
              className="max-w-24 cursor-pointer rounded-lg border border-slate-300 bg-transparent px-1.5 py-1 text-[10px] font-semibold focus:outline-none focus:ring-2 focus:ring-lime-500 dark:border-zinc-700"
            >
              {currencies.map((option) => (
                <option key={option.code} value={option.code} className="bg-white text-zinc-900">
                  {option.label} {option.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="relative hidden sm:block">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-40 rounded-full border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-slate-900 md:w-56 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:ring-lime-400"
              aria-label="Search products"
            />
            <Search className="absolute left-3 top-2 h-4 w-4 opacity-50" />
          </div>
          <button type="button" onClick={onWishlistOpen} className="relative rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-zinc-800" title="Wishlist" aria-label="Open wishlist">
            <Star className={`h-5 w-5 ${wishlistCount ? 'fill-amber-400 text-amber-400' : ''}`} />
            {wishlistCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">{wishlistCount}</span>}
          </button>
          <button type="button" onClick={() => onTabChange('cart')} className="relative rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-zinc-800" title="Shopping Cart" aria-label="Open shopping cart">
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime-500 text-[10px] font-bold text-black">{cartItemCount}</span>}
          </button>
          <button type="button" onClick={onThemeToggle} className="rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-zinc-800" title="Toggle theme" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5" />}
          </button>
          <button type="button" onClick={onInspectorToggle} className="rounded-full bg-blue-600/10 p-2 text-blue-600 transition hover:opacity-80 dark:bg-blue-400/20 dark:text-blue-400" title="VS Code source files" aria-label="Toggle source inspector">
            <Code2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:ring-lime-400"
            aria-label="Search products"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" aria-hidden="true" />
        </div>
      </div>
      <nav className="flex justify-center gap-2 border-t border-slate-200 px-2 py-2 text-xs font-medium md:hidden dark:border-zinc-800" aria-label="Mobile navigation">
        <button type="button" onClick={() => onTabChange('home')} className={tabClass('home')}>Home</button>
        <button type="button" onClick={() => onTabChange('products')} className={tabClass('products')}>Products</button>
        <button type="button" onClick={() => onTabChange('cart')} className={tabClass('cart')}>Cart ({cartItemCount})</button>
      </nav>
    </header>
  )
}
