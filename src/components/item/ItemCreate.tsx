import { defineComponent, onMounted, PropType, ref } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import s from './ItemCreate.module.scss';
import { Tabs, Tab } from '../../shared/Tabs';
import { InputPad } from './InputPad';
import { http } from '../../shared/Http';
import { Button } from '../../shared/Button';
import { useTags } from '../../hooks/useTags';

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
    const { tags: expensesTag, hasMore, fetchTags } = useTags((page) => {
      return http.get<Resources<Tag>>('/tags', { 
        kind: 'expenses',
        page: page + 1,
        _mock: 'tagIndex',
      })
    })
    const { tags: incomeTags, hasMore: hasMoreIncome, fetchTags: fetchTagsIncome } = useTags((page) => {
      return http.get<Resources<Tag>>('/tags', {
        kind: 'income',
        page: page + 1,
        _mock: 'tagIndex'
      })
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
                  {expensesTag.value.map(tag =>
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
                  {hasMore ? 
                    <Button onClick={fetchTags}>加载更多</Button> :
                    <span>没有更多</span>
                  }
                </div>
              </Tab>
              <Tab name="收入">
                <div class={s.tags_wrapper}>
                  <div class={s.tag}>
                    <div class={s.sign}>
                      <Icon name="add" class={s.createTag} />
                    </div>
                    <div class={s.name}>
                      新增
                    </div>
                  </div>
                  {incomeTags.value.map(tag =>
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
                  {hasMoreIncome ? 
                    <Button onClick={fetchTagsIncome}>加载更多</Button> :
                    <span>没有更多</span>
                  }
                </div>
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