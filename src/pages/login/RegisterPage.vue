<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const onSubmit = () => {
  // Placeholder until auth backend is connected.
  console.log('Register submit', {
    name: name.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  });
};
</script>

<template>
  <section class="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-slate-100 shadow-sm">
    <h1 class="text-2xl font-bold tracking-tight text-white">Create Account</h1>
    <p class="mt-2 text-sm text-slate-400">Register to start tracking your time.</p>

    <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-300">Full Name</span>
        <input
          v-model="name"
          type="text"
          required
          class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-slate-500"
          placeholder="Jane Doe"
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-300">Email</span>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-slate-500"
          placeholder="you@example.com"
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-300">Password</span>
        <input
          v-model="password"
          type="password"
          required
          class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-slate-500"
          placeholder="••••••••"
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-300">Confirm Password</span>
        <input
          v-model="confirmPassword"
          type="password"
          required
          class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-slate-500"
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        class="w-full cursor-pointer rounded-md bg-slate-100 px-3 py-2 font-medium text-slate-950 transition hover:bg-white"
      >
        Create Account
      </button>
    </form>
  </section>
</template>
