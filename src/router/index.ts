import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LoginPage from '../pages/login/LoginPage.vue';
import RegisterPage from '../pages/login/RegisterPage.vue';
import UserListPage from '../pages/admin/UserListPage.vue';
import UserCreatePage from '../pages/admin/UserCreatePage.vue';
import UserEditPage from '../pages/admin/UserEditPage.vue';
import TimeTrackerCreatePage from '../pages/time-tracker/TimeTrackerCreatePage.vue';
import TimeTrackerEditPage from '../pages/time-tracker/TimeTrackerEditPage.vue';
import TimeTrackingPage from '../pages/time-tracker/TimeTrackingPage.vue';
import apiService from '../services/ApiService';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: TimeTrackingPage,
    alias: '/time-trackers',
    meta: { requiresAuth: true },
  },
  {
    path: '/time-trackers/create',
    name: 'time-trackers-create',
    component: TimeTrackerCreatePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/time-trackers/:id/edit',
    name: 'time-trackers-edit',
    component: TimeTrackerEditPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/auth/login',
    name: 'login',
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: '/auth/register',
    name: 'register',
    component: RegisterPage,
    meta: { guestOnly: true },
  },
  {
    path: '/login',
    redirect: '/auth/login',
  },
  {
    path: '/register',
    redirect: '/auth/register',
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
