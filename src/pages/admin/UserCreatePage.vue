<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../../services/ApiService';
import type { CreateUserRequest } from '../../types/user';

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
  <section class="admin-create-user app-panel">
    <header>
      <h1 class="admin-create-user-title">Create User</h1>
      <p class="admin-create-user-subtitle">Add a new user account.</p>
    </header>

    <p v-if="errorMessage" class="admin-create-user-error app-error">{{ errorMessage }}</p>

    <form class="admin-create-user-form" @submit.prevent="onCreateUser">
      <div class="app-form-grid admin-create-user-grid">
        <label class="app-form-field">
          <span class="app-form-label">First Name</span>
          <input v-model="form.firstName" type="text" required class="app-form-control" />
        </label>

        <label class="app-form-field">
          <span class="app-form-label">Last Name</span>
          <input v-model="form.lastName" type="text" required class="app-form-control" />
        </label>

        <label class="app-form-field">
          <span class="app-form-label">Email</span>
          <input v-model="form.email" type="email" required class="app-form-control" />
        </label>

        <label class="app-form-field">
          <span class="app-form-label">Date of Birth</span>
          <input v-model="form.dateOfBirth" type="date" required class="app-form-control" />
        </label>

        <label class="app-form-field admin-create-user-field-password">
          <span class="app-form-label">Password</span>
          <input v-model="form.password" type="password" required class="app-form-control" />
        </label>

        <label class="admin-create-user-checkbox">
          <input v-model="form.isAdmin" type="checkbox" />
          <span>Admin user</span>
        </label>
      </div>

      <div class="app-actions">
        <div class="app-actions-main">
          <button type="submit" :disabled="isCreating" class="app-button-primary">
            {{ isCreating ? 'Creating...' : 'Create' }}
          </button>
          <button type="button" class="app-button-secondary" :disabled="isCreating" @click="onCancel">Cancel</button>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
.admin-create-user {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-create-user-title {
  margin: 0;
  color: #f4f8ff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.admin-create-user-subtitle {
  margin: 0.35rem 0 0;
  color: var(--app-text-muted);
  font-size: 0.92rem;
}

.admin-create-user-error {
  margin: 0;
}

.admin-create-user-grid {
  align-items: end;
}

.admin-create-user-checkbox {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding-top: 0.25rem;
  grid-column: 1 / -1;
  color: #d9e7fb;
  font-size: 0.92rem;
}

.admin-create-user-field-password {
  grid-column: 1 / -1;
}
</style>
