import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProfileHeader from '../profileHeader'
import StreamComponent from '../stream'

import * as postActions from '../../actions/postActions'
import * as userActions from '../../actions/userActions'
import { withStyles } from 'material-ui/styles'

const styles = (theme) => ({
  profileTitle: {
    margin:5,
    color: '#9c9c9c'
  }
})


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
        'max-width': '540px',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': '20px'
      },
      showcover: {
        height: '450px'
      },
      avatar: {
        border: '2px solid rgb(255, 255, 255)'
      }
    }
    const {loadPosts, hasMorePosts, name} = this.props
    const St = StreamComponent
    const {classes} = this.props
    return (
      <div style={styles.profile}>
        <div style={styles.header}>
          <ProfileHeader tagLine={this.props.tagLine} avatar={this.props.avatar} isAuthedUser={this.props.isAuthedUser} banner={this.props.banner} fullName={this.props.name} followerCount={0} userId={this.props.userId}/>
        </div>
        {this.props.posts && Object.keys(this.props.posts).length !== 0
        ? (
        <div style={styles.content}>
          <div className={classes.profileTitle}>
            {'Posts from ' + name}
          </div>
          <St
            posts={this.props.posts}
            loadStream={loadPosts}
            hasMorePosts={hasMorePosts}
            displayWriting={false} />
        </div>
        )
        : (<div className='profile__title'>
                {('Nothing has been shared from this user yet.')}
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
  const posts = state.post.getIn(['userPosts',userId]) ? state.post.getIn(['userPosts',userId]).toJS() : {}
  return {
    avatar: state.user.get('info') && state.user.get('info')[userId] ? state.user.get('info')[userId].avatar || '' : '',
    name: state.user.get('info') && state.user.get('info').get(userId) ? state.user.get('info').get(userId).fullName || '' : '',
    isAuthedUser: userId === uid,
    userId,
    posts,
    hasMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProfileComponent))
