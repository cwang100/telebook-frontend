import React, { Component } from 'react'
import { connect } from 'react-redux'

import UserBoxList from '../userBoxList'

export class FollowingComponent extends Component {
  render () {
    return (
      <div>
        {(this.props.followers && Object.keys(this.props.followers).length !== 0) ? (<div>
          <UserBoxList users={this.props.followers} />
          <div style={{ height: '24px' }}></div>
          </div>)
          : (<div className='g__title-center'>
             {('You are not following any one.')}
           </div>)}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch,ownProps) => {
  return {}
}


const mapStateToProps = (state, ownProps) => {
  const {follow} = state
  const followers = follow ? follow.get('followList') : {}
  return {
    followers
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FollowingComponent)
