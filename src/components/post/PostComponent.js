// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { push } from 'connected-react-router'
import PropTypes from 'prop-types'
import moment from 'moment/moment'
// - Material UI
import { Card, CardActions, CardHeader, CardMedia, CardContent } from 'material-ui'
import Typography from 'material-ui/Typography'
import SvgShare from '@material-ui/icons/Share'
import SvgComment from '@material-ui/icons/Comment'
import SvgFavorite from '@material-ui/icons/Favorite'
import SvgFavoriteBorder from '@material-ui/icons/FavoriteBorder'
import Checkbox from 'material-ui/Checkbox'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import { grey } from 'material-ui/colors'
import Paper from 'material-ui/Paper'
import Menu from 'material-ui/Menu'
import { MenuList, MenuItem } from 'material-ui/Menu'
import TextField from 'material-ui/TextField'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { ListItemIcon, ListItemText } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import { Manager, Target, Popper } from 'react-popper'
import Grow from 'material-ui/transitions/Grow'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import classNames from 'classnames'

import PostWrite from '../postWrite'

import * as postActions from '../../actions/postActions'
import * as globalActions from '../../actions/globalActions'

const styles = (theme) => ({
  iconButton: {
    width: 27,
    marginLeft: 5
  },
  vote: {
    display: 'flex',
    flex: 1
  },
  voteCounter: {
    color: 'rgb(134, 129, 129)',
    fontSize: 10,
    fontWeight: 400,
    padding: 2
  },
  commentCounter: {
    color: 'rgb(134, 129, 129)',
    fontSize: 10,
    fontWeight: 400,
    padding: 4
  },
  popperOpen: {
    zIndex: 10
  },
  popperClose: {
    pointerEvents: 'none',
    zIndex: 0
  },
  postBody: {
    wordWrap: 'break-word',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '0.875rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.46429em'
  },
  image: {
    width: '100%',
    height: 500
  },
  fullPageXs: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      margin: 0,
      overflowY: 'auto'
    }
  }
})

// - Create component class
export class PostComponent extends Component {

  styles = {
    dialog: {
      width: '',
      maxWidth: '530px',
      borderRadius: '4px'
    }

  }

  constructor (props) {
    super(props)
    const { post } = props
    this.state = {
      /**
       * Post text
       */
      text: post.body ? post.body : '',
      readMoreState: false,
      
      postMenuAnchorEl: null,
      isPostMenuOpen: false
    }

    // Binding functions to this
    this.handleReadMore = this.handleReadMore.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleOpenPostWrite = this.handleOpenPostWrite.bind(this)
    this.handleClosePostWrite = this.handleClosePostWrite.bind(this)
  }

  handleOpenPostWrite = () => {
    this.setState({
      openPostWrite: true
    })
  }

  handleClosePostWrite = () => {
    this.setState({
      openPostWrite: false
    })
  }

  handleDelete = () => {
    const { post } = this.props
    this.props.delete(post.id)
  }

  openPostMenu = (event) => {
    console.log(event.currentTarget)
    this.setState({
      postMenuAnchorEl: event.currentTarget,
      isPostMenuOpen: true
    })
  }

  closePostMenu = (event) => {
    this.setState({
      postMenuAnchorEl: event.currentTarget,
      isPostMenuOpen: false
    })
  }


  /**
   * Handle read more event
   * @param  {event} evt  is the event passed by click on read more
   */
  handleReadMore (event) {
    this.setState({
      readMoreState: !this.state.readMoreState

    })
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render () {
    const { post, setHomeTitle, goTo, fullName, isPostOwner, commentList, avatar, classes } = this.props
    const { postMenuAnchorEl, isPostMenuOpen } = this.state
    const rightIconMenu = (
      <Manager>
        <Target>
          <IconButton
            aria-owns={isPostMenuOpen ? 'post-menu' : ''}
            aria-haspopup='true'
            onClick={this.openPostMenu.bind(this)}
          >
            <MoreVertIcon />
          </IconButton>

        </Target>
        <Popper
          placement='bottom-start'
          eventsEnabled={isPostMenuOpen}
          className={classNames({ [classes.popperClose]: !isPostMenuOpen }, { [classes.popperOpen]: isPostMenuOpen })}
        >
          <ClickAwayListener onClickAway={this.closePostMenu}>
            <Grow in={isPostMenuOpen} >
              <Paper>
                <MenuList role='menu'>
                  <MenuItem onClick={this.handleOpenPostWrite} > {('post.edit')} </MenuItem>
                  <MenuItem onClick={this.handleDelete} > {('post.delete')} </MenuItem>
                  <MenuItem
                    onClick={() => this.props.toggleDisableComments(!post.disableComments)} >
                    {post.disableComments ? ('post.enableComments') : ('post.disableComments')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => this.props.toggleSharingComments(!post.disableSharing)} >
                    {post.disableSharing ? ('post.enableSharing') : ('post.disableSharing')}
                  </MenuItem>
                </MenuList>
              </Paper>
            </Grow>
          </ClickAwayListener>
        </Popper>
      </Manager>
    )

    const { ownerUserId, ownerDisplayName, creationDate, body } = post
    // Define variables
    return (
      <Card>
        <CardHeader
          title={<NavLink to={`/${ownerUserId}`}>{ownerDisplayName}</NavLink>}
          subheader={moment.unix(creationDate).fromNow() + ' | ' + ('post.public')}
          action={isPostOwner ? rightIconMenu : ''}
        >
        </CardHeader>
       
        <PostWrite
          open={this.state.openPostWrite}
          onRequestClose={this.handleClosePostWrite}
          edit={true}
          postModel={post}
        />

      </Card>

    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { post } = ownProps
  return {
    delete: (id) => dispatch(postActions.dbDeletePost(id)),
    goTo: (url) => dispatch(push(url)),
    setHomeTitle: (title) => dispatch(globalActions.setHeaderTitle(title || ''))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { post, authorize } = state
  const uid= authorize.get('uid')
  const postModel = post.get('userPosts')[ownProps.post.ownerUserId][ownProps.post.id]
  const postOwner = (post.get('userPosts')[uid] ? Object.keys(post.get('userPosts')[uid]).filter((key) => { return ownProps.post.id === key }).length : 0)
  return {
    avatar: state.user.get('info') && state.user.get('info')[ownProps.post.ownerUserId] ? state.user.info[ownProps.post.ownerUserId].avatar || '' : '',
    fullName: state.user.get('info') && state.user.get('info')[ownProps.post.ownerUserId] ? state.user.get('info')[ownProps.post.ownerUserId].fullName || '' : '',
    isPostOwner: postOwner > 0
  }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PostComponent))
