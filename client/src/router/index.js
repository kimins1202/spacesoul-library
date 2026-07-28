import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import UserLayout from '../components/layout/UserLayout.vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import AuthLayout from '../components/layout/AuthLayout.vue'

// Pages - Auth
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'

// Pages - User
import Home from '../pages/user/Home.vue'
import BookList from '../pages/user/BookList.vue'
import BookDetail from '../pages/user/BookDetail.vue'
import Profile from '../pages/user/Profile.vue'
import BorrowedBooks from '../pages/user/BorrowedBooks.vue'
import Guide from '../pages/user/Guide.vue'
import Contact from '../pages/user/Contact.vue'

// Pages - Admin
import Dashboard from '../pages/admin/Dashboard.vue'
import BookManagement from '../pages/admin/BookManagement.vue'
import UserManagement from '../pages/admin/UserManagement.vue'
import BorrowManagement from '../pages/admin/BorrowManagement.vue'

const routes = [
  // User Portal
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: 'books',
        name: 'book-list',
        component: BookList
      },
      {
        path: 'books/:id',
        name: 'book-detail',
        component: BookDetail
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      },
      {
        path: 'borrowed',
        name: 'borrowed-books',
        component: BorrowedBooks,
        meta: { requiresReader: true }
      },
      {
        path: 'guide',
        name: 'guide',
        component: Guide
      },
      {
        path: 'contact',
        name: 'contact',
        component: Contact
      }
    ]
  },
  // Auth Portal
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'register',
        name: 'register',
        component: Register
      }
    ]
  },
  // Admin Portal
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresEmployee: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: Dashboard
      },
      {
        path: 'books',
        name: 'admin-books',
        component: BookManagement
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UserManagement
      },
      {
        path: 'borrows',
        name: 'admin-borrows',
        component: BorrowManagement
      }
    ]
  },
  // Fallback redirect
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, left: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  // Require employee (nhân viên / admin) for admin routes
  if (to.matched.some(record => record.meta.requiresEmployee)) {
    if (!token || !user || user.type !== 'Employee') {
      return next('/login')
    }
  }

  if (to.matched.some(record => record.meta.requiresReader)) {
    if (!token || !user || user.type === 'Employee') {
      return next('/login')
    }
  }

  next()
})

export default router
