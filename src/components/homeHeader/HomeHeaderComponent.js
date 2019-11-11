// - Import react components
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'

import SvgDehaze from '@material-ui/icons/Dehaze'
import { grey, blue } from 'material-ui/colors'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Popover from 'material-ui/Popover'
import AppBar from 'material-ui/AppBar'
import Menu, { MenuList, MenuItem } from 'material-ui/Menu'
import Paper from 'material-ui/Paper'
import Hidden from 'material-ui/Hidden'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Tooltip from 'material-ui/Tooltip'
import Typography from 'material-ui/Typography'
import { Manager, Target, Popper } from 'react-popper'
import { withStyles } from 'material-ui/styles'
import config from '../../config'

// import Notify from '../notify'

// - Import actions
import * as globalActions from '../../actions/globalActions'
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

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor(props) {
    super(props)

    // Default state
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

  // On click toggle sidebar
  onToggleSidebar = () => {
   const {onToggleDrawer} = this.props
   onToggleDrawer()
  }


  handleNotifyTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      openNotifyMenu: true,
      anchorEl: event.currentTarget
    })
  }

  /**
   * Handle touch on user avatar for popover
   *
   *
   * @memberof HomeHeader
   */
  handleAvatarTouchTap = (event) => {
    this.setState({
      openAvatarMenu: true,
      anchorEl: event.currentTarget
    })
  }


  handleLogout = () => {
    this.props.logout()
  }

  handleRequestClose = () => {
    this.setState({
      openAvatarMenu: false,
      anchorEl: null
    })
  }

  handleResize = (event) => {
    const {drawerStatus} = this.props
    // Set initial state
    let width = window.innerWidth

    if (width >= 600 && !drawerStatus) {
      this.onToggleSidebar()
    } else if (width < 600) {

    }
  }

  componentDidMount () {
    this.handleResize(null)
  }

  render () {
    const { classes , translate, theme} = this.props
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
              {/* <Notify open={this.state.openNotifyMenu} anchorEl={this.state.anchorEl} onRequestClose={this.handleCloseNotify} /> */}
            </Manager>

{/*            <UserAvatarComponent
              onClick={this.handleAvatarTouchTap}
              fullName={this.props.fullName}
              fileName={this.props.avatar}
              size={32}
              style={this.styles.avatarStyle}
            />*/}

            <Menu
              open={this.state.openAvatarMenu}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              onClose={this.handleRequestClose}>
              <MenuItem style={{ backgroundColor: 'white', color: blue[500], fontSize: '14px' }} > {'My Account'} </MenuItem>
              <MenuItem style={{ fontSize: '14px' }} onClick={this.handleLogout.bind(this)} > {'Log Out'} </MenuItem>

            </Menu>
          </div>

        </Toolbar>
      </AppBar >
    )
  }
}

// - Map dispatch to props
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(authorizeActions.dbLogout())
  }
}

// - Map state to props
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

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(HomeHeaderComponent))
