import { firebaseRef, firebaseAuth, db } from '../../fireStoreClient'

import { SocialError, Feed } from '../../class/common'

export class CommonService {
  addFeed(feed) {
    return new Promise((resolve, reject) => {
      let feedRef = db.collection(`feeds`).doc()
      feedRef.set({ ...feed, id: feedRef.id })
        .then(() => {
          resolve(feedRef.id)
        })
        .catch((error) => {
          reject(new SocialError(error.code, error.message))
        })
    })
  }
}
