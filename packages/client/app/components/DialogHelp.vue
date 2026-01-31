<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator>
      <v-icon small @click.stop="dialog = !dialog"> mdi-help-circle-outline</v-icon>
    </template>
    <v-card>
      <v-card-title>Hoe werkt het?</v-card-title>

      <v-card-text>
        <h3>Hoe werkt het?</h3>

        <h4>Makkelijk aan te passen</h4>

        <p>
          Je kunt kaarten kopen, maar je zit niet aan je aankoop vast. Het is altijd mogelijk om
          aanpassingen te doen:
        </p>

        <ul>
          <li v-if="datumAanpasbaar">Datum aanpassen</li>

          <li>Kaarten annuleren (zie hieronder)</li>

          <li>Kaarten bijkopen</li>
        </ul>

        <h3>Annuleren</h3>

        <strong>Tot {{ teruggaveTermijn }} dagen voor de voorstelling</strong>
        :
        <ul>
          <li>Je kunt gratis annuleren (1 of meerdere kaarten)</li>

          <li>Het geld wordt teruggestort</li>
        </ul>

        <strong>minder dan {{ teruggaveTermijn }} dagen voor de voorstelling: </strong>

        <ul>
          <li>De kaarten worden voor doorverkoop aangeboden</li>

          <li>Zodra iemand anders de kaarten koopt krijg je je geld terug</li>
        </ul>

        <h3>Hoe annuleren?</h3>

        <ul>
          <li>Als je alle kaarten wilt annuleren, klik dan op de knop 'Alle kaarten annuleren</li>

          <li>
            Als je bv. maar één kaart wilt annuleren, verander dan het aantal kaarten dat je gekocht
            hebt. Maak bijvoorbeeld van 3 kaarten een 2. Het verschil zal teruggestort of verkocht
            worden.
          </li>
        </ul>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="dialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { Voorstelling } from "~/models";

const config = useRuntimeConfig();

const teruggaveTermijn = config.public.teruggave_termijn;

const props = defineProps<{
  voorstelling: Voorstelling;
}>();
const dialog = ref(false);
const datumAanpasbaar = computed(() => (props.voorstelling.uitvoeringen?.length || 0) > 1);
</script>
