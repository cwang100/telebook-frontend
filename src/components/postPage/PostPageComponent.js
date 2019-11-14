// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'

// - Import app components
import Stream from '../stream'

import * as postActions from '../../actions/postActions'
import * as userActions from '../../actions/userActions'

/**
 * Create component class
 */
export class PostPageComponent extends Component {
  constructor (props) {
    super(props)

    // Defaul state
    this.state = {

    }

    // Binding functions to `this`

  }
  componentWillMount () {
    this.props.loadPost()
    this.props.loadUserInfo()
  }

  render () {
    const St = Stream
    return (
      <St posts={this.props.posts} displayWriting={false} />
    )
  }
}

const mapDispatchToProps = (dispatch,ownProps) => {
  const {userId,postId} = ownProps.match.params
  return{
    loadPost: () => dispatch(postActions.dbGetPostById(userId,postId)),
    loadUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(userId,'header'))
  }
}

const mapStateToProps = (state,ownProps) => {
  const {userId,postId} = ownProps.match.params
  return{
    avatar: state.user.get('info') && state.user.get('info')[userId] ? state.user.get('info')[userId].avatar : '',
    name: state.user.get('info') && state.user.get('info')[userId] ? state.user.get('info')[userId].fullName : '',
    posts: state.post.get('userPosts') && state.post.get('userPosts')[userId] ? {[postId] : { ...state.post.get('userPosts')[userId][postId]}} : {}
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PostPageComponent)
