<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/AuthService';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter();

const onLogin = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await authService.login({
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
  <section class="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">Login</h1>
    <p class="mt-2 text-sm text-slate-600">Sign in to access your time tracking dashboard.</p>

    <form class="mt-6 space-y-4" @submit.prevent="onLogin">
      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-700">Email</span>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-400"
          placeholder="you@example.com"
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-700">Password</span>
        <input
          v-model="password"
          type="password"
          required
          class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-400"
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full rounded-md bg-slate-900 px-3 py-2 font-medium text-white transition hover:bg-slate-700"
      >
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    </form>
  </section>
</template>
