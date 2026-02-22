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
  <section class="section p-0">
    <h1 class="title is-3">Edit Time Tracking</h1>
    <p class="subtitle is-6">Update a time tracking record.</p>

    <article v-if="errorMessage" class="message is-danger is-light">
      <div class="message-body">{{ errorMessage }}</div>
    </article>

    <p v-if="isLoading" class="has-text-grey-light">Loading time tracking record...</p>

    <form v-else @submit.prevent="onSaveTimeTracker">
      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input :value="userDisplayName" type="text" readonly class="input" />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input v-model="form.date" type="date" required class="input" />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Start Time</label>
            <div class="control">
              <input v-model="form.startTime" type="time" required class="input" />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">End Time</label>
            <div class="control">
              <input v-model="form.endTime" type="time" required class="input" />
            </div>
          </div>
        </div>
      </div>

      <div class="buttons mt-2">
        <button type="submit" :disabled="isSaving || isDeleting" class="button is-primary">
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
        <button type="button" class="button" :disabled="isSaving || isDeleting" @click="onCancel">Cancel</button>
        <button type="button" class="button is-danger" :disabled="isSaving || isDeleting" @click="onDeleteTimeTracker">
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </form>
  </section>
</template>
