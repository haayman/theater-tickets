<template>
  <div class="container">
    <v-card>
      <v-card-title>Verstuur e-mail naar klanten</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-checkbox
            v-for="uitvoering in uitvoeringen"
            :key="uitvoering.id"
            v-model="uitvoeringIds"
            :value="uitvoering.id"
            :label="`${uitvoering.toString()} (${uitvoering.gereserveerd} gereserveerd)`"
          />

          <v-text-field v-model="subject" label="Onderwerp" required />

          <v-textarea v-model="content" label="Inhoud" required></v-textarea>

          <v-checkbox v-model="test" label="Test verzending" />

          <v-btn :disabled="!valid" color="primary" type="submit">Versturen</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card v-if="result" class="mt-3">
      <v-card-title>Resultaat</v-card-title>

      <v-card-text v-html="result" />
    </v-card>

    <v-alert v-if="error" color="error">{{ error }}</v-alert>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { type IUitvoering, Uitvoering } from "~/models/Uitvoering";

definePageMeta({
  middleware: "admin",
});

const { get, post } = useAPI();

const defaultMessage = `Hallo <%=naam%>,

Je kunt hier je bestelling <a href="<%=reservering.getEditLink()%>">wijzigen</a>
`;

const uitvoeringen = ref<(Uitvoering & { id: string })[]>([]);
const uitvoeringIds = ref<number[]>([]);
const subject = useStorage("customMailSubject", "");
const content = useStorage("customMailContent", defaultMessage);
const test = ref(true);
const error = ref("");
const result = ref("");

const valid = computed(() => subject.value && content.value && uitvoeringIds.value.length);

onMounted(async () => {
  const data = await get<IUitvoering[]>("/uitvoering");
  uitvoeringen.value = data.map((u) => new Uitvoering(u) as Uitvoering & { id: string });
});

async function submit() {
  try {
    const data = await post<string>("/mail", {
      uitvoeringIds: uitvoeringIds.value,
      subject: subject.value,
      content: content.value,
      test: test.value,
    });
    result.value = data;
    // this.$notify("mail verstuurd");
  } catch (e: any) {
    error.value = e.message;
  }
}

// export default {
//   async asyncData({ app }) {
//     const { data: uitvoeringen } = await app.$axios.get("/uitvoering");
//     return { uitvoeringen: uitvoeringen.map((u) => new Uitvoering(u)) };
//   },
//   data() {
//     return {
//       uitvoeringIds: [],
//       subject: process.browser ? localStorage.customMailSubject || "" : "",
//       content: process.browser ? localStorage.customMailContent || defaultMessage : defaultMessage,
//       test: true,
//       error: "",
//       result: "",
//     };
//   },
//   computed: {
//     valid() {
//       return this.subject && this.content && this.uitvoeringIds.length;
//     },
//   },
//   watch: {
//     subject(value) {
//       localStorage.setItem("customMailSubject", value);
//     },
//     content(value) {
//       localStorage.setItem("customMailContent", value);
//     },
//   },
//   methods: {
//     async submit() {
//       try {
//         const result = await this.$axios.post("/mail", {
//           uitvoeringIds: this.uitvoeringIds,
//           subject: this.subject,
//           content: this.content,
//           test: this.test,
//         });
//         this.result = result.data;
//         // this.$notify("mail verstuurd");
//       } catch (error) {
//         this.error = error;
//       }
//     },
//   },
// };
</script>

<style scoped>
textarea {
  min-height: 20rem;
}
</style>
