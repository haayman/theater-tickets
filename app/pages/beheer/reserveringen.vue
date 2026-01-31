<template>
  <div>
    <v-card v-if="uitvoeringen">
      <BeheerUitvoeringenList
        :uitvoeringen="uitvoeringen"
        :uitvoering-id="uitvoeringId"
        @refresh="fetch()"
      ></BeheerUitvoeringenList>
    </v-card>

    <BeheerReserveringenList
      class="mt-3"
      :loading="loading"
      :reserveringen="gereserveerd"
      :uitvoering_id="uitvoeringId"
      @refresh="fetch()"
    >
      Gereserveerd
    </BeheerReserveringenList>

    <BeheerReserveringenList
      v-if="wachtlijst.length"
      class="mt-3"
      :loading="loading"
      :reserveringen="wachtlijst"
      :uitvoering_id="uitvoeringId"
    >
      Wachtlijst
    </BeheerReserveringenList>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { IUitvoering } from "@/models/Uitvoering";
import { Uitvoering } from "@/models/Uitvoering";
import type { IReservering } from "@/models/Reservering";
import { Reservering } from "@/models/Reservering";

const uitvoeringId = ref<number | null>(null);
const loading = ref(false);
const uitvoeringen = ref<Uitvoering[]>([]);
const reserveringen = ref<Reservering[]>([]);
const { get } = useAPI();

const gereserveerd = computed(() => reserveringen.value.filter((r) => !r.wachtlijst));
const wachtlijst = computed(() => reserveringen.value.filter((r) => r.wachtlijst));

async function fetch(setLoading = false) {
  loading.value = setLoading;
  const params: any = {
    params: {
      include: ["tickets", "payments"],
      order: "-created_at",
    },
  };
  if (uitvoeringId.value) {
    params.params.uitvoering_id = uitvoeringId.value;
    params.params.order = "naam";
  }
  const reserveringenData = await get<IReservering[]>("/reservering", params);
  reserveringen.value = reserveringenData?.map((r) => new Reservering(r)) || [];

  const data = await get<IUitvoering[]>("/uitvoering", {
    params: {
      include: ["voorstelling"],
    },
  });
  uitvoeringen.value = data?.map((u) => new Uitvoering(u)) || [];

  loading.value = false;
}

const updater = setInterval(() => {
  fetch(false); // geen spinner
}, 60000); // elke minuut bijwerken

onBeforeUnmount(() => {
  clearInterval(updater);
});

const route = useRoute();
fetch();

watch(
  () => route.query.uitvoering_id,
  // eslint-disable-next-line camelcase
  (uitvoering_id) => {
    // eslint-disable-next-line camelcase
    uitvoeringId.value = uitvoering_id ? +uitvoering_id : null;
    fetch();
  },
  {
    immediate: true,
  },
);
</script>
