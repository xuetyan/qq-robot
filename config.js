export const config = {
  appID: 'BotAppID', // 申请机器人时获取到的机器人 BotAppID
  token: 'BotToken', // 申请机器人时获取到的机器人 BotToken
  intents: ['PUBLIC_GUILD_MESSAGES', 'GUILD_MEMBERS'], // 事件订阅,用于开启可接收的消息类型 https://bot.q.qq.com/wiki/develop/api/gateway/intents.html
  sandbox: true, // 沙箱支持，可选，默认false. v2.7.0+
  sk: ''
}

export const Opcode  = {
  DISPATCH: 0, // 服务端进行消息推送
  HEARTBEAT: 1, // 客户端或服务端发送心跳
  IDENTIFY: 2, // 客户端发送鉴权
  RESUME: 6, // 客户端恢复连接
  RECONNECT: 7, // 服务端通知客户端重新连接
  INVALID_SESSION: 9, // identify 或 resume 的时候，如果参数有错
  HELLO: 10, // 网关下发的第一条消息
  HEARTBEAT_ACK: 11, // 发送心跳成功后收到的消息
  HTTP_CALLBACK_ACK: 12, // HTTP 回调模式的回包
}

export const Intends = {
  None: 0,
  GUILDS: 1 << 0, // 频道操作事件
  GUILD_MEMBERS: 1 << 1, // 频道成员变更事件
  GUILD_MESSAGES: 1 << 9, // 私域频道消息事件
  GUILD_MESSAGE_REACTIONS: 1 << 10, // 频道消息表态事件
  DIRECT_MESSAGE: 1 << 12, // 频道私信事件
  OPEN_FORUMS_EVENTS: 1 << 18,
  AUDIO_OR_LIVE_CHANNEL_MEMBERS: 1 << 19, // 音频或直播频道成员
  // GROUP_MESSAGE_CREATE: 1 << 24, // 群聊消息事件
  C2C_MESSAGE_CREATE: 1 << 25, // 私聊消息事件
  GROUP_AT_MESSAGE_CREATE: 1 << 25, // 群聊@消息事件
  INTERACTION: 1 << 26, // 互动事件
  MESSAGE_AUDIT: 1 << 27, // 消息审核事件
  FORUMS_EVENTS: 1 << 28, // 论坛事件(仅私域)
  AUDIO_ACTIONS: 1 << 29, // 音频操作事件
  PUBLIC_GUILD_MESSAGES: 1 << 30, // 公域机器人消息事件
}

export const MessageType = {
  TEXT: 0, // 文本
  MARKDOWN: 2, // Markdown
  ARK: 3, // Ark 消息
  EMBED: 4, // Embed
  MEDIA: 7, // 富媒体
}

export const FileType = {
  Image: 1,
  Video: 2,
  Audio: 3,
}