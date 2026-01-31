<template>
  <v-container class="overzicht">
    <v-row>
      <v-col>
        <div class="aantal">
          <v-icon>mdi-ticket-outline</v-icon> {{ aantalKaarten }} {{ kaarten(aantalKaarten) }}
          <transition name="fade">
            <span v-if="aantalTekoop" class="tekoop">
              waarvan {{ aantalTekoop }} {{ kaarten(aantalTekoop) }} in de verkoop {{ staan }}
            </span>
          </transition>
        </div>
      </v-col>
      <v-spacer />
      <v-col class="bedragen">
        <div class="totaal text-right money">{{ formatMoney(totaalBedrag) }}</div>
        <transition name="fade">
          <div v-if="betaald" class="betaald text-right">betaald {{ formatMoney(betaald) }}</div>
        </transition>
        <transition name="fade">
          <div v-if="betaald && teBetalen" class="tebetalen text-right">
            {{ saldoTekst }} <span class="money">{{ formatMoney(Math.abs(teBetalen)) }}</span>
          </div>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { Reservering } from "~~/models";

const props = defineProps<{
  reservering: Reservering;
}>();

const originalAantal = ref(0);
const originalBedrag = ref(0);
const originalTekoop = ref(0);

const aantalKaarten = computed(() =>
  props.reservering.tickets.reduce((aantal, t) => aantal + +t.aantal, 0),
);

const betaald = computed(() =>
  props.reservering.tickets.reduce((totaal, t) => totaal + t.betaald, 0),
);

const aantalTekoop = computed(() =>
  props.reservering.tickets.reduce((aantal, t) => aantal + +t.aantalTekoop, 0),
);

const teBetalen = computed(() =>
  props.reservering.tickets.reduce((totaal, t) => totaal + t.tebetalen, 0),
);

const totaalBedrag = computed(() =>
  props.reservering.tickets.reduce((totaal, t) => totaal + t.totaal, 0),
);

const saldoTekst = computed(() => {
  if (!props.reservering.id || teBetalen.value === 0) return "bedrag";
  return teBetalen.value < 0 ? "te ontvangen" : "te betalen";
});

const staan = computed(() => (aantalTekoop.value === 1 ? "staat" : "staan"));

function kaarten(aantal: number) {
  return aantal === 1 ? "kaart" : "kaarten";
}

onMounted(() => {
  originalAantal.value = aantalKaarten.value;
  originalBedrag.value = teBetalen.value;
  originalTekoop.value = aantalTekoop.value;
});
</script>
<style lang="scss">
.overzicht {
  font-size: large;

  .bedragen {
    div {
      margin-bottom: 1em;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
