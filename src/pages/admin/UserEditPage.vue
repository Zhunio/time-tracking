<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '../../services/ApiService';
import type { UpdateUserRequest } from '../../types/user';

const route = useRoute();
const router = useRouter();

const userId = computed(() => String(route.params.id ?? ''));
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const errorMessage = ref('');

const form = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  isAdmin: false,
});

const toIsoDate = (dateValue: string): string => {
  if (!dateValue) {
    return dateValue;
  }

  return new Date(`${dateValue}T00:00:00.000Z`).toISOString();
};

const toDateInput = (isoDate: string): string => {
  if (!isoDate) {
    return '';
  }

  return isoDate.split('T')[0];
};

const loadUser = async () => {
  if (!userId.value) {
    errorMessage.value = 'Invalid user id.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const users = await apiService.getUsers();
    const user = users.find((item) => item.id === userId.value);

    if (!user) {
      errorMessage.value = 'User not found.';
      return;
    }

    form.value = {
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: toDateInput(user.dateOfBirth),
      isAdmin: user.isAdmin,
    };
  } catch (error) {
    errorMessage.value = 'Failed to load user.';
  } finally {
    isLoading.value = false;
  }
};

const onSaveUser = async () => {
  if (isSaving.value || !userId.value) {
    return;
  }

  isSaving.value = true;
  errorMessage.value = '';

  const payload: UpdateUserRequest = {
    email: form.value.email,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    dateOfBirth: toIsoDate(form.value.dateOfBirth),
    isAdmin: form.value.isAdmin,
  };

  try {
    await apiService.updateUser(userId.value, payload);
    await router.push('/admin/users');
  } catch (error) {
    errorMessage.value = 'Failed to update user.';
  } finally {
    isSaving.value = false;
  }
};

const onCancel = async () => {
  await router.push('/admin/users');
};

const onDeleteUser = async () => {
  if (isDeleting.value || !userId.value) {
    return;
  }

  if (!window.confirm('Delete this user?')) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = '';

  try {
    await apiService.deleteUser(userId.value);
    await router.push('/admin/users');
  } catch (error) {
    errorMessage.value = 'Failed to delete user.';
  } finally {
    isDeleting.value = false;
  }
};

onMounted(loadUser);
</script>

<template>
  <section class="admin-edit-user">
    <header>
      <h1 class="admin-edit-user-title">Edit User</h1>
      <p class="admin-edit-user-subtitle">Update user account details.</p>
    </header>

    <p v-if="errorMessage" class="admin-edit-user-error">{{ errorMessage }}</p>
    <p v-if="isLoading" class="admin-edit-user-muted">Loading user...</p>

    <form v-else class="admin-edit-user-form" @submit.prevent="onSaveUser">
      <div class="admin-edit-user-grid">
        <label class="admin-edit-user-field">
          <span>First Name</span>
          <input v-model="form.firstName" type="text" required class="admin-edit-user-input" />
        </label>

        <label class="admin-edit-user-field">
          <span>Last Name</span>
          <input v-model="form.lastName" type="text" required class="admin-edit-user-input" />
        </label>

        <label class="admin-edit-user-field">
          <span>Email</span>
          <input v-model="form.email" type="email" required class="admin-edit-user-input" />
        </label>

        <label class="admin-edit-user-field">
          <span>Date of Birth</span>
          <input v-model="form.dateOfBirth" type="date" required class="admin-edit-user-input" />
        </label>

        <!--
        <label class="admin-edit-user-field admin-edit-user-field-password">
          <span>Password</span>
          <input v-model="form.password" type="password" class="admin-edit-user-input" />
        </label>
        -->

        <label class="admin-edit-user-checkbox">
          <input v-model="form.isAdmin" type="checkbox" class="admin-edit-user-checkbox-input" />
          <span>Admin user</span>
        </label>
      </div>

      <div class="admin-edit-user-actions">
        <div class="admin-edit-user-actions-main">
          <button type="submit" :disabled="isSaving || isDeleting" class="admin-edit-user-button">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button
            type="button"
            class="admin-edit-user-button-secondary"
            :disabled="isSaving || isDeleting"
            @click="onCancel"
          >
            Cancel
          </button>
        </div>
        <button type="button" class="admin-edit-user-button-danger" :disabled="isSaving || isDeleting" @click="onDeleteUser">
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
@reference 'tailwindcss';

.admin-edit-user {
  @apply space-y-6 bg-transparent p-0 text-slate-100;
}

.admin-edit-user-title {
  @apply text-2xl font-bold tracking-tight text-white;
}

.admin-edit-user-subtitle {
  @apply mt-2 text-sm text-slate-400;
}

.admin-edit-user-error {
  @apply rounded-md border border-red-900/70 bg-red-950/60 p-3 text-sm text-red-300;
}

.admin-edit-user-muted {
  @apply text-sm text-slate-400;
}

.admin-edit-user-form {
  @apply p-0;
}

.admin-edit-user-grid {
  @apply grid gap-3 md:grid-cols-2;
}

.admin-edit-user-field {
  @apply block;
}

.admin-edit-user-field span {
  @apply mb-1 block text-sm font-medium text-slate-300;
}

.admin-edit-user-input {
  @apply w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-slate-500;
}

.admin-edit-user-checkbox {
  @apply flex items-center gap-2 pt-2 md:col-span-2;
}

.admin-edit-user-checkbox-input {
  @apply accent-emerald-300;
}

.admin-edit-user-field-password {
  @apply md:col-span-2;
}

.admin-edit-user-actions {
  @apply mt-4 flex flex-wrap items-center justify-between gap-3;
}

.admin-edit-user-actions-main {
  @apply flex gap-2;
}

.admin-edit-user-button {
  @apply cursor-pointer rounded-md bg-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-950 transition duration-150 hover:bg-emerald-200 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60;
}

.admin-edit-user-button-secondary {
  @apply cursor-pointer rounded-md border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition duration-150 hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60;
}

.admin-edit-user-button-danger {
  @apply cursor-pointer rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white transition duration-150 hover:bg-red-600 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60;
}
</style>
