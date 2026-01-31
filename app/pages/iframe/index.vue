<template>
  {{ message }}
</template>
<script setup lang="ts">
import { Voorstelling } from "~/models";

const { get } = useAPI();
const router = useRouter();
const voorstellingen = await get<Voorstelling[]>("/voorstelling");
const message = ref("Loading...");
if (voorstellingen.length === 1) {
  router.replace({ name: "iframe-id", params: { id: voorstellingen[0].id } });
} else {
  message.value = `Kies een voorstelling: ${voorstellingen.map((v) => v.id).join(", ")}`;
}
</script>
