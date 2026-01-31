<template></template>
<script setup lang="ts">
import { Reservering } from "~/models";

const { get } = useAPI();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    const reservering = await get<Reservering>(`/reservering/${route.params.id}`);
    if (reservering.status === "paid") {
      router.push({ name: "reserveren-id-geslaagd", params: { id: route.params.id } });
    } else {
      router.push({ name: "reserveren-id-mislukt", params: { id: route.params.id } });
    }
  } catch (e) {
    console.error(e);
    router.replace({ name: "not-found", params: route.params });
  }
});
</script>
