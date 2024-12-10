import axios from 'axios'

import { getToken } from './requestToken.js'
import { setAccessToken, getAccessToken } from '../data.js'
import { config } from '../config.js'

const sandBoxBaseUrl = 'https://sandbox.api.sgroup.qq.com'
const prodBaseUrl = `https://api.sgroup.qq.com`
const baseURL = config.sandbox ? sandBoxBaseUrl : prodBaseUrl

export const httpClient = axios.create({
  baseURL: baseURL,
});

// 添加请求拦截器
httpClient.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken()
    if(!accessToken) {
      const { access_token } = await getToken(); // 动态获取 access_token
      setAccessToken(access_token)
      accessToken = access_token
    }
    config.headers["Authorization"] = `QQBot ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);