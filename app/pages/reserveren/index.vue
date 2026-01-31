<template></template>
<script setup lang="ts">
import { Voorstelling } from "~~/models";

const { get } = useAPI();
const router = useRouter();
const voorstellingen = await get<Voorstelling[]>("/voorstelling");
if (voorstellingen.length === 1) {
  router.replace({ name: "voorstelling-id", params: { id: voorstellingen[0].id } });
} else {
  router.replace({ name: "voorstelling" });
}
</script>
