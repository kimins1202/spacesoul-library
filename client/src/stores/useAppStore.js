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

// ===== NOTIFICATIONS (Thông báo) =====
const NOTIF_KEY = 'spacesoul_notifications'

function loadNotificationsFromStorage() {
  try {
    const raw = localStorage.getItem(NOTIF_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const notifications = ref(loadNotificationsFromStorage())

watch(notifications, (val) => {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(val))
}, { deep: true })

export const notificationList = notifications
export const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

export function addNotification({ title, message, type = 'info' }) {
  const notif = {
    id: Date.now().toString(),
    title,
    message,
    type, // 'success' | 'info' | 'warning' | 'error'
    read: false,
    createdAt: new Date().toISOString()
  }
  notifications.value = [notif, ...notifications.value].slice(0, 20) // Max 20
  return notif
}

export function markAsRead(id) {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) notif.read = true
}

export function markAllAsRead() {
  notifications.value.forEach(n => n.read = true)
}

export function removeNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

export function clearAllNotifications() {
  notifications.value = []
  localStorage.removeItem(NOTIF_KEY)
}
