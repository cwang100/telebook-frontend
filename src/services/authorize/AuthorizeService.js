import { firebaseAuth, db } from '../../fireStoreClient'

import { LoginUser, RegisterUserResult } from '../../class/authorize'
import { SocialError } from '../../class/common'

import { OAuthType } from '../../class/authorize/oauthType'
import moment from 'moment/moment'

export class AuthorizeService {
  login(email, password) {
    return new Promise((resolve, reject) => {
      firebaseAuth()
                .signInWithEmailAndPassword(email, password)
                .then((result) => {
                  resolve(new LoginUser(result.uid, result.emailVerified))
                })
                .catch((error) => {
                  reject(new SocialError(error.code, error.message))
                })
    })
  }

  logout() {
    return new Promise((resolve, reject) => {
      firebaseAuth()
                .signOut()
                .then((result) => {
                  resolve()
                })
                .catch((error) => {

                  reject(new SocialError(error.code, error.message))
                })
    })
  }


  registerUser(user) {
    return new Promise((resolve, reject) => {
      firebaseAuth()
                .createUserWithEmailAndPassword(user.email, user.password)
                .then((signupResult) => {
                  const {uid, email} = signupResult.user
                  this.storeUserInformation(uid,email,user.fullName,'').then(resolve)
                })
                .catch((error) => reject(new SocialError(error.code, error.message)))
    })
  }

  updatePassword(newPassword) {
    return new Promise((resolve, reject) => {
      let user = firebaseAuth().currentUser
      if (user) {
        user.updatePassword(newPassword).then(() => {
          resolve()
        }).catch((error) => {
          reject(new SocialError(error.code, error.message))
        })
      }
    })
  }

  onAuthStateChanged(callBack) {
    firebaseAuth().onAuthStateChanged( (user) => {
      let isVerified = false
      if (user) {
        if (user.emailVerified || user.providerData[0].providerId.trim() !== 'password') {
          isVerified = true
        } else {
          isVerified = false
        }
      }
      callBack(isVerified,user)
    })
  }

  resetPassword(email) {
    return new Promise((resolve,reject) => {
      let auth = firebaseAuth()

      auth.sendPasswordResetEmail(email).then(function () {
        resolve()
      }).catch((error) => {
        reject(new SocialError(error.code, error.message))
      })
    })
  }

  sendEmailVerification() {
    return new Promise((resolve,reject) => {
      let auth = firebaseAuth()
      const user = auth.currentUser

      if (user) {
        user.sendEmailVerification().then(() => {
          resolve()
        }).catch((error) => {
          reject(new SocialError(error.code, error.message))
        })
      } else {
        reject(new SocialError('authorizeService/nullException', 'User was null!'))
      }

    })
  }

  loginWithOAuth(type) {
    return new Promise((resolve,reject) => {

      let provider

      switch (type) {
        case OAuthType.GITHUB:
          provider = new firebaseAuth.GithubAuthProvider()
          break
        case OAuthType.FACEBOOK:
          provider = new firebaseAuth.FacebookAuthProvider()
          break
        case OAuthType.GOOGLE:
          provider = new firebaseAuth.GoogleAuthProvider()
          break
        default:
          throw new SocialError('authorizeService/loginWithOAuth','None of OAuth type is matched!')
      }
      firebaseAuth().signInWithPopup(provider).then((result) => {
        let token = result.credential.accessToken
        const {user} = result
        const {credential} = result
        const {uid, displayName, email, photoURL} = user
        const {accessToken, providerId} = credential
        this.storeUserProviderData(uid,email,displayName,photoURL,providerId,accessToken)
        this.storeUserInformation(uid,email,displayName,photoURL).then(resolve)
        resolve(new LoginUser(user.uid,true,providerId,displayName,email,photoURL))

      })
    })
  }


  storeUserInformation(userId, email, fullName, avatar) {
    return new Promise((resolve,reject) => {
      db.doc(`userInfo/${userId}`).set(
        {
          id: userId,
          state: 'active',
          avatar,
          fullName,
          creationDate: moment().unix(),
          email
        }
      )
      .then(() => {
        resolve(new RegisterUserResult(userId))
      })
      .catch((error) => reject(new SocialError(error.name, 'firestore/storeUserInformation : ' + error.message)))
    })
  }


  storeUserProviderData(
    userId,
    email,
    fullName,
    avatar,
    providerId,
    accessToken
  ) {
    return new Promise((resolve,reject) => {
      db.doc(`userProviderInfo/${userId}`)
      .set(
        {
          userId,
          email,
          fullName,
          avatar,
          providerId,
          accessToken
        }
      )
      .then(() => {
        resolve(new RegisterUserResult(userId))
      })
      .catch((error) => reject(new SocialError(error.name, error.message)))
    })
  }
}
