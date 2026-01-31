<template>
  <div class="ticket-number d-flex justify-center align-center">
    <v-btn icon :disabled="value <= 0" size="x-small" class="decrement" @click="decrement">
      <v-icon size="x-large"> mdi-minus-circle </v-icon>
    </v-btn>
    <span class="value mx-2">{{ value }}</span>
    <v-btn icon :disabled="value >= max" size="x-small" class="increment" @click="increment">
      <v-icon size="x-large">mdi-plus-circle</v-icon>
    </v-btn>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
  max: number;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const value = useVModel(props, "modelValue", emit);

function increment() {
  value.value++;
}

function decrement() {
  value.value--;
}
</script>
<style lang="scss">
.ticket-number {
  .value {
    font-size: large;
  }
}
</style>
