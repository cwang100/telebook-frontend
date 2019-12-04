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

import * as authorizeActions from '../../actions/authorizeActions'

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

export class AddPrivateKeyComponent extends Component{
  constructor(props) {
    super(props)
    let open = false
    const prevPrivateKey = localStorage.getItem('privateKey') || ''
    const privateKey = props.privateKey
    if (!privateKey || privateKey.length === 0 || privateKey.trim() === '') {
      open = true
    }
    if (prevPrivateKey != '') {
      props.addPrivateKey(prevPrivateKey)
      open = false
    }

    this.state = {
      disabled: true,
      open: open,
      privateKey: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit = () => {
    const { privateKey } = this.state
    const {addPrivateKey} = this.props

    addPrivateKey(privateKey)
    this.setState({
      open: false
    })   
  }


  handleOnChange = (event) => {
    const data = event.target.value
    if (data.length === 0 || data.trim() === '') {
      this.setState({
        privateKey: data,
        disabled: true
      })
    } else {
      this.setState({
        privateKey: data,
        disabled: false
      })
    }

  }

  componentWillReceiveProps(nextProps) {
    const privateKey = nextProps.privateKey
    if (!nextProps.privateKey || privateKey.length === 0 || privateKey.trim() === '') {
      this.setState({
        open: true
      })
    }
    else {
      this.setState({
        open: false
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
          open={this.state.open || false}
          onClose={this.props.onRequestClose}
        >
          <DialogContent
            className={classes.content}
            style={{ paddingTop: 0 }}
          >

            <Card elevation={0}>
              <CardHeader
                title={'Add Private Key'}
              >
              </CardHeader>
              <CardContent>
                <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', flexDirection: 'column', display: 'flex', flexGrow: 1, overflow: 'hidden', overflowY: 'auto', maxHeight: '300px' }}>
                    <TextField
                      autoFocus
                      value={this.state.privateKey}
                      onChange={this.handleOnChange}
                      placeholder={'Your private key'}
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
              onClick={this.handleSubmit}
              disabled={this.state.disabled}
            >
              {'confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addPrivateKey: (privateKey) => dispatch(authorizeActions.addPrivateKey(privateKey))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { authorize } = state

  return {
    privateKey: authorize.get('privateKey')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddPrivateKeyComponent))
