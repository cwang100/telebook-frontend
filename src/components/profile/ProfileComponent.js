// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import RaisedButton from 'material-ui/Button'

// - Import app components
import ProfileHeader from '../profileHeader'
import StreamComponent from '../stream'

// - Import API

// - Import actions
import * as postActions from '../../actions/postActions'
import * as userActions from '../../actions/userActions'
import * as globalActions from '../../actions/globalActions'

/**
 * Create component class
 */
export class ProfileComponent extends Component {

  static propTypes = {

  }

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentWillMount () {
    this.props.loadPosts()
    this.props.loadUserInfo()
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render () {

    /**
     * Component styles
     */
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

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
  const { userId } = ownProps.match.params
  return {
    loadPosts: () => dispatch(postActions.dbGetPostsByUserId(userId)),
    loadUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(userId, 'header'))

  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
  const { userId } = ownProps.match.params
  const uid = state.authorize.get('uid')
  const profile = state.post.get('profile') || {}
  const hasMorePosts = profile.hasMoreData
  const posts = state.post.get('userPosts') ? state.post.get('userPosts')[userId] : {}
  return {
    // translate: getTranslate(state.locale),
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

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent)
