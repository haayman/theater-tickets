<template>
  <v-radio-group v-model="uitvoeringId" class="uitvoeringen" :rules="rules">
    <v-container v-for="uitvoering in uitvoeringen" :key="uitvoering.id" classes="">
      <v-row
        class="d-flex align-center"
        :class="classes(uitvoering.id)"
        @click="uitvoeringId = uitvoering.id"
      >
        <v-col cols="2">
          <v-radio :value="uitvoering.id" :disabled="!uitvoering.verkoopbaar" />
        </v-col>
        <v-col>
          {{ weekdag(uitvoering.aanvang) }}
          {{ formatDate(uitvoering.aanvang, "d LLLL HH:mm") }}
        </v-col>
        <v-col>
          <uitvoering-status :uitvoering="uitvoering" />
        </v-col>
      </v-row>
    </v-container>
  </v-radio-group>
</template>

<script setup lang="ts">
import { Uitvoering, Voorstelling } from "~~/models";
import type { IVoorstelling } from "~~/models";

const props = defineProps<{
  voorstelling: Voorstelling;
  uitvoeringId: number | null;
}>();

const emit = defineEmits<{
  (event: "update:uitvoeringId", value: number): void;
}>();

const uitvoeringId = useVModel(props, "uitvoeringId", emit);

const uitvoeringen = ref<Uitvoering[]>([]);
const { get } = useAPI();

const rules = [required];

function weekdag(date: Date) {
  return formatDate(date, "EEEE");
}

function classes(id: number) {
  return id === uitvoeringId.value ? ["elevation-2"] : [];
}

async function updateUitvoeringen() {
  const voorstelling = await get<IVoorstelling>(`/voorstelling/${props.voorstelling.id}`);
  uitvoeringen.value =
    voorstelling?.uitvoeringen?.map((u) => new Uitvoering(u) as Uitvoering) || [];
}

updateUitvoeringen();
const updater = setInterval(() => {
  updateUitvoeringen();
}, 10000); // elke 10 seconden

onUnmounted(() => {
  if (updater) {
    clearInterval(updater);
  }
});
</script>
<style lang="scss">
.uitvoeringen {
  cursor: pointer;

  .active {
    background-color: #eee;
  }
}
</style>
