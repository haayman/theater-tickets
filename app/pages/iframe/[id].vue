<template>
  <div v-if="voorstelling">
    <v-table>
      <tr class="row">
        <td>Locatie</td>
        <td><div v-html="voorstelling.locatie"></div></td>
      </tr>

      <tr class="row">
        <td>Prij{{ prijzen.length > 1 ? "zen" : "s" }}</td>
        <td>
          <div class="d-flex flex-column">
            <span v-for="prijs in prijzen" :key="prijs.id"
              >{{ prijs }}: € {{ prijs.prijs.toFixed(2) }}</span
            >
          </div>
        </td>
      </tr>

      <tr v-if="voorstelling.opmerkingen" class="row">
        <td>Opmerkingen</td>
        <td>{{ voorstelling.opmerkingen }}</td>
      </tr>
    </v-table>

    <div class="row">
      <v-table class="table ml-0">
        <thead>
          <tr>
            <th>datum</th>
            <th></th>
            <th>aanvang</th>
            <th>ontvangst</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="uitvoering in uitvoeringen" :key="uitvoering.id">
            <td>
              <a
                :href="`/voorstelling/${voorstelling.id}/?uitvoeringId=${uitvoering.id}`"
                target="_top"
              >
                {{ formatDate(uitvoering.aanvang, "EEEE d MMMM yyyy") }}
              </a>
            </td>
            <td v-html="uitvoering.extra_text" />
            <td>
              <a
                :href="`/voorstelling/${voorstelling.id}/?uitvoeringId=${uitvoering.id}`"
                target="_top"
              >
                {{ formatDate(uitvoering.aanvang, "HH:mm") }}
              </a>
            </td>
            <td>{{ formatDate(uitvoering.deur_open, "HH:mm") }}</td>
            <td><uitvoering-status :uitvoering="uitvoering" /></td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="row">
      <v-btn href="/reserveren/?voorstellingId={{voorstelling.id}}" target="_top" color="primary"
        >Reserveren</v-btn
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { Voorstelling } from "~~/models/Voorstelling";
import type { IVoorstelling } from "~~/models/Voorstelling";

definePageMeta({
  title: "Reserveren",
  description: "Reserveren",
  layout: "iframe",
});

const route = useRoute();
const { get } = useAPI();

const voorstellingId = route.params.id;
const voorstelling = ref<Voorstelling>();

async function updateUitvoeringen() {
  const data = await get<IVoorstelling>(`/voorstelling/${voorstellingId}`);
  voorstelling.value = new Voorstelling(data);
}

const uitvoeringen = computed(
  () =>
    voorstelling.value?.uitvoeringen
      .filter((u) => u.aanvang > new Date())
      .sort((a, b) => a.aanvang.getTime() - b.aanvang.getTime()) || [],
);

const prijzen = computed(() => voorstelling.value?.prijzen.filter((p) => !p.role) || []);

updateUitvoeringen();
const updater = setInterval(() => {
  updateUitvoeringen();
}, 10000); // elke 10 seconden

onUnmounted(() => {
  if (updater) {
    clearInterval(updater);
  }
});
</script>
<style scoped>
label {
  min-width: 10em;
}

.row {
  margin-left: 0;
  margin-right: 0;
  padding: 1em;
}
</style>
