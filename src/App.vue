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
.app-shell {
  min-height: 100vh;
  color: var(--app-text);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 15;
  border-bottom: 1px solid var(--app-border);
  background: linear-gradient(180deg, var(--app-navbar) 0%, #101b31 100%);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.28);
}

.app-nav {
  margin: 0 auto;
  max-width: 1120px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.15rem;
}

.app-brand {
  color: #f7fbff;
  font-size: 1.02rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.01em;
}

.app-user-menu {
  position: relative;
  margin-left: auto;
}

.app-user-trigger {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  background: rgba(30, 44, 69, 0.6);
  color: #d8e7ff;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.app-user-trigger:hover {
  background: rgba(37, 57, 88, 0.95);
  border-color: #3b4f72;
}

.app-user-trigger:focus-visible {
  outline: none;
  border-color: #68adff;
  box-shadow: 0 0 0 3px rgba(104, 173, 255, 0.2);
}

.app-user-trigger-user-icon {
  display: inline-flex;
  height: 1rem;
  width: 1rem;
  align-items: center;
  justify-content: center;
  color: #b7cae8;
}

.app-user-trigger-user-icon svg {
  height: 1rem;
  width: 1rem;
}

.app-user-trigger-icon {
  display: inline-flex;
  height: 0.95rem;
  width: 0.95rem;
  align-items: center;
  justify-content: center;
  color: #b7cae8;
}

.app-user-trigger-icon svg {
  height: 0.95rem;
  width: 0.95rem;
}

.app-user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.35rem);
  z-index: 20;
  min-width: 11rem;
  border: 1px solid var(--app-border);
  border-radius: 10px;
  background: #101a2d;
  padding: 0.35rem;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.38);
}

.app-user-dropdown-link,
.app-user-dropdown-button {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #d8e6fb;
  padding: 0.48rem 0.65rem;
  font-size: 0.85rem;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.app-user-dropdown-link:hover,
.app-user-dropdown-button:hover {
  background: #1f2b43;
  color: #ffffff;
}

.app-user-dropdown-icon {
  display: inline-flex;
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: #9eb4d9;
}

.app-user-dropdown-icon svg {
  height: 1rem;
  width: 1rem;
}

.app-main {
  margin: 0 auto;
  max-width: 1120px;
  padding: 1.3rem 1.15rem 2rem;
}
</style>
