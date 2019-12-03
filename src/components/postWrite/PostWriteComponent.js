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

import * as postActions from '../../actions/postActions'

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
  author: {
    fontSize: 30,
    paddingRight: 70
  }
})

export class PostWriteComponent extends Component{
  constructor(props) {

    super(props)

    const { postModel } = props

    this.state = {
      postText: this.props.edit && postModel ? (postModel.body ? postModel.body : '') : '',
      disabledPost: true,
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handlePost = this.handlePost.bind(this)
  }

  handlePost = () => {
    const {postText } = this.state

    const {
      ownerDisplayName,
      edit,
      onRequestClose,
      post,
      update,
      postModel
    } = this.props
    if (postText.trim() === '') {
      this.setState({
        disabledPost: false
      })
      return
    }

    // In edit status we should fire update if not we should fire post function
    if (!edit) {

      post({
        body: postText,
        ownerDisplayName: ownerDisplayName,
        postTypeId: 0,
        score: 0,
        viewCount: 0
      }, onRequestClose)
    } else { // In edit status we pass post to update functions
      postModel.body = postText

      update(postModel, onRequestClose)
    }
  }


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

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      const { postModel } = this.props
      this.setState({
        postText: this.props.edit && postModel ? (postModel.body ? postModel.body : '') : '',

        disabledPost: true
      })
    }
  }

  render() {
    const { classes } = this.props

    let author = (
      <div className={classes.author}>
        <span style={{
          fontSize: '30px',
          paddingRight: '10px',
          fontWeight: 400,
          color: 'rgba(0,0,0,0.87)',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          lineHeight: '25px'
        }}>{this.props.ownerDisplayName}</span><span style={{
          fontWeight: 400,
          fontSize: '30px'
        }}>{'Post'}</span>
      </div>
    )

    return (
      <div style={this.props.style}>
        {this.props.children}
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    post: (post, callBack) => dispatch(postActions.dbAddPost(post, callBack)),
    update: (post, callBack) => dispatch(postActions.dbUpdatePost(post, callBack))
  }
}

const mapStateToProps = (state, ownProps) => {
  const info = state.user.get('info')
  const uid = state.authorize.get('uid')
  return {
    ownerAvatar: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].avatar : '',
    ownerDisplayName: info && info.getIn([uid, 'fullName']) 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PostWriteComponent))
