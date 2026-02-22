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
const isResettingPassword = ref(false);
const errorMessage = ref('');
const resetPasswordError = ref('');
const resetPasswordSuccess = ref('');

const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  isAdmin: false,
});
const resetPasswordForm = ref({
  password: '',
  confirmPassword: '',
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

const onResetPassword = async () => {
  if (isResettingPassword.value || !userId.value) {
    return;
  }

  resetPasswordError.value = '';
  resetPasswordSuccess.value = '';

  if (!resetPasswordForm.value.password || !resetPasswordForm.value.confirmPassword) {
    resetPasswordError.value = 'Password and confirm password are required.';
    return;
  }

  if (resetPasswordForm.value.password !== resetPasswordForm.value.confirmPassword) {
    resetPasswordError.value = 'Passwords do not match.';
    return;
  }

  isResettingPassword.value = true;

  try {
    await apiService.updateUser(userId.value, { password: resetPasswordForm.value.password });
    resetPasswordForm.value = {
      password: '',
      confirmPassword: '',
    };
    resetPasswordSuccess.value = 'Password reset successfully.';
  } catch (error) {
    resetPasswordError.value = 'Failed to reset password.';
  } finally {
    isResettingPassword.value = false;
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

    <div v-else class="admin-edit-user-sections">
      <form class="admin-edit-user-form" @submit.prevent="onSaveUser">
        <div class="admin-edit-user-grid">
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

          <label class="admin-edit-user-checkbox">
            <input v-model="form.isAdmin" type="checkbox" class="admin-edit-user-checkbox-input" />
            <span>Admin user</span>
          </label>
        </div>

        <div class="admin-edit-user-actions">
          <div class="admin-edit-user-actions-main">
            <button
              type="submit"
              :disabled="isSaving || isDeleting || isResettingPassword"
              class="admin-edit-user-button"
            >
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
            <button
              type="button"
              class="admin-edit-user-button-secondary"
              :disabled="isSaving || isDeleting || isResettingPassword"
              @click="onCancel"
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            class="admin-edit-user-button-danger"
            :disabled="isSaving || isDeleting || isResettingPassword"
            @click="onDeleteUser"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </form>

      <section class="admin-reset-password">
        <h2 class="admin-reset-password-title">Reset Password</h2>
        <p class="admin-edit-user-muted">Set a new password for this user.</p>

        <p v-if="resetPasswordError" class="admin-edit-user-error">{{ resetPasswordError }}</p>
        <p v-if="resetPasswordSuccess" class="admin-reset-password-success">{{ resetPasswordSuccess }}</p>

        <form class="admin-reset-password-form" @submit.prevent="onResetPassword">
          <div class="admin-edit-user-grid">
            <label class="app-form-field">
              <span class="app-form-label">New Password</span>
              <input v-model="resetPasswordForm.password" type="password" required class="app-form-control" />
            </label>
            <label class="app-form-field">
              <span class="app-form-label">Confirm Password</span>
              <input
                v-model="resetPasswordForm.confirmPassword"
                type="password"
                required
                class="app-form-control"
              />
            </label>
          </div>

          <div class="admin-reset-password-actions">
            <button
              type="submit"
              :disabled="isResettingPassword || isSaving || isDeleting"
              class="admin-edit-user-button"
            >
              {{ isResettingPassword ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>
      </section>
    </div>
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

.admin-edit-user-sections {
  @apply space-y-8;
}

.admin-edit-user-grid {
  @apply grid gap-3 md:grid-cols-2;
}

.admin-edit-user-checkbox {
  @apply flex items-center gap-2 pt-2 md:col-span-2;
}

.admin-edit-user-checkbox-input {
  @apply accent-emerald-300;
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

.admin-reset-password {
  @apply space-y-3 border-t border-slate-800 pt-6;
}

.admin-reset-password-title {
  @apply text-lg font-semibold text-white;
}

.admin-reset-password-success {
  @apply rounded-md border border-emerald-900/70 bg-emerald-950/50 p-3 text-sm text-emerald-300;
}

.admin-reset-password-actions {
  @apply mt-4;
}
</style>
