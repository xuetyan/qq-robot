import axios from 'axios'

import { config } from '../config.js'

export const getToken = async () => {
  return new Promise((resolve, reject) => {
    axios
      .post("https://bots.qq.com/app/getAppAccessToken", {
        appId: config.appID,
        clientSecret: config.sk,
      })
      .then((res) => {
        if (res.status === 200 && res.data && typeof res.data === "object") {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}