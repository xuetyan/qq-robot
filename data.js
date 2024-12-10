/**
 * {
 *   userId: {},
 *   global: {}
 * }
 */
const msg = {}

const accessToken = {
  value: ''
}

const sessionId = {
  value: ''
}

const openId = {
  group: '',
  member: ''
}

export function getAccessToken() {
  return accessToken.value
}

export function setAccessToken(val) {
  accessToken.value = val
}

export function getSessionId() {
  return sessionId.value
}

export function setSessionId(val) {
  sessionId.value = val
}

export function getOpenId() {
  return openId
}

export function setOpenId(val) {
  Object.assign(openId, { ...val })
}

export function getMsg() {
  return msg
}

export function setMsg(val) {
  Object.assign(msg, { ...val })
}

export function clearMsg(userId) {
  delete msg[userId]
}