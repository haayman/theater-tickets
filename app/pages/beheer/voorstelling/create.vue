<template>
  <BeheerVoorstellingEdit :voorstelling="voorstelling" />
</template>

<script setup lang="ts">
import { Voorstelling } from "~/models/Voorstelling";

const voorstelling = ref(new Voorstelling());
</script>
