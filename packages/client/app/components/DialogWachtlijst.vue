<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator>
      <v-icon small @click.stop="dialog = !dialog"> mdi-help-circle-outline</v-icon>
    </template>
    <v-card>
      <v-card-title>Hoe werkt de wachtlijst?</v-card-title>

      <v-card-text>
        <p>
          Je komt op de wachtlijst als er voor de voorstelling die je wilt zien onvoldoende plaatsen
          beschikbaar zijn.
        </p>

        <p>
          Mocht het voorkomen dat iemand zijn/haar reservering nog wijzigt, waardoor er alsnog
          voldoende plaatsen vrijkomen, dan krijg je daarvan automatisch bericht en wordt je
          reservering definitief. Pas dan hoef je te betalen.
        </p>

        <p>
          Let wel: je komt pas aan de beurt als het gewenste aantal kaarten vrijkomt. Als je
          bijvoorbeeld 8 kaarten besteld hebt, maar er komen er 2 vrij, dan gaan mensen die 2 of
          minder besteld hebben voor.
        </p>

        <p>
          Als onvoldoende mensen annuleren, kun je naar de voorstelling komen en hopen dat er iemand
          niet op komt dagen. De overgebleven plaatsen worden dan vergeven aan de mensen in de
          wachtlijst, in de volgorde waarin ze in de lijst staan. 
        </p>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="dialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const dialog = ref(false);
</script>
