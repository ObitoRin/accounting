interface FData {
  [k: string]: string | number | null | undefined | FData
}

type Rule<T> = {
  key: keyof T;
  message: string;
} & (
    { type: 'required' } |
    { type: 'pattern', regexp: RegExp }
  )
type Rules<T> = Rule<T>[]

export type { FData, Rule, Rules }

export const validate = <T extends FData>(formData: T, rules: Rules<T>) => {
  type Errors = {
    [k in keyof T]?: string[]
  }
  const errors: Errors = {}
  rules.forEach(rule => {
    const { key, type, message } = rule
    const value = formData[key]

    switch (type) {
      case 'required':
        if (isEmpty(value)) {
          errors[key] = errors[key] ?? []
          errors[key]?.push(message)
        }
        break;
      case 'pattern':
        if (!isEmpty(value) && !rule.regexp.test(value!.toString())) {
          errors[key] = errors[key] ?? []
          errors[key]?.push(message)
        }
        break;
      default:
        return
    }
  })
  return errors
}

function isEmpty(value: null | undefined | string | number | FData) {
  return value === null || value === undefined || value === ''
}