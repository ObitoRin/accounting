import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import { FormItem } from '../../shared/Form';
import s from './Chart.module.scss';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { Bars } from './Bars';
import { http } from '../../shared/Http';

type Data1Item = { happen_at: string; amount: number }
type Data1 = Data1Item[]

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
    const kind = ref('expenses')

    const data1 = ref<Data1>([])
    const betterData1 = computed(() => {
      return data1.value.map(item => [item.happen_at, item.amount] as [string, number])
    })

    onMounted(async () => {
      const response = await http.get<{ groups: Data1, summary: number }>('/items/summary', {
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        _mock: 'itemSummary'
      })
      data1.value = response.data.groups
    })

    return () => (
      <div class={s.wrapper}>
        <FormItem
          v-model={kind.value}
          label='类型'
          type='select'
          options={[
            { text: '支出', value: 'expenses' },
            { text: '收入', value: 'income' },
          ]}
        />
        <LineChart data={betterData1.value} />
        <PieChart />
        <Bars />
      </div>
    )
  }
})