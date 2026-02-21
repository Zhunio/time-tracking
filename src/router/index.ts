import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import AdminUsersPage from '../pages/AdminUsersPage.vue';
import AdminCreateUserPage from '../pages/AdminCreateUserPage.vue';
import AdminEditUserPage from '../pages/AdminEditUserPage.vue';
import apiService from '../services/ApiService';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { guestOnly: true },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsersPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users/create',
    name: 'admin-users-create',
    component: AdminCreateUserPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users/:id/edit',
    name: 'admin-users-edit',
    component: AdminEditUserPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isAuthenticated = apiService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' };
  }

  if (to.meta.requiresAdmin && !apiService.isAdmin()) {
    return { name: 'home' };
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'home' };
  }

  return true;
});

export default router;
