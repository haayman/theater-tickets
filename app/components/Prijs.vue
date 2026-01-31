<template>
  <div class="prijs">
    <div class="description">{{ prijs.description }}</div>
    <div class="prijs lighten-4">{{ formatMoney(prijs.prijs) }}</div>
  </div>
</template>
<script setup lang="ts">
import { Prijs } from "~~/models";

defineProps<{
  prijs: Prijs;
}>();
</script>
<style lang="scss">
.prijs {
  .description {
    font-size: large;
    font-weight: bold;
  }
}
</style>
