<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title>Voorstellingen</v-card-title>

      <v-data-table
        v-model:options="options"
        :loading="loading"
        :headers="headers"
        :items="voorstellingen"
        hide-default-footer
        disable-pagination
      >
        <template #item.description="{ item }">
          <div v-html="item.description"></div>
        </template>
        <template #item.actions="{ item }">
          <nuxt-link :to="{ name: 'beheer-voorstelling-id', params: { id: item.id } }">
            <v-icon size="small" class="me-2">mdi-pencil</v-icon>
          </nuxt-link>

          <a href="#delete" @click.prevent="remove(item)">
            <v-icon size="small" class="me-2">mdi-delete</v-icon>
          </a>
        </template>

        <template #item.thumbnail="{ item }">
          <img v-if="item.thumbnail" class="thumbnail" :src="item.thumbnail" />
        </template>
      </v-data-table>

      <v-card-actions>
        <v-btn :to="{ name: 'beheer-voorstelling-create' }" color="primary">
          Voorstelling toevoegen
        </v-btn>
        <v-switch v-model="all" label="Alle voorstellingen" />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { Voorstelling } from "~/models";

const { get, del } = useAPI();

const loading = ref(false);
const options = ref({});
const headers = [
  { title: "Titel", key: "title", sortable: false },
  { title: "Omschrijving", key: "description", sortable: false },
  { title: "", key: "thumbnail", sortable: false },
  { title: "", key: "actions", sortable: false },
];
const all = ref(false);

const voorstellingen = ref<Voorstelling[]>([]);

async function fetch() {
  const data = await get<Voorstelling[]>("/voorstelling", {
    params: {
      include: ["prijzen", "uitvoeringen"],
      ...(all.value ? { all: true } : {}),
    },
  });
  voorstellingen.value = data || [];
}

onMounted(async () => {
  await fetch();
  loading.value = false;
});

watch(all, async () => {
  loading.value = true;
  await fetch();
  loading.value = false;
});

async function remove(voorstelling: Voorstelling) {
  if (confirm(`Weet je zeker dat je de voorstelling wilt verwijderen?`)) {
    await del(`/voorstelling/${voorstelling.id}`);

    voorstellingen.value = voorstellingen.value.filter((v) => v.id !== voorstelling.id);
  }
}
</script>

<style>
.thumbnail {
  max-height: 100px;
}
.v-data-table-footer {
  display: none !important;
}
</style>
