import { faker } from '@faker-js/faker'
import { AxiosRequestConfig } from 'axios';

type Mock = (config: AxiosRequestConfig) => [number, any]

faker.setLocale('zh_CN');

export const mockSession: Mock = (config) => {
  return [200, {
    jwt: faker.random.word()
  }]
}


export const mockTagIndex: Mock = (config) => {
  let id = 0
  const createId = () => {
    id += 1
    return id
  }
  const createTag = (n = 1, attrs?: any) => Array.from({ length: n }).map(() => ({
    id: createId(),
    name: faker.random.word(),
    sign: faker.internet.emoji(),
    category: config.params.kind,
    ...attrs
  }))

  if (config.params.kind === 'expenses') {
    return [200, { resource: createTag(7) }]
  } else {
    return [200, { resource: createTag(20) }]
  }
}
