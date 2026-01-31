<template>
  <v-form v-if="user" class="{saving:user.saving}" @submit.prevent="save">
    <v-card class="mx-auto" max-width="400" outlined>
      <v-card-title>Wachtwoord instellen</v-card-title>

      <v-card-text>
        <v-alert v-if="errors['general']" color="error">{{ errors.general }}</v-alert>

        <v-text-field v-model="user.username" label="Gebruikersnaam" readonly />

        <v-text-field v-model="user.name" label="Naam" readonly />

        <v-text-field v-model="user.email" label="E-mail" readonly />

        <v-alert v-if="errors.password">{{ errors.password }}</v-alert>

        <v-text-field
          v-model="user.password"
          label="Wachwoord"
          :rules="[rules.required, rules.strength]"
          validate-on-blur
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-progress-linear
          :background-opacity="opacity"
          :color="color.color"
          :value="color.value"
          :height="8"
          rounded
        ></v-progress-linear>

        <div v-if="showSuggestions" class="mt-3 text-muted font-italic">
          <ul>
            <li v-if="warning">{{ warning }}</li>

            <li v-if="crackTime">Hacked within {{ crackTime }}</li>

            <li v-for="suggestion in suggestions" :key="suggestion">{{ suggestion }}</li>
          </ul>
        </div>

        <v-alert v-if="saved">
          Wachtwoord opgeslagen.
          <nuxt-link to="/login">log in</nuxt-link>
          in om verder te gaan
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-btn v-if="!saved" class="mt-3" type="submit" :disabled="score < 3" color="primary">
          Opslaan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { IUser, User } from "~~/models/User";

const route = useRoute();
const { post, get, put } = useAPI();

const user = ref<User>();
const errors = ref<any>({});
const showPassword = ref(false);
const saved = ref(false);
const score = ref(0);
const warning = ref("");
const suggestions = ref<string[]>([]);
const crackTime = ref(0);
const rules = {
  required: (value: string) => !!value || "Vul een wachtwoord in",
  strength: () => score.value >= 3 || "Wachtwoord is niet sterk genoeg",
};
const opacity = 0.75;

const color = computed(() => {
  if (score.value >= 4) return { color: "light-blue", value: 100 };
  if (score.value === 3) return { color: "light-green", value: 75 };
  if (score.value === 2) return { color: "yellow", value: 50 };
  if (score.value === 1) return { color: "orange", value: 20 };
  return { color: "red", value: 0 };
});

onMounted(async () => {
  const { id, hash } = route.params;
  try {
    const data = await get<IUser>(`/user/${id}/?hash=${hash}`);
    user.value = new User(data);
    user.value.password = "";
  } catch (e) {
    errors.value.general = parseError(e);
  }
});

const showSuggestions = computed(() => user.value?.password && suggestions.value && !saved.value);

async function save() {
  if (!user.value) return;

  try {
    const { id, hash } = route.params;
    await put(`/user/${id}?hash=${hash}`, user.value?.toJSON());
    saved.value = true;
  } catch (error: any) {
    const errs = error.errors || {};

    if (error.message) {
      errs.general = error.message;
    }
    errors.value = errs;
  }
}

async function updateStrength(password: string | undefined) {
  if (!password) return;
  try {
    const result: any = await post("/auth/checkPassword", {
      password,
      userInputs: [user.value?.name, user.value?.email, user.value?.username],
    });
    score.value = result.score;
    warning.value = result.feedback?.warning;
    suggestions.value = result.feedback.suggestions;
    crackTime.value = result.crack_times_display?.offline_slow_hashing_1e4_per_second;
  } catch (ex) {
    errors.value.general = parseError(ex);
    score.value = 0;
  }
}

watch(
  () => user.value?.password,
  (password) => updateStrength(password),
);
</script>
