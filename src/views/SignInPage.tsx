import { defineComponent, PropType, reactive, ref } from 'vue';
import s from './SignInPage.module.scss';
import { Form, FormItem } from '../shared/Form';
import { hasError, validate } from '../shared/validate';
import { MainLayout } from '../layouts/MainLayout';
import { Icon } from '../shared/Icon';
import { Button } from '../shared/Button';
import { http } from '../shared/Http';
import { useBool } from '../hooks/useBool';
import { useRoute, useRouter } from 'vue-router';
import { refreshMe } from '../shared/Me';
import { BackIcon } from '../shared/BackIcon';

export const SignInPage = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const route = useRoute()
    const router = useRouter()
    const formData = reactive({
      email: '',
      code: ''
    })
    const errors = reactive({
      email: [],
      code: []
    })
    const refValidationCode = ref<any>()
    const { ref: refDisabled, disabled, enable } = useBool(false)
    const onSubmit = async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        email: [],
        code: []
      })
      Object.assign(errors, validate(formData, [
        { key: 'email', type: 'required', message: '必填' },
        { key: 'email', type: 'pattern', regexp: /.+@.+/, message: '必须是邮箱地址' },
        { key: 'code', type: 'required', message: '必填' },
      ]))

      if (!hasError(errors)) {
        const response = await http.post<{ jwt: string }>('/session', formData)
          .catch(onError)
        localStorage.setItem('jwt', response!.data.jwt)

        refreshMe()
        // router.push('/sign_in?return_to' + encodeURIComponent(route.fullPath))
        const returnTo = route.query.return_to?.toString()
        router.push(returnTo || '/')
      }
    }
    const onError = (error: any) => {
      if (error.response.status === 422) {
        Object.assign(errors, error.response.data.errors)
      }
    }
    const sendValidationCode = async () => {
      Object.assign(errors, {
        email: [],
      })
      Object.assign(errors, validate(formData, [
        { key: 'email', type: 'required', message: '必填' },
        { key: 'email', type: 'pattern', regexp: /.+@.+/, message: '必须是邮箱地址' },
      ]))
      if (hasError(errors)) return;
      disabled()
      await http.post('/validation_codes', { email: formData.email }, {
        _autoLoading: true
      })
        .catch(onError)
        .finally(enable)
      refValidationCode.value.startCount()
    }
    return () => (
      <MainLayout>
        {{
          title: () => '登录',
          icon: () => <BackIcon />,
          default: () => <>
            <div class={s.wrapper}>
              <div class={s.logo}>
                <Icon class={s.icon} name="mangosteen"></Icon>
                <h1 class={s.appName}>记账</h1>
              </div>
              <Form onSubmit={onSubmit}>
                <FormItem
                  v-model={formData.email}
                  type="text"
                  label="邮箱地址"
                  placeholder="请输入邮箱，然后点击发送验证码"
                  error={errors.email?.[0]}
                />
                <FormItem
                  ref={refValidationCode}
                  v-model={formData.code}
                  type="validationCode"
                  label="验证码"
                  placeholder="请输入六位数字"
                  error={errors.code?.[0]}
                  countFrom={1}
                  disabled={refDisabled.value}
                  onClick={sendValidationCode}
                />
                <FormItem style={{ paddingTop: '96px' }}>
                  <Button type="submit">登录</Button>
                </FormItem>
              </Form>
            </div>
          </>
        }}
      </MainLayout>
    )
  }
})