import { HomeRouter } from '../../routes'
import React, { Component } from 'react'
import _ from 'lodash'
import { Route, Switch, withRouter, Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import config from '../../config'
import classNames from 'classnames'

import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import Menu from 'material-ui/Menu'
import { MenuList, MenuItem } from 'material-ui/Menu'
import { ListItemIcon, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import SvgArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import SvgHome from '@material-ui/icons/Home'
import SvgFeedback from '@material-ui/icons/Feedback'
import SvgSettings from '@material-ui/icons/Settings'
import SvgAccountCircle from '@material-ui/icons/AccountCircle'
import SvgPeople from '@material-ui/icons/People'
import List from 'material-ui/List'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Hidden from 'material-ui/Hidden'
import MenuIcon from '@material-ui/icons/Menu'

import Sidebar from '../sidebar'
//import StreamComponent from '../stream'
//import HomeHeader from '../homeHeader'
import SidebarContent from '../sidebarContent'
import SidebarMain from '../sidebarMain'
import Profile from '../profile'
//import PostPage from '../postPage'
import People from '../people'

import * as authorizeActions from '../../actions/authorizeActions'
import * as postActions from '../../actions/postActions'
import * as userActions from '../../actions/userActions'
import * as globalActions from '../../actions/globalActions'
import * as circleActions from '../../actions/circleActions'
import * as notifyActions from '../../actions/notifyActions'

const drawerWidth = 220
const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    maxWidth: drawerWidth,
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  drawerPaperLarge: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      height: '100%',
    },
    top: 70,
    backgroundColor: '#fafafa',
    borderRight: 0
  },
  menu: {
    height: '100%',
  },
  content: {
    backgroundColor: 'transparent',
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing.unit * 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  'content-left': {
    marginLeft: 0,
  },
  'content-right': {
    marginRight: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    }
  },
  'contentShift-right': {
    marginRight: 0,
    [theme.breakpoints.up('md')]: {
      marginRight: drawerWidth
    }
  }
})

export class HomeComponent extends Component {

  constructor(props) {
    super(props)

    this.state = {
      drawerOpen: true
    }
  }

