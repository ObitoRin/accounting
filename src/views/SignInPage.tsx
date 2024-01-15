import { defineComponent, PropType, reactive } from 'vue';
import s from './SignInPage.module.scss';
import { Form, FormItem } from '../shared/Form';
import { validate } from '../shared/validate';
import { MainLayout } from '../layouts/MainLayout';
import { Icon } from '../shared/Icon';
import { Button } from '../shared/Button';

export const SignInPage = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const formData = reactive({
      email: '',
      code: ''
    })
    const errors = reactive({
      email: [],
      code: []
    })
    const onSubmit = (e: Event) => {
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
    }
    const sendValidationCode = () => {
      console.log(1111);
      
    }
    return () => (
      <MainLayout>
        {{
          title: () => '登录',
          icon: () => <Icon name="left" />,
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
                  v-model={formData.code}
                  type="validationCode"
                  label="验证码"
                  placeholder="请输入六位数字"
                  error={errors.code?.[0]}
                  onClick={sendValidationCode}
                />
                <FormItem style={{ paddingTop: '96px' }}>
                  <Button>登录</Button>
                </FormItem>
              </Form>
            </div>
          </>
        }}
      </MainLayout>
    )
  }
})