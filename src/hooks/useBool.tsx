import { ref } from "vue"

export const useBool = (initalValue: boolean) => {
  const bool = ref<boolean>(initalValue)
  return {
    ref: bool,
    toggle: () => bool.value = !bool.value,
    disabled: () => bool.value = true,
    enable: () => bool.value = false
  }
}