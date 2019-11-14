// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { push } from 'connected-react-router'
import moment from 'moment/moment'
// - Material UI
import { Card, CardHeader, CardContent } from 'material-ui'
import Paper from 'material-ui/Paper'
import { MenuList, MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
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
    const { post, fullName, isPostOwner, avatar, classes } = this.props
    const { isPostMenuOpen } = this.state
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
                  <MenuItem onClick={this.handleOpenPostWrite} > {('Edit')} </MenuItem>
                  <MenuItem onClick={this.handleDelete} > {('Delete')} </MenuItem>
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
          title={<NavLink to={`/${ownerUserId}`}>{fullName}</NavLink>}
          subheader={moment.unix(creationDate).fromNow() + ' | Public'}
          action={isPostOwner ? rightIconMenu : ''}
        >
        </CardHeader>
        <CardContent className={classes.postBody}>
          {body}
        </CardContent>
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
  return {
    delete: (id) => dispatch(postActions.dbDeletePost(id)),
    goTo: (url) => dispatch(push(url)),
    setHomeTitle: (title) => dispatch(globalActions.setHeaderTitle(title || ''))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { authorize } = state
  const uid = authorize.get('uid')
  const postOwner = ownProps.post.ownerUserId === uid  
  return {
    avatar: state.user.get('info') && state.user.get('info')[ownProps.post.ownerUserId] ? state.user.info[ownProps.post.ownerUserId].avatar || '' : '',
    fullName: state.user.get('info') && state.user.get('info').get(ownProps.post.ownerUserId) ? state.user.get('info').get(ownProps.post.ownerUserId).fullName || '' : '',
    isPostOwner: postOwner
  }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PostComponent))
