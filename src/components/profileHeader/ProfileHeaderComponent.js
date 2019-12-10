import React, { Component } from 'react'
import { connect } from 'react-redux'

import { grey } from 'material-ui/colors'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import EventListener, { withOptions } from 'react-event-listener'
import EditProfile from '../editProfile'
import DefaultAvator from '../../assets/avator.png'
// - Import API

// - Import actions
import * as globalActions from '../../actions/globalActions'
import * as userActions from '../../actions/userActions'
import { withStyles } from 'material-ui/styles'

const styles = (theme) => ({
  actionBar: { 
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10
  },
  actionButton: {
    borderRadius: 2,
    margin: '0 10px'
  },
  actionButtonEdit: {
    color: '#00b1b3',
    background: 'white',
    borderWidth: 1,
    borderColor: '#00b1b3',
    borderStyle: 'solid'
  }
})

export class ProfileHeaderComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isSmall: false
    }
  }

  handleResize = () => {
    let width = window.innerWidth

    if (width > 900) {
      this.setState({
        isSmall: false
      })

    } else {
      this.setState({
        isSmall: true
      })
    }
  }

  removePirvateKey = () => {
    localStorage.setItem('privateKey', '')
  }

  componentDidMount () {
    this.handleResize()
  }

  render () {
    const {isAuthedUser, editProfileOpen} = this.props
    const styles = {
      avatar: {
        border: '2px solid rgb(255, 255, 255)'
      },
      iconButton: {
        fill: 'rgb(255, 255, 255)',
        height: '24px',
        width: '24px'

      },
      iconButtonSmall: {
        fill: 'rgb(0, 0, 0)',
        height: '24px',
        width: '24px'
      },

      editButton: {

        marginLeft: '20px'

      },
      editButtonSmall: {

        marginLeft: '20px',
        color: 'white',
        fill: 'blue'

      },
      aboutButton: {
        color: 'white'
      },
      aboutButtonSmall: {
        color: 'black'
      }
    }

    const iconButtonElement = (
            <IconButton style={this.state.isSmall ? styles.iconButtonSmall : styles.iconButton}>
                <MoreVertIcon style={{...(this.state.isSmall ? styles.iconButtonSmall : styles.iconButton), color: grey[400]}} viewBox='10 0 24 24' />
            </IconButton>
        )

    const RightIconMenu = () => (
      <div>
           {iconButtonElement}
                <MenuItem style={{ fontSize: '14px' }}>Reply</MenuItem>
                <MenuItem style={{ fontSize: '14px' }}>Edit</MenuItem>
                <MenuItem style={{ fontSize: '14px' }}>Delete</MenuItem>
      </div>
        )
    const { classes } = this.props
    return (
      
            <div>
                <div className={this.state.isSmall ? 'profile__head-info-s' : 'profile__head-info'}>
                    <EventListener
                        target='window'
                        onResize={this.handleResize}
                    />
                    <div className={classes.actionButton}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{'borderRadius': '50%'}} src={this.props.avatar} width='150' height='150'/>
                      </div>
                    </div>
                    <div className={classes.actionBar}>
                        {isAuthedUser ? (<div style={this.state.isSmall ? styles.editButtonSmall : styles.editButton}>
                        <Button   className={classes.actionButton + " " + classes.actionButtonEdit}  onClick={this.props.openEditor}>
                        {'Edit Profile'}
                        </Button>
                        </div>) : ''}
                        {isAuthedUser? <Button className={classes.actionButton} variant='raised' onClick={this.removePirvateKey}>Remove Local Key</Button>:''}
                    </div>
                </div>
                {isAuthedUser && editProfileOpen ? (<EditProfile
                    avatar={this.props.avatar}
                    banner={this.props.banner}
                    fullName={this.props.fullName}
                />) : ''}
            </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openEditor: () => dispatch(userActions.openEditProfile())
  }
}

const mapStateToProps = (state, ownProps) => {

  return {
    editProfileOpen: state.user.get('openEditProfile')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProfileHeaderComponent))
