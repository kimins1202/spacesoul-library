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
        component: BookDetail,
        props: true
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      },
      {
        path: 'borrowed',
        name: 'borrowed-books',
        component: BorrowedBooks
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
  routes
})

export default router
