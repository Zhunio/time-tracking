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
  <section class="section p-0">
    <h1 class="title is-3">Create User</h1>
    <p class="subtitle is-6">Add a new user account.</p>

    <article v-if="errorMessage" class="message is-danger is-light">
      <div class="message-body">{{ errorMessage }}</div>
    </article>

    <form @submit.prevent="onCreateUser">
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
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input v-model="form.password" type="password" required class="input" />
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
        <button type="submit" :disabled="isCreating" class="button is-primary">
          {{ isCreating ? 'Creating...' : 'Create' }}
        </button>
        <button type="button" class="button" :disabled="isCreating" @click="onCancel">Cancel</button>
      </div>
    </form>
  </section>
</template>
