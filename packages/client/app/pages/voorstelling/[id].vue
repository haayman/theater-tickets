<template>
  <Reserveren v-if="voorstelling" :voorstelling="voorstelling" :reservering="reservering" />
</template>
<script setup lang="ts">
import { type IVoorstelling, Reservering, Voorstelling } from "~/models";

const voorstelling = ref<Voorstelling>();
const reservering = ref(new Reservering());
const { get } = useAPI();
const route = useRoute();
onMounted(async () => {
  try {
    const data = await get<IVoorstelling>(`/voorstelling/${route.params.id}`, {
      params: {
        include: ["uitvoeringen", "prijzen"],
      },
    });
    voorstelling.value = new Voorstelling(data);
  } catch (e) {
    console.error(e);
  }
});
</script>
