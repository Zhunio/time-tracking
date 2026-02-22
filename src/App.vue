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
  },
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
  <div>
    <header>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="container is-max-desktop px-3 is-flex is-align-items-center">
          <RouterLink class="has-text-weight-semibold has-text-white" to="/">Time Tracking</RouterLink>
          <div class="is-flex is-flex-grow-1 is-justify-content-flex-end is-align-items-center">
            <div v-if="isAuthenticated" ref="userMenuRef">
            <div class="dropdown is-right" :class="{ 'is-active': isUserMenuOpen }">
              <div class="dropdown-trigger">
                <button
                  ref="userMenuTriggerRef"
                  class="button is-borderless"
                  type="button"
                  :aria-expanded="isUserMenuOpen"
                  aria-controls="user-menu-dropdown"
                  aria-haspopup="menu"
                  @click="toggleUserMenu"
                  @keydown="onUserMenuTriggerKeyDown"
                >
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
              <div
                id="user-menu-dropdown"
                ref="userMenuDropdownRef"
                class="dropdown-menu"
                role="menu"
                tabindex="-1"
              >
                <div class="dropdown-content">
                  <RouterLink
                    v-if="isAdmin"
                    class="dropdown-item"
                    to="/admin/users"
                    role="menuitem"
                    @click="onUserMenuItemNavigate"
                  >
                    Users
                  </RouterLink>
                  <hr v-if="isAdmin" class="dropdown-divider" />
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
