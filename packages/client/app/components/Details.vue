<template>
  <div>
    <slot v-if="reservering" :reservering="reservering"></slot>

    <!-- alleen bezoekers voorstelling tonen -->

    <voorstelling-header
      v-if="reservering?.uitvoering?.voorstelling && !user"
      :voorstelling="reservering?.uitvoering?.voorstelling"
    ></voorstelling-header>

    <v-card v-if="reservering" class="mt-3">
      <v-card-title>Kaarten</v-card-title>

      <v-card-text>
        <v-alert v-if="reservering.ingenomen" color="warning">
          Deze kaart{{ reservering.aantal > 1 ? "en zijn" : " is" }} ingenomen op
          {{ formatDate(reservering.ingenomen, "PPPPp") }}
        </v-alert>

        <v-table>
          <template #default>
            <tbody>
              <tr>
                <th>Naam</th>

                <td>{{ reservering.naam }}</td>
              </tr>

              <tr>
                <th>E-mail</th>

                <td>{{ reservering.email }}</td>
              </tr>

              <tr>
                <th>Uitvoering</th>

                <td>{{ reservering.uitvoering }}</td>
              </tr>

              <tr>
                <th>Kaarten</th>

                <td>
                  <div v-for="ticket in reservering.tickets" :key="ticket.id">
                    {{ ticket.aantal ? ticket.toString() : "" }}
                  </div>
                </td>
              </tr>

              <tr v-if="reservering.opmerking_gebruiker">
                <th>Opmerking</th>

                <td>{{ reservering.opmerking_gebruiker }}</td>
              </tr>

              <tr v-if="reservering.wachtlijst">
                <th></th>

                <td>Je staat op de wachtlijst</td>
              </tr>

              <tr v-if="!reservering.wachtlijst && reservering.saldo">
                <th>{{ reservering.saldo > 0 ? "Tegoed" : "Nog bijbetalen" }}</th>

                <td>
                  <span>{{ formatMoney(Math.abs(reservering.saldo)) }}</span>

                  <span v-if="reservering.saldo > 0" v-html="bijbetalingStatus"></span>
                  <v-btn
                    v-else-if="reservering.saldo < 0"
                    color="primary"
                    class="ml-2"
                    :to="`/reserveren/${reservering.id}/betalen`"
                    >Betalen</v-btn
                  >
                </td>
              </tr>

              <tr v-if="reservering.opmerking">
                <th>Aantekening</th>

                <td>{{ reservering.opmerking }}</td>
              </tr>

              <tr>
                <td>
                  <v-btn v-if="wordtIngenomen" color="primary" @click="innemen">
                    Gezien bij kassa
                  </v-btn>
                </td>

                <td>
                  <v-btn
                    v-if="!reservering.ingenomen"
                    color="primary"
                    :to="{ name: 'reserveren-id', params: { id: reservering.id } }"
                  >
                    Wijzigen
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </v-card-text>
    </v-card>

    <qr v-if="reservering && !reservering.wachtlijst && showQr" :reservering="reservering" />

    <payments
      v-if="reservering && showPayments && reservering.payments"
      class="mt-3"
      :payments="reservering.payments"
    ></payments>

    <logs
      v-if="reservering && showLogs && reservering.logs"
      class="mt-3"
      :logs="reservering.logs"
    ></logs>
  </div>
</template>

<script setup lang="ts">
import { Reservering } from "../models/Reservering";
import type { IReservering } from "../models/Reservering";

withDefaults(
  defineProps<{
    showQr?: boolean;
    title?: string;
  }>(),
  {
    showQr: true,
    title: "Reservering",
  },
);

const reservering = ref<Reservering | null>(null);

const { isKassa, user } = useAuth();

const showLogs = computed(() => user.value);
const showPayments = computed(() => user.value);

const bijbetalingStatus = computed(() => {
  if (!reservering.value) return "";
  const saldo = reservering.value?.saldo;
  if (saldo > 0) {
    if (reservering.value.teruggeefbaar) {
      return "Het bedrag zal z.s.m. teruggestort worden";
    } else {
      return "Het bedrag zal teruggestort worden zodra de kaarten opnieuw verkocht zijn";
    }
  } else if (saldo < 0) {
    return ` <a href="/reserveren/${reservering.value.id}/betalen">Graag nog overmaken</a>`;
  }
});

const wordtIngenomen = computed(
  () => reservering.value?.id && !reservering.value?.ingenomen && isKassa.value,
);

const router = useRouter();
const route = useRoute();
const { get, put } = useAPI();

watch(
  () => route.params.id,
  (id) => fetch(id as string),
  { immediate: true },
);

async function fetch(id: string) {
  try {
    const data = await get<IReservering>(`/reservering/${id}`, {
      params: {
        include: ["tickets", "payments", "logs"],
      },
    });
    reservering.value = new Reservering(data);
  } catch (e) {
    console.error(e);
    router.replace({ name: "not-found", params: route.params });
  }
}
async function innemen() {
  if (!reservering.value) return;
  // meld terug dat de kaarten zijn ingenomen
  const data = await put<IReservering>(`/reservering/${reservering.value.id}/ingenomen`, {
    ingenomen: new Date(),
  });
  reservering.value.ingenomen = new Date(data.ingenomen);
}
</script>
