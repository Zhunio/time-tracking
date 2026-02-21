<script setup lang="ts">
import { useRouter } from 'vue-router';
import authService from './services/AuthService';

const router = useRouter();

const onLogout = async () => {
  authService.logout();
  await router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <header class="border-b border-slate-800 bg-black">
      <nav class="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <RouterLink class="font-semibold text-white" to="/">Time Tracking</RouterLink>
        <RouterLink class="text-slate-300 hover:text-white" to="/">Home</RouterLink>
        <RouterLink class="text-slate-300 hover:text-white" to="/login">Login</RouterLink>
        <RouterLink class="text-slate-300 hover:text-white" to="/register">Register</RouterLink>
        <button
          type="button"
          class="ml-auto cursor-pointer rounded-md border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-slate-500 hover:text-white"
          @click="onLogout"
        >
          Logout
        </button>
      </nav>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
