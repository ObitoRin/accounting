import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch, watchEffect } from 'vue';
import { FormItem } from '../../shared/Form';
import s from './Chart.module.scss';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { Bars } from './Bars';
import { http } from '../../shared/Http';
import { Time } from '../../shared/time';
import { useUserPreferenceStore } from '../../stores/useUserPreferenceStore';

const DAY = 24 * 3600 * 1000

type Data1Item = { happen_at: string; amount: number }
type Data1 = Data1Item[]
type Data2Item = { tag_id: number; tag: Tag; amount: number }
type Data2 = Data2Item[]

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
    const userPreferenceStore = useUserPreferenceStore()
    const kind = ref(userPreferenceStore.kindAccount || 'expenses')

    const data1 = ref<Data1>([])
    const betterData1 = computed<[string, number][]>(() => {
      if (!props.startDate || !props.endDate) {
        return []
      }
      const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime()
      const n = diff / DAY + 1
      return Array.from({ length: n }).map((_, i) => {
        const time = new Time(props.startDate + 'T00:00:00.000+0800').add(i, 'day').getTimestamp()
        const item = data1.value[0]
        const amount = (item && new Date(item.happen_at + 'T00:00:00.000+0800').getTime() === time)
          ? data1.value.shift()!.amount
          : 0
        return [new Date(time).toISOString(), amount]
      })
    })
    const fetchData1 = async () => {
      if (!props.startDate || !props.endDate) {
        return
      }
      const response = await http.get<{ groups: Data1, summary: number }>('/items/summary', {
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        group_by: 'happen_at',
      }, {
        _mock: 'itemSummary',
        _autoLoading: true,
      })
      // data1.value = response.data.groups
      data1.value = response.data.groups.sort((a, b) => new Time(a.happen_at).getTimestamp() - new Time(b.happen_at).getTimestamp());
    }
    onMounted(fetchData1)
    watch(() => kind.value, fetchData1)

    const data2 = ref<Data2>([])
    const betterData2 = computed<{ name: string; value: number }[]>(() =>
      data2.value.map(item => ({
        name: item.tag.name,
        value: item.amount,
      }))
    )
    const fetchData2 = async () => {
      if (!props.startDate || !props.endDate) {
        return
      }
      const response = await http.get<{ groups: Data2, summary: number }>('/items/summary', {
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        group_by: 'tag_id',
      }, {
        _mock: 'itemSummary'
      })
      data2.value = response.data.groups
    }
    onMounted(fetchData2)
    watch(() => kind.value, fetchData2)

    const betterData3 = computed<{ tag: Tag; amount: number; percent: number }[]>(() => {
      const total = data2.value.reduce((sum, item) => sum + item.amount, 0)
      return data2.value.map(item => ({
        ...item,
        percent: Math.round(item.amount / total * 100)
      }))
    })

    watch(() => [props.startDate, props.endDate], () => {
      fetchData1()
      fetchData2()
    })

    watchEffect(
      () => userPreferenceStore.changeKindAccount(kind.value),
      { flush: "post" }
    );
    onUnmounted(() => {
      localStorage.setItem('userPreferenceStore', JSON.stringify({
        selected: userPreferenceStore.selected,
        kind: userPreferenceStore.kind,
        kindAccount: userPreferenceStore.kindAccount,
      }))
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
        <PieChart data={betterData2.value} />
        <Bars data={betterData3.value} />
      </div>
    )
  }
})