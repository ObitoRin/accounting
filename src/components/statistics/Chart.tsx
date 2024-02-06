import { defineComponent, PropType, ref } from 'vue';
import { FormItem } from '../../shared/Form';
import s from './Chart.module.scss';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { Bars } from './Bars';

export const Chart = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: false
    },
    endDate: {
      type: String as PropType<string>,
      required: false
    }
  },
  setup: (props, context) => {
    const category = ref('expenses')

    return () => (
      <div class={s.wrapper}>
        <FormItem
          v-model={category.value}
          label='类型'
          type='select'
          options={[
            { text: '支出', value: 'expenses' },
            { text: '收入', value: 'income' },
          ]}
        />
        <LineChart />
        <PieChart />
        <Bars />
      </div>
    )
  }
})