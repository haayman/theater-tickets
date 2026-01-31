<template>
  <v-card v-if="reservering" class="mt-3">
    <v-card-title>QR code</v-card-title>

    <v-card-text>
      <img :src="url" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Reservering } from "~/models";

const props = defineProps<{
  reservering: Reservering;
}>();

const url = computed(() => `/api/reservering/${props.reservering.id}/qr`);
</script>
