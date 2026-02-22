<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from './services/ApiService';

const router = useRouter();
const route = useRoute();
const userMenuRef = ref<HTMLElement | null>(null);
const userMenuTriggerRef = ref<HTMLButtonElement | null>(null);
const userMenuDropdownRef = ref<HTMLElement | null>(null);
const isUserMenuOpen = ref(false);
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
  isUserMenuOpen.value = false;
  apiService.logout();
  await router.push('/auth/login');
};

const openUserMenu = async () => {
  if (isUserMenuOpen.value) {
    return;
  }

  isUserMenuOpen.value = true;
  await nextTick();
  userMenuDropdownRef.value?.focus();
};

const toggleUserMenu = async () => {
  if (!isUserMenuOpen.value) {
    await openUserMenu();
    return;
  }

  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = (returnFocus = false) => {
  isUserMenuOpen.value = false;
  if (returnFocus) {
    userMenuTriggerRef.value?.focus();
  }
};

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!isUserMenuOpen.value) {
    return;
  }

  const target = event.target as Node | null;
  if (target && userMenuRef.value?.contains(target)) {
    return;
  }

  closeUserMenu();
};

const onDocumentKeyDown = (event: KeyboardEvent) => {
  if (!isUserMenuOpen.value) {
    return;
  }

  if (event.key !== 'Escape') {
    return;
  }

  event.preventDefault();
  closeUserMenu(true);
};

const onDocumentFocusIn = (event: FocusEvent) => {
  if (!isUserMenuOpen.value) {
    return;
  }

  const target = event.target as Node | null;
  if (target && userMenuRef.value?.contains(target)) {
    return;
  }

  closeUserMenu();
};

const onUserMenuTriggerKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    await openUserMenu();
  }
};

const onUserMenuItemNavigate = () => {
  closeUserMenu();
};

watch(
  () => route.fullPath,
  () => {
    closeUserMenu();
  }
);

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
  document.addEventListener('keydown', onDocumentKeyDown);
  document.addEventListener('focusin', onDocumentFocusIn);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  document.removeEventListener('keydown', onDocumentKeyDown);
  document.removeEventListener('focusin', onDocumentFocusIn);
});
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <nav class="app-nav">
        <RouterLink class="app-brand" to="/">Time Tracking</RouterLink>
        <div v-if="isAuthenticated" ref="userMenuRef" class="app-user-menu">
          <button
            ref="userMenuTriggerRef"
            type="button"
            class="app-user-trigger"
            :aria-expanded="isUserMenuOpen"
            aria-controls="user-menu-dropdown"
            aria-haspopup="menu"
            @click="toggleUserMenu"
            @keydown="onUserMenuTriggerKeyDown"
          >
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
          </button>
          <div
            v-show="isUserMenuOpen"
            id="user-menu-dropdown"
            ref="userMenuDropdownRef"
            class="app-user-dropdown"
            role="menu"
            tabindex="-1"
          >
            <RouterLink
              v-if="isAdmin"
              class="app-user-dropdown-link"
              to="/admin/users"
              role="menuitem"
              @click="onUserMenuItemNavigate"
            >
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
            <button type="button" class="app-user-dropdown-button" role="menuitem" @click="onLogout">
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
  @apply flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40;
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
  @apply absolute right-0 top-full z-20 mt-1 min-w-44 rounded-md border border-slate-700 bg-slate-950 p-1 shadow-lg;
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
