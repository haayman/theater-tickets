<template>
  <v-card v-if="payments && payments.length" class="mt-3">
    <!--{{payments}}-->

    <v-card-title>Betaalgeschiedenis</v-card-title>

    <v-card-text>
      <v-table>
        <template #default>
          <thead>
            <tr>
              <th>ticket</th>

              <th>betaald</th>

              <th>status</th>

              <th>bedrag</th>

              <th v-if="hasRefunds">Teruggestort</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ payment.description }}</td>

              <td>{{ formatDate(payment.paidAt, "Pp") }}</td>

              <td>{{ payment.status }}</td>

              <td>{{ formatMoney(payment.amount) }}</td>

              <td v-if="payment.amountRefunded">{{ formatMoney(payment.amountRefunded) }}</td>
            </tr>
          </tbody>
        </template>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Payment } from "~~/models";

const props = defineProps<{
  payments: Payment[];
}>();

const hasRefunds = computed(() => props.payments.find((p) => p.amountRefunded));
</script>
