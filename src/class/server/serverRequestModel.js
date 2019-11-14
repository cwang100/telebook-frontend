export class ServerRequestModel {
  constructor (
    type,
    id,
    metadata,
    status= 'Sent'
  ) {
  	this.type = type
  	this.id = id
  	this.metadata = metadata
  	this.status = status
  }

  getKey () {
    return this.type + ':' + this.id
  }
}
