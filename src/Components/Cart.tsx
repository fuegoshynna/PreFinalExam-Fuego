import { ShoppingBasket, Trash2 } from 'lucide-react'
import type { CartItem } from './Products'
import type { AppTab } from './Header'
import { formatCurrency, type CurrencyCode } from './currency'

type CartProps = {
  cart: CartItem[]
  onQuantityChange: (item: CartItem, delta: number) => void
  onRemove: (item: CartItem) => void
  onTabChange: (tab: AppTab) => void
  currency: CurrencyCode
}

export default function Cart({ cart, onQuantityChange, onRemove, onTabChange, currency }: CartProps) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="space-y-4 rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-zinc-800">
          <ShoppingBasket className="mx-auto h-12 w-12 text-zinc-400" />
          <p className="text-lg font-medium text-zinc-500">Your cart is currently empty.</p>
          <button type="button" onClick={() => onTabChange('products')} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-lime-400 dark:text-black">
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <article key={`${item.id}-${item.selectedSize ?? 'one-size'}`} className="flex items-center space-x-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-zinc-400">{item.category}</span>
                  <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                  {item.selectedSize && <p className="text-xs text-zinc-500 dark:text-zinc-400">Size: {item.selectedSize}</p>}
                  <p className="text-sm font-bold">{formatCurrency(item.price, currency)}</p>
                  <p className={item.stock < 5 ? 'text-xs font-semibold text-red-600' : 'text-xs text-zinc-500 dark:text-zinc-400'}>
                    {item.stock === 0 ? 'No Stock' : item.stock < 5 ? `Low Stock — ${item.stock} left` : `${item.stock} in stock`}
                  </p>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-slate-200 p-1 dark:border-zinc-800">
                  <button type="button" onClick={() => onQuantityChange(item, -1)} aria-label={`Decrease ${item.name} quantity`} className="rounded px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-zinc-800">-</button>
                  <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                  <button type="button" onClick={() => onQuantityChange(item, 1)} disabled={item.stock === 0} aria-label={`Increase ${item.name} quantity`} className="rounded px-2 py-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800">+</button>
                </div>
                <button type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item.name}`} className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/30">
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
          <aside className="h-fit space-y-6 rounded-3xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="border-b border-slate-200 pb-4 text-lg font-bold dark:border-zinc-800">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>{formatCurrency(subtotal, currency)}</span></div>
              <div className="flex justify-between text-zinc-500"><span>Shipping</span><span>Free</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold dark:border-zinc-800"><span>Total</span><span>{formatCurrency(subtotal, currency)}</span></div>
            </div>
            <button type="button" onClick={() => window.alert('Order Placed Successfully!')} className="w-full rounded-full bg-lime-400 py-3 font-bold text-zinc-950 transition hover:bg-lime-300">
              Checkout Now
            </button>
          </aside>
        </div>
      )}
    </section>
  )
}
