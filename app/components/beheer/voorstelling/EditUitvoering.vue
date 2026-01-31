<template>
  <tr>
    <td width="13%">
      <v-text-field v-model.number="uitvoering.aantal_plaatsen" type="number" />
    </td>

    <td width="25%">
      <input-date
        v-model="uitvoering.aanvang"
        type="datetime-local"
        class="form-control"
        required
      />
    </td>

    <td width="25%">
      <input-date
        v-model="uitvoering.deur_open"
        type="datetime-local"
        class="form-control"
        required
      />
    </td>

    <td><v-text-field v-model="uitvoering.extra_text" class="form-control" /></td>

    <td>
      <v-btn v-if="deletable" color="warning" @click.prevent="remove">
        <v-icon icon="mdi-delete" />
      </v-btn>

      <v-btn v-else color="primary" @click.prevent="save"> <v-icon icon="mdi-plus" /> </v-btn>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { subMinutes } from "date-fns";
import { Uitvoering } from "~~/models/Uitvoering";

const props = defineProps<{
  uitvoering: Uitvoering;
  deletable: boolean;
}>();

const emit = defineEmits<{
  (event: "save", value: Uitvoering): void;
  (event: "delete", value: Uitvoering): void;
}>();

const uitvoering = useVModel(props, "uitvoering", emit);
watch(
  () => uitvoering.value.aanvang,
  (aanvang) => (uitvoering.value.deur_open = subMinutes(aanvang, 30)),
);

function save() {
  emit("save", uitvoering.value);
}

function remove() {
  emit("delete", props.uitvoering);
}
</script>

<style scoped></style>
