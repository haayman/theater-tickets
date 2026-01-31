<template>
  <v-container>
    <v-card class="mx-auto">
      <v-form @submit.prevent="save">
        <v-card-title>Nieuwe gebruiker</v-card-title>

        <v-card-text>
          <v-text-field v-model="user.username" type="text" label="Gebruikersnaam" required />

          <v-text-field v-model="user.name" type="text" label="Naam" required />

          <v-text-field v-model="user.email" type="email" label="E-mail" required />

          <v-text-field
            v-model="user.password"
            :type="showPassword ? 'text' : 'password'"
            label="Wachtwoord"
            required
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (showPassword = !showPassword)"
          />

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

const { post } = useAPI();
const router = useRouter();

const user = ref(new User());
const refErrors = ref<any>([]);
const showPassword = ref(false);

const { isAdministrator } = useAuth();
const roleOptions = computed(() => RoleList.map((r) => ({ value: r.id, title: r.description })));

async function save() {
  try {
    await post(`/user/`, user.value.toJSON());
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
