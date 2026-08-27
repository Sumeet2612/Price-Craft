import One8 from '../assets/one8shoes.jpeg'
import One82 from '../assets/oneshoes2.jpeg'
import Nike1 from '../assets/nikealphashoes.jpeg'
import Nike2 from '../assets/nikejordan.jpeg'
import Puma1 from '../assets/Puma.jpeg'
import Puma2 from '../assets/image.png'
import linenshirt from '../assets/Linenshirt.webp'

export const products = [
  {
    id: 1,
    img: One8,
    images: [One8, One82],
    name: 'One8 Drift Runner',
    category: 'One8',
    color: 'Black',
    size: 'UK 7',
    price: 6999,
    originalPrice: 7799,
    discountPercent: 10,
    rating: 4.7,
    createdAt: '2026-07-08',
    stock: 12,
    description: 'Lightweight daily trainers with a cushioned midsole and a grippy outsole for city runs.'
  },
  {
    id: 2,
    img: One82,
    images: [One82, One8],
    name: 'One8 Court Sprint',
    category: 'One8',
    color: 'White',
    size: 'UK 7',
    price: 6299,
    originalPrice: 6999,
    discountPercent: 10,
    rating: 4.4,
    createdAt: '2026-06-26',
    stock: 8,
    description: 'Clean court silhouette with breathable mesh and a stable heel for all-day wear.'
  },
  {
    id: 3,
    img: Nike1,
    images: [Nike1, Nike2],
    name: 'Nike Alpha Fly',
    category: 'Nike',
    color: 'Blue',
    size: 'UK 8',
    price: 11899,
    originalPrice: 13999,
    discountPercent: 15,
    rating: 4.8,
    createdAt: '2026-07-15',
    stock: 5,
    description: 'Race-day energy return with a carbon-infused plate and a snug, locked-in fit.'
  },
  {
    id: 4,
    img: Nike2,
    images: [Nike2, Nike1],
    name: 'Nike Air Jordan',
    category: 'Nike',
    color: 'Red',
    size: 'UK 9',
    price: 12799,
    originalPrice: 15999,
    discountPercent: 20,
    rating: 4.9,
    createdAt: '2026-07-19',
    stock: 4,
    description: 'Heritage basketball design with premium leather overlays and classic Air cushioning.'
  },
  {
    id: 5,
    img: Puma1,
    images: [Puma1, Puma2],
    name: 'Puma Street Rider',
    category: 'Puma',
    color: 'Black',
    size: 'UK 10',
    price: 6399,
    originalPrice: 7999,
    discountPercent: 20,
    rating: 4.2,
    createdAt: '2026-06-20',
    stock: 15,
    description: 'Street-ready sneakers with a padded collar and a durable rubber outsole.'
  },
  {
    id: 6,
    img: Puma2,
    images: [Puma2, Puma1],
    name: 'Puma Flex Runner',
    category: 'Puma',
    color: 'Orange',
    size: 'UK 7',
    price: 4799,
    originalPrice: 5999,
    discountPercent: 20,
    rating: 4.1,
    createdAt: '2026-06-12',
    stock: 18,
    description: 'Flexible knit upper and a soft foam midsole for easy everyday miles.'
  },
  {
    id: 7,
    img:  linenshirt,
    images: [Nike1, One8],
    name: 'Linen Resort Shirt',
    category: 'Fashion',
    color: 'Ivory',
    size: 'M',
    price: 1799,
    originalPrice: 2499,
    discountPercent: 28,
    rating: 4.5,
    createdAt: '2026-07-11',
    stock: 22,
    description: 'Breathable linen shirt with a relaxed collar. Eligible for FASHION20.'
  }
  
]

export const getProductById = (id) =>
  products.find((product) => String(product.id) === String(id))

export const getSalePrice = (product) =>
  Math.round(product.originalPrice * (1 - product.discountPercent / 100))
