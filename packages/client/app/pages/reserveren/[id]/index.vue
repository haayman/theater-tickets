<template>
  <Reserveren
    v-if="reservering && voorstelling"
    :reservering="reservering"
    :voorstelling="voorstelling"
  />
</template>
<script setup lang="ts">
import { Reservering, Voorstelling, type IReservering, type IVoorstelling } from "~/models";

const { get } = useAPI();
const reservering = ref<Reservering>();
const voorstelling = ref<Voorstelling>();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const reserveringData = await get<IReservering>(`/reservering/${route.params.id}`, {
      params: {
        include: ["tickets", "payments", "uitvoering"],
      },
    });
    reservering.value = new Reservering(reserveringData);
    if (!reservering.value) throw new Error("not found");
    const voorstellingData = await get<IVoorstelling>(
      // @ts-ignore id is aanwezig
      `/voorstelling/${reserveringData.uitvoering.voorstelling.id}`,
    );
    voorstelling.value = new Voorstelling(voorstellingData);
  } catch (e) {
    router.replace({ name: "not-found", params: { id: route.params.id } });
  }
});
</script>
