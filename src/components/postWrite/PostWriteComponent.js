// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Card, CardActions, CardHeader, CardMedia, CardContent } from 'material-ui'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import RaisedButton from 'material-ui/Button'
import { grey } from 'material-ui/colors'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import Tooltip from 'material-ui/Tooltip'
import { MenuList, MenuItem } from 'material-ui/Menu'
import SvgRemoveImage from '@material-ui/icons/RemoveCircle'
import SvgCamera from '@material-ui/icons/PhotoCamera'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { withStyles } from 'material-ui/styles'
import { Manager, Target, Popper } from 'react-popper'
import Grow from 'material-ui/transitions/Grow'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import classNames from 'classnames'


import * as postActions from '../../actions/postActions'
// import { Post } from 'core/domain/posts'
import Grid from 'material-ui/Grid/Grid'

const styles = (theme) => ({
  fullPageXs: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      margin: 0,
      overflowY: 'auto'
    }
  },
  backdrop: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: '-1',
    position: 'fixed',
    willChange: 'opacity',
    backgroundColor: 'rgba(251, 249, 249, 0.5)',
    WebkitTapHighlightColor: 'transparent'
  },
  content: {
    padding: 0,
    paddingTop: 0
  },
  dialogRoot: {
    paddingTop: 0
  },
  popperOpen: {
    zIndex: 10
  },
  popperClose: {
    pointerEvents: 'none',
    zIndex: 0
  },
  author: {
    paddingRight: 70
  }
})

// - Create PostWrite component class
export class PostWriteComponent extends Component{

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor(props) {

    super(props)

    const { postModel } = props

    // Default state
    this.state = {
      /**
       * Post text
       */
      postText: this.props.edit && postModel ? (postModel.body ? postModel.body : '') : '',
    
      /**
       * Whether menu is open
       */
      menuOpen: false,
      /**
       * If it's true post button will be disabled
       */
      disabledPost: true,
    }

    // Binding functions to `this`
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handlePost = this.handlePost.bind(this)
  }

  /**
   * Toggle comments of the post to disable/enable
   *
   *
   * @memberof PostWrite
   */
  handleToggleComments = () => {
    this.setState({
      disableComments: !this.state.disableComments,
      disabledPost: false
    })
  }

  /**
   * Toggle sharing of the post to disable/enable
   *
   *
   * @memberof PostWrite
   */
  handleToggleSharing = () => {
    this.setState({
      disableSharing: !this.state.disableSharing,
      disabledPost: false
    })
  }

  /**
   * Romove the image of post
   *
   *
   * @memberof PostWrite
   */
  handleRemoveImage = () => {
    this.setState({
      image: '',
      imageFullPath: '',
      disabledPost: this.state.postText.trim() === ''
    })
  }

  /**
   * Handle send post to the server
   * @param  {event} evt passed by clicking on the post button
   */
  handlePost = () => {
    const {
      image,
      imageFullPath,
      disableComments,
      disableSharing,
      postText } = this.state

    const {
      id,
      ownerDisplayName,
      edit,
      onRequestClose,
      post,
      update,
      postModel
      } = this.props
    if (image === '' && postText.trim() === '') {
      this.setState({
        disabledPost: false
      })
      return
    }

    // In edit status we should fire update if not we should fire post function
    if (!edit) {
      if (image !== '') {
        post({
          body: postText,
          ownerDisplayName: ownerDisplayName,
          disableComments: disableComments,
          disableSharing: disableSharing,
          postTypeId: 1,
          score: 0,
          viewCount: 0
        }, onRequestClose)
      } else {
        post({
          body: postText,
          ownerDisplayName: ownerDisplayName,
          disableComments: disableComments,
          disableSharing: disableSharing,
          postTypeId: 0,
          score: 0,
          viewCount: 0
        }, onRequestClose)
      }
    } else { // In edit status we pass post to update functions
      postModel.body = postText
      postModel.disableComments = disableComments
      postModel.disableSharing = disableSharing

      update(postModel, onRequestClose)
    }
  }

  /**
   * Set post image url
   */
  onRequestSetImage = (url, fullPath) => {
    this.setState({
      image: url,
      imageFullPath: fullPath,
      disabledPost: false
    })
  }

  /**
   * When the post text changed
   * @param  {event} evt is an event passed by change post text callback funciton
   * @param  {string} data is the post content which user writes
   */
  handleOnChange = (event) => {
    const data = event.target.value
    this.setState({ postText: data })
    if (data.length === 0 || data.trim() === '' || (this.props.edit && data.trim() === this.props.text)) {
      this.setState({
        postText: data,
        disabledPost: true
      })
    } else {
      this.setState({
        postText: data,
        disabledPost: false
      })
    }

  }

  /**
   * Handle open more menu
   */
  handleOpenMenu = () => {
    this.setState({
      menuOpen: true
    })
  }

  /**
   * Handle close more menu
   */
  handleCloseMenu = () => {
    this.setState({
      menuOpen: false
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      const { postModel } = this.props
      this.setState({
        postText: this.props.edit && postModel ? (postModel.body ? postModel.body : '') : '',

        disabledPost: true
      })
    }
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render() {

    const { classes } = this.props
    const { menuOpen } = this.state

    let author = (
      <div className={classes.author}>
        <span style={{
          fontSize: '14px',
          paddingRight: '10px',
          fontWeight: 400,
          color: 'rgba(0,0,0,0.87)',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          lineHeight: '25px'
        }}>{this.props.ownerDisplayName}</span><span style={{
          fontWeight: 400,
          fontSize: '10px'
        }}>{'Post'}</span>
      </div>
    )

    const styles = {
      dialog: {
        width: '',
        maxWidth: '530px',
        borderRadius: '4px'
      }
    }

    return (
      <div style={this.props.style}>
        {this.props.children}
        <Dialog
          BackdropProps={{ className: classes.backdrop }}
          PaperProps={{className: classes.fullPageXs}}
          key={this.props.id || 0}
          open={this.props.open}
          onClose={this.props.onRequestClose}
        >
          <DialogContent
            className={classes.content}
            style={{ paddingTop: 0 }}

          >

            <Card elevation={0}>
              <CardHeader
                title={author}
              >
              </CardHeader>
              <CardContent>
                <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', flexDirection: 'column', display: 'flex', flexGrow: 1, overflow: 'hidden', overflowY: 'auto', maxHeight: '300px' }}>
                    <TextField
                      autoFocus
                      value={this.state.postText}
                      onChange={this.handleOnChange}
                      placeholder={'Write something'}
                      multiline
                      rows={2}
                      rowsMax={4}
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
              onClick={this.props.onRequestClose}
              style={{ color: grey[800] }}
            >
              {'Cancel'}
            </Button>
            <Button
              color='primary'
              disableFocusRipple={true}
              disableRipple={true}
              onClick={this.handlePost}
              disabled={this.state.disabledPost}
            >
              {this.props.edit ? 'update' : 'post'}
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    )
  }
}

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    post: (post, callBack) => dispatch(postActions.dbAddPost(post, callBack)),
    update: (post, callBack) => dispatch(postActions.dbUpdatePost(post, callBack))
  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
  return {
    ownerAvatar: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].avatar : '',
    ownerDisplayName: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].fullName : ''
  }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PostWriteComponent))
