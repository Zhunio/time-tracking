import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../../../services/ApiService';
import type { CreateTimeTrackerRequest } from '../../../types/timeTracker';
import type { User } from '../../../types/user';

type CreateFormState = {
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
};

const getTodayDateInput = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toIsoDate = (dateValue: string): string => {
  if (!dateValue) {
    return dateValue;
  }

  return new Date(`${dateValue}T00:00:00.000Z`).toISOString();
};

export const useTimeTrackerCreateForm = () => {
  const router = useRouter();
  const isCreating = ref(false);
  const isLoadingUsers = ref(false);
  const errorMessage = ref('');
  const isAdmin = ref(apiService.isAdmin());
  const users = ref<User[]>([]);
  const currentUser = apiService.getCurrentUser();

  const form = ref<CreateFormState>({
    userId: currentUser?.id ?? '',
    date: getTodayDateInput(),
    startTime: '07:30',
    endTime: '17:00',
  });

  const loadUsers = async () => {
    if (!isAdmin.value) {
      return;
    }

    isLoadingUsers.value = true;
    errorMessage.value = '';

    try {
      users.value = await apiService.getUsers();

      if (!form.value.userId && users.value.length > 0) {
        form.value.userId = users.value[0].id;
      }
    } catch {
      errorMessage.value = 'Failed to load users for selection.';
    } finally {
      isLoadingUsers.value = false;
    }
  };

  const onCreateTimeTracker = async () => {
    if (isCreating.value) {
      return;
    }

    isCreating.value = true;
    errorMessage.value = '';

    if (!form.value.userId) {
      errorMessage.value = 'User is required.';
      isCreating.value = false;
      return;
    }

    if (form.value.endTime <= form.value.startTime) {
      errorMessage.value = 'End Time must be later than Start Time.';
      isCreating.value = false;
      return;
    }

    const payload: CreateTimeTrackerRequest = {
      userId: form.value.userId,
      date: toIsoDate(form.value.date),
      startTime: form.value.startTime,
      endTime: form.value.endTime,
    };

    try {
      await apiService.createTimeTracker(payload);
      await router.push('/');
    } catch {
      errorMessage.value = 'Failed to create time tracking record.';
    } finally {
      isCreating.value = false;
    }
  };

  const onCancel = async () => {
    await router.push('/');
  };

  onMounted(loadUsers);

  return {
    form,
    users,
    isAdmin,
    isCreating,
    isLoadingUsers,
    errorMessage,
    onCreateTimeTracker,
    onCancel,
  };
};
