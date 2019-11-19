import * as moment from 'moment/moment'
import { firebaseRef, firebaseAuth, db } from '../../fireStoreClient'

export class MessageService {
  addMessage(userId1, userId2, encryptedMessage, selfEncrypted) {
    return new Promise((resolve,reject) => {
      let promises = []
      promises.push(db.doc(`users/${userId1}`).collection(`messages`)
      .add({
        fromUser: userId1,
        toUser: userId2,
        content: selfEncrypted,
        timestamp: moment().unix()
      }))

      promises.push(db.doc(`users/${userId2}`).collection(`messages`)
      .add({
        fromUser: userId1,
        toUser: userId2,
        content: encryptedMessage,
        timestamp: moment().unix()
      }))
      Promise.all(promises).then((result) => {
        resolve(result)
      })
    })
  }

  getAllMessages(userId, callback) {
    let messagesRef = db.doc(`users/${userId}`).collection(`messages`)
      .orderBy('timestamp', 'desc')
      .limit(50)
    messagesRef.onSnapshot((snapshot) => {
      let parsedData = {}
      snapshot.forEach((result) => {

        parsedData[result.id] = {
          id: result.id,
          ...result.data()
        }
      })
      callback(parsedData)
    })
  }
}
