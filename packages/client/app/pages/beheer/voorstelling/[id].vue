<template>
  <BeheerVoorstellingEdit v-if="voorstelling" :voorstelling="voorstelling" />
</template>

<script setup lang="ts">
import { Voorstelling } from "~/models/Voorstelling";
import type { IVoorstelling } from "~/models/Voorstelling";

const voorstelling = ref<Voorstelling>();
const route = useRoute();
const { get } = useAPI();

onMounted(async () => {
  const data = await get<IVoorstelling>(`/voorstelling/${route.params.id}`, {
    query: {
      include: ["prijzen", "uitvoeringen"],
    },
  });
  voorstelling.value = new Voorstelling(data);
});
</script>
