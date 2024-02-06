import { AxiosResponse } from "axios";
import { http } from "./Http";

export let promiseMe: Promise<AxiosResponse<Resource<User>>> | undefined

export const refreshMe = () => {
  promiseMe = http.get<Resource<User>>('/me')
  return promiseMe
}

export const fetchMe = refreshMe
