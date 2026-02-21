<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../services/ApiService';
import type { CreateUserRequest } from '../types/user';

const router = useRouter();
const isCreating = ref(false);
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

const onCreateUser = async () => {
  if (isCreating.value) {
    return;
  }

  isCreating.value = true;
  errorMessage.value = '';

  const payload: CreateUserRequest = {
    email: form.value.email,
    password: form.value.password,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    dateOfBirth: toIsoDate(form.value.dateOfBirth),
    isAdmin: form.value.isAdmin,
  };

  try {
    await apiService.createUser(payload);
    await router.push('/admin/users');
  } catch (error) {
    errorMessage.value = 'Failed to create user.';
  } finally {
    isCreating.value = false;
  }
};

const onCancel = async () => {
  await router.push('/admin/users');
};
</script>

<template>
  <section class="admin-create-user">
    <header>
      <h1 class="admin-create-user-title">Create User</h1>
      <p class="admin-create-user-subtitle">Add a new user account.</p>
    </header>

    <p v-if="errorMessage" class="admin-create-user-error">{{ errorMessage }}</p>

    <form class="admin-create-user-form" @submit.prevent="onCreateUser">
      <div class="admin-create-user-grid">
        <label class="admin-create-user-field">
          <span>Email</span>
          <input v-model="form.email" type="email" required class="admin-create-user-input" />
        </label>

        <label class="admin-create-user-field">
          <span>Password</span>
          <input v-model="form.password" type="password" required class="admin-create-user-input" />
        </label>

        <label class="admin-create-user-field">
          <span>First name</span>
          <input v-model="form.firstName" type="text" required class="admin-create-user-input" />
        </label>

        <label class="admin-create-user-field">
          <span>Last name</span>
          <input v-model="form.lastName" type="text" required class="admin-create-user-input" />
        </label>

        <label class="admin-create-user-field">
          <span>Date of birth</span>
          <input v-model="form.dateOfBirth" type="date" required class="admin-create-user-input" />
        </label>

        <label class="admin-create-user-checkbox">
          <input v-model="form.isAdmin" type="checkbox" />
          <span>Admin user</span>
        </label>
      </div>

      <div class="admin-create-user-actions">
        <button type="submit" :disabled="isCreating" class="admin-create-user-button">
          {{ isCreating ? 'Creating...' : 'Create user' }}
        </button>
        <button type="button" class="admin-create-user-button-secondary" :disabled="isCreating" @click="onCancel">
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
@reference 'tailwindcss';

.admin-create-user {
  @apply space-y-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm;
}

.admin-create-user-title {
  @apply text-2xl font-bold tracking-tight;
}

.admin-create-user-subtitle {
  @apply mt-2 text-sm text-slate-600;
}

.admin-create-user-error {
  @apply rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700;
}

.admin-create-user-form {
  @apply rounded-lg border border-slate-200 p-4;
}

.admin-create-user-grid {
  @apply grid gap-3 md:grid-cols-2;
}

.admin-create-user-field {
  @apply block;
}

.admin-create-user-field span {
  @apply mb-1 block text-sm font-medium text-slate-700;
}

.admin-create-user-input {
  @apply w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500;
}

.admin-create-user-checkbox {
  @apply flex items-center gap-2 pt-6;
}

.admin-create-user-actions {
  @apply mt-4 flex gap-2;
}

.admin-create-user-button {
  @apply rounded-md bg-slate-900 px-3 py-2 font-medium text-white transition hover:bg-slate-700;
}

.admin-create-user-button-secondary {
  @apply rounded-md border border-slate-300 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100;
}
</style>
