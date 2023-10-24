import { defineComponent, Transition, VNode } from "vue";
import { RouterView, RouteLocationNormalizedLoaded } from "vue-router";
import './App.scss';

export const App = defineComponent({
  setup() {
    return () => (
      <div class="page">
        <RouterView />
      </div>
    )
  }
})