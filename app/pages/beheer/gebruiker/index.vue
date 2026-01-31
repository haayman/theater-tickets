<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title>Gebruikers</v-card-title>

      <v-data-table
        class="user-management"
        :loading="pending"
        :headers="headers"
        :items="users"
        :items-per-page="0"
        disable-pagination
        hide-default-footer
      >
        <template #item.actions="{ item }">
          <nuxt-link :to="{ name: 'beheer-gebruiker-id', params: { id: item.id } }">
            <v-icon size="small" class="me-2">mdi-pencil</v-icon>
          </nuxt-link>

          <a href="#delete" @click.prevent="removeUser(item)">
            <v-icon size="small" class="me-2">mdi-delete</v-icon>
          </a>
        </template>
      </v-data-table>

      <v-card-actions>
        <v-btn :to="{ name: 'beheer-gebruiker-create' }" color="primary">Gebruiker toevoegen</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { User } from "@/models/User";

const { get, del } = useAPI();

const headers = [
  { title: "Account", key: "username", sortable: false },
  { title: "Naam", key: "name", sortable: false },
  { title: "Rol", key: "role", sortable: false },
  { title: "", key: "actions", sortable: false },
];

const users = ref<User[]>([]);
const pending = ref(true);

onMounted(async () => {
  const data = await get<User[]>("/user");
  users.value = data || [];
  pending.value = false;
});

async function removeUser(user: User) {
  if (confirm(`Weet je zeker dat je ${user.name} wilt verwijderen?`)) {
    await del(`/user/${user.id}`);
    users.value = users.value?.filter((u) => u.id !== user.id) || [];
  }
}
</script>
<style lang="scss">
.v-data-table-footer {
  display: none !important;
}
</style>
