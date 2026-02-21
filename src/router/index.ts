import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import UserListPage from '../pages/admin/UserListPage.vue';
import UserCreatePage from '../pages/admin/UserCreatePage.vue';
import UserEditPage from '../pages/admin/UserEditPage.vue';
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
    component: UserListPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users/create',
    name: 'admin-users-create',
    component: UserCreatePage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users/:id/edit',
    name: 'admin-users-edit',
    component: UserEditPage,
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
