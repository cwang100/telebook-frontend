import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { push } from 'connected-react-router'
import SvgClose from 'material-ui-icons/Close'
import { withStyles } from 'material-ui/styles'
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'

import * as notifyActions from '../../actions/notifyActions'

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  closeButton: {color: 'black'},
  closeIcon: {width: 12, height: 12},
  listItem: {
    backgroundColor: 'white',
    marginBottom: '6px',
  }
})

export class NotifyItemComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }

    this.handleSeenNotify = this.handleSeenNotify.bind(this)
  }

  handleSeenNotify = (event) => {
    event.preventDefault()
    const { seenNotify, id, url, goTo, isSeen, closeNotify } = this.props
    if (id) {
      if (!isSeen) {
        seenNotify(id)
      }
      closeNotify()
      goTo(url)
    }
  }

  render () {
    let { description, fullName, isSeen, id, goTo,closeNotify, notifierUserId, url, deleteNotiy, classes } = this.props

    return (

        <ListItem key={notifierUserId} dense button className={classes.listItem} style={isSeen ? { opacity: 0.6 } : {}}>
              <ListItemText primary={<NavLink to={url} onClick={this.handleSeenNotify}>
                        <div className='user-name'>
                            {fullName}
                        </div>
                        <div className='description'>
                            {description}
                        </div>
                    </NavLink>} />
              <ListItemSecondaryAction className={classes.closeButton}>
              <div onClick={() => deleteNotiy(id)}>
                    <SvgClose className={classes.closeIcon} style={{ cursor: 'pointer' }} />
                </div>
              </ListItemSecondaryAction>
            </ListItem>

    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    goTo: (url) => dispatch(push(url)),
    seenNotify: (id) => dispatch(notifyActions.dbSeenNotification(id)),
    deleteNotiy: (id) => dispatch(notifyActions.dbDeleteNotification(id))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NotifyItemComponent))