  handleDrawerToggle = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen })
  }

  componentWillMount() {
    const { global, clearData, loadData, authed, defaultDataEnable, isVerified, goTo } = this.props
    if (!authed) {
      goTo('/login')
      return
    }
    if (!isVerified) {
      goTo('/emailVerification')

    } else if (!global.defaultLoadDataStatus) {

      clearData()
      loadData()
      defaultDataEnable()
    }
  }

  render() {
    const HR = HomeRouter
    const { loaded, authed, loadDataStream, mergedPosts, hasMorePosts, showSendFeedback, classes, theme } = this.props
    const { drawerOpen } = this.state
    const drawer = (
      <>

      <NavLink to='/'>
        <MenuItem style={{ color: 'rgb(117, 117, 117)' }}>
          <ListItemIcon>
            <SvgHome />
          </ListItemIcon>
          <ListItemText inset primary={'sidebar.home'} />
        </MenuItem>
      </NavLink>
      <NavLink to={`/${this.props.uid}`}>
        <MenuItem style={{ color: 'rgb(117, 117, 117)' }}>
          <ListItemIcon>
            <SvgAccountCircle />
          </ListItemIcon>
          <ListItemText inset primary={'sidebar.profile'} />
        </MenuItem>
      </NavLink>
      <NavLink to='/people'>
        <MenuItem style={{ color: 'rgb(117, 117, 117)' }}>
          <ListItemIcon>
            <SvgPeople />
          </ListItemIcon>
          <ListItemText inset primary={'sidebar.people'} />
        </MenuItem>
      </NavLink>
      <Divider />
      <NavLink to='/settings'>
        <MenuItem style={{ color: 'rgb(117, 117, 117)' }}>
          <ListItemIcon>
            <SvgSettings />
          </ListItemIcon>
          <ListItemText inset primary={'sidebar.settings'} />
        </MenuItem>
      </NavLink>
      <MenuItem onClick={() => showSendFeedback()} style={{ color: 'rgb(117, 117, 117)' }}>
        <ListItemIcon>
          <SvgFeedback />
        </ListItemIcon>
        <ListItemText inset primary={'sidebar.sendFeedback'} />
      </MenuItem>
      </>
    )

    const anchor = theme.direction === 'rtl' ? 'right' : 'left'
    //<HomeHeader onToggleDrawer={this.handleDrawerToggle} drawerStatus={this.state.drawerOpen} />
    return (
      <div className={classes.root}>
        <h3>Welcome!</h3>
        <div className={classes.appFrame}> 
          <Hidden mdUp>
            <Drawer
              variant='temporary'
              open={this.state.drawerOpen}
              classes={{
                paper: classes.drawerPaper,
              }}
              onClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              <div>
                <div className={classes.drawerHeader} />
                <MenuList style={{ color: 'rgb(117, 117, 117)', width: '210px' }}>
                  <Divider />
                  {drawer}
                </MenuList>
              </div>
            </Drawer>
          </Hidden>
          <Hidden smDown implementation='js'>
            <Drawer
              variant='persistent'
              open={this.state.drawerOpen}
              classes={{
                paper: classes.drawerPaperLarge,
              }}
            >
              <div>
                <MenuList className={classes.menu} style={{ color: 'rgb(117, 117, 117)', width: '210px' }}>
                  {drawer}
                </MenuList>
              </div>
            </Drawer>
          </Hidden>
          <main
            className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: drawerOpen,
              [classes[`contentShift-${anchor}`]]: drawerOpen,
            })}
          >
            <HR enabled={loaded} data={{ mergedPosts, loadDataStream, hasMorePosts }} />
          </main>
        </div>
      </div>

    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {

  return {
    loadDataStream:
      (page, limit) => dispatch(postActions.dbGetPosts(page, limit)),
    loadData: () => {
      dispatch(postActions.dbGetPosts())
      dispatch(userActions.dbGetUserInfo())
      dispatch(notifyActions.dbGetNotifications())
      dispatch(circleActions.dbGetCircles())
      dispatch(circleActions.dbGetUserTies())
      dispatch(circleActions.dbGetFollowers())

    },
    clearData: () => {
      dispatch(postActions.clearAllData())
      dispatch(userActions.clearAllData())
      dispatch(notifyActions.clearAllNotifications())
      dispatch(circleActions.clearAllCircles())
      dispatch(globalActions.clearTemp())
    },
    defaultDataDisable: () => {
      dispatch(globalActions.defaultDataDisable())
    },
    defaultDataEnable: () => {
      dispatch(globalActions.defaultDataEnable())
    },
    goTo: (url) => dispatch(push(url)),
    showSendFeedback: () => dispatch(globalActions.showSendFeedback()),
    hideSendFeedback: () => dispatch(globalActions.hideSendFeedback())

  }

}

const mapStateToProps = (state, ownProps) => {
  const { authorize, global, user, post, imageGallery, notify, circle } = state
  const uid = authorize.get('uid')
  let mergedPosts = {}
  const circles = circle ? (circle.get('circleList') || {}) : {}
  const followingUsers = circle ? circle.get('userTies') || {} : {}
  const posts = post.get('userPosts') ? post.get('userPosts')[uid] : {}
  const stream = post.get('stream') || {}
  const hasMorePosts = stream.hasMoreData
  Object.keys(followingUsers).forEach((userId) => {
    let newPosts = post.get('userPosts') ? post.get('userPosts')[uid] : {}
    _.merge(mergedPosts, newPosts)
  })
  _.merge(mergedPosts, posts)
  return {
    authed: authorize.get('authed'),
    isVerified: authorize.get('isVerified'),
    mainStyle: global.get('sidebarMainStyle'),
    mergedPosts,
    global,
    hasMorePosts,
    loaded: user.get('loaded') && notify.get('loaded') && circle.get('loaded')
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(HomeComponent)))
