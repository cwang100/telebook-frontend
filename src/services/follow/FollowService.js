import * as moment from 'moment/moment'
import { firebaseRef, firebaseAuth, db } from '../../fireStoreClient'

export class FollowService {
  addFollow(userId1, userId2) {
    return new Promise((resolve,reject) => {
      let followRef = db.collection(`follow`).doc()
      followRef.set({
        id: followRef.id, 
        user1: userId1, 
        user2: userId2,
        time: moment().unix()
      }).then((result) => {
        resolve(result)
      })
    })
  }

  getAllFollowers(userId) {
    return new Promise((resolve,reject) => {
      let parsedData = []
      db.collection(`follow`).where('user1', '==', userId).get().then((query) => {
        query.forEach((result) => {
          parsedData.push(result.data().user2)
        })
        return db.collection(`follow`).where('user2', '==', userId).get()
      }).then((query) => {
        query.forEach((result) => {
          parsedData.push(result.data().user1)
        })
        
        resolve(parsedData)
      })
    })
  }
}
