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
  <section class="register-card app-panel">
    <h1 class="register-title">Create Account</h1>
    <p class="register-subtitle">Register to start tracking your time.</p>

    <form class="register-form" @submit.prevent="onSubmit">
      <label class="app-form-field">
        <span class="app-form-label">Full Name</span>
        <input v-model="name" type="text" required class="app-form-control" placeholder="Jane Doe" />
      </label>

      <label class="app-form-field">
        <span class="app-form-label">Email</span>
        <input v-model="email" type="email" required class="app-form-control" placeholder="you@example.com" />
      </label>

      <label class="app-form-field">
        <span class="app-form-label">Password</span>
        <input v-model="password" type="password" required class="app-form-control" placeholder="••••••••" />
      </label>

      <label class="app-form-field">
        <span class="app-form-label">Confirm Password</span>
        <input v-model="confirmPassword" type="password" required class="app-form-control" placeholder="••••••••" />
      </label>

      <button type="submit" class="app-button-primary register-submit-button">Create Account</button>
    </form>
  </section>
</template>

<style scoped>
.register-card {
  max-width: 30rem;
  margin: 2.5rem auto 0;
}

.register-title {
  margin: 0;
  color: #f4f8ff;
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.register-subtitle {
  margin: 0.35rem 0 0;
  color: var(--app-text-muted);
  font-size: 0.92rem;
}

.register-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.register-submit-button {
  width: 100%;
  margin-top: 0.2rem;
}
</style>
