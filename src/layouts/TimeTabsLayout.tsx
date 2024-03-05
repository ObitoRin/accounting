import { PropType, defineComponent, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
import s from './TimeTabsLayout.module.scss';
import { Dialog, Overlay } from 'vant'
import { Time } from '../shared/time';
import { MainLayout } from './MainLayout';
import { OverlayIcon } from '../shared/Overlay';
import { Tab, Tabs } from '../shared/Tabs';
import { Form, FormItem } from '../shared/Form';
import { useMeStore } from '../stores/useMeStore';
import { useRouter } from 'vue-router';
import { useUserPreferenceStore } from '../stores/useUserPreferenceStore';

const demo = defineComponent({
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
})

export const TimeTabsLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof demo>,
      required: true
    },
    rerenderOnSwitchTab: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    hideThisYear: {
      type: Boolean,
      default: false
    }
  },
  setup: (props, context) => {
    const userPreferenceStore = useUserPreferenceStore()
    const refSelected = ref(userPreferenceStore.selected === '今年' && props.hideThisYear ? '本月' : userPreferenceStore.selected)
    const time = new Time()
    const tempTime = reactive({
      start: new Time().format(),
      end: new Time().format(),
    })
    const customTime = reactive<{
      start?: string;
      end?: string;
    }>({})
    const timeList = [
      { start: time.firstDayOfMonth(), end: time.lastDayOfMonth() },
      { start: time.add(-1, 'month').firstDayOfMonth(), end: time.add(-1, 'month').lastDayOfMonth() },
      { start: time.firstDayOfYear(), end: time.lastDayOfYear() }
    ]
    const refOverlayVisible = ref(false)
    const meStore = useMeStore()
    const router = useRouter()

    const onSelect = () => {
      if (refSelected.value === '自定义时间') {
        refOverlayVisible.value = true
      }
    }

    const onSubmitCustomTime = (e: Event) => {
      e.preventDefault()

      if (!meStore.me) {
        router.push('/items/create')
        return
      }
      if (new Time(tempTime.start).getTimestamp() > new Time(tempTime.end).getTimestamp()) {
        Dialog.alert({ title: '提示', message: '结束时间必须大于开始时间', closeOnPopstate: false, })
        return
      }
      if (props.hideThisYear && (new Time(tempTime.start).getTimestamp() >= new Time(tempTime.end).getTimestamp())) {
        Dialog.alert({ title: '提示', message: '结束时间必须大于开始时间', closeOnPopstate: false, })
        return
      }

      refOverlayVisible.value = false
      Object.assign(customTime, tempTime)
    }
    
    watchEffect(
      () => {
        if (refSelected.value === '自定义时间') {
          refOverlayVisible.value = true
        }
        userPreferenceStore.changeSelected(refSelected.value)
        
      },
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
      <MainLayout>
        {{
          title: () => '荔枝记账',
          icon: () => <OverlayIcon />,
          default: () => <>
              {props.hideThisYear ? 
                <Tabs v-model:selected={refSelected.value} onUpdate:selected={onSelect} rerenderOnSelect={props.rerenderOnSwitchTab} classPrefix='customTabs'>
                  <Tab name="本月" value="本月">
                    <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                  </Tab>
                  <Tab name="上月" value="上月">
                    <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                  </Tab>
                  <Tab name="自定义时间" value="自定义时间">
                    <props.component startDate={customTime.start} endDate={customTime.end} />
                  </Tab>
                </Tabs>
              :
                <Tabs v-model:selected={refSelected.value} onUpdate:selected={onSelect} rerenderOnSelect={props.rerenderOnSwitchTab} classPrefix='customTabs'>
                  <Tab name="本月" value="本月">
                    <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                  </Tab>
                  <Tab name="上月" value="上月">
                    <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                  </Tab>
                  <Tab name="今年" value="今年">
                    <props.component startDate={timeList[2].start.format()} endDate={timeList[2].end.format()} />
                  </Tab>
                  <Tab name="自定义时间" value="自定义时间">
                    <props.component startDate={customTime.start} endDate={customTime.end} />
                  </Tab>
                </Tabs>
              }
              <Overlay show={refOverlayVisible.value} class={s.overlay} >
                <div class={s.overlay_inner}>
                  <header>
                    请选择时间
                  </header>
                  <main>
                    <Form onSubmit={onSubmitCustomTime}>
                      <FormItem v-model={tempTime.start} label='开始时间' type='date' />                      
                      <FormItem v-model={tempTime.end} label='结束时间' type='date' />                      
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