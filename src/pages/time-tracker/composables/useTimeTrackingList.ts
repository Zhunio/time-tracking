import { computed, onMounted, ref } from 'vue';
import apiService from '../../../services/ApiService';
import type { TimeTracker } from '../../../types/timeTracker';
import type { User } from '../../../types/user';

type WeekDay = {
  dateKey: string;
  shortLabel: string;
  fullLabel: string;
};

type DailyEntry = {
  id: string;
  startTime: string;
  endTime: string;
};

type DisplayEntryRow = {
  id: string;
  dayIndicator: string;
  startTime: string;
  endTime: string;
  isPlaceholder?: boolean;
};

type UserCard = {
  userId: string;
  userName: string;
  entryRows: DisplayEntryRow[];
  totalHours: number;
};

const getTodayDateInput = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getDateKey = (isoDate: string): string => {
  if (!isoDate) {
    return '';
  }

  return isoDate.split('T')[0];
};

const getWeekStartDate = (dateInput: string): Date => {
  const date = new Date(`${dateInput}T00:00:00`);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  return date;
};

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toDayIndicator = (dayShort: string): string => {
  if (dayShort === 'M') return 'M';
  if (dayShort === 'Tu') return 'T';
  if (dayShort === 'W') return 'W';
  if (dayShort === 'Th') return 'T';
  if (dayShort === 'F') return 'F';
  if (dayShort === 'Sa') return 'S';
  if (dayShort === 'Su') return 'S';
  return dayShort;
};

const getMinutes = (timeValue: string): number => {
  const [hourString = '0', minuteString = '0'] = timeValue.split(':');
  const hours = Number(hourString);
  const minutes = Number(minuteString);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
};

const normalizeEntryRows = (rows: DisplayEntryRow[]): DisplayEntryRow[] => {
  const visibleRows = rows.slice(0, 5);

  while (visibleRows.length < 5) {
    visibleRows.push({
      id: `placeholder-${visibleRows.length}`,
      dayIndicator: '',
      startTime: '',
      endTime: '',
      isPlaceholder: true,
    });
  }

  return visibleRows;
};

export const to12HourTime = (timeValue: string): string => {
  if (!timeValue) {
    return '';
  }

  const [hourString = '0', minuteString = '00'] = timeValue.split(':');
  const hours24 = Number(hourString);

  if (Number.isNaN(hours24)) {
    return timeValue;
  }

  const hours12 = hours24 % 12 || 12;
  const period = hours24 >= 12 ? 'PM' : 'AM';

  return `${hours12}:${minuteString} ${period}`;
};

export const getDurationHours = (startTime: string, endTime: string): number => {
  const startMinutes = getMinutes(startTime);
  let endMinutes = getMinutes(endTime);

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
};

export const useTimeTrackingList = () => {
  const timeTrackers = ref<TimeTracker[]>([]);
  const isLoadingTimeTrackers = ref(false);
  const errorMessage = ref('');
  const usersById = ref<Record<string, User>>({});
  const isAdmin = apiService.isAdmin();
  const currentUser = apiService.getCurrentUser();
  const selectedDate = ref(getTodayDateInput());

  const weekDays = computed<WeekDay[]>(() => {
    const startDate = getWeekStartDate(selectedDate.value);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);

      const dateKey = formatDateKey(date);
      const fullLabel = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date);

      const shortLabel = index === 6 ? 'Su' : ['M', 'Tu', 'W', 'Th', 'F', 'Sa'][index];

      return {
        dateKey,
        shortLabel,
        fullLabel,
      };
    });
  });

  const weekRangeLabel = computed(() => {
    const first = weekDays.value[0];
    const last = weekDays.value[weekDays.value.length - 1];

    if (!first || !last) {
      return '';
    }

    return `${first.fullLabel} - ${last.fullLabel}`;
  });

  const getUserDisplayName = (userId: string): string => {
    const matchedUser = usersById.value[userId];

    if (matchedUser) {
      return matchedUser.firstName;
    }

    if (currentUser && currentUser.id === userId) {
      return currentUser.firstName;
    }

    return userId;
  };

  const userCards = computed<UserCard[]>(() => {
    const daySet = new Set(weekDays.value.map((day) => day.dateKey));
    const weekTrackers = timeTrackers.value.filter((tracker) => daySet.has(getDateKey(tracker.date)));
    const groupedByUser: Record<string, Record<string, DailyEntry[]>> = {};

    for (const tracker of weekTrackers) {
      const userId = tracker.userId;
      const dateKey = getDateKey(tracker.date);

      if (!groupedByUser[userId]) {
        groupedByUser[userId] = {};
      }

      if (!groupedByUser[userId][dateKey]) {
        groupedByUser[userId][dateKey] = [];
      }

      groupedByUser[userId][dateKey].push({
        id: tracker.id,
        startTime: tracker.startTime,
        endTime: tracker.endTime,
      });
    }

    return Object.entries(groupedByUser)
      .map(([userId, byDate]) => {
        const entryRows = weekDays.value.flatMap((day) => {
          const entries = [...(byDate[day.dateKey] ?? [])].sort((a, b) => a.startTime.localeCompare(b.startTime));
          const dayIndicator = toDayIndicator(day.shortLabel);

          return entries.map((entry) => ({
            id: entry.id,
            dayIndicator,
            startTime: entry.startTime,
            endTime: entry.endTime,
          }));
        });

        return {
          userId,
          userName: getUserDisplayName(userId),
          entryRows: normalizeEntryRows(entryRows),
          totalHours: entryRows.reduce((sum, entry) => sum + getDurationHours(entry.startTime, entry.endTime), 0),
        };
      })
      .sort((a, b) => a.userName.toLocaleLowerCase().localeCompare(b.userName.toLocaleLowerCase()));
  });

  const loadTimeTrackers = async () => {
    isLoadingTimeTrackers.value = true;
    errorMessage.value = '';

    try {
      timeTrackers.value = await apiService.getTimeTrackers();
    } catch {
      errorMessage.value = 'Failed to load time tracking records.';
    } finally {
      isLoadingTimeTrackers.value = false;
    }
  };

  const loadUsers = async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const users = await apiService.getUsers();
      usersById.value = users.reduce<Record<string, User>>((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
    } catch {
      usersById.value = {};
    }
  };

  onMounted(async () => {
    await Promise.all([loadTimeTrackers(), loadUsers()]);
  });

  return {
    selectedDate,
    weekRangeLabel,
    userCards,
    errorMessage,
    isLoadingTimeTrackers,
  };
};
