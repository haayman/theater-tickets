<template>
  <v-card v-if="voorstellingen.length > 1">
    <VoorstellingList :voorstellingen="voorstellingen" />
  </v-card>
  <v-card v-else class="pa-3">
    <h2>Gesloten</h2>
    <p>Het is op dit moment niet mogelijk kaarten te kopen voor een voorstelling</p>
  </v-card>
</template>
<script setup lang="ts">
import { type IVoorstelling, Voorstelling } from "~/models";

const { get } = useAPI();
const router = useRouter();
const voorstellingen = ref<Voorstelling[]>();
const data = await get<IVoorstelling[]>("/voorstelling");
if (data.length === 1) {
  router.replace({ name: "voorstelling-id", params: { id: data[0].id } });
} else {
  voorstellingen.value = data.map((v) => new Voorstelling(v));
}
</script>
