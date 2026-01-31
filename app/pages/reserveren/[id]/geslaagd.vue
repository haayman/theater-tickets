<template>
  <Details>
    <template #default="{ reservering }">
      <v-card class="mt-3">
        <v-card-title>Bestelling geslaagd </v-card-title>

        <v-card-text>
          <p class="card-text">
            Bedankt voor je reservering.
            <br />
            Je krijgt een mail met de bevestiging naar {{ reservering.email }}
          </p>

          <p v-if="reservering.wachtlijst" class="card-text">
            Helaas sta je op de wachtlijst. Zodra er voldoende plaatsen beschikbaar komen krijg je
            een mail.
            <br />
            Dan pas hoef je te betalen.
            <br />
          </p>
        </v-card-text>
      </v-card>
    </template>
  </Details>
</template>
