// - Import react components
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Manager, Target, Popper } from 'react-popper'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import Grow from 'material-ui/transitions/Grow'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'

// - Import app components
import NotifyItem from '../notifyItem'
// - Import API

// - Import actions
import * as userActions from '../../actions/userActions'

const styles = (theme) => ({
  root: {
    width: 360,
    maxWidth: 360,
    backgroundColor: '#efefef',
    minHeight: 376,
    display: 'flex',
  },
  noNotify: {
    color: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '100%'
  },
  popperClose: {
    pointerEvents: 'none'
  },
  popperOpen: {
    zIndex: 1,
    maxWidth: 500,
    overflowY: 'auto'
  },
  popper: {
  },
  overflowHidden: {
    overflow: 'hidden'
  },
  list: {
    maxHeight: 380,
    overflowY: 'auto'

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
export class NotifyComponent extends Component {

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor (props) {
    super(props)

    // Defaul state
    this.state = {
    }

    // Binding functions to `this`

  }

  notifyItemList = () => {
    let { notifications, info, onRequestClose } = this.props
    let parsedDOM = []
    if (notifications) {
      Object.keys(notifications).forEach((key) => {
        const { notifierUserId } = notifications[key]
        parsedDOM.push(
          <NotifyItem
            key={key}
            description={(notifications[key] ? notifications[key].description || '' : '')}
            fullName={(info[notifierUserId] ? info[notifierUserId].fullName || '' : '')}
            avatar={(info[notifierUserId] ? info[notifierUserId].avatar || '' : '')}
            id={key}
            isSeen={(notifications[key] ? notifications[key].isSeen || false : false)}
            url={(notifications[key] ? notifications[key].url || '' : '')}
            notifierUserId={notifierUserId}
            closeNotify={onRequestClose}
          />
        )
      })
    }
    return parsedDOM
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render () {
    let { open, anchorEl, onRequestClose, classes } = this.props
    const noNotify = ( 
    <div className={classes.noNotify}>
     All caught up! </div>
     )
    const items = this.notifyItemList()
    return (
      <Popper
        placement='bottom-start'
        eventsEnabled={open}
        className={classNames({ [classes.popperClose]: !open }, { [classes.popperOpen]: open })}
      >

        <ClickAwayListener onClickAway={onRequestClose}>
          <Grow in={open} >
          <Paper className={classNames(classes.root, { [classes.overflowHidden]: !open })} elevation={4} >

                {items.length > 0 ? <List className={classes.list} >{items}</List> : noNotify}

              </Paper>
          </Grow>
        </ClickAwayListener>
      </Popper>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    notifications: state.notify.get('userNotifies'),
    info: state.user.get('info')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NotifyComponent))
