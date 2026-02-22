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
.time-tracking-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-tracking-page-header {
  border: 1px solid var(--app-border);
  border-radius: 14px;
  background: linear-gradient(160deg, rgba(28, 42, 66, 0.95) 0%, rgba(18, 28, 45, 0.98) 100%);
  padding: 1rem 1.1rem;
}

.time-tracking-page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f4f8ff;
  letter-spacing: -0.02em;
}

.time-tracking-page-subtitle {
  margin: 0.35rem 0 0;
  color: var(--app-text-muted);
  font-size: 0.92rem;
}

.time-tracking-controls {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.time-tracking-week-picker {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.time-tracking-week-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--app-text-muted);
}

.time-tracking-week-wrap {
  position: relative;
  display: inline-flex;
  min-width: 16rem;
  align-items: center;
  border-radius: 9px;
  border: 1px solid var(--app-border);
  background: var(--app-surface-strong);
  padding: 0.45rem 0.7rem;
  color: #d8e7ff;
  transition: border-color 0.15s ease;
}

.time-tracking-week-wrap:hover {
  border-color: #48628e;
}

.time-tracking-week-wrap:focus-within {
  border-color: #5ea4ff;
  box-shadow: 0 0 0 3px rgba(94, 164, 255, 0.2);
}

.time-tracking-week-text {
  padding-right: 1.6rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #ecf3ff;
}

.time-tracking-week-icon {
  pointer-events: none;
  position: absolute;
  right: 0.7rem;
  display: inline-flex;
  height: 1rem;
  width: 1rem;
  align-items: center;
  justify-content: center;
  color: #8fa8ce;
}

.time-tracking-week-icon svg {
  height: 1rem;
  width: 1rem;
}

.time-tracking-week-input {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0;
}

.time-tracking-week-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

.time-tracking-create-btn {
  border: 0;
  border-radius: 9px;
  background: var(--app-accent);
  color: #032923;
  padding: 0.52rem 0.9rem;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
}

.time-tracking-create-btn:hover {
  background: #62e5d1;
}

.time-tracking-error {
  border: 1px solid #8a3040;
  border-radius: 10px;
  background: rgba(131, 34, 52, 0.25);
  color: #ffb4c1;
  padding: 0.65rem 0.8rem;
  font-size: 0.92rem;
}

.time-tracking-muted {
  color: var(--app-text-muted);
  font-size: 0.93rem;
}

.time-tracking-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.time-tracking-card {
  border: 1px solid var(--app-border);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(26, 37, 58, 0.95) 0%, rgba(18, 27, 42, 0.98) 100%);
  box-shadow: 0 8px 20px rgba(4, 8, 16, 0.3);
  padding: 0.85rem 0.9rem;
}

.time-tracking-card-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: stretch;
  gap: 0.65rem;
}

.time-tracking-entries {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.time-tracking-entry {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
  border-radius: 8px;
  padding: 0.22rem 0.35rem;
  font-size: 0.76rem;
  font-weight: 600;
  color: #b4c6e3;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}

.time-tracking-entry--interactive {
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.time-tracking-entry--interactive:hover {
  background: rgba(46, 67, 104, 0.7);
  color: #bde2ff;
}

.time-tracking-entry-time {
  color: #e8f1ff;
  text-decoration: none;
}

.time-tracking-entry--interactive:hover .time-tracking-entry-time {
  text-decoration: underline;
  text-decoration-color: rgba(141, 207, 255, 0.9);
  text-underline-offset: 2px;
}

.time-tracking-entry--interactive:hover .time-tracking-entry-icon,
.time-tracking-entry--interactive:hover .time-tracking-entry-day {
  color: #7ec5ff;
}

.time-tracking-user-name {
  color: #f5f8ff;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}

.time-tracking-user {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.time-tracking-total {
  margin: 0.15rem 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.time-tracking-total-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #8ea3c6;
}

.time-tracking-total-value {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.12rem 0.45rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #99f4e2;
  background: rgba(28, 125, 111, 0.52);
}

.time-tracking-entry-day {
  display: inline-flex;
  min-width: 1rem;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #8ac7ff;
}

.time-tracking-entry-icon {
  display: inline-flex;
  height: 0.86rem;
  width: 0.86rem;
  align-items: center;
  justify-content: center;
  color: #77a5d8;
}

.time-tracking-entry-icon svg {
  height: 0.86rem;
  width: 0.86rem;
}

.time-tracking-entry-placeholder {
  color: #6f85a8;
}

.time-tracking-hours {
  margin-left: 0.35rem;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.12rem 0.42rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #9af4e2;
  background: rgba(28, 125, 111, 0.52);
}

@media (max-width: 1024px) {
  .time-tracking-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .time-tracking-cards {
    grid-template-columns: 1fr;
  }

  .time-tracking-week-wrap {
    min-width: 13rem;
  }
}
</style>
