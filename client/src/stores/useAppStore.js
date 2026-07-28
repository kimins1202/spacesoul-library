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

export const cartCount = computed(() => cartItems.value.length)
export const cart = cartItems

export function addToCart(book) {
  const exists = cartItems.value.find(b => b._id === book._id)
  if (!exists) {
    cartItems.value = [...cartItems.value, {
      _id: book._id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      price: book.price,
      category: book.category,
      availableCopies: book.availableCopies
    }]
    return true // added
  }
  return false // already exists
}

export function removeFromCart(bookId) {
  cartItems.value = cartItems.value.filter(b => b._id !== bookId)
}

export function clearCart() {
  cartItems.value = []
}

export function isInCart(bookId) {
  return cartItems.value.some(b => b._id === bookId)
}
