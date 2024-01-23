import { AxiosResponse } from "axios";
import { http } from "./Http";

export let promiseMe: Promise<AxiosResponse<{
  resources: {
    id: number;
  };
}>> | undefined

export const refreshMe = () => {
  promiseMe = http.get<{ resources: { id: number } }>('/me')
  return promiseMe
}

export const fetchMe = refreshMe
