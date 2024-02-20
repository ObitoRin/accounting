import { defineComponent, onMounted, PropType, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import s from './Overlay.module.scss';
import { Dialog } from 'vant';
import { useMeStore } from '../stores/useMeStore';

type Action = {
  to: string;
  iconName: IconName;
  text: string;
}

export const Overlay = defineComponent({
  props: {
    onClose: Function as PropType<() => void>
  },
  setup: (props, context) => {
    const meStore = useMeStore()
    const route = useRoute()
    const me = ref()
    onMounted(async () => {
      const response = await meStore.mePromise
      me.value = response?.data.resource
    })
    const onSignOut = async () => {
      await Dialog.confirm({
        title: '提示',
        message: '你真的要退出登录吗？'
      })
      localStorage.removeItem('jwt')
      window.location.reload()
    }
    const actionList: Action[] = [
      { to: '/items', iconName: 'pig', text: '记账' },
      { to: '/statistics', iconName: 'charts', text: '统计图表' },
      { to: '/export', iconName: 'export', text: '导出数据' },
      { to: '/notify', iconName: 'notify', text: '记账提醒' },
    ]
    return () => <>
      <div class={s.mask} onClick={props?.onClose}></div>
      <div class={s.overlay}>
        <section class={s.currentUser}>
          {me.value ?
            <div>
              <h2 class={s.email}>{me.value.email}</h2>
              <p onClick={onSignOut}>点击这里退出登录</p>
            </div>
            :
            <RouterLink to={`/sign_in?return_to=${route.fullPath}`}>
              <h2>未登录用户</h2>
              <p>点击这里登录</p>
            </RouterLink>
          }
        </section>
        <nav>
          <ul class={s.action_list}>
            {actionList.map(item =>
              <li class={route.fullPath === item.to ? s.active : ''}>
                <RouterLink to={item.to} class={s.action}>
                  <Icon name={item.iconName} class={s.icon} />
                  <span>{item.text}</span>
                </RouterLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  }
})

export const OverlayIcon = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refOverlayVisible = ref<boolean>(false)
    const onClickMenu = () => {
      refOverlayVisible.value = !refOverlayVisible.value
    }
    return () => <>
      <Icon name='menu' class={s.icon} onClick={onClickMenu} />
      {refOverlayVisible.value &&
        <Overlay onClose={() => refOverlayVisible.value = false} />
      }
    </>
  }
})
