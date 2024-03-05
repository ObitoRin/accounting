import { defineComponent, onUnmounted, PropType, reactive, watchEffect } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import s from './ItemCreate.module.scss';
import { Tabs, Tab } from '../../shared/Tabs';
import { InputPad } from './InputPad';
import { Tags } from './Tags';
import { http } from '../../shared/Http';
import { useRouter } from 'vue-router';
import { Dialog } from 'vant';
import { AxiosError } from 'axios';
import { BackIcon } from '../../shared/BackIcon';
import { hasError, validate } from '../../shared/validate';
import { useUserPreferenceStore } from '../../stores/useUserPreferenceStore';

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
    const userPreferenceStore = useUserPreferenceStore()
    const router = useRouter()
    const formData = reactive<Partial<Item>>({
      kind: userPreferenceStore.kind || 'expenses',
      tag_ids: [],
      happen_at: new Date().toISOString(),
      amount: 0
    })
    const errors = reactive<FormErrors<typeof formData>>({
      kind: [],
      tag_ids: [],
      happen_at: [],
      amount: []
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
      Object.assign(errors, { kind: [], tag_ids: [], happen_at: [], amount: [] })
      Object.assign(errors, validate(formData, [
        { key: 'kind', type: 'required', message: '类型必填'},
        { key: 'tag_ids', type: 'required', message: '标签必填' },
        { key: 'amount', type: 'required', message: '金额必填' },
        { key: 'amount', type: 'notEqual', value: 0, message: '金额不能为零' },
        { key: 'happen_at', type: 'required', message: '时间必填' },
      ]))
      if (hasError(errors)) {
        Dialog.alert({
          title: '出错',
          message: Object.values(errors).filter(i => i.length > 0).join('\n')
        })
        return
      }
      await http.post<Resource<Item>>('/items', formData, 
        { _mock: 'itemCreate', _autoLoading: true }
      ).catch(onError)
      router.push('/items')
    }
    watchEffect(
      () => userPreferenceStore.changeKind(formData.kind as 'expenses' | 'income'),
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
        <MainLayout class={s.layout}>
          {{
            title: () => '记一笔',
            icon: () => <BackIcon />,
            default: () => <>
              {/* <Tabs selected={refKind.value} onUpdateSelected={onUpdateSelected}> */}
              <div class={s.wrapper}>
            <Tabs v-model:selected={formData.kind} class={s.tabs}>
              <Tab name="支出" value="expenses">
                <Tags kind="expenses" v-model:selected={formData.tag_ids![0]} />
              </Tab>
              <Tab name="收入" value="income">
                <Tags kind="income" v-model:selected={formData.tag_ids![0]} />
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad
                v-model:happenAt={formData.happen_at}
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

export default ItemCreate