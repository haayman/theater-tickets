<template>
  <v-row class="voorstelling">
    <v-col cols="2">
      <VoorstellingDate :min="dateRange.min" :max="dateRange.max" />
    </v-col>
    <v-col>
      <v-col v-if="voorstelling.thumbnail">
        <img :src="voorstelling.thumbnail" style="max-height: 100px" />
      </v-col>
    </v-col>
    <v-col>
      <div>
        <h3>{{ voorstelling.title }}</h3>
      </div>
      <div
        v-if="voorstelling.description"
        class="description text-medium-emphasis mb-3"
        style="white-space: pre-wrap"
        v-html="voorstelling.description"
      ></div>
      <div
        v-if="voorstelling.locatie"
        class="locatie text-medium-emphasis"
        v-html="voorstelling.locatie"
      ></div>

      <div v-if="voorstelling.url">
        <a :href="voorstelling.url" target="_blank">Meer informatie</a>
      </div>

      <div>
        <UitvoeringStatus
          class="text-medium-emphasis"
          :uitvoering="{ vrije_plaatsen, wachtlijst, te_koop, verkoopbaar }"
        />
      </div>
    </v-col>
    <v-col>
      <v-btn :to="{ name: 'voorstelling-id', params: { id: voorstelling.id } }"
        ><v-icon>mdi-cart</v-icon></v-btn
      >
    </v-col>
    <v-divider />
  </v-row>
</template>
<script setup lang="ts">
/* eslint-disable camelcase */
import { Voorstelling } from "~~/models";

const props = defineProps<{
  voorstelling: Voorstelling;
}>();

const data = computed(() => props.voorstelling.uitvoeringen.map((u) => u.aanvang));
const dateRange = computed(() => {
  let min: Date;
  let max: Date;
  data.value.forEach((date) => {
    if (!min || date.getTime() < min.getTime()) {
      min = date;
    }
    if (!max || date.getTime() > max.getTime()) {
      max = date;
    }
  });
  // @ts-ignore
  return { min, max };
});

const uitvoeringen = computed(() => props.voorstelling.uitvoeringen);

const vrije_plaatsen = computed(() =>
  uitvoeringen.value.reduce((total: number, u) => total + u.vrije_plaatsen, 0),
);
const wachtlijst = computed(() =>
  uitvoeringen.value.reduce((total: number, u) => total + u.wachtlijst, 0),
);

const te_koop = computed(() =>
  uitvoeringen.value.reduce((total: number, u) => total + u.te_koop, 0),
);
const verkoopbaar = computed(() =>
  uitvoeringen.value.reduce((verkoopbaar: boolean, u) => verkoopbaar && u.verkoopbaar, true),
);
</script>
