// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List'
import SvgGroup from '@material-ui/icons/GroupWork'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import TextField from 'material-ui/TextField'
import { MenuList, MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'
import { Manager, Target, Popper } from 'react-popper'
import Grow from 'material-ui/transitions/Grow'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import classNames from 'classnames'
import IconButtonElement from '../iconButtonElement'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import Button from 'material-ui/Button'
import RaisedButton from 'material-ui/Button'
import SvgClose from 'material-ui-icons/Close'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import Collapse from 'material-ui/transitions/Collapse'

// - Import API

// - Import actions
import * as circleActions from '../../actions/circleActions'

const styles = (theme) => ({
  root: {
    width: '100%',
    paddingRight: '0px',
    backgroundColor: theme.palette.background.paper
  },
  popperOpen: {
    zIndex: 10
  },
  popperClose: {
    pointerEvents: 'none',
    zIndex: 0
  },
  dialogPaper: {
    minWidth: 400
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

export class CircleComponent extends Component {
  styles = {
    userListItem: {
      backgroundColor: '#e2e2e2'
    },
    rightIconMenu: {
      display: 'block',
      position: 'absolute',
      top: '0px',
      right: '12px'
    },
    settingOverlay: {
      background: 'rgba(0,0,0,0.12)'
    },
    settingContent: {
      maxWidth: '400px'
    },
    listMenu: {
      color: 'rgba(0,0,0,0.87)',
      fontSize: '16px',
      marginRight: '8px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  }

  constructor (props) {
    super(props)

    // Defaul state
    this.state = {
      /**
       * If is true circle is open to show users in circle list
       */
      open: false,
      /**
       * Circle name on change
       */
      circleName: this.props.circle.name,
      /**
       * Save operation will be disable if user doesn't meet requirement
       */
      disabledSave: false,

      /**
       * Whether meu is open
       */
      isMenuOpen: false
    }

    // Binding functions to `this`
    this.handleToggleCircle = this.handleToggleCircle.bind(this)
    this.handleDeleteCircle = this.handleDeleteCircle.bind(this)
    this.handleUpdateCircle = this.handleUpdateCircle.bind(this)
    this.handleChangeCircleName = this.handleChangeCircleName.bind(this)
  }

  handleChangeCircleName = (evt) => {
    const { value } = evt.target
    this.setState({
      circleName: value,
      disabledSave: (!value || value.trim() === '')
    })
  }

  handleCloseMenu = () => {
    this.setState({
      isMenuOpen: false
    })
  }

  handleOpenMenu = () => {
    this.setState({
      isMenuOpen: true
    })
  }

  handleUpdateCircle = () => {
    const { circleName } = this.state
    if (circleName && circleName.trim() !== '') {
      this.props.updateCircle({ name: circleName, id: this.props.id })
    }
  }

  handleDeleteCircle = () => {
    this.props.deleteCircle(this.props.id)
  }

  handleToggleCircle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  userList = () => {
    const { usersOfCircle } = this.props
    let usersParsed = []

    if (usersOfCircle) {
      Object.keys(usersOfCircle).forEach((userId, index) => {
        const { fullName } = usersOfCircle[userId]
        let avatar = usersOfCircle && usersOfCircle[userId] ? usersOfCircle[userId].avatar || '' : ''
        usersParsed.push(
          <ListItem
            button
            key={`${this.props.id}.${userId}`}
            style={this.styles.userListItem}
            value={2}
            onClick={() => this.props.goTo(`/${userId}`)}
          >
            <ListItemText inset primary={fullName} />
            </ListItem>)

      })
      return usersParsed
    }
  }

  render () {

    const { circle, classes } = this.props
    const { isMenuOpen } = this.state

    const rightIconMenu = (
      <Manager>
        <Target>
          <IconButton
            aria-owns={isMenuOpen ? 'circle-menu' : ''}
            aria-haspopup='true'
            onClick={this.handleOpenMenu}
          >
            <MoreVertIcon />
          </IconButton>
        </Target>
        <Popper
          placement='bottom-start'
          eventsEnabled={isMenuOpen}
          className={classNames({ [classes.popperClose]: !isMenuOpen }, { [classes.popperOpen]: isMenuOpen })}
        >
          <ClickAwayListener onClickAway={this.handleCloseMenu}>
            <Grow in={isMenuOpen} >
              <Paper>
                <MenuList role='menu'>
                  <MenuItem onClick={this.handleDeleteCircle} > Delete circle </MenuItem>
                  <MenuItem onClick={this.props.openCircleSettings}> Circle settings </MenuItem>
                </MenuList>
              </Paper>
            </Grow>
          </ClickAwayListener>
        </Popper>
      </Manager>
    )

    const circleTitle = (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ paddingRight: '10px' }}>
            <SvgClose onClick={this.props.closeCircleSettings} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{
            color: 'rgba(0,0,0,0.87)',
            flex: '1 1',
            font: '500 20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif'
          }}>
            Circle settings
        </div>
          <div style={{ marginTop: '-9px' }}>
            <Button color='primary' disabled={this.state.disabledSave} onClick={this.handleUpdateCircle} > SAVE </Button>
          </div>
        </div>
        <Divider />
      </div>
    )
    return (
    <div>
        <ListItem
          className={classes.root}
          key={this.props.id + '-CircleComponent'}
          onClick={this.handleToggleCircle}
        >
          <ListItemIcon className={classes.icon}>
            <SvgGroup />
          </ListItemIcon>
          <ListItemText inset primary={<span style={this.styles}>{this.props.circle.name}</span>} />
          <ListItemSecondaryAction>
            {circle.isSystem ? null : rightIconMenu}
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse component='li' in={this.state.open} timeout='auto' unmountOnExit>
          <List disablePadding>
          {this.userList()}
          </List>
        </Collapse>
        <Dialog
        PaperProps={{className: classes.fullPageXs}}
          key={this.props.id}
          open={this.props.openSetting}
          onClose={this.props.closeCircleSettings}
          classes={{
            paper: classes.dialogPaper
          }}
        >
          <DialogTitle >{circleTitle}</DialogTitle>
          <DialogContent>
            <TextField
            fullWidth
              autoFocus
              placeholder='Circle name'
              label='Circle name'
              onChange={this.handleChangeCircleName}
              value={this.state.circleName}
            />
          </DialogContent>
        </Dialog>
        </div>
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
  let { uid } = ownProps
  return {
    deleteCircle: (id) => dispatch(circleActions.dbDeleteCircle(id)),
    updateCircle: (circle) => dispatch(circleActions.dbUpdateCircle(circle)),
    closeCircleSettings: () => dispatch(circleActions.closeCircleSettings(ownProps.id)),
    openCircleSettings: () => dispatch(circleActions.openCircleSettings(ownProps.id)),
    goTo: (url) => dispatch(push(url))

  }
}

const mapStateToProps = (state, ownProps) => {
  const { circle, authorize, server } = state
  const userTies = circle.get('userTies')
  const uid = state.authorize.get('uid')
  const circles = circle ? (circle.get('circleList') || {}) : {}
  const currentCircle = (circles ? circles[ownProps.id] : {})
  const circleId = ownProps.circle.id
  let usersOfCircle = {}
  Object.keys(userTies).forEach((userTieId) => {
    const theUserTie = userTies[userTieId]
    if (theUserTie.circleIdList.indexOf(ownProps.id) > -1) {
      usersOfCircle = {
        ...usersOfCircle,
        [userTieId]: theUserTie
      }
    }
  })
  return {
    usersOfCircle,
    openSetting: (state.circle && state.circle.get('openSetting') && state.circle.get('openSetting')[circleId]) ? state.circle.get('openSetting')[circleId] : false,
    userInfo: state.user.get('info')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CircleComponent))
