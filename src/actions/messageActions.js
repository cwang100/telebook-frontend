
import { MessageActionType } from '../constants/messageActionType'
import NodeRSA from 'node-rsa'
import * as globalActions from './globalActions'
import * as userActions from './userActions'

import { MessageService } from '../services'

let messageService = new MessageService()

export const dbAddMessage = (userId2, message, publicKey) => {
  const key = new NodeRSA()
  key.importKey(publicKey, 'pkcs8-public-pem');
  const encryptedMessage = key.encrypt(message, 'base64');
  return (dispatch, getState) => {
    let uid = getState().authorize.get('uid')
    return messageService.addMessage(uid, userId2, encryptedMessage)
      .then(() => {
        dispatch(addMessage({fromUser:uid, toUser: userId2, content: message}))
      })
  }
}

export const dbGetMessage = () => {
  return (dispatch , getState) => {
    let uid = getState().authorize.get('uid')
    if (uid) {
      return messageService.getAllMessages(uid,
        (messages) => {
          let parsedMessages = {}

          Object.keys(messages).forEach((key => {
            let user = getState().user
            let info = user ? user.get('info') : undefined
            let id = info ? info.get(messages[key].fromUser) : undefined
            if (!id) {
              dispatch(userActions.dbGetUserInfoByUserId(messages[key].fromUser,''))
            }
            const msg = messages[key]
            parsedMessages[msg.fromUser] = msg
          }))
          dispatch(receiveMessage(parsedMessages))
        })
    }
  }
}

export const addMessage = (notify) => {
  return {
    type: MessageActionType.ADD,
    payload: notify
  }
}

export const receiveMessage = (messages) => {
  return {
    type: MessageActionType.RECEIVE,
    payload: messages
  }
}
