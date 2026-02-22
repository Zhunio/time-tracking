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
  <section class="section p-0">
    <div class="level mb-4">
      <div class="level-left">
        <div>
          <h1 class="title is-3 mb-2">User Management</h1>
          <p class="subtitle is-6">Click a name to edit a user.</p>
        </div>
      </div>
      <div class="level-right">
        <button type="button" class="button is-primary" @click="goToCreateUser">Create user</button>
      </div>
    </div>

    <article v-if="errorMessage" class="message is-danger is-light">
      <div class="message-body">{{ errorMessage }}</div>
    </article>

    <p v-if="isLoadingUsers" class="has-text-grey-light">Loading users...</p>
    <p v-else-if="users.length === 0" class="has-text-grey-light">No users found.</p>

    <div v-else class="table-container">
      <table class="table is-fullwidth is-hoverable">
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
              <RouterLink :to="{ name: 'admin-users-edit', params: { id: user.id } }">
                {{ user.firstName }} {{ user.lastName }}
              </RouterLink>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ toDateInput(user.dateOfBirth) }}</td>
            <td>{{ user.isAdmin ? 'Yes' : 'No' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
