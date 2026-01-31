<template>
  <Details>
    <template #default="{ reservering }">
      <v-card v-if="reservering">
        <v-card-title>Ticket is betaald</v-card-title>

        <v-card-text>
          Het ticket is betaald.
          <br />
          Er is een e-mail met het ticket verstuurd naar
          <strong>{{ reservering.email }}</strong>
        </v-card-text>

        <v-card-text>
          <h3 class="mb-3">Niet ontvangen?</h3>

          <v-btn @click="resend(reservering.id)">Opnieuw versturen</v-btn>
        </v-card-text>
      </v-card>
    </template>
  </Details>
</template>

<script setup lang="ts">
const { get } = useAPI();
const router = useRouter();

async function resend(id: string | null) {
  if (!id) return;
  await get(`/api/reservering/${id}/resend`);
  router.push({ name: "reserveren-id-done", params: { id } });
}
</script>
