import { defineComponent } from 'vue';
import s from './First.module.scss';
import chart from '../../assets/icons/chart.svg';
import { RouterLink } from 'vue-router';
import { WelcomeLayout } from './WelcomeLayout';

export const Third = defineComponent({
  setup: (props, context) => {
    return () => (
      <WelcomeLayout>
        {{
          icon: () => <img src={chart} />,
          title: () => <h2>会挣钱<br />还要会省钱</h2>,
          buttons: () => <>
            <RouterLink class={s.fake} to="/start" >跳过</RouterLink>
            <RouterLink to="/welcome/4">下一页</RouterLink>
            <RouterLink to="/start" >跳过</RouterLink>
          </>
        }}
      </WelcomeLayout>
    )
  }



})
// <div class={s.wrapper}>
//   <div class={s.card}>
//     <img src={chart} />
//     <h2>会挣钱<br />还要会省钱</h2>
//   </div>
//   <div class={s.actions}>
//     <RouterLink class={s.fake} to="/start" >跳过</RouterLink>
//     <RouterLink to="/welcome/4">下一页</RouterLink>
//     <RouterLink to="/start" >跳过</RouterLink>
//   </div>
// </div>

