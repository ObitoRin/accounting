import { defineComponent, onMounted, PropType, ref } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import s from './ItemCreate.module.scss';
import { Tabs, Tab } from '../../shared/Tabs';
import { InputPad } from './InputPad';
import { http } from '../../shared/Http';
import { Button } from '../../shared/Button';

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
    const refExpensesTags = ref<Tag[]>([])
    const refIncomeTags = ref<Tag[]>([])
    const refPage = ref(0)
    const refHasMore = ref(false)
    const fetchTags = async () => {
      const response = await http.get<Resources<Tag>>('/tags', { 
        kind: 'expenses',
        _mock: 'tagIndex',
        page: refPage.value + 1
      })
      const { resources, pager } = response.data
      refExpensesTags.value.push(...resources)
      refHasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count
      refPage.value += 1
    }
    onMounted(fetchTags)
    onMounted(async () => {
      const response = await http.get<{ resource: Tag[] }>('/tags', { 
        kind: 'income',
        _mock: 'tagIndex'
      })
      refIncomeTags.value = response.data.resource
    })
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
                <div class={s.tags_wrapper}>
                  <div class={s.tag}>
                    <div class={s.sign}>
                      <Icon name="add" class={s.createTag} />
                    </div>
                    <div class={s.name}>
                      新增
                    </div>
                  </div>
                  {refExpensesTags.value.map(tag =>
                    <div class={[s.tag, s.selected]}>
                      <div class={s.sign}>
                        {tag.sign}
                      </div>
                      <div class={s.name}>
                        {tag.name}
                      </div>
                    </div>
                  )}
                </div>
                <div class={s.more}>
                  {refHasMore ? 
                    <Button onClick={fetchTags}>加载更多</Button> :
                    <span>没有更多</span>
                  }
                </div>
              </Tab>
              <Tab name="收入" class={s.tags_wrapper}>
                <div class={s.tag}>
                  <div class={s.sign}>
                    <Icon name="add" class={s.createTag} />
                  </div>
                  <div class={s.name}>
                    新增
                  </div>
                </div>
                {refIncomeTags.value.map(tag =>
                  <div class={[s.tag, s.selected]}>
                    <div class={s.sign}>
                      {tag.sign}
                    </div>
                    <div class={s.name}>
                      {tag.name}
                    </div>
                  </div>
                )}
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad />
            </div>
              </div>
            </>
          }}
        </MainLayout>
      </div>
    )
  }
})