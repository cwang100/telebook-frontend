
import { MessageActionType } from '../constants/messageActionType'
import NodeRSA from 'node-rsa'
import * as globalActions from './globalActions'
import * as userActions from './userActions'

import { MessageService } from '../services'

let messageService = new MessageService()

export const dbAddMessage = (userId2, message, publicKey, selfPublicKey) => {
  const key = new NodeRSA()
  key.importKey(publicKey, 'pkcs8-public-pem');
  const encryptedMessage = key.encrypt(message, 'base64');

  const key2 = new NodeRSA()
  key2.importKey(selfPublicKey, 'pkcs8-public-pem');
  const selfEncrypted = key2.encrypt(message, 'base64');
  return (dispatch, getState) => {
    let uid = getState().authorize.get('uid')
    return messageService.addMessage(uid, userId2, encryptedMessage, selfEncrypted)
      .then((result) => {
        let id = result[0].id
        dispatch(addMessage({id: id, fromUser:uid, toUser: userId2, content: message}))
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

          Object.keys(messages).forEach(key => {
            const msg = messages[key]
            const targetUser = msg.fromUser == uid ? msg.toUser : msg.fromUser

            let user = getState().user
            let info = user ? user.get('info') : undefined
            let id = info ? info.get(targetUser) : undefined
            if (!id) {
              dispatch(userActions.dbGetUserInfoByUserId(targetUser,''))
            }

            if (parsedMessages[targetUser] == undefined) {
              parsedMessages[targetUser] = [msg]
            } else {
              parsedMessages[targetUser].push(msg)
            }
          })
          Object.keys(parsedMessages).forEach(key => {
            let old_arr = parsedMessages[key]
            let new_arr = old_arr.reverse()
            parsedMessages[key] = new_arr
          })
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
