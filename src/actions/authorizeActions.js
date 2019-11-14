
import { push } from 'connected-react-router'
import { User } from '../class/users'
import { AuthorizeActionType } from '../constants/authorizeActionType'

import * as globalActions from './globalActions'

import { AuthorizeService } from '../services'

let authorizeService = new AuthorizeService()

export const login = (uid, isVerified) => {
  return {
    type: AuthorizeActionType.LOGIN,
    payload: { authed: true, isVerified, uid }
  }
}


export const logout = () => {
  return { type: AuthorizeActionType.LOGOUT }
}

export const signup = (user) => {
  return {
    type: AuthorizeActionType.SIGNUP,
    payload: { ...user }
  }

}

export const updatePassword = () => {
  return { type: AuthorizeActionType.UPDATE_PASSWORD }
}

export const dbLogin = (email, password) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())
    return authorizeService.login(email, password).then((result) => {
      dispatch(globalActions.showNotificationSuccess())
      dispatch(login(result.uid, result.emailVerified))
      dispatch(push('/'))
    }, (error) => dispatch(globalActions.showMessage(error.code)))
  }
}

export const dbLogout = () => {
  return (dispatch, getState) => {
    return authorizeService.logout().then((result) => {
      dispatch(logout())
      dispatch(push('/login'))

    }, (error) => dispatch(globalActions.showMessage(error.code)))
  }

}

export const dbSendEmailVerfication = () => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())

    return authorizeService.sendEmailVerification().then(() => {
      dispatch(globalActions.showNotificationSuccess())
      dispatch(push('/'))
    })
      .catch((error) => {
        dispatch(globalActions.showMessage(error.code))
      })
  }
}

export const dbSignup = (user) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())
    let newUser = new User()
    newUser.email = user.email
    newUser.password = user.password
    newUser.fullName = user.fullName

    return authorizeService.registerUser(newUser).then((result) => {
      dispatch(signup({
        userId: result.uid,
        ...user
      }))
      dispatch(dbSendEmailVerfication())
      dispatch(push('/emailVerification'))
    })
      .catch((error) => dispatch(globalActions.showMessage(error.code)))
  }

}

export const dbUpdatePassword = (newPassword) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())

    return authorizeService.updatePassword(newPassword).then(() => {
      dispatch(globalActions.showNotificationSuccess())
      dispatch(updatePassword())
      dispatch(push('/'))
    })
      .catch((error) => {
        switch (error.code) {
          case 'auth/requires-recent-login':
            dispatch(globalActions.showMessage(error.code))
            dispatch(dbLogout())
            break
          default:

        }
      })
  }
}

export const dbResetPassword = (email) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())

    return authorizeService.resetPassword(email).then(() => {
      dispatch(globalActions.showNotificationSuccess())
      dispatch(push('/login'))
    })
      .catch((error) => {
        dispatch(globalActions.showMessage(error.code))
      })
  }
}

export const dbLoginWithOAuth = (type) => {
  return (dispatch, getState) => {
    dispatch(globalActions.showNotificationRequest())

    return authorizeService.loginWithOAuth(type).then((result) => {
      dispatch(globalActions.showNotificationSuccess())
      dispatch(login(result.uid, true))
      dispatch(push('/'))
    })
    .catch((error) => {
      dispatch(globalActions.showMessage(error.code))
    })
  }
}
