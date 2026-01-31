<template>
  <v-card class="mt-3">
    <v-card-text>
      <v-textarea v-model="reservering.opmerking_gebruiker" label="Opmerking" />

      <v-textarea v-if="user" v-model="reservering.opmerking" label="Reactie" />
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { Reservering } from "~~/models";

const props = defineProps<{
  reservering: Reservering;
}>();

const emit = defineEmits<{
  (e: "update:reservering", reservering: Reservering): void;
}>();

const reservering = useVModel(props, "reservering", emit);

const { user } = useAuth();
</script>
