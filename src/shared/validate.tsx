interface FData {
  [k: string]: JSONValue
}

type Rule<T> = {
  key: keyof T;
  message: string;
} & (
    { type: 'required' } |
    { type: 'pattern', regexp: RegExp } |
    { type: 'notEqual', value: JSONValue }
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
        if (isEmpty(value) || value.length === 0) {
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
      case 'notEqual':
        if (!isEmpty(value) && value === rule.value) {
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

export function hasError(errors: Record<string, string[]>) {
  // return Object.values(errors).reduce((result, value) => result + value.length, 0) > 0
  // return Object.values(errors).some(value => value.length > 0)

  let result = false
  for (let key in errors) {
    if (errors[key]?.length > 0) {
      result = true
      break
    }
  }
  return result
}