// - Import react components
import React, { Component } from 'react'
import moment from 'moment/moment'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { push } from 'connected-react-router'
import classNames from 'classnames'

// - Material UI
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

// - Import actions
import * as circleActions from '../../actions/circleActions'

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

/**
 * Create component class
 */
export class UserBoxComponent extends Component {
  /**
   * Fields
   */
  static propTypes = {
    /**
     * User identifier
     */
    userId: PropTypes.string,
    /**
     * User information
     */
    user: PropTypes.object

  }

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
  selectedCircles

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor (props) {
    super(props)
    const { userBelongCircles, circles, userId } = this.props
    // Defaul state
    this.state = {
      /**
       * The value of circle input
       */
      circleName: ``,
      disabledCreateCircle: true,
      /**
       * The button of add user in a circle is disabled {true} or not {false}
       */
      disabledAddToCircle: true,
      /**
       * Whether current user changed the selected circles for referer user
       */
      disabledDoneCircles: true
    }
    this.selectedCircles = userBelongCircles.slice()
    this.handleChangeName = this.handleChangeName.bind(this)
    this.onCreateCircle = this.onCreateCircle.bind(this)
    this.handleDoneAddCircle = this.handleDoneAddCircle.bind(this)
    this.circleList = this.circleList.bind(this)

  }

  /**
   * Handle follow user
   */
  handleDoneAddCircle = () => {
    const { userId, user, addUserToCircle, selectedCircles, deleteFollowingUser } = this.props
    const { avatar, fullName } = user
    const { disabledDoneCircles } = this.state
    if (!disabledDoneCircles) {
      if (selectedCircles.length > 0) {
        addUserToCircle(selectedCircles, { avatar, userId, fullName })
      } else {
        deleteFollowingUser(userId)
      }
    }
  }

  /**
   * Handle follow user
   */
  onFollowUser = (event) => {
    event.preventDefault()
    const { isFollowed, followUser, followingCircleId, userId, user, followRequest } = this.props

    if (followRequest && followRequest.status === ServerRequestStatusType.Sent) {
      return
    }
    const { avatar, fullName } = user
    if (!isFollowed) {
      followUser(followingCircleId, { avatar, userId, fullName })
    } else {
      this.onRequestOpenAddCircle()
    }
  }

  /**
   * Handle request close for add circle box
   */
  onRequestCloseAddCircle = () => {
    const { setSelectedCircles, userId, userBelongCircles, closeSelectCircles } = this.props
    setSelectedCircles(userId, userBelongCircles)
    closeSelectCircles(userId)
    this.setState({
      circleName: ``,
      disabledCreateCircle: true,
      disabledAddToCircle: true,
      disabledDoneCircles: true
    })
  }

  /**
   * Handle request open for add circle box
   */
  onRequestOpenAddCircle = () => {
    const { openSelectCircles, userId } = this.props
    openSelectCircles(userId)
  }

  /**
   * Create a new circle
   */
  onCreateCircle = () => {
    const { circleName } = this.state
    if (circleName && circleName.trim() !== '') {
      this.props.createCircle(this.state.circleName)
      this.setState({
        circleName: '',
        disabledCreateCircle: true
      })
    }
  }

  /**
   * Handle change group name input to the state
   */
  handleChangeName = (event) => {
    this.setState({
      circleName: event.target.value,
      disabledCreateCircle: (event.target.value === undefined || event.target.value.trim() === '')

    })
  }

  handleSelectCircle = (event, isInputChecked, circleId) => {
    const { userBelongCircles, circles, setSelectedCircles, selectedCircles, userId } = this.props
    let newSelectedCircles = selectedCircles.slice()
    if (isInputChecked) {

      newSelectedCircles = [
        ...selectedCircles,
        circleId
      ]

    } else {
      const circleIndex = selectedCircles.indexOf(circleId)
      newSelectedCircles.splice(circleIndex, 1)
    }

    setSelectedCircles(userId, newSelectedCircles)
    this.setState({
      disabledDoneCircles: !this.selectedCircleChange(newSelectedCircles)
    })
  }

  /**
   * Create a circle list of user which belong to
   */
  circleList = () => {
    let { circles, userId, userBelongCircles, selectedCircles, classes } = this.props

    if (circles) {

      const parsedDate = Object.keys(circles).map((circleId, index) => {
        let isBelong = selectedCircles ? selectedCircles.indexOf(circleId) > -1 : false

        // Create checkbox for selected/unselected circle
        return (
          <ListItem key={`${circleId}-${userId}`} dense className={classes.listItem}>
            <ListItemText className={classes.circleName} primary={circles[circleId].name} />
            <ListItemSecondaryAction>
              <Checkbox
                onChange={(event, isInputChecked) => this.handleSelectCircle(event, isInputChecked, circleId)}
                checked={isBelong}
              />
            </ListItemSecondaryAction>
          </ListItem>)
      })

      return parsedDate
    }
  }

  /**
   * Check if the the selected circles changed
   */
  selectedCircleChange = (selectedCircles) => {
    let isChanged = false
    const { userBelongCircles, circles } = this.props

    if (selectedCircles.length === userBelongCircles.length) {
      for (let circleIndex = 0; circleIndex < selectedCircles.length; circleIndex++) {
        const selectedCircleId = selectedCircles[circleIndex]
        if (!(userBelongCircles.indexOf(selectedCircleId) > -1)) {
          isChanged = true
          break
        }
      }
    } else {
      isChanged = true
    }
    return isChanged
  }

