<template>
  <v-text-field v-model="timestamp" :type="type" class="input-date" />
</template>

<script setup lang="ts">
import formatter from "date-fns/format";

const props = defineProps<{
  modelValue: Date;
  type: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: Date): void;
}>();

const timestamp = computed({
  get() {
    return asString();
  },
  set(value) {
    emit("update:modelValue", new Date(value));
  },
});

function asString() {
  try {
    switch (props.type) {
      // 2018-08-26T04:06:37
      case "datetime-local":
        return formatter(props.modelValue, "yyyy-MM-dd'T'HH:mm");
      case "time":
        return props.modelValue.toLocaleTimeString();
      case "date":
      default:
        // yyyy-MM-dd
        return props.modelValue.toISOString().substring(0, 10);
    }
  } catch (e) {
    return props.modelValue.toString();
  }
}
</script>
