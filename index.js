// 3889461270
import robot from 'qq-guild-bot'
import { WebSocket } from 'ws'

import { config, Opcode, Intends, MessageType, FileType } from './config.js'
import { toObject } from './utils/format.js'
import { getToken } from './services/requestToken.js'
import { setAccessToken, getAccessToken, getSessionId, setSessionId, getOpenId, setOpenId, getMsg, setMsg, clearMsg } from './data.js'
import { getWsEntry } from './services/requestSocketUri.js'

import { send } from './services/sendMessage.js'

const connectWs = async () => {
  const { url } = await getWsEntry()
  const accessToken = getAccessToken()
  if (!url) {
    console.error("未获取到入口点url");
    return;
  }
  const ws = new WebSocket(url, {
    headers: {
      Authorization: `QQBot ${accessToken}`,
      "X-Union-Appid": config.sk,
    },
  });
  const sendWs = (data) => {
    return new Promise((resolve, reject) => {
      try {
        const res = ws.send(
          typeof data === "string" ? data : JSON.stringify(data),
          (error) => {
            if (error) {
              reject(error);
            }
          }
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
      resolve(undefined);
    });
  };
  const authSession = () => {
    console.log("开始鉴权....");
    sendWs({
      op: Opcode.IDENTIFY,
      d: {
        token: `QQBot ${accessToken}`,
        intents: Intends.GROUP_AT_MESSAGE_CREATE | Intends.DIRECT_MESSAGE,
        shard: [0, 1], // 分片信息,给一个默认值
      },
    });
  };
  const sendHeartbeatEvent = () => {
    sendWs({
      op: Opcode.HEARTBEAT,
      d: getSessionId(),
    });
  };
  const initHeartbeatService = (heartbeatInterval) => {
    const id = setInterval(() => {
      if (wsInstance.closed) {
        clearInterval(id);
        return;
      }
      sendHeartbeatEvent();
    }, heartbeatInterval);
  };
  let wsInstance = Object.assign(ws, {
    closed: false,
    sendWs,
    authSession,
    initHeartbeatService,
  });
  return ws;
};

const startWS = async (cb) => {
  const ws = await connectWs()
  ws.on('message', stream => {
    const raw = toObject(stream)
    console.log('******************************************************************************************');
    console.log(raw);
    setSessionId(raw?.s)
    switch (raw?.op) {
      //Hello事件，表示登陆成功
      case Opcode.HELLO: {
        //注册心跳事件
        // saveBotInfo({
        //   heartbeat_interval: raw.d.heartbeat_interval,
        // });
        ws.initHeartbeatService(raw.d.heartbeat_interval);
        //开始鉴权
        const { access_token } = getToken();
        ws.authSession(access_token);
        break;
      }
      //Ready事件,表示鉴权成功,可获得bot基础信息
      case Opcode.DISPATCH: {
        const d = raw.d;
        // saveBotInfo(d.user);
          setOpenId({ member: d.author?.member_openid, group: d?.group_openid })
          if(cb && typeof cb === 'function') {
            cb(raw)
          }
        break;
      }
    }
  })

  return {
    //回复群聊中的艾特消息
    sendUserPlain: async (openId, content, params) => {
      return await send({ content, openId, msg_type: MessageType.TEXT, ...params }, "user");
    },

    // sendUserImage: async (openId, content, fileData) => {
    //   const res = await uploadMedia({
    //     openId,
    //     fileType: FileType.Image,
    //     fileData: fileData,
    //     targetType: "user",
    //   });
    //   return await replyAt(
    //     {
    //       content,
    //       openId,
    //       media: {
    //         file_info: res.file_info,
    //       },
    //       msg_type: MessageType.MEDIA,
    //     },
    //     "user"
    //   );
    // },

    sendUserMarkDown: async (openId, markdown, content, params) => {
      return await send({ markdown, content, openId, msg_type: MessageType.MARKDOWN, ...params }, "user");
    },

    sendGroupPlain: async (groupOpenId, content, params) => {
      return await send({ content, groupOpenId: groupOpenId, msg_type: MessageType.TEXT, ...params }, "group");
    },

    // sendGroupImage: async (
    //   groupOpenId,
    //   content,
    //   fileData
    // ) => {
    //   const res = await uploadMedia({
    //     groupOpenId,
    //     fileType: FileType.Image,
    //     fileData: fileData,
    //     targetType: "group",
    //   });
    //   return await send(
    //     {
    //       content,
    //       groupOpenId,
    //       media: {
    //         file_info: res.file_info,
    //       },
    //       msg_type: MessageType.MEDIA,
    //     },
    //     "group"
    //   );
    // },

    sendGroupMarkdown: async (groupOpenId, markdown, content, params) => {
      return await send({ markdown, content, groupOpenId: groupOpenId, msg_type: MessageType.MARKDOWN, ...params }, "group");
    },
  }
}
async function main() {
  function getMessageCb(raw) {
    const { member, group } = getOpenId()
    if(member && group) {
      const reply = handle(raw)
      sendGroupPlain(group, reply, {
        event_id: raw.id,
        msg_id: raw?.d?.id
      })
    }
  }
  const { sendUserPlain, sendUserMarkDown, sendGroupPlain, sendGroupMarkdown } = await startWS(getMessageCb)
}

main()

/**
 * @param {*} attachments
 * {
 *  content: '',
 *  content_type: 'image/gif',
 *  filename: '314DB052C1847C0B51794CE3EFF22482.jpg',
 *  height: 80,
 *  size: 5167,
 *  url: 'https://multimedia.nt.qq.com.cn/download?appid=1407&fileid=EhQXCYhONKFOuNYfj_EkuvK5CX5ZIhivKCD_Ciiv56aLwZyKAzIEcHJvZFCAvaMBWhDDcVjKfhEfOxvjqBhS8czX&rkey=CAISKHim-nm2GSiH8Fjz41DRNrw_-bXWZFVr6Ir7aVs_sa9hF6TGBiIpnPY&spec=0',
 *  width: 80
 * }
 * @returns
 */

const orders = {
  '帮助': -1,
  '设置': 0,
  '获取': 1,
  '清除': 2,
}
function handle(raw) {
  let content = raw?.d?.content
  let attachments = raw?.d?.attachments
  if(!content) {
    return
  }

  let message = ''
  content = content.trim()
  const order = orders[content.replace(/^([^ ]*) +(.*)/g, '$1')]
  const userId = raw?.d?.author?.member_openid
  if(order !== undefined) {
    switch (order) {
      case -1:
        message = '[帮助 设置 获取 清楚] + 空格 + 要保存的信息(仅设置时需要)'
        break
      case 0:
        const willSave = content.replace(/^(\S)\s+.*$/g, '$2').trim()
        if(willSave === null || willSave === '' || willSave === undefined) {
          message = '保存的信息不能为空'
        } else {
          setMsg({
            [userId ? userId : 'global']: content.replace(/^([^ ]*) +(.*)/g, '$2')
          })
          message = '保存成功'
        }
        break;
      case 1:
        message = getMsg()[userId] || getMsg().global || '保存的信息走丢了'
        break
      case 2:
        clearMsg(userId)
        message = '成功清楚你的信息'
        break
      default:
        break;
    }
    return message
  } else {
    message = '请输入正确的指令'
    return message
  }
}