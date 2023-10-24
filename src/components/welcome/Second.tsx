import { defineComponent } from 'vue';
import s from './First.module.scss';
import clock from '../../assets/icons/clock.svg';
import { RouterLink } from 'vue-router';

export const Second = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.card}>
          <img src={clock} />
          <h2>会挣钱<br />还要会省钱</h2>
        </div>
        <div class={s.actions}>
          <RouterLink class={s.fake} to="/start" >跳过</RouterLink>
          <RouterLink to="/welcome/3">下一页</RouterLink>
          <RouterLink to="/start" >跳过</RouterLink>
        </div>
      </div>
    )
  }
})