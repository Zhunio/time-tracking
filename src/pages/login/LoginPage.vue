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
  <div class="columns is-centered">
    <div class="column is-full-mobile is-two-thirds-tablet is-half-desktop">
      <h1 class="title is-3">Login</h1>
      <p class="subtitle is-6">Sign in to access your time tracking dashboard.</p>

      <form @submit.prevent="onLogin">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input v-model="email" type="email" required class="input" placeholder="you@example.com" />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input v-model="password" type="password" required class="input" placeholder="••••••••" />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button type="submit" :disabled="isLoading" class="button is-primary is-fullwidth">
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
          </div>
        </div>

        <article v-if="errorMessage" class="message is-danger is-light">
          <div class="message-body">{{ errorMessage }}</div>
        </article>
      </form>
    </div>
  </div>
</template>
