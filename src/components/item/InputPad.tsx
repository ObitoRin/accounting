import { defineComponent, PropType } from 'vue';
import s from './InputPad.module.scss';
import { Icon } from '../../shared/Icon';
export const InputPad = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const buttons = [
      { text: '1', onClick: () => { } },
      { text: '2', onClick: () => { } },
      { text: '3', onClick: () => { } },
      { text: '清空', onClick: () => { } },
      { text: '4', onClick: () => { } },
      { text: '5', onClick: () => { } },
      { text: '6', onClick: () => { } },
      { text: '+', onClick: () => { } },
      { text: '7', onClick: () => { } },
      { text: '8', onClick: () => { } },
      { text: '9', onClick: () => { } },
      { text: '-', onClick: () => { } },
      { text: '.', onClick: () => { } },
      { text: '0', onClick: () => { } },
      { text: '删', onClick: () => { } },
      { text: '提交', onClick: () => { } },
    ]
    return () => <>
      <div>
        <span class={s.date}>
          <Icon name="notes" />
          <span>2020-11-11</span>
        </span>
        <span class={s.amount}>199.66</span>
      </div>
      <div class={s.buttons}>
        {buttons.map(item => <button onClick={item.onClick}>{item.text}</button>)}
      </div>
    </>
  }
})