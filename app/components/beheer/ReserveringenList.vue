<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card v-if="reserveringen.length" class="mx-auto">
    <v-card-title>
      <!-- 'Gereserveerd' of 'Wachtlijst' -->

      <slot>Titel</slot>
    </v-card-title>

    <!-- zoek-formulier -->

    <div class="m-3 form-inline noprint">
      <v-text-field v-model="filter" label="zoek" clearable @focus="$event.target.select()" />

      <div v-if="aantalIngenomen" class="ml-3">
        {{ aantalIngenomen }} van de {{ totaalAantal }} ingenomen
      </div>
    </div>

    <v-data-table
      :headers="headers"
      class="reserveringen-list"
      :items="reserveringen"
      item-key="id"
      :search="filter"
      disable-pagination
      hide-default-footer
      :items-per-page="0"
      locale="nl - NL"
      @click:row="gotoReservation"
    >
      <template #item.actions="{ item }">
        <span>
          <v-icon v-if="item.ingenomen" small>mdi-check </v-icon>

          <v-icon
            v-if="isAdministrator"
            title="ticket opnieuw versturen"
            @click.stop="resend(item)"
          >
            mdi-ticket-outline
          </v-icon>

          <v-icon
            v-if="isAdministrator && item.openstaandBedrag > 0"
            title="betalingsverzoek versturen"
            @click.stop="reminder(item)"
          >
            mdi-credit-card
          </v-icon>

          <v-icon v-if="isAdministrator" title="verwijderen" @click.stop="remove(item)">
            mdi-delete
          </v-icon>
        </span>
      </template>

      <template #item.email="{ item }">
        <div class="email">{{ addBreaks(item.email) }}</div>
      </template>

      <template #item.naam="{ item }">
        <div class="naam">{{ addBreaks(item.naam) }}</div>
      </template>

      <template #item.tickets="{ item }">
        <td class="d-flex flex-column">
          <span v-for="ticket in item.tickets" :key="ticket.id" class="mr-3">
            {{ ticket.aantal ? ticket.toString() : "" }}
          </span>
        </td>
      </template>

      <template #item.opmerking_gebruiker="{ item }">
        <div class="opmerking">{{ item.opmerking_gebruiker }}</div>
      </template>

      <template #item.uitvoering="{ item }">
        {{ item.uitvoering ? formatUitvoering(item.uitvoering) : "" }}
      </template>

      <template #item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { Reservering, Uitvoering } from "~~/models";

const { get, del } = useAPI();
const { isAdministrator } = useAuth();

const props = defineProps<{
  reserveringen: Reservering[];
  uitvoering_id: number | null;
}>();

const emit = defineEmits<{
  (event: "refresh", value: void): void;
}>();

const filter = ref("");

const hasOpmerkingen = computed(() => props.reserveringen.find((r) => r.opmerking_gebruiker));
const hasAantekeningen = computed(() => props.reserveringen.find((r) => r.opmerking));
const totaalAantal = computed(() =>
  props.reserveringen.reduce((totaal, reservering) => totaal + reservering.aantal, 0),
);

const aantalIngenomen = computed(() => {
  return props.reserveringen
    .filter((r) => r.ingenomen)
    .reduce((totaal, reservering) => totaal + reservering.aantal, 0);
});

const headers = computed(() => {
  const headers = [
    {
      key: "actions",
      sortable: false,
    },
    {
      title: "Naam",
      key: "naam",
    },
    {
      title: "E-mail",
      key: "email",
    },
    ...(!props.uitvoering_id
      ? [
          {
            title: "Voorstelling",
            key: "uitvoering",
            sortable: false,
          },
        ]
      : []),
    {
      title: "Tijdstip",
      key: "created_at",
      sortable: true,
    },
    {
      title: "Kaarten",
      key: "tickets",
      classes: "d-flex flex-column",
      sortable: false,
    },
    { title: "Status", key: "status", sortable: true },

    ...(hasOpmerkingen.value
      ? [
          {
            title: "Opmerking",
            key: "opmerking_gebruiker",
            sortable: false,
          },
        ]
      : []),
    ...(hasAantekeningen.value
      ? [
          {
            title: "Aantekeningen",
            key: "opmerking",
            sortable: false,
          },
        ]
      : []),
  ];
  return headers;
});

function formatUitvoering(uitvoering: Uitvoering) {
  return formatDate(uitvoering.aanvang, "eeee");
}

// voeg een ZERO-WIDTH-SPACE karakter toe aan elk non-word character
function addBreaks(string: string) {
  // return string;
  return string.replace(/([^\w])/g, "$&\u200B");
}

function remove(reservering: Reservering) {
  try {
    if (confirm("Weet je zeker dat je deze reservering wilt verwijderen")) {
      del(`/reservering/${reservering.id}`);
      useNotifyBus.emit({ message: `Ticket ${reservering.email} verwijderd` });
      emit("refresh");
    }
  } catch (e) {
    useNotifyBus.emit({
      message: `Fout bij verwijderen ticket ${reservering.email}: ${e}`,
      type: "error",
    });
  }
}

async function reminder(reservering: Reservering) {
  try {
    await get(`/reservering/${reservering.id}/resend`);
    useNotifyBus.emit({ message: `Betalingsherinnering ${reservering.email} verzonden` });
  } catch (e) {
    useNotifyBus.emit({
      message: `Fout bij versturen betalingsherinnering ${reservering.email}: ${e}`,
      type: "error",
    });
  }
}

async function resend(reservering: Reservering) {
  try {
    await get(`/reservering/${reservering.id}/resend`);
    useNotifyBus.emit({ message: `Ticket ${reservering.email} verzonden` });
  } catch (e) {
    useNotifyBus.emit({
      message: `Fout bij versturen ticket ${reservering.email}: ${e}`,
      type: "error",
    });
  }
}

function gotoReservation(_pointerEvent: any, { item }: { item: Reservering }) {
  const reservering = item;
  const router = useRouter();
  router.push({ name: "reserveren-id-details", params: { id: reservering.id } });
}
</script>

<style lang="scss">
.reserveringen-list {
  cursor: pointer;

  .email,
  .naam {
    max-width: 15em;
  }
}
.v-data-table-footer {
  display: none !important;
}
</style>
