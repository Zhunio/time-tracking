<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from './services/ApiService';

const router = useRouter();
const route = useRoute();
const isAuthenticated = computed(() => {
  route.fullPath;
  return apiService.isAuthenticated();
});
const isAdmin = computed(() => {
  route.fullPath;
  return apiService.isAdmin();
});
const currentUserLabel = computed(() => {
  route.fullPath;
  const user = apiService.getCurrentUser();

  if (!user) {
    return 'Account';
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  return fullName || user.email;
});

const onLogout = async () => {
  apiService.logout();
  await router.push('/auth/login');
};
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <nav class="app-nav">
        <RouterLink class="app-brand" to="/">Time Tracking</RouterLink>
        <div v-if="isAuthenticated" class="app-user-menu">
          <div class="app-user-trigger">
            <span class="app-user-trigger-user-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </span>
            <span>{{ currentUserLabel }}</span>
            <span class="app-user-trigger-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
          <div class="app-user-dropdown">
            <RouterLink v-if="isAdmin" class="app-user-dropdown-link" to="/admin/users">
              <span class="app-user-dropdown-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6" />
                  <path d="M23 11h-6" />
                </svg>
              </span>
              <span>Users</span>
            </RouterLink>
            <button type="button" class="app-user-dropdown-button" @click="onLogout">
              <span class="app-user-dropdown-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

.app-shell {
  @apply min-h-screen bg-slate-950 text-white;
}

.app-header {
  @apply border-b border-slate-800 bg-black;
}

.app-nav {
  @apply mx-auto flex max-w-5xl items-center gap-4 px-4 py-3;
}

.app-brand {
  @apply font-semibold text-white;
}

.app-user-menu {
  @apply relative ml-auto;
}

.app-user-trigger {
  @apply flex cursor-default items-center gap-1 text-slate-200;
}

.app-user-trigger-user-icon {
  @apply inline-flex h-4 w-4 items-center justify-center text-slate-300;
}

.app-user-trigger-user-icon svg {
  @apply h-4 w-4;
}

.app-user-trigger-icon {
  @apply inline-flex h-4 w-4 items-center justify-center text-slate-300;
}

.app-user-trigger-icon svg {
  @apply h-4 w-4;
}

.app-user-dropdown {
  @apply pointer-events-none absolute right-0 top-full z-20 min-w-44 rounded-md border border-slate-700 bg-slate-950 p-1 opacity-0 shadow-lg transition;
}

.app-user-dropdown::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
}

.app-user-menu:hover .app-user-dropdown,
.app-user-menu:focus-within .app-user-dropdown {
  @apply pointer-events-auto opacity-100;
}

.app-user-dropdown-link,
.app-user-dropdown-button {
  @apply flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white;
}

.app-user-dropdown-icon {
  @apply inline-flex h-4 w-4 shrink-0 items-center justify-center text-slate-300;
}

.app-user-dropdown-icon svg {
  @apply h-4 w-4;
}

.app-main {
  @apply mx-auto max-w-5xl px-4 py-8;
}
</style>
