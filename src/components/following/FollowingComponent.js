// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import UserBoxList from '../userBoxList'

export class FollowingComponent extends Component {

  static propTypes = {

  }

  constructor (props) {
    super(props)

    // Defaul state
    this.state = {

    }

    // Binding functions to `this`

  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render () {
    return (
          <div>
            {(this.props.followingUsers && Object.keys(this.props.followingUsers).length !== 0 ) ? (<div>
              <div className='profile__title'>
                {('people.followingLabel')}
                        </div>
                        <UserBoxList users={this.props.followingUsers} />
              <div style={{ height: '24px' }}></div>

              </div>) : (<div className='g__title-center'>
                 {('people.noFollowingLabel')}
               </div>)}
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
const mapDispatchToProps = (dispatch,ownProp) => {
  return{

  }
}

const mapStateToProps = (state,ownProps) => {
  const {circle, authorize, server} = state
  const { uid } = state.authorize
  const circles = circle ? (circle.circleList || {}) : {}
  const followingUsers = circle ? circle.userTies : {}
  return {
    uid,
    circles,
    followingUsers

  }
}

  // - Connect component to redux store
export default connect(mapStateToProps,mapDispatchToProps)(FollowingComponent)
