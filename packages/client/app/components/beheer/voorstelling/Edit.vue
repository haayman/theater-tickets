<template>
  <v-container v-if="voorstelling">
    <v-form v-if="voorstelling" @submit.prevent="save">
      <v-card class="mx-auto">
        <v-card-title>Voorstelling</v-card-title>
        <v-card-text>
          <v-alert v-if="errors['general']">
            {{ errors.general }}
          </v-alert>
          <v-switch v-model="voorstelling.active" label="Actief" />
          <v-text-field v-model="voorstelling.title" required label="Titel" />
          <v-textarea v-model="voorstelling.description" required label="Omschrijving" />
          <v-text-field v-model="voorstelling.url" label="URL" type="url" />
          <v-textarea v-model="voorstelling.locatie" label="Locatie" />
          <v-textarea v-model="voorstelling.opmerkingen" label="Opmerkingen" />
          <v-text-field v-model="voorstelling.poster" label="Poster" type="url" />
          <img v-if="voorstelling.poster" :src="voorstelling.poster" class="mh-300 mt-2" />
          <v-text-field v-model="voorstelling.thumbnail" label="Thumbnail" type="url" />
          <img
            v-if="voorstelling.thumbnail"
            :src="voorstelling.thumbnail"
            class="mh-300 mt-2 thumbnail"
          />
        </v-card-text>
      </v-card>
      <v-card class="mx-auto mt-4">
        <v-card-title>Prijzen</v-card-title>
        <v-card-text>
          <v-table>
            <template #default>
              <thead>
                <tr>
                  <th width="30%">Omschrijving</th>
                  <th width="20%">Prijs</th>
                  <th>Benodigde rol voor uitgifte</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr v-for="prijs in voorstelling.prijzen" :key="prijs.id">
                  <td>
                    <v-text-field v-model="prijs.description" />
                  </td>
                  <td>
                    <v-text-field
                      v-model.number="prijs.prijs"
                      prefix="€"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td>
                    <v-select v-model="prijs.role" :items="roles" />
                  </td>
                  <td>
                    <v-btn color="warning" @click.prevent="deletePrijs(prijs)">
                      <v-icon icon="mdi-delete" />
                    </v-btn>
                  </td>
                </tr>
                <tr>
                  <td>
                    <v-text-field v-model="prijs.description" />
                  </td>
                  <td>
                    <v-text-field
                      v-model.number="prijs.prijs"
                      prefix="€"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td>
                    <v-select v-model="prijs.role" :items="roles" />
                  </td>
                  <td>
                    <v-btn color="primary" @click.prevent="addPrijs()">
                      <v-icon icon="mdi-plus" />
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto mt-4">
        <v-card-title>Uitvoeringen</v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th>Aantal plaatsen</th>
                <th>Aanvang</th>
                <th>Deur open</th>
                <th>extra tekst</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <BeheerVoorstellingEditUitvoering
                v-for="(uitvoering, index) in voorstelling.uitvoeringen"
                :key="index"
                :uitvoering="uitvoering"
                :deletable="true"
                @delete="deleteUitvoering"
              />
              <BeheerVoorstellingEditUitvoering
                :uitvoering="uitvoering"
                :deletable="false"
                @save="addUitvoering"
              />
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto mt-4">
        <v-alert v-if="errors['general']" type="error">
          {{ errors.general }}
        </v-alert>
        <v-card-text>
          <v-btn type="submit" color="primary">
            {{ !voorstelling.id ? "Toevoegen" : "Bijwerken" }}
          </v-btn>
          <v-btn :to="{ name: 'beheer-voorstelling' }" color="secondary"> annuleren </v-btn>
        </v-card-text>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { addDays } from "date-fns";
import { useVModel } from "@vueuse/core";
import { Prijs } from "~/models/Prijs";
import { Uitvoering } from "~/models/Uitvoering";
import type { Voorstelling } from "~/models";
import { RoleList } from "~/models/Role";

const props = defineProps<{
  voorstelling: Voorstelling;
}>();

const emit = defineEmits<{
  (event: "voorstelling", voorstelling: Voorstelling): void;
}>();

const prijs = ref<Prijs>(new Prijs());
const uitvoering = ref<Uitvoering>(new Uitvoering({ voorstelling: props.voorstelling }));
const errors = ref<any>({});
const dirty = ref(false);

const router = useRouter();
const { put, post } = useAPI();

const roles = computed(() => {
  return [
    { title: "Iedereen", value: null },
    ...RoleList.map((role) => ({ title: role.description, value: role.id })),
  ];
});

onBeforeRouteLeave((to, from, next) => {
  if (!dirty.value) {
    next();
    return;
  }

  if (confirm("Nog niet opgeslagen\n. Weet je zeker dat je de pagina wilt verlaten?")) {
    next();
  } else {
    next(false);
  }
});

function copyUitvoering() {
  if (props.voorstelling.uitvoeringen.length) {
    const [lastUitvoering] = props.voorstelling.uitvoeringen.slice(-1);
    const { aantal_plaatsen, aanvang, deur_open } = lastUitvoering;
    uitvoering.value = new Uitvoering({
      aantal_plaatsen,
      aanvang: addDays(aanvang, 1),
      deur_open: addDays(deur_open, 1),
    });
  } else {
    uitvoering.value = new Uitvoering();
  }
}
onMounted(() => {
  copyUitvoering();
});

const voorstelling = useVModel(props, "voorstelling", emit);

function addPrijs() {
  voorstelling.value.prijzen.push(prijs.value);
  voorstelling.value.prijzen = [...voorstelling.value.prijzen].sort((a, b) => +b.prijs - +a.prijs);

  prijs.value = new Prijs();
}

function deletePrijs(prijs: Prijs) {
  if (!prijs.id || confirm("Weet je zeker dat je deze prijs wilt verwijderen?")) {
    voorstelling.value.prijzen = voorstelling.value.prijzen
      .filter((p) => p !== prijs)
      .sort((a, b) => b.prijs - a.prijs);
  }
}

function addUitvoering() {
  voorstelling.value.uitvoeringen.push(uitvoering.value);
  voorstelling.value.uitvoeringen = [...voorstelling.value.uitvoeringen].sort(
    (a, b) => a.aanvang.getTime() - b.aanvang.getTime(),
  );

  copyUitvoering();
}

function deleteUitvoering(uitvoering: Uitvoering) {
  voorstelling.value.uitvoeringen = voorstelling.value.uitvoeringen
    .filter((u) => u !== uitvoering)
    .sort((a, b) => a.aanvang.getTime() - b.aanvang.getTime());
}

async function save() {
  const stayOnPage = !voorstelling.value.id;
  try {
    if (voorstelling.value.id) {
      await put(`/voorstelling/${voorstelling.value.id}`, voorstelling.value.serialize());
    } else {
      await post(`/voorstelling/`, voorstelling.value.serialize());
    }
    if (stayOnPage) {
      router.push({
        name: "beheer-voorstelling-id",
        params: { id: voorstelling.value.id },
      });
    } else {
      router.push({
        name: "beheer-voorstelling",
      });
    }
  } catch (error: any) {
    const errors = error.errors || {};

    if (error.message) {
      errors.general = error.message;
    }
  }
}
</script>
<style>
.thumbnail {
  max-height: 100px;
}
</style>
