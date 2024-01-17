import { computed, defineComponent, PropType, ref } from 'vue';
import { EmojiSelect } from './EmojiSelect';
import s from './Form.module.scss';
import { DatetimePicker, Popup } from 'vant';
import { Time } from './time';
import { Button } from './Button';
import { getFriendlyError } from './getFriendlyError';

export const Form = defineComponent({
  props: {
    onSubmit: {
      type: Function as PropType<(e: Event) => void>,
    }
  },
  setup: (props, context) => {
    return () => (
      <form class={s.form} onSubmit={props.onSubmit}>
        {context.slots.default?.()}
      </form>
    )
  }
})

export const FormItem = defineComponent({
  props: {
    label: {
      type: String
    },
    modelValue: {
      type: [String, Number]
    },
    type: {
      type: String as PropType<'text' | 'emojiSelect' | 'date' | 'validationCode' | 'select'>,
    },
    error: {
      type: String
    },
    placeholder: String as PropType<string>,
    options: {
      type: Array as PropType<Array<{text: string, value: string}>>
    },
    onClick: Function as PropType<() => void>,
    countFrom: {
      type: Number,
      default: 60
    }
  },
  emits: ['update:modelValue'],
  setup: (props, context) => {
    const refDateVisible = ref(false)
    const timer = ref<number>()
    const count = ref<number>(props.countFrom)
    const isCounting = computed(() => !!timer.value)
    const startCount = () => {
      timer.value = setInterval(() => {
        count.value -= 1
        if (count.value === 0) {
          clearInterval(timer.value)
          timer.value = undefined
          count.value = props.countFrom
        }
      }, 1000)
    }
    context.expose({startCount})
    const content = computed(() => {
      switch (props.type) {
        case 'text':
          return <input
            value={props.modelValue}
            onInput={(e: any) => context.emit('update:modelValue', e.target.value)}
            class={[s.formItem, s.input]} 
            placeholder={props.placeholder}
          />
        case 'select': 
          return <select class={[s.formItem, s.select]} value={props.modelValue} onChange={(e: any) => context.emit('update:modelValue', e.target.value)}>
            {props.options?.map(option => 
              <option value={option.value}>{option.text}</option>
            )}
          </select>
        case 'emojiSelect':
          return <EmojiSelect
            modelValue={props.modelValue?.toString()}
            onUpdateModelValue={value => context.emit('update:modelValue', value)}
            class={[s.formItem, s.emojiList, s.error]} />
        case 'validationCode': 
          return <>
            <input 
              value={props.modelValue}
              onInput={(e: any) => context.emit('update:modelValue', e.target.value)}
              class={[s.formItem, s.input, s.validationCodeInput]}
              placeholder={props.placeholder}
            />
            <Button class={[s.formItem, s.button, s.validationCodeButton]}
              disabled={isCounting.value}
              onClick={props.onClick}
            >
              {isCounting.value ? `${count.value}秒后可重新发送` : '发送验证码'}
            </Button>
          </>
        case 'date':
          return <>
            <input
              readonly={true}
              value={props.modelValue}
              onClick={() => refDateVisible.value = true}
              class={[s.formItem, s.input]}
              placeholder={props.placeholder}
            />
            <Popup position='bottom' v-model:show={refDateVisible.value}>
              <DatetimePicker
                value={refDateVisible.value}
                type="date"
                title="选择年月日"
                onConfirm={(date: Date) => {
                  context.emit('update:modelValue', new Time(date).format())
                  refDateVisible.value = false
                }}
                onCancel={() => refDateVisible.value = false}
              />
            </Popup>
          </>
        case undefined:
          return context.slots.default?.()
      }
    })
    return () => {
      return <div class={s.formRow}>
        <label class={s.formLabel}>
          {props.label &&
            <span class={s.formItem_name}>{props.label}</span>
          }
          <div class={s.formItem_value}>
            {content.value}
          </div>
          <div class={s.formItem_errorHint}>
            <span>{props.error ? getFriendlyError(props.error) : '　'}</span>
          </div>
        </label>
      </div>
    }
  }
})