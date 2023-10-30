import { defineComponent, PropType, ref } from 'vue';
import s from './InputPad.module.scss';
import { Icon } from '../../shared/Icon';
import { time } from '../../shared/time';
import { DatetimePicker, Popup } from 'vant';

export const InputPad = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const now = new Date()
    const refDate = ref<Date>(now)
    const refDatePickerVisible = ref(false)
    const refAmount = ref('')

    const appendText = (n: string | number) => {
      refAmount.value += n.toString()
    }

    const buttons = [
      { text: '1', onClick: () => { appendText(1) } },
      { text: '2', onClick: () => { appendText(2) } },
      { text: '3', onClick: () => { appendText(3) } },
      { text: '4', onClick: () => { appendText(4) } },
      { text: '5', onClick: () => { appendText(5) } },
      { text: '6', onClick: () => { appendText(6) } },
      { text: '7', onClick: () => { appendText(7) } },
      { text: '8', onClick: () => { appendText(8) } },
      { text: '9', onClick: () => { appendText(9) } },
      { text: '.', onClick: () => { appendText('.') } },
      { text: '0', onClick: () => { appendText(0) } },
      { text: '清空', onClick: () => { refAmount.value = '' } },
      { text: '提交', onClick: () => { } },
    ]

    const showDatePicker = () => refDatePickerVisible.value = true
    const hideDatePicker = () => refDatePickerVisible.value = false
    const setDate = (date: Date) => {
      refDate.value = date;
      hideDatePicker();
    }

    return () => <>
      <div class={s.dateAndAmount}>
        <span class={s.date}>
          <Icon name="notes" class={s.icon} />
          <span onClick={showDatePicker}>{time(refDate.value).format()}</span>
          <Popup v-model:show={refDatePickerVisible.value} position="bottom">
            <DatetimePicker
              value={refDate.value}
              type="date"
              title="选择年月日"
              onConfirm={setDate}
              onCancel={hideDatePicker}
            />
          </Popup>
        </span>
        <span class={s.amount}>{refAmount.value}</span>
      </div>
      <div class={s.buttons}>
        {buttons.map(item => <button onClick={item.onClick}>{item.text}</button>)}
      </div>
    </>
  }
})