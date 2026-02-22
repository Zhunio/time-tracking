import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '../../../services/ApiService';
import type { UpdateTimeTrackerRequest } from '../../../types/timeTracker';

type EditFormState = {
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
};

const toIsoDate = (dateValue: string): string => {
  if (!dateValue) {
    return dateValue;
  }

  return new Date(`${dateValue}T00:00:00.000Z`).toISOString();
};

const toDateInput = (isoDate: string): string => {
  if (!isoDate) {
    return '';
  }

  return isoDate.split('T')[0];
};

export const useTimeTrackerEditForm = () => {
  const route = useRoute();
  const router = useRouter();

  const timeTrackerId = computed(() => String(route.params.id ?? ''));
  const isLoading = ref(false);
  const isSaving = ref(false);
  const isDeleting = ref(false);
  const errorMessage = ref('');
  const userDisplayName = ref('');

  const form = ref<EditFormState>({
    userId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const loadTimeTracker = async () => {
    if (!timeTrackerId.value) {
      errorMessage.value = 'Invalid time tracker id.';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      const timeTrackers = await apiService.getTimeTrackers();
      const timeTracker = timeTrackers.find((item) => item.id === timeTrackerId.value);

      if (!timeTracker) {
        errorMessage.value = 'Time tracking record not found.';
        return;
      }

      form.value = {
        userId: timeTracker.userId,
        date: toDateInput(timeTracker.date),
        startTime: timeTracker.startTime,
        endTime: timeTracker.endTime,
      };

      const currentUser = apiService.getCurrentUser();
      if (currentUser && currentUser.id === timeTracker.userId) {
        userDisplayName.value = `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.email;
        return;
      }

      try {
        const users = await apiService.getUsers();
        const matchedUser = users.find((user) => user.id === timeTracker.userId);
        if (matchedUser) {
          userDisplayName.value = `${matchedUser.firstName} ${matchedUser.lastName}`.trim() || matchedUser.email;
        } else {
          userDisplayName.value = timeTracker.userId;
        }
      } catch {
        userDisplayName.value = timeTracker.userId;
      }
    } catch {
      errorMessage.value = 'Failed to load time tracking record.';
    } finally {
      isLoading.value = false;
    }
  };

  const onSaveTimeTracker = async () => {
    if (isSaving.value || !timeTrackerId.value) {
      return;
    }

    isSaving.value = true;
    errorMessage.value = '';

    const payload: UpdateTimeTrackerRequest = {
      userId: form.value.userId,
      date: toIsoDate(form.value.date),
      startTime: form.value.startTime,
      endTime: form.value.endTime,
    };

    try {
      await apiService.updateTimeTracker(timeTrackerId.value, payload);
      await router.push('/');
    } catch {
      errorMessage.value = 'Failed to update time tracking record.';
    } finally {
      isSaving.value = false;
    }
  };

  const onCancel = async () => {
    await router.push('/');
  };

  const onDeleteTimeTracker = async () => {
    if (isDeleting.value || !timeTrackerId.value) {
      return;
    }

    if (!window.confirm('Delete this time tracking record?')) {
      return;
    }

    isDeleting.value = true;
    errorMessage.value = '';

    try {
      await apiService.deleteTimeTracker(timeTrackerId.value);
      await router.push('/');
    } catch {
      errorMessage.value = 'Failed to delete time tracking record.';
    } finally {
      isDeleting.value = false;
    }
  };

  onMounted(loadTimeTracker);

  return {
    form,
    userDisplayName,
    isLoading,
    isSaving,
    isDeleting,
    errorMessage,
    onSaveTimeTracker,
    onCancel,
    onDeleteTimeTracker,
  };
};
