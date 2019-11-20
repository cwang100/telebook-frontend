export class LoginUser {
  constructor (
   uid,
   emailVerified,
   providerId = '',
   displayName = '',
   email = '',
   avatarURL = ''
  ) {
    this.uid = uid
    this.emailVerified = emailVerified
    this.providerId = providerId
    this.displayName = displayName
    this.email = email
    this.avatarURL = avatarURL
  }
}
