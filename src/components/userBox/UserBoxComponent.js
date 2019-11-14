// - Import react components
import React, { Component } from 'react'
import moment from 'moment/moment'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import classNames from 'classnames'

import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import RaisedButton from 'material-ui/Button'
import Menu, { MenuItem } from 'material-ui/Menu'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'
import Tooltip from 'material-ui/Tooltip'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from 'material-ui/Dialog'
import SvgAdd from 'material-ui-icons/Add'
import IconButton from 'material-ui/IconButton'
import { grey } from 'material-ui/colors'
import DefaultAvator from '../../assets/avator.png'

import * as followActions from '../../actions/followActions'

import { ServerRequestType } from '../../constants/serverRequestType'
import { ServerRequestStatusType } from '../../actions/serverRequestStatusType'

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    height: 254,
    width: 243,
    margin: 10,
    textAlign: 'center',
    minWidth: 230,    
    maxWidth: '257px'
  },
  dialogContent: {
    paddingTop: '5px',
    padding: '0px 5px 5px 5px'
  },
  circleName: {
    fontSize: '1rem'
  },
  space: {
    height: 20
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

export class UserBoxComponent extends Component {
  styles = {
    followButton: {
      position: 'absolute',
      bottom: '30px',
      left: 0,
      right: 0
    },
    dialog: {
      width: '',
      maxWidth: '280px',
      borderRadius: '4px'
    }
  }

  constructor (props) {
    super(props)
    const { circles, userId } = this.props
    this.state = {
    }
  }

  onFollowUser = (event) => {
    event.preventDefault()
    const { isFollowed, followUser, userId, user, followRequest } = this.props

    if (followRequest && followRequest.status === ServerRequestStatusType.Sent) {
      return
    }

    if (!isFollowed) {
      followUser(user)
    }
  }

  render () {
    const { isFollowed, followRequest, userId, classes } = this.props

    return (
      <Paper key={userId} elevation={1} className={classNames('grid-cell', classes.paper)}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          position: 'relative',
          paddingTop: 20

        }}>
          <div onClick={() => this.props.goTo(`/${this.props.userId}`)} className='people__name' style={{ cursor: 'pointer' }}>
            <div>
              {this.props.user.fullName}
            </div>
            <img src={DefaultAvator} width='150' height='150'/>
          </div>
          <div style={this.styles.followButton}>
            <Button
              color='primary'
              onClick={this.onFollowUser}
              disabled={
                (followRequest ? followRequest.status === ServerRequestStatusType.Sent : false) ||
                (isFollowed ? true : false)
              }
            >
              {!isFollowed ? ('Follow') : ('Followed')}
            </Button>
          </div>
        </div>
      </Paper>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    followUser: (userFollowing) => dispatch(followActions.dbFollowUser(userFollowing)),
    goTo: (url) => dispatch(push(url))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { follow, authorize, server } = state
  const uid = authorize.get('uid')
  const request = server.get('request')
  const userId = ownProps.userId

  const isFollowed = follow.get('followList')[userId] != undefined

  const followRequest = request ? request[ServerRequestType.CircleFollowUser + ownProps.userId] : null
  
  return {
    isFollowed,
    followRequest,
    avatar: state.user.get('info') && state.user.get('info')[ownProps.userId] ? state.user.get('info')[ownProps.userId].avatar || '' : '',
    fullName: state.user.get('info') && state.user.get('info').get(ownProps.userId) ? state.user.get('info').get(ownProps.userId).fullName || '' : ''
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserBoxComponent))
