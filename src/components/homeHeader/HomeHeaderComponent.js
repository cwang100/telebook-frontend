// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import SvgDehaze from '@material-ui/icons/Dehaze'
import { blue } from 'material-ui/colors'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import AppBar from 'material-ui/AppBar'
import Menu, { MenuItem } from 'material-ui/Menu'
import Hidden from 'material-ui/Hidden'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Tooltip from 'material-ui/Tooltip'
import Typography from 'material-ui/Typography'
import { Manager, Target } from 'react-popper'
import { withStyles } from 'material-ui/styles'
import config from '../../config'

import Notify from '../notify'

import { authorizeActions } from '../../actions'

const styles = {
  root: {
    backgroundColor: '#a5792a'
  },
  flex: {
    flex: 1
  }
}

export class HomeHeaderComponent extends Component {

  styles = {
    avatarStyle: {
      margin: 5,
      cursor: 'pointer'
    }

  }

  constructor(props) {
    super(props)

    this.state = {
      openAvatarMenu: false,
      showTitle: true,
      openNotifyMenu: false
    }

    this.onToggleSidebar = this.onToggleSidebar.bind(this)
    this.handleCloseNotify = this.handleCloseNotify.bind(this)

  }

  handleCloseNotify = () => {
    this.setState({
      openNotifyMenu: false
    })
  }

  onToggleSidebar = () => {
   const {onToggleDrawer} = this.props
   onToggleDrawer()
  }


  handleNotifyTouchTap = (event) => {
    event.preventDefault()

    this.setState({
      openNotifyMenu: true,
      anchorEl: event.currentTarget
    })
  }

  handleAvatarTouchTap = (event) => {
    this.setState({
      openAvatarMenu: true,
      anchorEl: event.currentTarget
    })
  }

  handleRequestClose = () => {
    this.setState({
      openAvatarMenu: false,
      anchorEl: null
    })
  }

  handleResize = (event) => {
    // const {drawerStatus} = this.props
    // let width = window.innerWidth

    // if (width >= 600 && !drawerStatus) {
    //   this.onToggleSidebar()
    // } else if (width < 600) {

    // }
  }

  render () {
    const {theme} = this.props
    const anchor = theme.direction === 'rtl' ? 'right' : 'left'
    return (

      <AppBar position='fixed' color='secondary'>
        <Toolbar>
          {/* Left side */}

          <IconButton onClick={this.onToggleSidebar} >
            <SvgDehaze color='primary' style={{ cursor: 'pointer' }} />
          </IconButton>
          {/* Header title */}
          <Typography variant='title' color='primary' style={{ marginLeft: '15px' }} >
            {config.settings.appName}
          </Typography>
          <div className='homeHeader__title-root'>
          <Hidden smDown>
           <div className={classNames({'homeHeader__title-left': anchor === 'left', 'homeHeader__title-right': anchor === 'right' })}>{this.props.title}</div> 
           </Hidden>
          </div>

          {/* Notification */}
          <div className='homeHeader__right'>
            <Manager>
              <Target>
                {this.props.notifyCount > 0 ? (
                  <Tooltip title={'Notifications'}>
                    <IconButton onClick={this.handleNotifyTouchTap}>
                      <div className='homeHeader__notify'>
                        <div className='title'>{this.props.notifyCount}</div>
                      </div>
                    </IconButton>
                  </Tooltip>)
                  : (<Tooltip title={'Notifications'}>
                    <IconButton onClick={this.handleNotifyTouchTap}>
                      <NotificationsIcon style={{ color: 'rgba(255, 255, 255, 0.87)' }} />
                    </IconButton>
                  </Tooltip>)}
              </Target>
              {<Notify open={this.state.openNotifyMenu} anchorEl={this.state.anchorEl} onRequestClose={this.handleCloseNotify} />}
            </Manager>
          </div>
        </Toolbar>
      </AppBar >
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

const mapStateToProps = (state, ownProps) => {
  let notifyCount = state.notify.get('userNotifies')
    ? Object
      .keys(state.notify.get('userNotifies'))
      .filter((key) => !state.notify.get('userNotifies')[key].isSeen).length
    : 0
  return {
    avatar: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].avatar : '',
    fullName: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].fullName : '',
    title: state.global.get('headerTitle'),
    notifyCount
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(HomeHeaderComponent))
