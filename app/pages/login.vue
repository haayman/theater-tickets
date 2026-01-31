<template>
  <v-container>
    <v-card class="mx-auto" max-width="400" outlined>
      <v-card-title>Login</v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error"> {{ error }} </v-alert>

        <v-form method="post" @submit.prevent="postLogin">
          <v-text-field
            v-model="username"
            type="text"
            label="gebruikersnaam"
            data-test="username"
            autocomplete="username"
          />

          <v-text-field
            v-model="password"
            label="wachtwoord"
            data-test="password"
            autocomplete="current-password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />

          <v-btn type="submit" depressed color="primary">Log In</v-btn>

          <v-btn color="secondary" @click="forgotten = !forgotten">Wachtwoord vergeten</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card v-if="forgotten" class="mx-auto mt-2" max-width="400" outlined>
      <v-card-title>Wachtwoord vergeten</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="sendForgotten">
          <v-text-field v-model="username" required label="gebruikersnaam" />

          <v-btn color="primary" type="submit">Stuur link</v-btn>
        </v-form>

        <v-alert v-if="forgottenSent">Controleer je e-mail</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const username = ref<string>("");
const password = ref("");
const error = ref<null | string>(null);
const forgotten = ref(false);
const forgottenSent = ref(false);
const showPassword = ref(false);
const router = useRouter();
const { login } = useAuth();
const { post } = useAPI();

async function postLogin() {
  error.value = null;

  try {
    await login({
      username: username.value,
      password: password.value,
    });

    router.push("/");
  } catch (e: any) {
    error.value = e.message || `${e}`;
  }
}
async function sendForgotten() {
  error.value = null;

  try {
    await post("/user/forgotten", {
      username: username.value,
    });
    forgottenSent.value = true;
  } catch (e: any) {
    error.value = e.response?.statusText || e.message;
  }
}
</script>
