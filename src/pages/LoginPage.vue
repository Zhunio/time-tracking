<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../services/ApiService';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter();

const onLogin = async () => {
  // Prevent duplicate submissions while the first login request is still in flight.
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await apiService.login({
      email: email.value,
      password: password.value,
    });

    await router.push('/');
  } catch (error) {
    errorMessage.value = 'Invalid email or password. Please try again';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="login-card">
    <h1 class="login-title">Login</h1>
    <p class="login-subtitle">Sign in to access your time tracking dashboard.</p>

    <form class="login-form" @submit.prevent="onLogin">
      <label class="login-field">
        <span class="login-label">Email</span>
        <input v-model="email" type="email" required class="login-input" placeholder="you@example.com" />
      </label>

      <label class="login-field">
        <span class="login-label">Password</span>
        <input v-model="password" type="password" required class="login-input" placeholder="••••••••" />
      </label>

      <button type="submit" :disabled="isLoading" class="login-submit-button">
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>

      <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
    </form>
  </section>
</template>

<style scoped>
@reference 'tailwindcss';

.login-card {
  @apply mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm;
}

.login-title {
  @apply text-2xl font-bold tracking-tight text-slate-900;
}

.login-subtitle {
  @apply mt-2 text-sm text-slate-600;
}

.login-form {
  @apply mt-6 space-y-4;
}

.login-field {
  @apply block;
}

.login-label {
  @apply mb-1 block text-sm font-medium text-slate-700;
}

.login-input {
  @apply w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-400;
}

.login-submit-button {
  @apply w-full rounded-md bg-slate-900 px-3 py-2 font-medium text-white transition hover:bg-slate-700;
}

.login-error {
  @apply text-sm text-red-600;
}
</style>
