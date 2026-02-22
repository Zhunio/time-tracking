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
  <section class="admin-users app-panel">
    <header class="admin-users-header">
      <div>
        <h1 class="admin-users-title">User Management</h1>
        <p class="admin-users-subtitle">Click a name to edit a user.</p>
      </div>
      <button type="button" class="admin-users-button app-button-primary" @click="goToCreateUser">Create user</button>
    </header>

    <p v-if="errorMessage" class="admin-users-error app-error">{{ errorMessage }}</p>

    <section class="admin-users-list">
      <p v-if="isLoadingUsers" class="admin-users-muted app-muted">Loading users...</p>
      <p v-else-if="users.length === 0" class="admin-users-muted app-muted">No users found.</p>

      <div v-else class="admin-users-table-wrap">
        <table class="admin-users-table table is-fullwidth is-hoverable">
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
.admin-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-users-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.admin-users-title {
  margin: 0;
  color: #f4f8ff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.admin-users-subtitle {
  margin: 0.35rem 0 0;
  color: var(--app-text-muted);
  font-size: 0.92rem;
}

.admin-users-error {
  margin: 0;
}

.admin-users-table-wrap {
  overflow-x: auto;
}

.admin-users-table {
  min-width: 100%;
  background: transparent;
  color: var(--app-text);
}

.admin-users-table thead th,
.admin-users-table td {
  border-color: var(--app-border-soft);
  color: #d9e7fb;
  background: transparent;
  font-size: 0.9rem;
}

.admin-users-table tbody tr {
  transition: background-color 0.12s ease;
}

.admin-users-name-link {
  color: #8ec9ff;
  font-weight: 600;
  text-decoration: none;
}

.admin-users-name-link:hover {
  color: #b6dcff;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.admin-users-cell-center {
  text-align: center;
}

.admin-users-muted {
  margin: 0;
}
</style>
