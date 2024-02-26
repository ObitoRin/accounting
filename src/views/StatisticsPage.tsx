import { defineComponent, PropType } from 'vue';
import { TimeTabsLayout } from '../layouts/TimeTabsLayout';
import { Chart } from '../components/statistics/Chart';

export const StatisticsPage = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <TimeTabsLayout rerenderOnSwitchTab={true} component={Chart} hideThisYear={true} />
    )
  }
})

export default StatisticsPage