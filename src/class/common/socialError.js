export class SocialError extends Error {
  constructor (_code, _message) {
    super(_message)
    this._isError = true
    this.isError = true
    this.code = _code
    this._code = _code
    this.message = _message
    this._message = _message
  }
}
