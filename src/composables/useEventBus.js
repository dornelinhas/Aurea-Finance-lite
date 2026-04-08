import { ref } from 'vue';

const bus = ref(new Map());

export const useEventBus = () => {
  function emit(event, payload) {
    if (bus.value.has(event)) {
      bus.value.get(event).forEach(callback => callback(payload));
    }
  }

  function on(event, callback) {
    if (!bus.value.has(event)) {
      bus.value.set(event, []);
    }
    bus.value.get(event).push(callback);
  }

  return { emit, on };
};
