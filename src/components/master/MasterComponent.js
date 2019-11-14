import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Snackbar from 'material-ui/Snackbar'
import { AuthorizeService as authorizeService } from '../../services'

import MasterRouter from '../../routes/MasterRouter'

// // - Import actions
import {
  authorizeActions,
  postActions,
  userActions,
  globalActions,
  notifyActions
} from '../../actions'

export class MasterComponent extends Component {
  static isPrivate = true
  constructor (props) {
    super(props)

    this._authourizeService = new authorizeService()
    this.state = {
      loading: true,
      authed: false,
      dataLoaded: false,
      isVerified: false
    }

    this.handleLoading = this.handleLoading.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
  }

  handleMessage = (evt) => {
    this.props.closeMessage()
  }

  handleLoading = (status) => {
    this.setState({
      loading: status,
      authed: false
    })
  }

  componentDidMount () {
    this._authourizeService.onAuthStateChanged((isVerified, user) => {
      const {
        global,
        clearData,
        loadDataGuest,
        defaultDataDisable,
        login,
        logout
      } = this.props
      if (user) {
        login(user.uid,isVerified)
        this.setState({
          loading: false,
          isVerified: true
        })

      } else {
        logout()
        this.setState({
          loading: false,
          isVerified: false
        })
        if (global.get('defaultLoadDataStatus')) {
          defaultDataDisable()
          clearData()
        }
        loadDataGuest()
      }
    })
  }

  render () {
    const { global, uid, hideMessage } = this.props
    const { loading } = this.state

    return (
      <div id='master'>
        <div className='master__loading animate-fading2' style={{ display: (global.get('showTopLoading') ? 'flex' : 'none') }}>
          <div className='title'>Loading ... </div>
        </div>
      <MasterRouter enabled={!loading} data={{uid}} />
        <Snackbar
          open={this.props.global.get('messageOpen')}
          message={this.props.global.get('message')}
          onClose={hideMessage}
          autoHideDuration={4000}
          style={{ left: '1%', transform: 'none' }}
        />
      </div>

    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clearData: () => {
      dispatch(postActions.clearAllData())
      dispatch(userActions.clearAllData())
      dispatch(notifyActions.clearAllNotifications())
      dispatch(globalActions.clearTemp())
    },
    login: (userId, isVerified) => {
      dispatch(authorizeActions.login(userId, isVerified))
    },
    logout: () => {
      dispatch(authorizeActions.logout())
    },
    defaultDataDisable: () => {
      dispatch(globalActions.defaultDataDisable())
    },
    defaultDataEnable: () => {
      dispatch(globalActions.defaultDataEnable())
    },
    closeMessage: () => {
      dispatch(globalActions.hideMessage())
    },
    loadDataGuest: () => {
      dispatch(globalActions.loadDataGuest())
    },
    hideMessage: () => dispatch(globalActions.hideMessage())
  }

}

const mapStateToProps = (state) => {
  const { authorize, global } = state

  return {
    guest: authorize.get('guest'),
    uid: authorize.get('uid'),
    authed: authorize.get('authed'),
    progress: global.get('progress'),
    global: global
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MasterComponent))
