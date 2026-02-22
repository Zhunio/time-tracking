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
  <section class="time-tracking-page">
    <header class="time-tracking-page-header">
      <div>
        <h1 class="time-tracking-page-title">Time Tracking</h1>
        <p class="time-tracking-page-subtitle">Review and manage time tracking records.</p>
      </div>
    </header>

    <div class="time-tracking-controls">
      <label class="time-tracking-week-picker">
        <span class="time-tracking-week-label">Week start</span>
        <span class="time-tracking-week-wrap">
          <span class="time-tracking-week-text">{{ weekRangeLabel }}</span>
          <span class="time-tracking-week-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4" />
              <path d="M8 3v4" />
              <path d="M3 10h18" />
            </svg>
          </span>
          <input v-model="selectedDate" type="date" class="time-tracking-week-input" aria-label="Week start date" />
        </span>
      </label>
      <button type="button" class="time-tracking-create-btn" @click="goToCreateTimeTracker">Create</button>
    </div>

    <p v-if="errorMessage" class="time-tracking-error">{{ errorMessage }}</p>

    <section class="time-tracking-list">
      <p v-if="isLoadingTimeTrackers" class="time-tracking-muted">Loading time tracking records...</p>
      <p v-else-if="userCards.length === 0" class="time-tracking-muted">No time tracking records for this week.</p>

      <div v-else class="time-tracking-cards">
        <article v-for="card in userCards" :key="card.userId" class="time-tracking-card">
          <div class="time-tracking-card-grid">
            <div class="time-tracking-user">
              <div class="time-tracking-user-name">{{ card.userName }}</div>
              <p class="time-tracking-total">
                <span class="time-tracking-total-label">Total</span>
                <span class="time-tracking-total-value">{{ card.totalHours.toFixed(1) }}h</span>
              </p>
            </div>
            <ul class="time-tracking-entries">
              <li
                v-for="entry in card.entryRows"
                :key="entry.id"
                class="time-tracking-entry"
                :class="{ 'time-tracking-entry--interactive': !entry.isPlaceholder }"
                @click="goToEditTimeTracker(entry)"
              >
                <template v-if="entry.isPlaceholder">
                  <span class="time-tracking-entry-placeholder">-</span>
                </template>
                <template v-else>
                  <span class="time-tracking-entry-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 8v5" />
                      <path d="M12 13l3 2" />
                    </svg>
                  </span>
                  <span class="time-tracking-entry-day">{{ entry.dayIndicator }}:</span>
                  <span class="time-tracking-entry-time">
                    {{ to12HourTime(entry.startTime) }} - {{ to12HourTime(entry.endTime) }}
                  </span>
                  <span class="time-tracking-hours">
                    {{ getDurationHours(entry.startTime, entry.endTime).toFixed(1) }}h
                  </span>
                </template>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
@reference 'tailwindcss';

.time-tracking-page {
  @apply space-y-6 bg-transparent p-0 text-slate-100;
}

.time-tracking-page-header {
  @apply flex items-center justify-between gap-4;
}

.time-tracking-page-title {
  @apply text-2xl font-bold tracking-tight text-white;
}

.time-tracking-page-subtitle {
  @apply mt-2 text-sm text-slate-400;
}

.time-tracking-controls {
  @apply flex items-end justify-between gap-3;
}

.time-tracking-week-picker {
  @apply flex flex-col gap-1;
}

.time-tracking-week-label {
  @apply text-[11px] font-semibold uppercase tracking-wide text-slate-400;
}

.time-tracking-week-wrap {
  @apply relative inline-flex min-w-56 items-center rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-300 transition duration-150 hover:border-slate-500 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20;
}

.time-tracking-week-text {
  @apply pr-7 text-sm font-medium text-slate-100;
}

.time-tracking-week-icon {
  @apply pointer-events-none absolute right-2.5 inline-flex h-4 w-4 items-center justify-center text-slate-500;
}

.time-tracking-week-icon svg {
  @apply h-4 w-4;
}

.time-tracking-week-input {
  @apply absolute inset-0 h-full w-full cursor-pointer opacity-0 outline-none;
}

.time-tracking-week-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

.time-tracking-create-btn {
  @apply cursor-pointer rounded-md bg-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-950 transition duration-150 hover:bg-emerald-200 hover:shadow-sm;
}

.time-tracking-error {
  @apply rounded-md border border-red-900/70 bg-red-950/60 p-3 text-sm text-red-300;
}

.time-tracking-muted {
  @apply text-sm text-slate-400;
}

.time-tracking-cards {
  @apply grid gap-3 md:grid-cols-2 xl:grid-cols-3;
}

.time-tracking-card {
  @apply rounded-lg border border-slate-600 bg-slate-900/80 p-3;
}

.time-tracking-card-grid {
  @apply grid grid-cols-[auto_1fr] items-stretch gap-2;
}

.time-tracking-entries {
  @apply flex flex-col items-end gap-0.5;
}

.time-tracking-entry {
  @apply flex items-center justify-end gap-1.5 rounded px-0.5 py-0.5 text-xs font-medium text-slate-400;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}

.time-tracking-entry--interactive {
  @apply cursor-pointer transition-all duration-150;
}

.time-tracking-entry--interactive:hover {
  @apply bg-slate-800/70 text-sky-300;
}

.time-tracking-entry-time {
  text-decoration: none;
}

.time-tracking-entry--interactive:hover .time-tracking-entry-time {
  text-decoration: underline;
  text-decoration-color: rgb(125 211 252 / 0.85);
  text-underline-offset: 2px;
}

.time-tracking-entry--interactive:hover .time-tracking-entry-icon,
.time-tracking-entry--interactive:hover .time-tracking-entry-day {
  @apply text-sky-400;
}

.time-tracking-user-name {
  @apply text-xl font-bold leading-none tracking-tight text-white;
}

.time-tracking-user {
  @apply space-y-1;
}

.time-tracking-total {
  @apply mt-1 flex flex-col items-start gap-1;
}

.time-tracking-total-label {
  @apply text-sm font-semibold uppercase tracking-wide text-slate-500;
}

.time-tracking-total-value {
  @apply inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold text-emerald-200 bg-emerald-900/50;
}

.time-tracking-entry-day {
  @apply inline-flex min-w-4 items-center justify-center font-semibold text-slate-500;
}

.time-tracking-entry-icon {
  @apply inline-flex h-3.5 w-3.5 items-center justify-center text-slate-500;
}

.time-tracking-entry-icon svg {
  @apply h-3.5 w-3.5;
}

.time-tracking-entry-placeholder {
  @apply text-slate-500;
}

.time-tracking-hours {
  @apply ml-2 inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold text-emerald-200 bg-emerald-900/50;
}
</style>
