import { UserService } from '../services'

import * as globalActions from './globalActions'

import { UserActionType } from '../constants/userActionType'

let userService = new UserService()
export const dbGetUserInfo = () => {
  return (dispatch, getState) => {
    let uid = getState().authorize.get('uid')
    if (uid) {
      return userService.getUserProfile(uid).then((userProfile) => {
        dispatch(addUserInfo(uid, userProfile))
      })
      .catch((error) => dispatch(globalActions.showMessage(error.message)))

    }
  }
}

export const dbGetUserInfoByUserId = (uid, callerKey) => {
  return (dispatch, getState) => {
    if (uid) {

      let temp = getState().global.get('temp') || {}
      let caller = temp.caller
      if ( caller && caller.indexOf(`dbGetUserInfoByUserId-${uid}`) > -1) {
        return undefined
      }
      dispatch(globalActions.temp({caller: `dbGetUserInfoByUserId-${uid}`}))
      return userService.getUserProfile(uid).then((userProfile) => {

        dispatch(addUserInfo(uid, userProfile))

        switch (callerKey) {
          case 'header':
            dispatch(globalActions.setHeaderTitle(userProfile.fullName))

            break

          default:
            break
        }
      })
      .catch((error) => dispatch(globalActions.showMessage(error.message)))

    }
  }
}

export const dbUpdateUserInfo = (newProfile) => {
  return (dispatch, getState) => {
    console.trace('newProfile', newProfile)
    // Get current user id
    let uid = getState().authorize.get('uid')

    let profile = getState().user.get('info').get(uid).toJS()
    let updatedProfile = {
      avatar: newProfile.avatar || profile.avatar || '',
      banner: newProfile.banner || profile.banner || 'https://firebasestorage.googleapis.com/v0/b/open-social-33d92.appspot.com/o/images%2F751145a1-9488-46fd-a97e-04018665a6d3.JPG?alt=media&token=1a1d5e21-5101-450e-9054-ea4a20e06c57',
      email: newProfile.email || profile.email || '',
      fullName: newProfile.fullName || profile.fullName || '',
      tagLine: newProfile.tagLine || profile.tagLine || '',
      birthday: newProfile.birthday,
      companyName: newProfile.companyName || '',
      webUrl: newProfile.webUrl || '',
      twitterId: newProfile.twitterId || '',
      creationDate: newProfile.creationDate
    }
    return userService.updateUserProfile(uid,updatedProfile).then(() => {

      dispatch(updateUserInfo(uid, updatedProfile))
      dispatch(closeEditProfile())
    })
    .catch((error) => dispatch(globalActions.showMessage(error.message)))

  }
}

export const dbGetPeopleInfo = (page, limit) => {
  return (dispatch, getState) => {
    const state = getState()
    const people = state.user.get('people') || {}
    const lastPageRequest = people.lastPageRequest
    const lastUserId = people.lastUserId

    let uid = state.authorize.get('uid')

    if (uid && lastPageRequest !== page) {

      return userService.getUsersProfile(uid, lastUserId, page, limit).then((result) => {

        if (!result.users || !(result.users.length > 0)) {
          return dispatch(notMoreDataPeople())
        }

        dispatch(lastUserPeople(result.newLastUserId))

        let parsedData: {[userId]: Profile} = {}
        result.users.forEach((post) => {
          const userId = Object.keys(post)[0]
          const postData = post[userId]
          parsedData = {
            ...parsedData,
            [userId]: {
              ...postData
            }
          }
        })
        dispatch(addPeopleInfo(parsedData))
      })
        .catch((error) => dispatch(globalActions.showMessage(error.message)))

    }
  }
}

export const addUserInfo = (uid, info) => {
  return {
    type: UserActionType.ADD_USER_INFO,
    payload: { uid, info }
  }
}

export const addPeopleInfo = (infoList) => {
  return {
    type: UserActionType.ADD_PEOPLE_INFO,
    payload: infoList
  }
}

export const updateUserInfo = (uid, info) => {
  return {
    type: UserActionType.UPDATE_USER_INFO,
    payload: { uid, info }
  }
}

export const clearAllData = () => {
  return {
    type: UserActionType.CLEAR_ALL_DATA_USER
  }
}

export const openEditProfile = () => {
  return {
    type: UserActionType.OPEN_EDIT_PROFILE
  }

}

export const closeEditProfile = () => {
  return {
    type: UserActionType.CLOSE_EDIT_PROFILE
  }

}

export const hasMoreDataPeople = () => {
  return {
    type: UserActionType.HAS_MORE_DATA_PEOPLE
  }
}

export const notMoreDataPeople = () => {
  return {
    type: UserActionType.NOT_MORE_DATA_PEOPLE
  }
}

export const requestPagePeople = (page: number) => {
  return {
    type: UserActionType.REQUEST_PAGE_PEOPLE,
    payload: { page}
  }
}

export const lastUserPeople = (lastUserId: string) => {
  return {
    type: UserActionType.LAST_USER_PEOPLE,
    payload: { lastUserId}
  }
}
