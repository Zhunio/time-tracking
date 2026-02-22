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
  <section class="admin-edit-user app-panel">
    <header>
      <h1 class="admin-edit-user-title">Edit User</h1>
      <p class="admin-edit-user-subtitle">Update user account details.</p>
    </header>

    <p v-if="errorMessage" class="admin-edit-user-error app-error">{{ errorMessage }}</p>
    <p v-if="isLoading" class="admin-edit-user-muted app-muted">Loading user...</p>

    <div v-else class="admin-edit-user-sections">
      <form class="admin-edit-user-form" @submit.prevent="onSaveUser">
        <div class="app-form-grid admin-edit-user-grid">
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
            <button type="submit" :disabled="isSaving || isDeleting || isResettingPassword" class="app-button-primary">
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
            <button
              type="button"
              class="app-button-secondary"
              :disabled="isSaving || isDeleting || isResettingPassword"
              @click="onCancel"
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            class="app-button-danger"
            :disabled="isSaving || isDeleting || isResettingPassword"
            @click="onDeleteUser"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </form>

      <section class="admin-reset-password">
        <h2 class="admin-reset-password-title">Reset Password</h2>
        <p class="admin-edit-user-muted app-muted">Set a new password for this user.</p>

        <p v-if="resetPasswordError" class="admin-edit-user-error app-error">{{ resetPasswordError }}</p>
        <p v-if="resetPasswordSuccess" class="admin-reset-password-success app-success">{{ resetPasswordSuccess }}</p>

        <form class="admin-reset-password-form" @submit.prevent="onResetPassword">
          <div class="app-form-grid admin-edit-user-grid">
            <label class="app-form-field">
              <span class="app-form-label">New Password</span>
              <input v-model="resetPasswordForm.password" type="password" required class="app-form-control" />
            </label>
            <label class="app-form-field">
              <span class="app-form-label">Confirm Password</span>
              <input v-model="resetPasswordForm.confirmPassword" type="password" required class="app-form-control" />
            </label>
          </div>

          <div class="admin-reset-password-actions">
            <button type="submit" :disabled="isResettingPassword || isSaving || isDeleting" class="app-button-primary">
              {{ isResettingPassword ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<style scoped>
.admin-edit-user {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-edit-user-title {
  margin: 0;
  color: #f4f8ff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.admin-edit-user-subtitle {
  margin: 0.35rem 0 0;
  color: var(--app-text-muted);
  font-size: 0.92rem;
}

.admin-edit-user-error {
  margin: 0;
}

.admin-edit-user-muted {
  margin: 0;
}

.admin-edit-user-sections {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.admin-edit-user-grid {
  align-items: end;
}

.admin-edit-user-checkbox {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding-top: 0.25rem;
  grid-column: 1 / -1;
  color: #d9e7fb;
  font-size: 0.92rem;
}

.admin-edit-user-checkbox-input {
  accent-color: var(--app-accent);
}

.admin-reset-password {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 1rem;
  border-top: 1px solid var(--app-border-soft);
}

.admin-reset-password-title {
  margin: 0;
  color: #f4f8ff;
  font-size: 1.2rem;
  font-weight: 700;
}

.admin-reset-password-success {
  margin: 0;
}

.admin-reset-password-actions {
  margin-top: 0.5rem;
}

.admin-edit-user-actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
}

.admin-edit-user-actions-main {
  display: flex;
  gap: 0.55rem;
}
</style>
