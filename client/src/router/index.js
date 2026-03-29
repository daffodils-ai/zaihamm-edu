import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Notices from '../pages/Notices.vue'
import Admission from '../pages/Admission.vue'
import Contact from '../pages/Contact.vue'
import Facilities from '../pages/Facilities.vue'
import Login from '../admin/Login.vue'
import Dashboard from '../admin/Dashboard.vue'
import ManageNotices from '../admin/ManageNotices.vue'
import ManageFees from '../admin/ManageFees.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/notices',
    name: 'Notices',
    component: Notices
  },
  {
    path: '/admission',
    name: 'Admission',
    component: Admission
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: Facilities
  },
  {
    path: '/admin/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/admin/manage-notices',
    name: 'ManageNotices',
    component: ManageNotices
  },
  {
    path: '/admin/manage-fees',
    name: 'ManageFees',
    component: ManageFees
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
