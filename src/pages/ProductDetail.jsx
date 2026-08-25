import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Minus, Plus, Star } from 'lucide-react'
import { getProductById, getSalePrice } from '../data/products'
import { useCart } from '../context/CartContext'

const formatRupees = (value) => `Rs. ${Number(value).toFixed(2)}`

const ProductDetail = () => {
  const { productId } = useParams()
  const product = getProductById(productId)
  const { addItem, items } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product?.img)

  const inCart = useMemo(
    () => items.find((item) => String(item.productId) === String(productId))?.quantity || 0,
    [items, productId]
  )

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

      <div className="mt-8 grid gap-8 bg-white p-6 lg:grid-cols-2">
        <div>
          <img src={activeImage || product.img} alt={product.name} className="aspect-square w-full object-cover" />
          <div className="mt-3 flex gap-3">
            {(product.images || [product.img]).map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`h-16 w-16 overflow-hidden border ${activeImage === image ? 'border-orange-500' : 'border-gray-200'}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
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
