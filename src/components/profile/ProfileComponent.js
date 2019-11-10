import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import RaisedButton from 'material-ui/Button'

import ProfileHeader from '../profileHeader'
import StreamComponent from '../stream'

import * as postActions from '../../actions/postActions'
import * as userActions from '../../actions/userActions'
import * as globalActions from '../../actions/globalActions'

export class ProfileComponent extends Component {

  static propTypes = {

  }

  constructor (props) {
    super(props)

    this.state = {}
  }

  componentWillMount () {
    this.props.loadPosts()
    this.props.loadUserInfo()
  }

  render () {
    const styles = {
      profile: {
      },
      header: {

      },
      content: {

      },
      showcover: {
        height: '450px'
      },
      avatar: {
        border: '2px solid rgb(255, 255, 255)'
      }
    }
    const {loadPosts, hasMorePosts, translate} = this.props
    const St = StreamComponent
    return (
      <div style={styles.profile}>
        <div style={styles.header}>
            <ProfileHeader tagLine={this.props.tagLine} avatar={this.props.avatar} isAuthedUser={this.props.isAuthedUser} banner={this.props.banner} fullName={this.props.name} followerCount={0} userId={this.props.userId}/>
        <St
          posts={this.props.posts}
          loadStream={loadPosts}
          hasMorePosts={hasMorePosts}
          displayWriting={false} />
        </div>
        {this.props.posts && Object.keys(this.props.posts).length !== 0
        ? (<div style={styles.content}>
          <div className='profile__title'>
            {('profile.headPostsLabel', {userName: this.props.name})}
               </div>
          <div style={{ height: '24px' }}></div>
        </div>)
        : (<div className='profile__title'>
                {('profile.nothingSharedLabel')}
               </div>)
        }

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { userId } = ownProps.match.params
  return {
    loadPosts: () => dispatch(postActions.dbGetPostsByUserId(userId)),
    loadUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(userId, 'header'))

  }
}

const mapStateToProps = (state, ownProps) => {
  const { userId } = ownProps.match.params
  const uid = state.authorize.get('uid')
  const profile = state.post.get('profile') || {}
  const hasMorePosts = profile.hasMoreData
  const posts = state.post.get('userPosts') ? state.post.get('userPosts')[userId] : {}
  return {
    avatar: state.user.get('info') && state.user.get('info')[userId] ? state.user.get('info')[userId].avatar || '' : '',
    name: state.user.get('info') && state.user.get('info')[userId] ? state.user.get('info')[userId].fullName || '' : '',
    banner: state.user.get('info') && state.user.get('info')[userId] ? state.user.get('info')[userId].banner || '' : '',
    tagLine: state.user.get('info') && state.user.get('info')[userId] ? state.user.get('info')[userId].tagLine || '' : '',
    isAuthedUser: userId === uid,
    userId,
    posts,
    hasMorePosts

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent)
