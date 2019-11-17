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

import * as messageActions from '../../actions/messageActions'

import Grid from 'material-ui/Grid/Grid'

const styles = (theme) => ({
  fullPageXs: {
    width: "600px",
    height: "300px",
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
    const {addMessage, publicKey} = this.props

    addMessage(text, publicKey)   
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

  render() {
    const { classes } = this.props

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
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', flexDirection: 'column', display: 'flex', flexGrow: 1, overflow: 'hidden', overflowY: 'auto', maxHeight: '300px' }}>
                    <TextField
                      autoFocus
                      value={this.state.text}
                      onChange={this.handleOnChange}
                      placeholder={'message'}
                      multiline
                      rows={7}
                      style={{ fontWeight: 400, fontSize: '14px', margin: '0 16px', flexShrink: 0, width: 'initial', flexGrow: 1 }}
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
    addMessage: (message, publicKey) => dispatch(messageActions.dbAddMessage(ownProps.uid, message, publicKey))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { authorize, user, message } = state
  const ownUid = authorize.get('uid')
  const publicKey = state.user.getIn(['info', ownProps.uid, 'publicKey'])
  return {
    privateKey: authorize.get('privateKey'),
    publicKey: publicKey,
    messages: message.getIn(['message', ownProps.uid])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageComponent))
