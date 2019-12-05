// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardHeader, CardContent } from 'material-ui'
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import { grey } from 'material-ui/colors'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
import NodeRSA from 'node-rsa'

import * as messageActions from '../../actions/messageActions'
import * as globalActions from '../../actions/globalActions'

import Grid from 'material-ui/Grid/Grid'

const styles = (theme) => ({
  fullPageXs: {
    width: "600px",
    height: "auto",
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      margin: 0,
      overflowY: 'auto'
    }
  },
  content: {
    padding: 0,
    paddingTop: 0
  },
  dialogRoot: {
    paddingTop: 0
  },
  fromMessage: {
    borderRadius: "5px",
    padding: "2px",
    boxShadow: "0px 0px 3px #B2B2B2",
    backgroundColor: "#F2F2F2"
  },
  toMessage: {
    borderRadius: "5px",
    padding: "2px",
    boxShadow: "0px 0px 3px #8ec38a",
    backgroundColor: "#8ceba3"
  },
  messageBox: {
    display: "flex",
    margin: "5px 0"
  },
  messageBoxRight: {
    justifyContent: "flex-end"
  },
  messageInput: {
    border: "solid",
    borderColor: "#9e9e9e",
    borderRadius: 4,
    marginTop: 10,
    borderWidth: 1,
    boxShadow: "inset 1px 2px 4px rgba(148, 148, 148, 0.32)"
  },
  textBox: { 
    fontWeight: 400, 
    fontSize: '14px', 
    margin: '0 16px', 
    flexShrink: 0, 
    width: 'initial', 
    flexGrow: 1 
  }
})

export class MessageComponent extends Component{
  constructor(props) {
    super(props)

    this.state = {
      disabled: true,
      text: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit = () => {
    const { text } = this.state
    const {addMessage, publicKey, ownPublic} = this.props

    addMessage(text, publicKey, ownPublic)   
  }


  handleOnChange = (event) => {
    const data = event.target.value
    if (data.length === 0 || data.trim() === '') {
      this.setState({
        text: data,
        disabled: true
      })
    } else {
      this.setState({
        text: data,
        disabled: false
      })
    }
  }

  decode = (encrypted) => {
    const key = new NodeRSA()
    const { privateKey, showError } = this.props
    try {
      key.importKey(privateKey, 'pkcs8-private-pem');
      const decrypted = key.decrypt(encrypted, 'utf8');
      return decrypted
    } catch(err) {
      showError(err.message)
    }
  }

  fromMessage = (message) => {
    const { classes } = this.props
    const newMessage = this.decode(message)
    return (<div className={classes.messageBox}>
      <div className={classes.fromMessage}>
        {newMessage}
      </div>
    </div>)
  }

  toMessage = (message) => {
    const { classes } = this.props
      const newMessage = this.decode(message)
      return (<div className={classes.messageBox + " " + classes.messageBoxRight}>
        <div className={classes.toMessage}>
          {newMessage}
        </div>
      </div>)
  }

  processMessages = (messages) => {
    let result = []
    const { uid } = this.props
    Object.keys(messages).forEach((key) => {
      let message = messages[key]
      if (message.fromUser == uid) {
        result.push(this.fromMessage(message.content))
      } else {
        result.push(this.toMessage(message.content))
      }
    })
    return result
  }

  render() {
    const { classes, messages } = this.props
    return (
      <div style={this.props.style}>
        <Dialog
          BackdropProps={{ className: classes.backdrop }}
          PaperProps={{className: classes.fullPageXs}}
          key={this.props.id || 0}
          open={this.props.open || false}
          onClose={this.props.onRequestClose}
        >
          <DialogContent
            className={classes.content}
            style={{ paddingTop: 0 }}
          >

            <Card elevation={0}>
              <CardHeader
                title={'Message'}
              >
              </CardHeader>
              <CardContent>
                <Grid item xs={12}>
                <div>
                  {this.processMessages(messages)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  <div className={classes.messageInput} style={{ position: 'relative', flexDirection: 'column', display: 'flex', flexGrow: 1, overflow: 'hidden', overflowY: 'auto', maxHeight: '300px' }}>
                    <TextField
                      value={this.state.text}
                      onChange={this.handleOnChange}
                      placeholder={'message'}
                      margin="normal"
                      multiline
                      rows={5}
                      className={classes.textBox}
                      variant="outlined"
                    />
                  </div>
                </div>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button
              color='primary'
              disableFocusRipple={true}
              disableRipple={true}
              onClick={this.props.close}
            >
              {'close'}
            </Button>
            <Button
              color='primary'
              disableFocusRipple={true}
              disableRipple={true}
              onClick={this.handleSubmit}
              disabled={this.state.disabled}
            >
              {'send'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addMessage: (message, publicKey, ownPublic) => dispatch(messageActions.dbAddMessage(ownProps.uid, message, publicKey, ownPublic)),
    showError: (message) => dispatch(globalActions.showMessage(message))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { authorize, user, message } = state
  const ownUid = authorize.get('uid')
  const ownPublic = state.user.getIn(['info', ownUid, 'publicKey'])
  const publicKey = state.user.getIn(['info', ownProps.uid, 'publicKey'])
  const messages = message.getIn(['message', ownProps.uid])
  return {
    privateKey: authorize.get('privateKey'),
    publicKey: publicKey,
    ownPublic: ownPublic,
    ownUid: ownUid,
    messages: messages? messages.toJS() : {},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageComponent))
