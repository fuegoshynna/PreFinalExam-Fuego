import { Plus, Star, X } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import type { Product } from './Products'
import { currencySymbol, formatCurrency, type CurrencyCode } from './currency'

type AddProductModalProps = {
  open: boolean
  onClose: () => void
  onCreate: (product: Omit<Product, 'id'>) => void
}

export function AddProductModal({ open, onClose, onCreate }: AddProductModalProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadError, setUploadError] = useState('')
  const [isReadingImage, setIsReadingImage] = useState(false)
  const [specifications, setSpecifications] = useState([{ name: '', value: '' }])
  const [colorOptions, setColorOptions] = useState([{ name: '', image: '' }])
  const [sizes, setSizes] = useState<string[]>([''])
  const [formError, setFormError] = useState('')

  if (!open) return null

  const handleClose = () => {
    setUploadedImages([])
    setUploadError('')
    setIsReadingImage(false)
    setSpecifications([{ name: '', value: '' }])
    setColorOptions([{ name: '', image: '' }])
    setSizes([''])
    setFormError('')
    onClose()
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    setUploadedImages([])
    setUploadError('')
    setIsReadingImage(false)

    if (files.length === 0) return
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setUploadError('Choose an image file.')
      event.currentTarget.value = ''
      return
    }

    setIsReadingImage(true)
    Promise.all(files.map((file) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Could not read the selected image.'))
      reader.onerror = () => reject(new Error('Could not read the selected image.'))
      reader.readAsDataURL(file)
    })))
      .then(setUploadedImages)
      .catch(() => setUploadError('Could not read the selected image. Please try another file.'))
      .finally(() => setIsReadingImage(false))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (uploadError || isReadingImage) {
      setFormError(uploadError || 'Please wait for the image upload to finish.')
      return
    }
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setFormError('Please fill out all required fields with valid values.')
      return
    }
    const formData = new FormData(form)
    const name = String(formData.get('name')).trim()
    const prices = {
      EUR: Number(formData.get('price-EUR')),
      PHP: Number(formData.get('price-PHP')),
      USD: Number(formData.get('price-USD')),
    }
    const stock = Number(formData.get('stock'))
    if (!name || Object.values(prices).some((price) => !Number.isFinite(price) || price < 0) || !Number.isInteger(stock) || stock < 0) {
      setFormError('Enter a product name, valid prices for all currencies, and a whole-number stock quantity of 0 or more.')
      return
    }
    const incompleteColorOption = colorOptions.some((option) => option.name.trim() !== '' && !option.image)
      || colorOptions.some((option) => option.image !== '' && option.name.trim() === '')
    if (incompleteColorOption) {
      setFormError('Add both a color name and an image for each color option.')
      return
    }

    const imageUrl = String(formData.get('image')).trim()
    const images = uploadedImages.length ? uploadedImages : imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800']
    onCreate({
      name,
      category: formData.get('category') as Product['category'],
      prices,
      stock,
      featured: false,
      image: images[0],
      images,
      description: String(formData.get('description')).trim(),
      specifications: specifications
        .map((specification) => ({ name: specification.name.trim(), value: specification.value.trim() }))
        .filter((specification) => specification.name && specification.value),
      colorOptions: colorOptions
        .map((option) => ({ name: option.name.trim(), image: option.image }))
        .filter((option) => option.name && option.image),
      sizes: sizes.map((size) => size.trim()).filter(Boolean),
    })
    setUploadedImages([])
    setUploadError('')
    setSpecifications([{ name: '', value: '' }])
    setColorOptions([{ name: '', image: '' }])
    setSizes([''])
    setFormError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) handleClose()
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="add-product-title" className="relative max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <button type="button" onClick={handleClose} aria-label="Close dialog" className="absolute right-4 top-4 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-zinc-800">
          <X className="h-5 w-5" />
        </button>
        <h2 id="add-product-title" className="text-xl font-bold">Add New Product</h2>
        <form noValidate onChange={() => setFormError('')} onSubmit={handleSubmit} className="space-y-3">
          {formError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">{formError}</p>}
          <label className="block text-xs font-bold uppercase text-zinc-500">
            Product Name
            <input required name="name" type="text" className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800" />
          </label>
          <label className="block text-xs font-bold uppercase text-zinc-500">
            Category
            <select name="category" className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800">
              <option value="Clothing">Clothing</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Shoes">Shoes</option>
            </select>
          </label>
          {(['EUR', 'PHP', 'USD'] as const).map((priceCurrency) => (
            <label key={priceCurrency} className="block text-xs font-bold uppercase text-zinc-500">
              Price ({priceCurrency} {currencySymbol(priceCurrency)})
              <input required min="0" step="0.01" name={`price-${priceCurrency}`} type="number" className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800" />
            </label>
          ))}
          <label className="block text-xs font-bold uppercase text-zinc-500">
            Stock Quantity
            <input required min="0" step="1" name="stock" type="number" defaultValue="0" className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800" />
          </label>
          <fieldset className="space-y-2">
            <legend className="text-xs font-bold uppercase text-zinc-500">Specifications</legend>
            {specifications.map((specification, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={specification.name}
                  onChange={(event) => setSpecifications((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))}
                  placeholder="Name (e.g. Material)"
                  aria-label={`Specification ${index + 1} name`}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800"
                />
                <input
                  type="text"
                  value={specification.value}
                  onChange={(event) => setSpecifications((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))}
                  placeholder="Value"
                  aria-label={`Specification ${index + 1} value`}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800"
                />
                {specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setSpecifications((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    aria-label={`Remove specification ${index + 1}`}
                    className="rounded-lg px-2 py-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setSpecifications((current) => [...current, { name: '', value: '' }])} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
              <Plus className="h-3.5 w-3.5" /> Add specification
            </button>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-xs font-bold uppercase text-zinc-500">Color Options</legend>
            {colorOptions.map((option, index) => (
              <div key={index} className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-zinc-700">
                <input
                  type="text"
                  value={option.name}
                  onChange={(event) => setColorOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))}
                  placeholder="Color name (e.g. Black)"
                  aria-label={`Color ${index + 1} name`}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800"
                />
                <input
                  type="file"
                  accept="image/*"
                  aria-label={`Color ${index + 1} image`}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0]
                    if (!file) return
                    if (!file.type.startsWith('image/')) {
                      setFormError('Choose an image file for each color option.')
                      event.currentTarget.value = ''
                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        setColorOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, image: reader.result as string } : item))
                        setFormError('')
                      } else {
                        setFormError('Could not read the color image. Please try another file.')
                      }
                    }
                    reader.onerror = () => setFormError('Could not read the color image. Please try another file.')
                    reader.readAsDataURL(file)
                  }}
                  className="w-full text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 dark:file:bg-zinc-700"
                />
                {option.image && <img src={option.image} alt={`${option.name || 'Color'} option preview`} className="h-20 w-20 rounded-lg object-cover" />}
                {colorOptions.length > 1 && (
                  <button type="button" onClick={() => setColorOptions((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-rose-600 hover:underline">
                    Remove color
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setColorOptions((current) => [...current, { name: '', image: '' }])} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
              <Plus className="h-3.5 w-3.5" /> Add color option
            </button>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-xs font-bold uppercase text-zinc-500">Size Options</legend>
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={size}
                  onChange={(event) => setSizes((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                  placeholder="Size (e.g. S, M, 38)"
                  aria-label={`Size option ${index + 1}`}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800"
                />
                {sizes.length > 1 && (
                  <button type="button" onClick={() => setSizes((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove size option ${index + 1}`} className="rounded-lg px-2 py-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setSizes((current) => [...current, ''])} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
              <Plus className="h-3.5 w-3.5" /> Add size
            </button>
          </fieldset>
          <label className="block text-xs font-bold uppercase text-zinc-500">
            Upload Image
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mt-1 w-full cursor-pointer rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:font-semibold dark:border-zinc-700 dark:bg-zinc-800 dark:file:bg-zinc-700"
            />
          </label>
          {uploadError && <p role="alert" className="text-sm text-rose-600">{uploadError}</p>}
          {uploadedImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {uploadedImages.map((image, index) => (
                <img key={`${image.slice(0, 40)}-${index}`} src={image} alt={`Selected product image ${index + 1}`} className="h-24 w-20 shrink-0 rounded-xl object-cover" />
              ))}
            </div>
          )}
          <label className="block text-xs font-bold uppercase text-zinc-500">
            Or Image URL (one image)
            <input name="image" type="url" placeholder="https://..." className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800" />
          </label>
          <label className="block text-xs font-bold uppercase text-zinc-500">
            Description
            <textarea name="description" rows={2} className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-normal normal-case dark:border-zinc-700 dark:bg-zinc-800" />
          </label>
          <button type="submit" disabled={isReadingImage} className="w-full rounded-xl bg-lime-500 py-3 font-bold text-zinc-950 transition hover:bg-lime-400 disabled:cursor-wait disabled:opacity-60">
            Create Product
          </button>
        </form>
      </section>
    </div>
  )
}

type WishlistDrawerProps = {
  products: Product[]
  wishlist: number[]
  currency: CurrencyCode
  onClose: () => void
  onToggleWishlist: (productId: number) => void
}

export function WishlistDrawer({ products, wishlist, currency, onClose, onToggleWishlist }: WishlistDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <aside role="dialog" aria-modal="true" aria-labelledby="wishlist-title" className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="wishlist-title" className="text-xl font-bold">Wishlist</h2>
          <button type="button" onClick={onClose} aria-label="Close wishlist" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-zinc-800"><X className="h-5 w-5" /></button>
        </div>
        {wishlist.length === 0 ? (
          <p className="py-12 text-center text-zinc-500">Your wishlist is empty.</p>
        ) : (
          <div className="space-y-4">
            {products.filter((product) => wishlist.includes(product.id)).map((product) => (
              <article key={product.id} className="flex items-center gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800">
                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{product.name}</p>
                  <p className="text-sm text-zinc-500">{formatCurrency(product.prices[currency], currency)}</p>
                </div>
                <button type="button" onClick={() => onToggleWishlist(product.id)} aria-label={`Remove ${product.name} from wishlist`} className="p-2 text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                </button>
              </article>
            ))}
          </div>
        )}
      </aside>
    </div>
  )
}
