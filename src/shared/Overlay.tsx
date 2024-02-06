import { defineComponent, onMounted, PropType, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Icon } from './Icon';
import s from './Overlay.module.scss';
import { promiseMe } from './Me';
import { Dialog } from 'vant';

export const Overlay = defineComponent({
  props: {
    onClose: Function as PropType<() => void>
  },
  setup: (props, context) => {
    const route = useRoute()
    const me = ref()
    onMounted(async () => {
      const response = await promiseMe
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
            <li>
              <RouterLink to="/statistics" class={s.action}>
                <Icon name="charts" class={s.icon} />
                <span>统计图表</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/export" class={s.action}>
                <Icon name="export" class={s.icon} />
                <span>导出数据</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/notify" class={s.action}>
                <Icon name="notify" class={s.icon} />
                <span>记账提醒</span>
              </RouterLink>
            </li>
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
