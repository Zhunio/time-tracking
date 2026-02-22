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
  <section class="section p-0">
    <h1 class="title is-3">Edit User</h1>
    <p class="subtitle is-6">Update user account details.</p>

    <article v-if="errorMessage" class="message is-danger is-light">
      <div class="message-body">{{ errorMessage }}</div>
    </article>
    <p v-if="isLoading" class="has-text-grey-light">Loading user...</p>

    <div v-else>
      <form @submit.prevent="onSaveUser">
        <div class="columns is-multiline">
          <div class="column is-half">
            <div class="field">
              <label class="label">First Name</label>
              <div class="control">
                <input v-model="form.firstName" type="text" required class="input" />
              </div>
            </div>
          </div>

          <div class="column is-half">
            <div class="field">
              <label class="label">Last Name</label>
              <div class="control">
                <input v-model="form.lastName" type="text" required class="input" />
              </div>
            </div>
          </div>

          <div class="column is-half">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input v-model="form.email" type="email" required class="input" />
              </div>
            </div>
          </div>

          <div class="column is-half">
            <div class="field">
              <label class="label">Date of Birth</label>
              <div class="control">
                <input v-model="form.dateOfBirth" type="date" required class="input" />
              </div>
            </div>
          </div>

          <div class="column is-full">
            <label class="checkbox">
              <input v-model="form.isAdmin" type="checkbox" />
              Admin user
            </label>
          </div>
        </div>

        <div class="buttons mt-2">
          <button type="submit" :disabled="isSaving || isDeleting || isResettingPassword" class="button is-primary">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" class="button" :disabled="isSaving || isDeleting || isResettingPassword" @click="onCancel">Cancel</button>
          <button type="button" class="button is-danger" :disabled="isSaving || isDeleting || isResettingPassword" @click="onDeleteUser">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </form>

      <hr />

      <section>
        <h2 class="title is-5">Reset Password</h2>
        <p class="has-text-grey-light mb-3">Set a new password for this user.</p>

        <article v-if="resetPasswordError" class="message is-danger is-light">
          <div class="message-body">{{ resetPasswordError }}</div>
        </article>
        <article v-if="resetPasswordSuccess" class="message is-success is-light">
          <div class="message-body">{{ resetPasswordSuccess }}</div>
        </article>

        <form @submit.prevent="onResetPassword">
          <div class="columns is-multiline">
            <div class="column is-half">
              <div class="field">
                <label class="label">New Password</label>
                <div class="control">
                  <input v-model="resetPasswordForm.password" type="password" required class="input" />
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">Confirm Password</label>
                <div class="control">
                  <input v-model="resetPasswordForm.confirmPassword" type="password" required class="input" />
                </div>
              </div>
            </div>
          </div>

          <div class="buttons">
            <button type="submit" :disabled="isResettingPassword || isSaving || isDeleting" class="button is-primary">
              {{ isResettingPassword ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>
