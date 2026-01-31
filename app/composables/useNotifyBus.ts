import { useEventBus } from "@vueuse/core";

export const NOTIFY_EVENT_BUS_KEY = "NotifyEventBus";

export const useNotifyBus = useEventBus(NOTIFY_EVENT_BUS_KEY);
