<script setup lang="ts">
import { useTimeTrackerCreateForm } from './composables/useTimeTrackerCreateForm';

const { form, users, isAdmin, isCreating, isLoadingUsers, errorMessage, onCreateTimeTracker, onCancel } =
  useTimeTrackerCreateForm();
</script>

<template>
  <section class="time-tracking-create-page">
    <header>
      <h1 class="time-tracking-create-page-title">Create Time Tracking</h1>
      <p class="time-tracking-create-page-subtitle">Add a new time tracking record.</p>
    </header>

    <p v-if="errorMessage" class="time-tracking-create-page-error">{{ errorMessage }}</p>

    <form class="time-tracking-create-page-form" @submit.prevent="onCreateTimeTracker">
      <div class="time-tracking-create-page-grid">
        <label class="time-tracking-create-page-field" v-if="isAdmin">
          <span>Name</span>
          <select
            v-model="form.userId"
            required
            :disabled="isLoadingUsers || isCreating"
            class="time-tracking-create-page-input time-tracking-create-page-select"
          >
            <option value="" disabled>{{ isLoadingUsers ? 'Loading users...' : 'Select a user' }}</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.firstName }} {{ user.lastName }}
            </option>
          </select>
        </label>

        <label class="time-tracking-create-page-field" v-else>
          <span>User ID</span>
          <input
            v-model="form.userId"
            type="text"
            required
            readonly
            class="time-tracking-create-page-input time-tracking-create-page-input-readonly"
          />
        </label>

        <label class="time-tracking-create-page-field">
          <span>Date</span>
          <input v-model="form.date" type="date" required class="time-tracking-create-page-input" />
        </label>

        <label class="time-tracking-create-page-field">
          <span>Start Time</span>
          <input v-model="form.startTime" type="time" required class="time-tracking-create-page-input" />
        </label>

        <label class="time-tracking-create-page-field">
          <span>End Time</span>
          <input v-model="form.endTime" type="time" required class="time-tracking-create-page-input" />
        </label>
      </div>

      <div class="time-tracking-create-page-actions">
        <div class="time-tracking-create-page-actions-main">
          <button type="submit" :disabled="isCreating" class="time-tracking-create-page-button">
            {{ isCreating ? 'Creating...' : 'Create' }}
          </button>
          <button
            type="button"
            class="time-tracking-create-page-button-secondary"
            :disabled="isCreating"
            @click="onCancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
@reference 'tailwindcss';

.time-tracking-create-page {
  @apply space-y-6 text-slate-100;
}

.time-tracking-create-page-title {
  @apply text-2xl font-bold tracking-tight text-white;
}

.time-tracking-create-page-subtitle {
  @apply mt-2 text-sm text-slate-400;
}

.time-tracking-create-page-error {
  @apply rounded-md border border-red-900/70 bg-red-950/60 p-3 text-sm text-red-300;
}

.time-tracking-create-page-form {
  @apply p-0;
}

.time-tracking-create-page-grid {
  @apply grid gap-3 md:grid-cols-2;
}

.time-tracking-create-page-field {
  @apply block;
}

.time-tracking-create-page-field span {
  @apply mb-1 block text-sm font-medium text-slate-300;
}

.time-tracking-create-page-input {
  @apply w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-slate-500;
}

.time-tracking-create-page-input[type='time']::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(1.3);
  opacity: 0.9;
}

.time-tracking-create-page-input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(1.3);
  opacity: 0.9;
}

.time-tracking-create-page-select {
  appearance: none;
  padding-right: 2.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
}

.time-tracking-create-page-input-readonly {
  @apply bg-slate-900 text-slate-300;
}

.time-tracking-create-page-actions {
  @apply mt-4 flex flex-wrap items-center justify-between gap-3;
}

.time-tracking-create-page-actions-main {
  @apply flex gap-2;
}

.time-tracking-create-page-button {
  @apply cursor-pointer rounded-md bg-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-950 transition duration-150 hover:bg-emerald-200 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60;
}

.time-tracking-create-page-button-secondary {
  @apply cursor-pointer rounded-md border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60;
}
</style>
