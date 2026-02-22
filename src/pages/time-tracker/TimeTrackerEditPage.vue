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

    <p v-if="errorMessage" class="time-tracking-edit-page-error app-error">{{ errorMessage }}</p>
    <p v-if="isLoading" class="time-tracking-edit-page-muted app-muted">Loading time tracking record...</p>

    <form v-else class="time-tracking-edit-page-form" @submit.prevent="onSaveTimeTracker">
      <div class="app-form-grid">
        <label class="app-form-field">
          <span class="app-form-label">Name</span>
          <div class="app-form-static">{{ userDisplayName }}</div>
        </label>

        <label class="app-form-field">
          <span class="app-form-label">Date</span>
          <input v-model="form.date" type="date" required class="app-form-control" />
        </label>

        <label class="app-form-field">
          <span class="app-form-label">Start Time</span>
          <input v-model="form.startTime" type="time" required class="app-form-control" />
        </label>

        <label class="app-form-field">
          <span class="app-form-label">End Time</span>
          <input v-model="form.endTime" type="time" required class="app-form-control" />
        </label>
      </div>

      <div class="app-actions">
        <div class="app-actions-main">
          <button type="submit" :disabled="isSaving || isDeleting" class="app-button-primary">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" class="app-button-secondary" :disabled="isSaving || isDeleting" @click="onCancel">
            Cancel
          </button>
        </div>
        <button type="button" class="app-button-danger" :disabled="isSaving || isDeleting" @click="onDeleteTimeTracker">
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.time-tracking-edit-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-tracking-edit-page-title {
  margin: 0;
  color: #f4f8ff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.time-tracking-edit-page-subtitle {
  margin: 0.35rem 0 0;
  color: var(--app-text-muted);
  font-size: 0.92rem;
}

.time-tracking-edit-page-error {
  margin: 0;
}

.time-tracking-edit-page-muted {
  margin: 0;
}
</style>
