<template>
  <v-card>
    <v-card-title>Voortgang</v-card-title>

    <v-card-text>
      <!-- <button class="btn btn-primary" @click="showLog=!showLog">{{showLog?'Verberg':'Toon'}} Log</button> -->

      <v-table>
        <thead>
          <tr>
            <th>tijdstip</th>

            <th>melding</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="log in sortedLogs" :key="log.id">
            <td>{{ formatDate(log.created_at, "EEEE dd MMM HH:mm") }}</td>

            <td>{{ log.message }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Log } from "~~/models";

const props = defineProps<{
  logs: Log[];
}>();

const sortedLogs = computed(() => {
  return [...props.logs].sort((a: Log, b: Log) => b.id - a.id);
});
</script>
