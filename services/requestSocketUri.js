import { httpClient } from  './request.js'

export const getWsEntry = async () => {
  return await httpClient.get("/gateway/bot").then((res) => {
    if (!res.data) throw new Error("获取ws连接信息异常");
    console.log("已获取到Ws入口点: " + res?.data?.url);
    return res.data;
  }).catch((err) => {
    console.error("获取ws连接信息异常: " + err);
    throw err
  });
}