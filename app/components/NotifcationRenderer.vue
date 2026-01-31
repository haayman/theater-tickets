<template>
  <v-snackbar
    v-model="visible"
    :color="color"
    :timeout="-1"
    location="bottom right"
    transition="slide-y-reverse-transition"
    content-class="notification-snackbar"
  >
    <div class="notification-snackbar__content text-body-1">
      {{ message }}
    </div>

    <div class="notification-snackbar__progress">
      <v-progress-linear :model-value="counter" />
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import type { EventBusListener } from "@vueuse/core";
import type { NotificationContent, NotificationData } from "~~/types/notfication";

const DEFAULT_TIMEOUT = 5000;
const DEFAULT_TYPE: NotificationData["type"] = "info";

const bus = useEventBus<NotificationContent>(NOTIFY_EVENT_BUS_KEY);
let listener: EventBusListener;

const visible = ref(false);
const message = ref("");
const timeout = ref(DEFAULT_TIMEOUT);
const type = ref<NotificationData["type"]>(DEFAULT_TYPE);

const color = computed(() => {
  switch (type.value) {
    case "success":
      return "green-darken-1";
    case "warning":
      return "orange-darken-1";
    case "error":
      return "red-darken-1";
    case "info":
    default:
      return "blue-darken-1";
  }
});

const intervalRange = computed(() => timeout.value / 100);
const { counter, reset, resume, pause } = useInterval(intervalRange, {
  controls: true,
  immediate: false,
  callback: (progress) => {
    if (progress > 100) {
      visible.value = false;
      pause();
      reset();
    }
  },
});

onMounted(() => {
  listener = bus.on((event: NotificationContent) => {
    // Reset from previous
    reset();
    resume();
    visible.value = true;
    timeout.value = DEFAULT_TIMEOUT;
    type.value = DEFAULT_TYPE;

    // Progress notification
    if (typeof event === "string") {
      message.value = event;
      return;
    }

    message.value = event.message;

    if (event.timeout) {
      timeout.value = event.timeout;
    }

    if (event.type) {
      type.value = event.type;
    }

    if (event.stack) {
      // eslint-disable-next-line no-console
      console.warn(`Notification [${event.message}] contains stack: `, event.stack);
    }
  });
});

onUnmounted(() => {
  bus.off(listener);
});
</script>

<style lang="scss">
.notification-snackbar {
  .v-snackbar__wrapper {
    position: relative;
    overflow: hidden;
  }

  .v-snackbar__content {
    padding: 0;
  }

  &__content {
    padding: 8px 16px;
  }

  &__progress {
    position: absolute;
    bottom: 0;
    display: block;
    width: 100%;
    height: 4px;
    opacity: 0.5;
  }
}
</style>
