import { computed, defineComponent, PropType } from 'vue';
export const Money = defineComponent({
  props: {
    value: {
      type: Number as PropType<number>,
      required: true
    }
  },
  setup: (props, context) => {
    const addZero = computed(() => {
      const nString = (props.value / 100).toString()
      const dotIndex = nString.indexOf('.')
      if (dotIndex < 0) {
        return nString + '.00'
      } else if (nString.substring(dotIndex).length === 2) {
        return nString + '0'
      } else {
        return nString
      }
    })
    return () => (
      <span>￥{addZero.value}</span>
    )
  }
})