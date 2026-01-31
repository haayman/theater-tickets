<template>
  <v-card>
    <v-card-text>
      <v-alert v-if="displayErrors['general']" dense type="error">{{
        displayErrors.general
      }}</v-alert>

      <v-text-field
        v-model="reservering.naam"
        label="Naam"
        :rules="rules.naam"
        validate-on-blur
        required
      />

      <v-text-field
        v-model="reservering.email"
        label="E-mail"
        type="email"
        :rules="rules.email"
        validate-on-blur
        required
      />
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { Reservering } from "~~/models";
import type { Rule } from "~~/types/rule";

const props = defineProps<{
  reservering: Reservering;
  rules: { naam: Rule[]; email: Rule[] };
  displayErrors: any;
}>();

const emit = defineEmits<{
  (e: "update:reservering", reservering: Reservering): void;
}>();

const reservering = useVModel(props, "reservering", emit);
</script>
