import { FunctionalComponent } from 'vue'
import { RouterLink } from 'vue-router'
import s from './welcome.module.scss'

export const FourthActions: FunctionalComponent = () => {
  return (
    <div class={s.actions}>
      <RouterLink class={s.fake} to="/start" >跳过</RouterLink>
      <RouterLink to="/start">完成</RouterLink>
      <RouterLink class={s.fake} to="/start" >跳过</RouterLink>
    </div>
  )
}

FourthActions.displayName = 'FourthActions'