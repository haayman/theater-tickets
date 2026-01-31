<template>
  <Details :show-qr="false">
    <template #default="{ reservering }">
      <v-card class="mt-3">
        <v-card-title>Betaling is mislukt</v-card-title>

        <v-card-text>
          De betaling is mislukt.
          <br />
          Klik
          <nuxt-link :to="{ name: 'reserveren-id-betalen', params: { id: reservering.id } }">
            hier
          </nuxt-link>
          om het nogmaals te proberen
        </v-card-text>
      </v-card>
    </template>
  </Details>
</template>
