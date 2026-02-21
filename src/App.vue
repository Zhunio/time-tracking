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

const onLogout = async () => {
  apiService.logout();
  await router.push('/login');
};
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <nav class="app-nav">
        <RouterLink class="app-brand" to="/">Time Tracking</RouterLink>
        <template v-if="isAuthenticated">
          <RouterLink class="app-nav-link" to="/">Home</RouterLink>
          <RouterLink v-if="isAdmin" class="app-nav-link" to="/admin/users">Users</RouterLink>
          <button type="button" class="app-logout-button" @click="onLogout">Logout</button>
        </template>
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
  @apply min-h-screen bg-black text-white;
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

.app-nav-link {
  @apply text-slate-300 hover:text-white;
}

.app-logout-button {
  @apply ml-auto cursor-pointer rounded-md border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-slate-500 hover:text-white;
}

.app-main {
  @apply mx-auto max-w-5xl px-4 py-8;
}
</style>