  render () {
    const { disabledDoneCircles } = this.state
    const { isFollowed, followRequest, userId, isSelecteCirclesOpen, addToCircleRequest, deleteFollowingUserRequest, classes } = this.props

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
          </div>
          <div style={this.styles.followButton}>
            <Button
              color='primary'
              onClick={this.onFollowUser}
              disabled={
                (followRequest ? followRequest.status === ServerRequestStatusType.Sent : false) ||
                (deleteFollowingUserRequest ? deleteFollowingUserRequest.status === ServerRequestStatusType.Sent : false)
              }
            >
              {!isFollowed ? ('userBox.followButton')
                : (this.props.belongCirclesCount > 1 ? ('userBox.numberOfCircleButton', {circlesCount: this.props.belongCirclesCount}) : ((this.props.firstBelongCircle) ? this.props.firstBelongCircle.name : ('Follow')))}
            </Button>
          </div>
        </div>
        <Dialog
        PaperProps={{className: classes.fullPageXs}}
          key={this.props.userId || 0}
          open={isSelecteCirclesOpen === true}
          onClose={this.onRequestCloseAddCircle}
        >
          <DialogContent className={classes.dialogContent}>
            <List>
              {this.circleList()}
              <div className={classes.space}></div>
              <Divider />
              <ListItem key={`'circleName'-${userId}`} dense className={classes.listItem}>
                <ListItemText primary={
                  <TextField
                  autoFocus
                    placeholder={('groupNamePlaceholder')}
                    onChange={this.handleChangeName}
                    value={this.state.circleName}
                  />
                } />
                <ListItemSecondaryAction>
                  <IconButton onClick={this.onCreateCircle} disabled={this.state.disabledCreateCircle}>
                    <Tooltip title={('createCircleTooltip')}>
                      <SvgAdd />
                    </Tooltip>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              color='primary'
              disableFocusRipple={true}
              disableRipple={true}
              onClick={this.onRequestCloseAddCircle}
              style={{ color: grey[800] }}
            >
              {('cancelButton')}
        </Button>
            <Button
              color='primary'
              disableFocusRipple={true}
              disableRipple={true}
              disabled={disabledDoneCircles || (addToCircleRequest ? addToCircleRequest.status === ServerRequestStatusType.Sent : false)}
              onClick={this.handleDoneAddCircle}
            >
              {('doneButton')}
        </Button>
          </DialogActions>
        </Dialog>
      </Paper>
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
    createCircle: (name) => dispatch(circleActions.dbAddCircle(name)),
    addUserToCircle: (circleIds, user) => dispatch(circleActions.dbUpdateUserInCircles(circleIds, user)),
    followUser: (circleId, userFollowing) => dispatch(circleActions.dbFollowUser(circleId, userFollowing)),
    deleteFollowingUser: (followingId) => dispatch(circleActions.dbDeleteFollowingUser(followingId)),
    setSelectedCircles: (userId, circleList) => dispatch(circleActions.setSelectedCircles(userId, circleList)),
    removeSelectedCircles: (userId, circleList) => dispatch(circleActions.removeSelectedCircles(userId)),
    openSelectCircles: (userId) => dispatch(circleActions.openSelectCircleBox(userId)),
    closeSelectCircles: (userId) => dispatch(circleActions.closeSelectCircleBox(userId)),
    goTo: (url) => dispatch(push(url))

  }
}

const mapStateToProps = (state, ownProps) => {
  const { circle, authorize, server } = state
  const uid = authorize.get('uid')
  const request = server.get('request')

  const circles = circle ? (circle.get('circleList') || {}) : {}
  const userBelongCircles = circle.get('userTies') ? (circle.get('userTies')[ownProps.userId] ? circle.get('userTies')[ownProps.userId].circleIdList : []) : []
  const isFollowed = userBelongCircles.length > 0
  const followingCircleId = circles ? Object.keys(circles)
    .filter((circleId) => circles[circleId].isSystem && circles[circleId].name === `Following`)[0] : ''
  const followRequest = request ? request[ServerRequestType.CircleFollowUser + ownProps.userId] : null
  const addToCircleRequest = request ? request[ServerRequestType.CircleAddToCircle + ownProps.userId] : null
  const deleteFollowingUserRequest = request ? request[ServerRequestType.CircleDeleteFollowingUser + ownProps.userId] : null
  const selectedCircles = circle.selectedCircles ? circle.selectedCircles[ownProps.userId] : []
  const isSelecteCirclesOpen = circle.openSelecteCircles ? circle.openSelecteCircles[ownProps.userId] : []

  return {
    isSelecteCirclesOpen,
    isFollowed,
    selectedCircles,
    circles,
    followingCircleId,
    userBelongCircles,
    followRequest,
    belongCirclesCount: userBelongCircles.length || 0,
    firstBelongCircle: userBelongCircles ? (circles ? circles[userBelongCircles[0]] : {}) : {},
    avatar: state.user.get('info') && state.user.get('info')[ownProps.userId] ? state.user.get('info')[ownProps.userId].avatar || '' : '',
    fullName: state.user.get('info') && state.user.get('info').get(ownProps.userId) ? state.user.get('info').get(ownProps.userId).fullName || '' : ''
  }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserBoxComponent))
