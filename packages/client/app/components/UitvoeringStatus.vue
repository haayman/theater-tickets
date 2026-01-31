<template>
  <span>
    <span v-if="uitvoering.vrije_plaatsen">
      {{ uitvoering.vrije_plaatsen }} vrije plaats{{ uitvoering.vrije_plaatsen == 1 ? "" : "en" }}
    </span>

    <b v-else>Uitverkocht</b>

    <span v-if="!uitvoering.vrije_plaatsen || uitvoering.wachtlijst">
      wachtlijst: {{ uitvoering.wachtlijst }}
    </span>

    <span v-if="uitvoering.te_koop">, te koop: {{ uitvoering.te_koop }}</span>

    <span v-if="!uitvoering.verkoopbaar">(gesloten)</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  uitvoering: { vrije_plaatsen: number; wachtlijst: number; te_koop: number; verkoopbaar: boolean };
}>();
</script>
