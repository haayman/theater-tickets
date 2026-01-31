<template>
  <v-row v-if="shouldBeDisplayed">
    <v-col cols="8" md="5">
      <Prijs :prijs="ticket.prijs" />
    </v-col>

    <v-col cols="4" md="3">
      <ticket-amount v-model="aantal" :max="max" />
    </v-col>

    <v-col cold="12" md="4">
      <ticket-saldo :ticket="ticket" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { Reservering, Ticket } from "~~/models";
import type { Rule } from "~~/types/rule";

const props = defineProps<{
  ticket: Ticket;
  reservering: Reservering;
  aantalTekoop: number;
  aantal: number;
  factor: number;
  rules: Rule[];
}>();

const emit = defineEmits<{
  (event: "update:aantalTekoop", value: number): void;
  (event: "update:aantal", value: number): void;
  (event: "update:ticket", value: Ticket): void;
}>();

const ticket = useVModel(props, "ticket", emit);

const originalAantal = ref<number>(ticket.value.aantal - ticket.value.aantalTekoop);
const originalTekoop = ref<number>(ticket.value.aantalTekoop);
const { isAuthorized: userIsAuthorized } = useAuth();

/**
 * is de huidige gebruiker gemachtigd deze prijs te bestellen?
 */
const isAuthorized = computed(() => {
  return !ticket.value.prijs.role || userIsAuthorized(ticket.value.prijs.role);
});

/**
 * een anonieme gebruiker kan z'n eigen vrijkaartjes zien
 */
const shouldBeDisplayed = computed(() => isAuthorized.value || originalAantal.value);

const max = computed(() => {
  if (ticket.value.prijs.prijs > 0 || isAuthorized.value) return 8;

  // iemand die de eigen vrijkaartjes aanpast kan alleen omlaag
  return originalAantal.value;
});

const aantal = computed({
  get() {
    return Math.max(ticket.value.aantal - ticket.value.aantalTekoop);
  },
  set(value) {
    if (originalTekoop.value) {
      ticket.value.aantalTekoop = Math.max(originalTekoop.value + originalAantal.value - value, 0);
    }

    ticket.value.aantal = value + ticket.value.aantalTekoop;
  },
});
</script>
