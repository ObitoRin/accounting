import { defineComponent, PropType, reactive, ref } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import s from './ItemCreate.module.scss';
import { Tabs, Tab } from '../../shared/Tabs';
import { InputPad } from './InputPad';
import { Tags } from './Tags';
import { http } from '../../shared/Http';
import { useRouter } from 'vue-router';
import { Dialog } from 'vant';
import { AxiosError } from 'axios';
import { BackIcon } from '../../shared/BackIcon';

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

    const router = useRouter()
    const formData = reactive({
      kind: '支出',
      tags_id: [],
      happentAt: new Date().toISOString(),
      amount: 0
    })
    const onError = (error: AxiosError<ResourceError>) => {
      if (error.response?.status === 422) {
        Dialog.alert({
          title: '出错',
          message: Object.values(error.response.data.errors).join('\n')
        })
      }
      throw error
    }
    const onSubmit = async () => {
      await http.post<Resource<Item>>('/items', formData, 
        { params: { _mock: 'itemCreate' } }
      ).catch(onError)
      router.push('/items')
    }

    return () => (
      <div class={s.wrapper}>
        <MainLayout class={s.layout}>
          {{
            title: () => '记一笔',
            icon: () => <BackIcon />,
            default: () => <>
              {/* <Tabs selected={refKind.value} onUpdateSelected={onUpdateSelected}> */}
              <div class={s.wrapper}>
            <Tabs v-model:selected={formData.kind} class={s.tabs}>
              <Tab name="支出">
                <Tags kind="expenses" v-model:selected={formData.tags_id[0]} />
              </Tab>
              <Tab name="收入">
                <Tags kind="income" v-model:selected={formData.tags_id[0]} />
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad
                v-model:happenAt={formData.happentAt}
                v-model:amount={formData.amount}
                onSubmit={onSubmit}
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