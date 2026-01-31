<template>
  <div>
    <voorstelling-header v-if="!user" :voorstelling="voorstelling" />

    <v-card v-if="reservering" class="mt-3">
      <v-form ref="form" v-model="valid" validate-on="input" @submit.prevent="onSubmit">
        <v-card-title>
          Kaarten
          <DialogHelp :voorstelling="voorstelling" />
        </v-card-title>

        <v-card-text>
          <v-alert v-if="reservering.ingenomen" color="warning">
            Deze kaart{{ reservering.aantal > 1 ? "en zijn" : " is" }} al ingenomen op
            {{ formatDate(reservering.ingenomen, "Pp") }}
          </v-alert>

          <!-- groot scherm -->
          <v-container v-if="$vuetify.display.mdAndUp">
            <v-row>
              <v-col>
                <ReserverenNaam
                  :reservering="reservering"
                  :display-errors="displayErrors"
                  :rules="rules"
                />
              </v-col>
              <v-col>
                <ReserverenUitvoeringen
                  :reservering="reservering"
                  :voorstelling="voorstelling"
                  :display-errors="displayErrors"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <ReserverenOpmerkingen :reservering="reservering" />
              </v-col>
              <v-col>
                <v-card class="mt-3">
                  <v-card-text>
                    <tickets :reservering="reservering" :rules="rules.aantal" />
                  </v-card-text>
                </v-card>

                <v-card class="mt-3">
                  <v-card-text>
                    <tickets-summary :reservering="reservering" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <!-- mobiel -->
          <v-container v-else>
            <ReserverenNaam
              :reservering="reservering"
              :display-errors="displayErrors"
              :rules="rules"
            />
            <ReserverenUitvoeringen
              class="mt-3"
              :reservering="reservering"
              :voorstelling="voorstelling"
              :display-errors="displayErrors"
            />
            <v-card class="mt-3">
              <v-card-text>
                <tickets :reservering="reservering" :rules="rules.aantal" />
              </v-card-text>
            </v-card>

            <v-card class="mt-3">
              <v-card-text>
                <tickets-summary :reservering="reservering" />
              </v-card-text>
            </v-card>
            <ReserverenOpmerkingen :reservering="reservering" />
          </v-container>
          <transition name="fade">
            <v-alert v-if="wachtrijNodig" type="warning" dense class="mt-3">
              <h4 class="alert-heading">Let op!</h4>
              Er zijn onvoldoende plaatsen beschikbaar. Je komt op de wachtlijst
              <DialogWachtlijst />

              <br />

              <v-checkbox
                v-model="reservering.wachtlijst"
                :rules="rules.wachtlijst"
                label="Akkoord"
              />
            </v-alert>
          </transition>

          <transition name="fade">
            <v-alert v-if="wachtlijst" type="info" dense class="mt-3">
              Je staat op de wachtlijst
              <DialogWachtlijst />
            </v-alert>
          </transition>

          <transition name="fade">
            <v-alert
              v-if="bijbetalingStatus && !loading"
              class="mt-3"
              type="warning"
              v-html="bijbetalingStatus"
            />
          </transition>

          <v-alert v-if="displayErrors['general']" type="error">{{
            displayErrors.general
          }}</v-alert>
          <v-container>
            <v-row>
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="!!reservering.ingenomen || valid === false"
              >
                {{ submitText }}
              </v-btn>

              <v-spacer />

              <v-btn
                v-if="reservering.id"
                color="secondary"
                :disabled="!!reservering.ingenomen"
                @click.prevent="annuleren"
              >
                Alle kaarten annuleren
              </v-btn>
            </v-row>
          </v-container>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import type { Uitvoering } from "~/models";
import { Ticket } from "~/models";
import type { Reservering } from "~/models/Reservering";
import type { Voorstelling } from "~/models/Voorstelling";

const props = defineProps<{
  voorstelling: Voorstelling;
  reservering: Reservering;
}>();

const route = useRoute();

const emit = defineEmits<{
  (e: "update:reservering", reservering: Reservering): void;
}>();

const { user } = useAuth();
const form = ref();

const reservering = useVModel(props, "reservering", emit);

const valid = ref(true);
const displayErrors: any = ref({});
const originalUitvoeringId = ref<number | null>(reservering.value.uitvoering_id);
const originalAantal = ref<number>(reservering.value.aantal);
const loading = ref(false);

const aantalKaarten = computed(
  () => reservering.value?.tickets?.reduce((aantal, t) => aantal + +t.aantal, 0) || 0,
);
const teveelKaarten = computed(() => {
  if (!reservering.value?.uitvoering) return false;
  return (
    aantalKaarten.value > reservering.value.uitvoering.aantal_plaatsen || aantalKaarten.value > 8
  );
});

const totaalBedrag = computed(
  () => reservering.value?.tickets?.reduce((totaal, t) => totaal + t.tebetalen, 0) || 0,
);

const wachtlijst = computed(() => {
  return (
    reservering.value?.id &&
    reservering.value?.wachtlijst &&
    reservering.value?.uitvoering_id === originalUitvoeringId.value
  );
});

