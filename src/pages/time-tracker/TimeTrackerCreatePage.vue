<script setup lang="ts">
import { useTimeTrackerCreateForm } from './composables/useTimeTrackerCreateForm';

const { form, users, isAdmin, isCreating, isLoadingUsers, errorMessage, onCreateTimeTracker, onCancel } =
  useTimeTrackerCreateForm();
</script>

<template>
  <section class="time-tracking-create-page app-panel">
    <header>
      <h1 class="time-tracking-create-page-title">Create Time Tracking</h1>
      <p class="time-tracking-create-page-subtitle">Add a new time tracking record.</p>
    </header>

    <p v-if="errorMessage" class="time-tracking-create-page-error app-error">{{ errorMessage }}</p>

    <form class="time-tracking-create-page-form" @submit.prevent="onCreateTimeTracker">
      <div class="app-form-grid">
        <label class="app-form-field" v-if="isAdmin">
          <span class="app-form-label">Name</span>
          <select
            v-model="form.userId"
            required
            :disabled="isLoadingUsers || isCreating"
            class="app-form-control app-form-select"
          >
            <option value="" disabled>{{ isLoadingUsers ? 'Loading users...' : 'Select a user' }}</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.firstName }} {{ user.lastName }}
            </option>
          </select>
        </label>

        <label class="app-form-field" v-else>
          <span class="app-form-label">User ID</span>
          <input
            v-model="form.userId"
            type="text"
            required
            readonly
            class="app-form-control app-form-control-readonly"
          />
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
          <button type="submit" :disabled="isCreating" class="app-button-primary">
            {{ isCreating ? 'Creating...' : 'Create' }}
          </button>
          <button type="button" class="app-button-secondary" :disabled="isCreating" @click="onCancel">Cancel</button>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
.time-tracking-create-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-tracking-create-page-title {
  margin: 0;
  color: #f4f8ff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.time-tracking-create-page-subtitle {
  margin: 0.35rem 0 0;
  color: var(--app-text-muted);
  font-size: 0.92rem;
}

.time-tracking-create-page-error {
  margin: 0;
}
</style>
