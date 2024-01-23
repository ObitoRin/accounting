import { defineComponent, PropType, ref } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import s from './ItemCreate.module.scss';
import { Tabs, Tab } from '../../shared/Tabs';
import { InputPad } from './InputPad';
import { Tags } from './Tasg';

export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    // const onUpdateSelected = (name: string) => {
    //   refKind.value = name
    // }
    const refKind = ref('支出')
    const refTagId = ref<number>()
    const refHappenAt = ref<string>(new Date().toISOString())
    const refAmount = ref<number>(0)
    return () => (
      <div class={s.wrapper}>
        <MainLayout class={s.layout}>
          {{
            title: () => '记一笔',
            icon: () => <Icon name="left" class={s.navIcon} />,
            default: () => <>
              {/* <Tabs selected={refKind.value} onUpdateSelected={onUpdateSelected}> */}
              <div class={s.wrapper}>
            <Tabs v-model:selected={refKind.value} class={s.tabs}>
              <Tab name="支出">
                <Tags kind="expenses" v-model:selected={refTagId.value} />
              </Tab>
              <Tab name="收入">
                <Tags kind="income" v-model:selected={refTagId.value} />
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad
                v-model:happenAt={refHappenAt.value}
                v-model:amount={refAmount.value}
              />
            </div>
              </div>
            </>
          }}
        </MainLayout>
      </div>
    )
  }
})