const uitvoering_id = computed(
  () =>
    reservering.value?.uitvoering_id ||
    (route.query?.uitvoering_id ? +route.query.uitvoering_id : null),
);

const uitvoering = computed(() => {
  return props.voorstelling.uitvoeringen.find((u) => u.id === uitvoering_id.value);
});

const wachtrijNodig = computed(() => {
  if (wachtlijst.value) return false;
  let retval = false;
  if (uitvoering.value) {
    if (uitvoering_id.value !== originalUitvoeringId.value) {
      retval =
        aantalKaarten.value > uitvoering.value.vrije_plaatsen + (uitvoering.value.te_koop || 0);
    } else {
      retval =
        aantalKaarten.value - originalAantal.value >
        uitvoering.value.vrije_plaatsen + (uitvoering.value.te_koop || 0);
    }
  }
  return retval;
});

const betaling = computed(() => totaalBedrag.value > 0);

const rules = {
  naam: [required],
  email: [required, email],
  wachtlijst: [required],
  aantal: [
    () => aantalKaarten.value > 0 || "Geen kaarten geselecteerd",
    () => !teveelKaarten.value || "Teveel kaarten",
  ],
};

const submitText = computed(() => {
  if (betaling.value && !wachtrijNodig.value && !wachtlijst.value) {
    return "Betalen";
  } else {
    return "Opslaan";
  }
});

const bijbetalingStatus = computed(() => {
  if (reservering.value?.id && !wachtlijst?.value) {
    const bedrag = totaalBedrag.value;
    if (bedrag < 0 && !reservering.value.teruggeefbaar) {
      return "Het bedrag zal worden teruggestort zodra de kaarten zijn verkocht";
    }
  }
  return "";
});

watch(
  uitvoering_id,
  (uitvoering_id) => {
    if (!reservering.value || !uitvoering_id) return;
    reservering.value.uitvoering = uitvoering.value as Uitvoering;
    reservering.value.uitvoering_id = uitvoering_id;
  },
  { immediate: true },
);

props.voorstelling.prijzen?.forEach((prijs) => {
  if (!reservering.value?.tickets.find((t) => t.prijs.id === prijs.id)) {
    const ticket = new Ticket({ prijs, aantal: 0 });
    reservering.value?.tickets.push(ticket);
  }
});

originalAantal.value = aantalKaarten.value;

if (props.voorstelling.uitvoeringen.length === 1 && !reservering.value?.uitvoering_id) {
  reservering.value.uitvoering_id = props.voorstelling.uitvoeringen[0].id as number;
}

function validate() {
  const valid = form.value.validate();

  return valid;
}

function getNextPage() {
  if (!reservering.value) return;
  let maxRetries = 100;
  const id = reservering.value?.id;
  const { get } = useAPI();
  const router = useRouter();
  const timer = setInterval(async () => {
    try {
      const reservering = await get<Reservering>(`/reservering/${id}`, {
        params: {
          include: ["tickets"],
        },
      });

      if (reservering.wachtlijst || !(reservering.openstaandBedrag > 0)) {
        clearInterval(timer);
        loading.value = false;
        if (user.value) {
          router.push({ name: "beheer-reserveringen" });
        } else {
          router.push({
            name: "reserveren-id-details",
            params: { id },
          });
        }
        // message.value = "Reservering is opgeslagen";
      } else if (reservering.paymentUrl) {
        clearInterval(timer);
        document.location.href = reservering.paymentUrl;
      }
    } catch (e: any) {
      displayErrors.value.general = e.message;
    }
    if (!--maxRetries) {
      clearInterval(timer);
    }
  }, 1000);
}

async function onSubmit() {
  if (!reservering.value) return;
  const { put, post } = useAPI();
  validate();
  if (valid.value) {
    loading.value = true;
    try {
      if (reservering.value?.id) {
        await put<Reservering>(
          `/reservering/${reservering.value.id}`,
          reservering.value.serialize(),
        );
      } else {
        const result = await post<Reservering>("/reservering", reservering.value?.serialize());
        reservering.value.id = result.id;
      }

      getNextPage();
    } catch (e: any) {
      loading.value = false;
      const errors = e.errors || {};

      if (e.response) {
        // error is afkomstig van de server
        const data = e.response.data?.data;
        if (data && data.message) {
          errors.general = data.message;
        } else if (e.message) {
          errors.general = e.message;
        }
      }
      displayErrors.value = errors;
    }
  } else {
    nextTick(() => {
      const el = form.value.$el.querySelector(".v-messages__message:first-of-type");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
}

async function annuleren() {
  if (!reservering.value) return;
  if (confirm("Weet je zeker dat je deze reservering wilt annuleren?")) {
    const { del } = useAPI();
    const router = useRouter();
    await del(`/reservering/${reservering.value.id}`);
    if (user) {
      router.push({
        name: "beheer-reserveringen",
      });
    } else if (reservering.value.teruggeefbaar) {
      router.push({
        name: "geannuleerd",
      });
    } else {
      router.push({
        name: "reserveren-id-details",
        params: { id: reservering.value.id },
      });
    }
  }
}
</script>

<style scoped>
.total td {
  border-top: 2px double grey !important;
  font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
