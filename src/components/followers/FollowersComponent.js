// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import UserBoxList from '../userBoxList'

export class FollowersComponent extends Component {

  static propTypes = {

  }

  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render () {
    const {translate} = this.props
    return (
          <div>
            {(this.props.followers && Object.keys(this.props.followers).length !== 0) ? (<div>
              <div className='profile__title'>
                {('people.followersLabel')}
                        </div>
                        <UserBoxList users={this.props.followers} />
              <div style={{ height: '24px' }}></div>
              </div>)
              : (<div className='g__title-center'>
                 {('people.noFollowersLabel')}
               </div>)}
          </div>
    )
  }
}

const mapDispatchToProps = (dispatch,ownProps) => {
  return{

  }
}

  /**
   * Map state to props
   * @param  {object} state is the obeject from redux store
   * @param  {object} ownProps is the props belong to component
   * @return {object}          props of component
   */
const mapStateToProps = (state, ownProps) => {
  const {circle, authorize, server} = state
  const { uid } = state.authorize
  const circles = circle ? (circle.circleList || {}) : {}
  const followers = circle ? circle.userTieds : {}
  return{
    followers
  }
}

  // - Connect component to redux store
export default connect(mapStateToProps,mapDispatchToProps)(FollowersComponent)
