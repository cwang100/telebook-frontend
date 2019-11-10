import PrivateRoute from './PrivateRoute'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, withRouter, Redirect, NavLink } from 'react-router-dom'

import StreamComponent from '../components/stream'
import Profile from '../components/profile'
import PostPage from '../components/postPage'
import People from '../components/people'

export class HomeRouter extends Component {
  render () {
    const { enabled, match, data } = this.props
    const St = StreamComponent
    return (
          enabled ? (
          <Switch>
            <PrivateRoute path='/people/:tab?' component={<People />} />
            <Route path='/:userId/posts/:postId/:tag?' component={PostPage} />
            <Route path='/:userId' component={Profile} />
            <PrivateRoute path='/' component={(
              <div>
                <St
                  homeTitle={'Telebook'}
                  posts={data.mergedPosts}
                  loadStream={data.loadDataStream}
                  hasMorePosts={data.hasMorePosts}
                  displayWriting={true} 
                />
              </div>
            )} />
            </Switch>
          )
          : ''

    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {

  return {}

}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeRouter)) 
