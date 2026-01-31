<template>
  <div class="voorstelling_date d-flex flex-column">
    <div class="date d-flex flex-column">
      <div class="day">{{ formatDate(min, "dd") }}</div>
      <div class="month">{{ formatMonth(min) }}</div>
    </div>
    <template v-if="!equal">
      <div>-</div>
      <div class="date d-flex flex-column">
        <div class="day">{{ formatDate(max, "dd") }}</div>
        <div class="month">{{ formatMonth(max) }}</div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ min: Date; max: Date }>();
const equal = computed(() => props.min.getTime() === props.max.getTime());

function formatMonth(date: Date) {
  const month = date.getMonth();
  return ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"][
    month
  ];
}
</script>

<style lang="scss">
.voorstelling_date {
  .month {
    font-size: larger;
    text-transform: uppercase;
  }
  .day {
    font-size: large;
    font-weight: bolder;
  }
}
</style>
