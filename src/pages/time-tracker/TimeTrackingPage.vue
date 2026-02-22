<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getDurationHours, to12HourTime, useTimeTrackingList } from './composables/useTimeTrackingList';

type EntryRow = {
  id: string;
  isPlaceholder?: boolean;
};

const router = useRouter();
const { selectedDate, weekRangeLabel, userCards, errorMessage, isLoadingTimeTrackers } = useTimeTrackingList();

const goToCreateTimeTracker = async () => {
  await router.push('/time-trackers/create');
};

const goToEditTimeTracker = async (entry: EntryRow) => {
  if (entry.isPlaceholder) {
    return;
  }

  await router.push({ name: 'time-trackers-edit', params: { id: entry.id } });
};
</script>

<template>
  <section class="section p-0">
    <h1 class="title is-3 mb-2">Time Tracking</h1>
    <p class="subtitle is-6">Review and manage time tracking records.</p>

    <div class="level mb-4">
      <div class="level-left">
        <div class="field mb-0">
          <label class="label">Week start</label>
          <div class="control">
            <input v-model="selectedDate" type="date" class="input" aria-label="Week start date" />
          </div>
          <p class="help">{{ weekRangeLabel }}</p>
        </div>
      </div>
      <div class="level-right">
        <button type="button" class="button is-primary" @click="goToCreateTimeTracker">Create</button>
      </div>
    </div>

    <article v-if="errorMessage" class="message is-danger is-light">
      <div class="message-body">{{ errorMessage }}</div>
    </article>

    <p v-if="isLoadingTimeTrackers" class="has-text-grey-light">Loading time tracking records...</p>
    <p v-else-if="userCards.length === 0" class="has-text-grey-light">No time tracking records for this week.</p>

    <div v-else class="columns is-multiline">
      <div v-for="card in userCards" :key="card.userId" class="column is-half-tablet is-one-third-desktop">
        <article class="card">
          <div class="card-content">
            <div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
              <p class="title is-5 mb-0">{{ card.userName }}</p>
              <span class="tag is-primary is-light">{{ card.totalHours.toFixed(1) }}h</span>
            </div>

            <ul>
              <li
                v-for="entry in card.entryRows"
                :key="entry.id"
                class="is-flex is-justify-content-space-between is-align-items-center py-2"
              >
                <template v-if="entry.isPlaceholder">
                  <span class="has-text-grey">-</span>
                </template>
                <template v-else>
                  <button type="button" class="button is-text p-0" @click="goToEditTimeTracker(entry)">
                    <span class="has-text-weight-semibold">{{ entry.dayIndicator }}:</span>
                    <span class="ml-2">{{ to12HourTime(entry.startTime) }} - {{ to12HourTime(entry.endTime) }}</span>
                  </button>
                  <span class="tag is-info is-light"
                    >{{ getDurationHours(entry.startTime, entry.endTime).toFixed(1) }}h</span
                  >
                </template>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
