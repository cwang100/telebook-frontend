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

export class ProfileHeaderComponent extends Component {
  constructor (props) {
    super(props)

        /**
         * Defaul state
         */
    this.state = {

      isSmall: false

    }
  }
    /**
     * Handle resize event for window to change sidebar status
     * @param  {event} evt is the event is passed by winodw resize event
     */
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

    return (

            <div>
                <div className={this.state.isSmall ? 'profile__head-info-s' : 'profile__head-info'}>
                    <EventListener
                        target='window'
                        onResize={this.handleResize}
                    />
                    <div className='left'>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={DefaultAvator} width='150' height='150'/>
                      </div>
                        <div className='info'>
                            <div className='fullName'>
                                {this.props.fullName}
                            </div>
                        </div>
                    </div>
                    <div className='right'>
                        {isAuthedUser ? (<div style={this.state.isSmall ? styles.editButtonSmall : styles.editButton}>
                        <Button variant='raised' onClick={this.props.openEditor}>
                        {'Edit Profile'}
                        </Button>
                        </div>) : ''}
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

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openEditor: () => dispatch(userActions.openEditProfile())
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
    editProfileOpen: state.user.get('openEditProfile')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeaderComponent)
