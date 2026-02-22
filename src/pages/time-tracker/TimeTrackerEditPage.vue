<script setup lang="ts">
import { useTimeTrackerEditForm } from './composables/useTimeTrackerEditForm';

const {
  form,
  userDisplayName,
  isLoading,
  isSaving,
  isDeleting,
  errorMessage,
  onSaveTimeTracker,
  onCancel,
  onDeleteTimeTracker,
} = useTimeTrackerEditForm();
</script>

<template>
  <section class="time-tracking-edit-page">
    <header>
      <h1 class="time-tracking-edit-page-title">Edit Time Tracking</h1>
      <p class="time-tracking-edit-page-subtitle">Update a time tracking record.</p>
    </header>

    <p v-if="errorMessage" class="time-tracking-edit-page-error">{{ errorMessage }}</p>
    <p v-if="isLoading" class="time-tracking-edit-page-muted">Loading time tracking record...</p>

    <form v-else class="time-tracking-edit-page-form" @submit.prevent="onSaveTimeTracker">
      <div class="time-tracking-edit-page-grid">
        <label class="time-tracking-edit-page-field">
          <span>Name</span>
          <div class="time-tracking-edit-page-static-field">{{ userDisplayName }}</div>
        </label>

        <label class="time-tracking-edit-page-field">
          <span>Date</span>
          <input v-model="form.date" type="date" required class="time-tracking-edit-page-input" />
        </label>

        <label class="time-tracking-edit-page-field">
          <span>Start Time</span>
          <input v-model="form.startTime" type="time" required class="time-tracking-edit-page-input" />
        </label>

        <label class="time-tracking-edit-page-field">
          <span>End Time</span>
          <input v-model="form.endTime" type="time" required class="time-tracking-edit-page-input" />
        </label>
      </div>

      <div class="time-tracking-edit-page-actions">
        <div class="time-tracking-edit-page-actions-main">
          <button type="submit" :disabled="isSaving || isDeleting" class="time-tracking-edit-page-button">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button
            type="button"
            class="time-tracking-edit-page-button-secondary"
            :disabled="isSaving || isDeleting"
            @click="onCancel"
          >
            Cancel
          </button>
        </div>
        <button
          type="button"
          class="time-tracking-edit-page-button-danger"
          :disabled="isSaving || isDeleting"
          @click="onDeleteTimeTracker"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
@reference 'tailwindcss';

.time-tracking-edit-page {
  @apply space-y-6 bg-transparent p-0 text-slate-100;
}

.time-tracking-edit-page-title {
  @apply text-2xl font-bold tracking-tight text-white;
}

.time-tracking-edit-page-subtitle {
  @apply mt-2 text-sm text-slate-400;
}

.time-tracking-edit-page-error {
  @apply rounded-md border border-red-900/70 bg-red-950/60 p-3 text-sm text-red-300;
}

.time-tracking-edit-page-muted {
  @apply text-sm text-slate-400;
}

.time-tracking-edit-page-form {
  @apply p-0;
}

.time-tracking-edit-page-grid {
  @apply grid gap-3 md:grid-cols-2;
}

.time-tracking-edit-page-field {
  @apply block;
}

.time-tracking-edit-page-field span {
  @apply mb-1 block text-sm font-medium text-slate-300;
}

.time-tracking-edit-page-input {
  @apply w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-slate-500;
}

.time-tracking-edit-page-input[type='time']::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(1.3);
  opacity: 0.9;
}

.time-tracking-edit-page-input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(1.3);
  opacity: 0.9;
}

.time-tracking-edit-page-static-field {
  @apply w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100;
}

.time-tracking-edit-page-actions {
  @apply mt-4 flex flex-wrap items-center justify-between gap-3;
}

.time-tracking-edit-page-actions-main {
  @apply flex gap-2;
}

.time-tracking-edit-page-button {
  @apply cursor-pointer rounded-md bg-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-950 transition duration-150 hover:bg-emerald-200 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60;
}

.time-tracking-edit-page-button-secondary {
  @apply cursor-pointer rounded-md border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition duration-150 hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60;
}

.time-tracking-edit-page-button-danger {
  @apply cursor-pointer rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white transition duration-150 hover:bg-red-600 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60;
}
</style>
