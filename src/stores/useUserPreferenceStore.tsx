import { defineStore } from 'pinia'

type UserPreferenceState = {
  selected: '本月' | '上月' | '今年' | '自定义时间';
  kind: 'expenses' | 'income';
  kindAccount: 'expenses' | 'income';
}
type UserPreferenceActions = {
  changeSelected: (selected: UserPreferenceState['selected']) => void;
  changeKind: (kind: UserPreferenceState['kind']) => void;
  changeKindAccount: (kindAccount: UserPreferenceState['kindAccount']) => void;
  getUserPreference: (value: string) => void;
}

export const useUserPreferenceStore = defineStore<string, UserPreferenceState, {}, UserPreferenceActions>('userPreference', {
  state: () => ({
    selected: '本月',
    kind: 'expenses',
    // 统计时下拉支出和收入
    kindAccount: 'expenses'
  }),
  actions: {
    changeSelected(selected: UserPreferenceState['selected']) {
      this.selected = selected
    },
    changeKind(kind: UserPreferenceState['kind']) {
      this.kind = kind
    },
    changeKindAccount(kindAccount: UserPreferenceState['kindAccount']) {
      this.kindAccount = kindAccount
    },
    getUserPreference(value: string | undefined) {
      if (!value) {
        return
      }
      const userPreference = JSON.parse(value)
      this.selected = userPreference.selected
      this.kind = userPreference.kind
      this.kindAccount = userPreference.kindAccount
    }
  }
})