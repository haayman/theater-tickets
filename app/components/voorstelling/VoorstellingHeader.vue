<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <h1>{{ voorstelling.title }}</h1>

            <p
              v-if="voorstelling.description"
              class="mt-3"
              style="white-space: pre-wrap"
              v-html="voorstelling.description"
            ></p>

            <template v-if="voorstelling.locatie">
              <h3 class="mt-3">Locatie</h3>
              <p class="mt-3" style="white-space: pre-wrap" v-html="voorstelling.locatie"></p>
            </template>

            <template v-if="voorstelling.opmerkingen">
              <h3 class="mt-3">Opmerkingen</h3>
              <p class="mt-3" style="white-space: pre-wrap" v-html="voorstelling.opmerkingen"></p>
            </template>

            <p v-if="voorstelling.url" class="mt-3">
              <a :href="voorstelling.url" target="_blank">&raquo; Meer informatie</a>
            </p>
          </v-col>

          <v-col v-if="voorstelling.poster" md="6">
            <img :src="voorstelling.poster" style="width: 100%; object-fit: cover" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Voorstelling } from "~/models";

defineProps<{
  voorstelling: Voorstelling;
}>();
</script>
