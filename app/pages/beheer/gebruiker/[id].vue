<template>
  <v-container>
    <v-card v-if="user" class="mx-auto">
      <v-form @submit.prevent="save">
        <v-card-title>Wijzig gebruiker</v-card-title>

        <v-card-text>
          <v-text-field v-model="user.username" type="text" label="Gebruikersnaam" required />

          <v-text-field v-model="user.name" type="text" label="Naam" required />

          <v-text-field v-model="user.email" type="email" label="E-mail" required />

          <v-select v-if="isAdministrator" v-model="user.role" :items="roleOptions" label="Rol" />

          <v-text-field v-else v-model="user.role" readonly label="Rol" />
        </v-card-text>

        <v-card-actions>
          <v-alert v-if="refErrors['general']" type="error"> {{ refErrors.general }} </v-alert>

          <v-btn type="submit" color="primary"> Opslaan </v-btn>

          <v-btn :to="{ name: 'beheer-gebruiker' }" color="secondary"> annuleren </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { User } from "~~/models/User";
import { RoleList } from "~~/models/Role";

const user = ref<User>();
const refErrors = ref<any>([]);
const { isAdministrator } = useAuth();
const route = useRoute();
const router = useRouter();
const { get, put } = useAPI();

const roleOptions = computed(() => RoleList.map((r) => ({ value: r.id, title: r.description })));

onMounted(async () => {
  try {
    user.value = new User(await get<User>(`/user/${route.params.id}`));
  } catch (error: any) {
    const errors = error.errors || {};

    if (error.message) {
      errors.general = error.message;
    }
    refErrors.value = errors;
  }
});

async function save() {
  if (!user.value) return;
  try {
    await put(`/user/${user.value.id}`, user.value.toJSON());
    router.push({ name: "beheer-gebruiker" });
  } catch (error: any) {
    const errors = error.errors || {};

    if (error.message) {
      errors.general = error.message;
    }
    refErrors.value = errors;
  }
}
</script>
