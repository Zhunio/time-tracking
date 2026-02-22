<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../../services/ApiService';

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

    await router.push('/time-trackers');
  } catch (error) {
    errorMessage.value = 'Invalid email or password. Please try again';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="login-card app-panel">
    <h1 class="login-title">Login</h1>
    <p class="login-subtitle">Sign in to access your time tracking dashboard.</p>

    <form class="login-form" @submit.prevent="onLogin">
      <label class="app-form-field">
        <span class="app-form-label">Email</span>
        <input v-model="email" type="email" required class="app-form-control" placeholder="you@example.com" />
      </label>

      <label class="app-form-field">
        <span class="app-form-label">Password</span>
        <input v-model="password" type="password" required class="app-form-control" placeholder="••••••••" />
      </label>

      <button type="submit" :disabled="isLoading" class="app-button-primary login-submit-button">
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>

      <p v-if="errorMessage" class="login-error app-error">{{ errorMessage }}</p>
    </form>
  </section>
</template>

<style scoped>
.login-card {
  max-width: 30rem;
  margin: 2.5rem auto 0;
}

.login-title {
  margin: 0;
  color: #f4f8ff;
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.login-subtitle {
  margin: 0.35rem 0 0;
  color: var(--app-text-muted);
  font-size: 0.92rem;
}

.login-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-submit-button {
  width: 100%;
  margin-top: 0.2rem;
}

.login-error {
  margin: 0;
}
</style>
