<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../../services/ApiService';
import type { User } from '../../types/user';

const router = useRouter();
const users = ref<User[]>([]);
const isLoadingUsers = ref(false);
const errorMessage = ref('');

const toDateInput = (isoDate: string): string => {
  if (!isoDate) {
    return '';
  }

  return isoDate.split('T')[0];
};

const loadUsers = async () => {
  isLoadingUsers.value = true;
  errorMessage.value = '';

  try {
    users.value = await apiService.getUsers();
  } catch (error) {
    errorMessage.value = 'Failed to load users.';
  } finally {
    isLoadingUsers.value = false;
  }
};

const goToCreateUser = async () => {
  await router.push('/admin/users/create');
};

onMounted(loadUsers);
</script>

<template>
  <section class="admin-users">
    <header class="admin-users-header">
      <div>
        <h1 class="admin-users-title">User Management</h1>
        <p class="admin-users-subtitle">Click a name to edit a user.</p>
      </div>
      <button type="button" class="admin-users-button" @click="goToCreateUser">Create user</button>
    </header>

    <p v-if="errorMessage" class="admin-users-error">{{ errorMessage }}</p>

    <section class="admin-users-list">
      <p v-if="isLoadingUsers" class="admin-users-muted">Loading users...</p>
      <p v-else-if="users.length === 0" class="admin-users-muted">No users found.</p>

      <div v-else class="admin-users-table-wrap">
        <table class="admin-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date of birth</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <RouterLink :to="{ name: 'admin-users-edit', params: { id: user.id } }" class="admin-users-name-link">
                  {{ user.firstName }} {{ user.lastName }}
                </RouterLink>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ toDateInput(user.dateOfBirth) }}</td>
              <td class="admin-users-cell-center">{{ user.isAdmin ? 'Yes' : 'No' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
@reference 'tailwindcss';

.admin-users {
  @apply space-y-6 bg-transparent p-0 text-slate-100;
}

.admin-users-header {
  @apply flex items-center justify-between gap-4;
}

.admin-users-title {
  @apply text-2xl font-bold tracking-tight text-white;
}

.admin-users-subtitle {
  @apply mt-2 text-sm text-slate-400;
}

.admin-users-error {
  @apply rounded-md border border-red-900/70 bg-red-950/60 p-3 text-sm text-red-300;
}

.admin-users-list {
  @apply p-0;
}

.admin-users-table-wrap {
  @apply overflow-x-auto;
}

.admin-users-table {
  @apply min-w-full border-collapse border border-slate-700 text-sm;
}

.admin-users-table th {
  @apply border border-slate-700 bg-slate-900 px-3 py-2 text-left font-semibold text-slate-200;
}

.admin-users-table td {
  @apply border border-slate-700 px-3 py-2 align-top text-slate-200;
}

.admin-users-table tbody tr {
  @apply transition-colors odd:bg-slate-950/30 even:bg-slate-900/50 hover:bg-slate-800/70;
}

.admin-users-name-link {
  @apply cursor-pointer font-medium text-sky-300 underline-offset-2 transition hover:text-sky-200 hover:underline;
}

.admin-users-cell-center {
  @apply text-center;
}

.admin-users-muted {
  @apply text-sm text-slate-400;
}

.admin-users-button {
  @apply cursor-pointer rounded-md bg-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-950 transition duration-150 hover:bg-emerald-200 hover:shadow-sm;
}
</style>
