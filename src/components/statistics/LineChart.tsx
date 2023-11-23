import { defineComponent, onMounted, PropType, ref } from 'vue';
import s from './LineChart.module.scss';
import * as echarts from 'echarts';

export const LineChart = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
  const refDiv = ref<HTMLDivElement>()
  onMounted(() => {
    if (!refDiv.value) { return }
    const myChart = echarts.init(refDiv.value);
    const option = {
      grid: [
        {
          left: 0,
          right: 0,
          top: 0,
          bottom: 20,
        }
      ],
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }
    myChart.setOption(option)
  })
    return () => (
      <div ref={refDiv} class={s.wrapper}></div>
    )
  }
})