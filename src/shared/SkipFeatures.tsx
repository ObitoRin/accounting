import { defineComponent, PropType } from 'vue';
import { RouterLink } from 'vue-router';
export const SkipFeatures = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const onClick = () => {
      // 多个广告就记录跳过/完成时间，以此判断广告发布
      localStorage.setItem('skipFeatures', 'yes')
    }
    return () => (
      <span onClick={onClick}>
        <RouterLink to="/start">跳过</RouterLink>
      </span>
    )
  }
})