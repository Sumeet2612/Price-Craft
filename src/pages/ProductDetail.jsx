import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Minus, Plus, RefreshCw, Star } from 'lucide-react'
import { fetchProductById, getProductById, getSalePrice } from '../data/products'
import { useCart } from '../context/CartContext'

const formatRupees = (value) => `Rs. ${Number(value).toFixed(2)}`

const ProductDetail = () => {
  const { productId } = useParams()
  const { addItem, items } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState(() => getProductById(productId))
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [productError, setProductError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product?.img)

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      setIsLoadingProduct(true)
      setProductError('')

      try {
        const productFromApi = await fetchProductById(productId)
        if (!isMounted) return

        setProduct(productFromApi || getProductById(productId) || null)
      } catch (error) {
        if (!isMounted) return
        setProduct(getProductById(productId) || null)
        setProductError('We could not refresh this product. Please try again.')
      } finally {
        if (isMounted) {
          setIsLoadingProduct(false)
        }
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [productId])

  useEffect(() => {
    setActiveImage(product?.img)
  }, [product])

  const inCart = useMemo(
    () => items.find((item) => String(item.productId) === String(productId))?.quantity || 0,
    [items, productId]
  )

  if (isLoadingProduct) {
    return (
      <div className="px-4 py-16 sm:px-7.5">
        <div className="mx-auto max-w-5xl animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-[480px] rounded-2xl bg-slate-200" />
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-8 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-20 rounded bg-slate-200" />
              <div className="h-8 w-1/3 rounded bg-slate-200" />
              <div className="h-10 w-full rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="px-7.5 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-orange-600">Back to catalog</Link>
      </div>
    )
  }

  const salePrice = getSalePrice(product)
  const inStock = product.stock > 0

  return (
    <div className="px-7.5 pb-16 pt-6">
      <div className="flex items-center gap-1 text-sm text-gray-400">
        <Link to="/" className="hover:text-gray-600">Home</Link>
        <ChevronRight size={14} />
        <span className="hover:text-gray-600">{product.category}</span>
        <ChevronRight size={14} />
        <span className="text-gray-700">{product.name}</span>
      </div>

      {productError ? (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span>{productError}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-medium text-amber-700 transition hover:bg-amber-100"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 bg-white p-6 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img src={activeImage || product.img} alt={product.name} className="aspect-square w-full object-cover" />
          </div>
          <div className="mt-3 flex gap-3">
            {(product.images || [product.img]).map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`h-16 w-16 overflow-hidden rounded-xl border ${activeImage === image ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-200'}`}
              >
                <img src={image} alt={`${product.name} thumbnail`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-orange-600">{product.category}</p>
          <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700">
            <Star size={14} fill="currentColor" />
            {product.rating}
          </p>
          <p className="text-gray-600">{product.description}</p>
          <p>
            <span className="text-2xl font-semibold text-gray-900">{formatRupees(salePrice)}</span>
            <span className="ml-3 text-gray-400 line-through">{formatRupees(product.originalPrice)}</span>
          </p>
          <p className={inStock ? 'text-green-700' : 'text-red-600'}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <p className="text-sm text-gray-500">Color: {product.color} · Size: {product.size}</p>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Quantity</span>
            <button
              type="button"
              className="h-8 w-8 bg-gray-800 text-white"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Minus size={14} className="mx-auto" />
            </button>
            <span className="w-6 text-center">{quantity}</span>
            <button
              type="button"
              className="h-8 w-8 bg-gray-800 text-white"
              onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
            >
              <Plus size={14} className="mx-auto" />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={!inStock}
              onClick={() => addItem(product, quantity)}
              className="bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:bg-gray-300"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => navigate('/#cart-section')}
              className="border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700"
            >
              View cart {inCart ? `(${inCart})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
