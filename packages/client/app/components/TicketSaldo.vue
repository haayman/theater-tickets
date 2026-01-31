<template>
  <div class="ticket-summary d-flex flex-column">
    <div class="text-right money">{{ formatMoney(ticket.totaal) }}</div>
    <div v-if="ticket.betaald" class="text-right">betaald {{ formatMoney(-ticket.betaald) }}</div>
    <div v-if="ticket.betaald" class="text-right total">
      {{ saldoTekst }}
      <span class="money total">{{ formatMoney(Math.abs(ticket.tebetalen)) }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ticket } from "~/models";

const props = defineProps<{
  ticket: Ticket;
}>();

const saldoTekst = computed(() => (props.ticket.tebetalen >= 0 ? "" : "te ontvangen"));
</script>
<style lang="scss">
.money {
  font-weight: bold;
}
.ticket-summary {
  div {
    margin-bottom: 4px;

    .total {
      border-top: 1px solid grey;
      padding-top: 4px;
      display: inline-block;
    }
  }
}
</style>
