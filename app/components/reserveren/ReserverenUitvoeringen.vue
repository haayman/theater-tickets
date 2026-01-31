<template>
  <v-card>
    <v-card-title v-if="isAuthenticated">{{ voorstelling.title }}</v-card-title>

    <v-card-text>
      <div v-if="displayErrors.uitvoering" class="invalid-feedback">
        {{ displayErrors.uitvoering }}
      </div>

      <uitvoeringen
        v-if="voorstelling"
        v-model:uitvoering-id="reservering.uitvoering_id"
        :voorstelling="voorstelling"
      />
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import type { Reservering, Voorstelling } from "~/models";

const { isAuthenticated } = useAuth();
const props = defineProps<{
  reservering: Reservering;
  voorstelling: Voorstelling;
  displayErrors: any;
}>();

const emit = defineEmits<{
  (e: "update:reservering", reservering: Reservering): void;
}>();

const reservering = useVModel(props, "reservering", emit);
</script>
