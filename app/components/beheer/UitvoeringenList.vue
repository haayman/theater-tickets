<template>
  <v-table>
    <template #default>
      <tbody>
        <nuxt-link v-slot="{ navigate }" :to="{ name: 'beheer-reserveringen' }" custom>
          <tr @click="navigate">
            <td>Alle voorstellingen</td>
            <td>{{ totaalGereserveerd }} gereserveerd</td>
            <td>
              <uitvoering-status :uitvoering="totaalUitvoering"></uitvoering-status>
            </td>
          </tr>
        </nuxt-link>
        <nuxt-link
          v-for="uitvoering in uitvoeringen"
          :key="uitvoering.id"
          v-slot="{ navigate }"
          :to="{
            name: 'beheer-reserveringen',
            query: { uitvoering_id: uitvoering.id },
          }"
          custom
        >
          <tr :class="classes(uitvoering.id)" @click="navigate">
            <td>{{ uitvoering }}</td>
            <td>{{ uitvoering.gereserveerd }} gereserveerd</td>
            <td>
              <uitvoering-status :uitvoering="uitvoering"></uitvoering-status>
            </td>
          </tr>
        </nuxt-link>
      </tbody>
    </template>
  </v-table>
</template>

<script setup lang="ts">
import { Uitvoering } from "~/models";

const props = defineProps<{
  uitvoeringen: (Uitvoering & { id: string })[];
  uitvoeringId?: number | null;
}>();
const totaalGereserveerd = computed(() =>
  props.uitvoeringen.reduce((total, u) => total + u.gereserveerd, 0),
);

const totaalVrijePlaatsen = computed(() =>
  props.uitvoeringen.reduce((total, u) => total + u.vrije_plaatsen, 0),
);

const totaalWachtlijst = computed(() =>
  props.uitvoeringen.reduce((total, u) => total + u.wachtlijst, 0),
);

const totaalTekoop = computed(() => props.uitvoeringen.reduce((total, u) => total + u.te_koop, 0));

const totaalUitvoering = computed(() => ({
  wachtlijst: totaalWachtlijst.value,
  vrije_plaatsen: totaalVrijePlaatsen.value,
  verkoopbaar: true,
  te_koop: totaalTekoop.value,
}));

function classes(uitvoeringId: number | undefined) {
  if (uitvoeringId && props.uitvoeringId === uitvoeringId) {
    return ["table-active"];
  } else {
    return ["noprint"];
  }
}
</script>
<style scoped>
tr {
  cursor: pointer;
}

.table-active {
  background-color: var(--loglist-hover);
}
</style>
