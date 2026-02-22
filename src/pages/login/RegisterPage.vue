<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const onSubmit = () => {
  console.log('Register submit', {
    name: name.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  });
};
</script>

<template>
  <div class="columns is-centered">
    <div class="column is-full-mobile is-two-thirds-tablet is-half-desktop">
      <h1 class="title is-3">Create Account</h1>
      <p class="subtitle is-6">Register to start tracking your time.</p>

      <form @submit.prevent="onSubmit">
        <div class="field">
          <label class="label">Full Name</label>
          <div class="control">
            <input v-model="name" type="text" required class="input" placeholder="Jane Doe" />
          </div>
        </div>

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
          <label class="label">Confirm Password</label>
          <div class="control">
            <input v-model="confirmPassword" type="password" required class="input" placeholder="••••••••" />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button type="submit" class="button is-primary is-fullwidth">Create Account</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
