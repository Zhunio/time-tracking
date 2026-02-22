<script setup lang="ts">
import { useTimeTrackerCreateForm } from './composables/useTimeTrackerCreateForm';

const { form, users, isAdmin, isCreating, isLoadingUsers, errorMessage, onCreateTimeTracker, onCancel } = useTimeTrackerCreateForm();
</script>

<template>
  <section class="section p-0">
    <h1 class="title is-3">Create Time Tracking</h1>
    <p class="subtitle is-6">Add a new time tracking record.</p>

    <article v-if="errorMessage" class="message is-danger is-light">
      <div class="message-body">{{ errorMessage }}</div>
    </article>

    <form @submit.prevent="onCreateTimeTracker">
      <div class="columns is-multiline">
        <div class="column is-half" v-if="isAdmin">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="form.userId" required :disabled="isLoadingUsers || isCreating">
                  <option value="" disabled>{{ isLoadingUsers ? 'Loading users...' : 'Select a user' }}</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">{{ user.firstName }} {{ user.lastName }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-half" v-else>
          <div class="field">
            <label class="label">User ID</label>
            <div class="control">
              <input v-model="form.userId" type="text" required readonly class="input" />
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
        <button type="submit" :disabled="isCreating" class="button is-primary">
          {{ isCreating ? 'Creating...' : 'Create' }}
        </button>
        <button type="button" class="button" :disabled="isCreating" @click="onCancel">Cancel</button>
      </div>
    </form>
  </section>
</template>
