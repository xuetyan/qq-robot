import { omit } from '../utils/omit.js'
import { httpClient } from './request.js'

/**
 *
 * @param {*} params
 * {
    openId?: string;
    groupOpenId?: string;
    content?: string; // 文本内容
    msg_type: MessageType; // 消息类型
    markdown?: MarkdownObject; // 可选的 Markdown 对象
    keyboard?: KeyboardObject; // 可选的 Keyboard 对象
    media?: MediaObject; // 可选的 富媒体对象
    ark?: ArkObject; // 可选的 Ark 对象
    message_reference?: MessageReference; // 可选的 消息引用
    event_id?: string; // 可选的 前置事件 ID
    msg_id?: string; // 前置消息 ID
    msg_seq?: number; // 可选的 回复消息序号
  };
 */
export async function replyGroupAt(params) {
  const { groupOpenId } = params;
  const apiUrl = `/v2/groups/${groupOpenId}/messages`;
  try {
    const response = await httpClient.post(
      apiUrl,
      omit(params, ["groupOpenId", "openId"])
    );
    return response.data; // 返回响应数据
  } catch (error) {
    console.error("Error sending media file:", error);
    throw error; // 抛出错误以便处理
  }
  return undefined;
}

export async function replyUserAt(params) {
  const { openId } = params;
  const apiUrl = `/v2/users/${openId}/messages`;
  try {
    const response = await httpClient.post(
      apiUrl,
      omit(params, ["groupOpenId", "openId"])
    );
    return response.data; // 返回响应数据
  } catch (error) {
    console.error("Error sending media file:", error);
    throw error; // 抛出错误以便处理
  }
}

// type = "user" | "group";
export async function replyAt(params, type) {
  if (type === "group") {
    return replyGroupAt(params);
  }
  if (type === "user") {
    return replyUserAt(params);
  }
}

// params Omit<Params, "msg_id">
export async function send(params, type) {
  if (type === "group") {
    return replyGroupAt(params);
  }
  if (type === "user") {
    return replyUserAt(params);
  }
}