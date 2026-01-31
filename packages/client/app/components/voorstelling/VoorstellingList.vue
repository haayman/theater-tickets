<template>
  <v-container>
    <VoorstellingSummary
      v-for="(voorstelling, index) in voorstellingen"
      :key="index"
      :voorstelling="voorstelling"
      class="voorstelling-summary p-3"
      @click="toVoorstelling(voorstelling.id)"
    />
  </v-container>
</template>
<script setup lang="ts">
import { Voorstelling } from "~/models";

const router = useRouter();

defineProps<{
  voorstellingen: (Voorstelling & { id: string })[];
}>();

function toVoorstelling(id: number) {
  router.push({ name: "voorstelling-id", params: { id } });
}
</script>
<style lang="scss">
.voorstelling-summary {
  cursor: pointer;
}
</style>
