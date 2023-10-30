import { defineComponent, ref } from 'vue';
import { Button } from '../shared/Button';
import s from './StartPage.module.scss'
import { FloatButton } from '../shared/FloatButton';
import { Center } from '../shared/Center';
import { Icon } from '../shared/Icon';
import { Overlay } from '../shared/Overlay';
import { RouterLink } from 'vue-router';
import { MainLayout } from './layouts/MainLayout';

export const StartPage = defineComponent({
  setup: (props, context) => {
    const refOverlayVisible = ref<boolean>(false)
    const onClickMenu = () => {
      refOverlayVisible.value = !refOverlayVisible.value
    }

    return () => (
      <MainLayout>
        {{
          title: () => '记账',
          icon: () => <Icon name='menu' class={s.navIcon} onClick={onClickMenu} />,
          default: () => <>
            <Center class={s.pig_wrapper}>
              <Icon name="pig" class={s.pig} />
            </Center>
            <div class={s.button_wrapper}>
              <RouterLink to="/items/create">
                <Button class={s.button}>开始记账</Button>
              </RouterLink>
            </div>
            <RouterLink to="/items/create">
              <FloatButton name='add' />
            </RouterLink>
            {refOverlayVisible.value &&
              <Overlay onClose={() => refOverlayVisible.value = false} />
            }
          </>
        }}
      </MainLayout>
    )
  }
})