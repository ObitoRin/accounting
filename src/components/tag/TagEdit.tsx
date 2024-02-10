import { defineComponent } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { TagForm } from './TagForm';
import { Button } from '../../shared/Button';
import s from './Tag.module.scss';
import { BackIcon } from '../../shared/BackIcon';
import { useRoute, useRouter } from 'vue-router';
import { http } from '../../shared/Http';
import { AxiosError } from 'axios';
import { Dialog } from 'vant';

export const TagEdit = defineComponent({
  setup: (props, context) => {
    const route = useRoute()
    const numberId = parseInt(route.params.id.toString())
    if (Number.isNaN(numberId)) {
      return () => <div>id 不存在</div>
    }
    const router = useRouter()
    const onError = (error: AxiosError) => {
      Dialog.alert({ title: '提示', message: '删除失败' })
    }
    const onDelete = async (options?: { withItems?: boolean }) => {
      await Dialog.confirm({ title: '确认', message: '你真的要删除吗？' })
      await http.delete(`/tags/${numberId}`, {
        withItems: options?.withItems ? 'true' : 'false'
      }, { _autoLoading: true }).catch(onError)
      router.back()
    }
    return () => (
      <MainLayout>{{
        title: () => '编辑标签',
        icon: () => <BackIcon />,
        default: () => <>
          <TagForm id={numberId} />
          <div class={s.actions}>
            <Button level="danger" class={s.removeTags} onClick={() => onDelete()}>删除标签</Button>
            <Button level="danger" class={s.removeTagsAndItems} onClick={() => onDelete({ withItems: true })}>删除标签和记账</Button>
          </div>
        </>
      }}</MainLayout>
    )
  }
})