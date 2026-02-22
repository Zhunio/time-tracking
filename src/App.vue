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
  <div>
    <header>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="container is-max-desktop px-3 is-flex is-align-items-center">
          <RouterLink class="has-text-weight-semibold has-text-white" to="/">Time Tracking</RouterLink>
          <div class="is-flex is-flex-grow-1 is-justify-content-flex-end is-align-items-center">
            <div v-if="isAuthenticated">
              <div class="dropdown is-right is-hoverable">
                <div class="dropdown-trigger">
                  <button class="button is-borderless" type="button" aria-haspopup="menu">
                    <span class="icon is-small is-size-7" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M20 21a8 8 0 0 0-16 0" />
                        <circle cx="12" cy="8" r="4" />
                      </svg>
                    </span>
                    <span>{{ currentUserLabel }}</span>
                    <span class="icon is-small" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                </div>
                <div class="dropdown-menu" role="menu">
                  <div class="dropdown-content">
                    <RouterLink v-if="isAdmin" class="dropdown-item" to="/admin/users" role="menuitem">Users</RouterLink>
                    <button type="button" class="dropdown-item" role="menuitem" @click="onLogout">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="section pt-5">
      <div class="container is-max-desktop">
        <RouterView />
      </div>
    </main>
  </div>
</template>
