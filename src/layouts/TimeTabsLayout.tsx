import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './TimeTabsLayout.module.scss';
import { Overlay } from 'vant'
import { Time } from '../shared/time';
import { MainLayout } from './MainLayout';
import { OverlayIcon } from '../shared/Overlay';
import { Tab, Tabs } from '../shared/Tabs';
import { Form, FormItem } from '../shared/Form';

const demo = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true
    },
    endDate: {
      type: String as PropType<string>,
      required: true
    }
  },
})

export const TimeTabsLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof demo>,
      required: true
    }
  },
  setup: (props, context) => {
    const refSelected = ref('本月')
    const time = new Time()
    const customTime = reactive({
      start: new Time().format(),
      end: new Time().format()
    })
    const timeList = [
      { start: time.firstDayOfMonth(), end: time.lastDayOfMonth() },
      { start: time.add(-1, 'month').firstDayOfMonth(), end: time.add(-1, 'month').lastDayOfMonth() },
      { start: time.firstDayOfYear(), end: time.lastDayOfYear() }
    ]
    const refOverlayVisible = ref(false)
    const onSelect = () => {
      if (refSelected.value === '自定义时间') {
        refOverlayVisible.value = true
      }
    }

    const onSubmitCustomTime = (e: Event) => {
      e.preventDefault()
      refOverlayVisible.value = false
    }
    
    return () => (
      <MainLayout>
        {{
          title: () => '记账',
          icon: () => <OverlayIcon />,
          default: () => <>
              <Tabs v-model:selected={refSelected.value} onUpdate:selected={onSelect} classPrefix='customTabs'>
                <Tab name="本月">
                  <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                </Tab>
                <Tab name="上月">
                  <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                </Tab>
                <Tab name="今年">
                  <props.component startDate={timeList[2].start.format()} endDate={timeList[2].end.format()} />
                </Tab>
                <Tab name="自定义时间">
                  <props.component startDate={customTime.start} endDate={customTime.end} />
                </Tab>
              </Tabs>
              <Overlay show={refOverlayVisible.value} class={s.overlay} >
                <div class={s.overlay_inner}>
                  <header>
                    请选择时间
                  </header>
                  <main>
                    <Form onSubmit={onSubmitCustomTime}>
                      <FormItem v-model={customTime.start} label='开始时间' type='date' />                      
                      <FormItem v-model={customTime.end} label='结束时间' type='date' />                      
                      <FormItem>
                        <div class={s.actions}>
                          <button type='button' onClick={() => refOverlayVisible.value = false}>取消</button>
                          <button type='submit'>提交</button>
                        </div>
                      </FormItem>
                    </Form>
                  </main>
                </div>
              </Overlay>
            </>
        }}
      </MainLayout>
    )
  }
})