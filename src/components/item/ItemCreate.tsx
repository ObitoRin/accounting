import { defineComponent, PropType, ref } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import s from './ItemCreate.module.scss';
import { Tabs, Tab } from '../../shared/Tabs';
import { InputPad } from './InputPad';

export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refKind = ref('支出')
    const onUpdateSelected = (name: string) => {
      refKind.value = name
    }
    return () => (
      <div class={s.wrapper}>
        <MainLayout>
          {{
            title: () => '记一笔',
            icon: () => <Icon name="left" class={s.navIcon} />,
            default: () => <>
              {/* <Tabs selected={refKind.value} onUpdateSelected={onUpdateSelected}> */}
              <Tabs v-model:selected={refKind.value}>
                <Tab name="支出">icon 列表</Tab>
                <Tab name="收入">icon 列表2</Tab>
              </Tabs>
              <div class={s.inputPad_wrapper}>
                <InputPad />
              </div>
            </>
          }}
        </MainLayout>
      </div>
    )
  }
})