// Giỏ hàng sách muốn mượn - lưu trong localStorage
import { ref, computed, watch } from 'vue'

// ===== CART (Giỏ mượn) =====
const CART_KEY = 'spacesoul_cart'

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const cartItems = ref(loadCartFromStorage())

watch(cartItems, (val) => {
  localStorage.setItem(CART_KEY, JSON.stringify(val))
}, { deep: true })

export const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + (item.quantity || 1), 0))
export const cart = cartItems

export function addToCart(book, quantity = 1) {
  const exists = cartItems.value.find(b => b._id === book._id)
  if (!exists) {
    const remainingCartLimit = 10 - cartCount.value
    if (remainingCartLimit < 1 || Number(book.availableCopies) < 1) return false
    const safeQuantity = Math.max(1, Math.min(
      Math.trunc(Number(quantity) || 1),
      Number(book.availableCopies) || 1,
      remainingCartLimit,
    ))
    cartItems.value = [...cartItems.value, {
      _id: book._id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      price: book.price,
      category: book.category,
      availableCopies: book.availableCopies,
      quantity: safeQuantity,
    }]
    return true // added
  }
  return false // already exists
}

export function removeFromCart(bookId) {
  cartItems.value = cartItems.value.filter(b => b._id !== bookId)
}

export function updateCartQuantity(bookId, quantity) {
  const item = cartItems.value.find(book => book._id === bookId)
  if (!item) return
  const otherQuantity = cartItems.value.reduce(
    (sum, book) => sum + (book._id === bookId ? 0 : (book.quantity || 1)),
    0,
  )
  const maxQuantity = Math.max(1, Math.min(Number(item.availableCopies) || 1, 10 - otherQuantity))
  item.quantity = Math.max(1, Math.min(Math.trunc(Number(quantity) || 1), maxQuantity))
}

export function clearCart() {
  cartItems.value = []
}

export function syncCartWithBooks(books) {
  const latestBooks = new Map((books || []).map(book => [book._id, book]))
  cartItems.value = cartItems.value
    .filter(item => latestBooks.has(item._id))
    .map(item => {
      const book = latestBooks.get(item._id)
      return {
        _id: book._id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        price: book.price,
        category: book.category,
        availableCopies: book.availableCopies,
        quantity: Math.max(1, Math.min(item.quantity || 1, book.availableCopies || 1)),
      }
    })
}

export function isInCart(bookId) {
  return cartItems.value.some(b => b._id === bookId)
}
