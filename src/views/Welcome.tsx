import { defineComponent, ref, Transition, VNode, watchEffect } from 'vue';
import { RouteLocationNormalizedLoaded, RouterView, useRoute, useRouter } from 'vue-router';
import s from './Welcome.module.scss';
import { useSwipe } from '../hooks/useSwipe';
import { throttle } from '../config/throttle';

export const Welcome = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const route = useRoute()
    const main = ref<HTMLElement>()
    const { direction, swiping } = useSwipe(main, { beforeStart: (e) => e.preventDefault() })

    const replace = throttle(() => {
      if (route.name === 'Welcome1') {
        router.replace('/welcome/2')
      } else if (route.name === 'Welcome2') {
        router.replace('/welcome/3')
      } else if (route.name === 'Welcome3') {
        router.replace('/welcome/4')
      } else if (route.name === 'Welcome4') {
        router.replace('/start')
      }
    }, 500)

    watchEffect(() => {
      if (swiping.value && direction.value === 'left') {
        replace()
      }
    })

    return () => (<div class={s.wrapper}>
      <header >
        <svg>
          <use xlinkHref='#mangosteen'></use>
        </svg>
        <h1>山竹记账</h1>
      </header>
      <main class={s.main} ref={main}>
        <RouterView name="main">
          {({ Component: X, route: R }: { Component: VNode, route: RouteLocationNormalizedLoaded }) =>
            <Transition
              enterFromClass={s.slide_fade_enter_from}
              enterActiveClass={s.slide_fade_enter_active}
              leaveToClass={s.slide_fade_leave_to}
              leaveActiveClass={s.slide_fade_leave_active}
            >
              {X}
            </Transition>
          }
        </RouterView>
      </main>
      <footer class={s.footer}><RouterView name="footer" /></footer>
    </div>
    )
  }
})