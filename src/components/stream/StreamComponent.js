// - Import react components
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import { grey, teal } from 'material-ui/colors'
import SvgCamera from 'material-ui-icons/PhotoCamera'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import InfiniteScroll from 'react-infinite-scroller'

// - Import app components
import PostComponent from '../post'
import PostWriteComponent from '../postWrite'
import UserAvatarComponent from '../userAvatar'
import LoadMoreProgressComponent from 'layouts/loadMoreProgress'


// - Import actions
import * as globalActions from '../../actions/globalActions'

// - Create StreamComponent component class
export class StreamComponent extends Component {

  static propTypes = {
    /**
     * If it's true , writing post block will be visible
     */
    displayWriting: PropTypes.bool.isRequired,
    /**
     * A list of post
     */
    posts: PropTypes.object,

    /**
     * The title of home header
     */
    homeTitle: PropTypes.string

  }

  styles = {
    postWritePrimaryText: {
      color: grey[400],
      cursor: 'text'
    },
    postWtireItem: {
      fontWeight: '200'
    }
  }

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor(props) {
    super(props)

    this.state = {
      /**
       * It's true if we want to have two column of posts
       */
      divided: false,
      /**
       * If it's true comment will be disabled on post
       */
      disableComments: this.props.disableComments,
      /**
       * If it's true share will be disabled on post
       */
      disableSharing: this.props.disableSharing,
      /**
       * If it's true, post write will be open
       */
      openPostWrite: false,
      /**
       * The title of home header
       */
      homeTitle: props.homeTitle,

      /**
       * If there is more post to show {true} or not {false}
       */
      hasMorePosts: true
    }

    // Binding functions to `this`
    this.postLoad = this.postLoad.bind(this)
    this.handleOpenPostWrite = this.handleOpenPostWrite.bind(this)
    this.handleClosePostWrite = this.handleClosePostWrite.bind(this)

  }

  /**
   * Open post write
   *
   *
   * @memberof StreamComponent
   */
  handleOpenPostWrite = () => {
    this.setState({
      openPostWrite: true
    })
  }
  /**
   * Close post write
   *
   *
   * @memberof StreamComponent
   */
  handleClosePostWrite = () => {
    this.setState({
      openPostWrite: false
    })
  }

  /**
   * Create a list of posts
   * @return {DOM} posts
   */
  postLoad = () => {

    let { posts, match } = this.props
    let { tag } = match.params
    if (posts === undefined || !(Object.keys(posts).length > 0)) {

      return (

        <h1>
          'Nothing has shared.'
                </h1>

      )
    } else {

      let postBack = { divided: false, oddPostList: [], evenPostList: [] }
      let parsedPosts: any = []
      Object.keys(posts).forEach((postId) => {
        if (tag) {
          let regex = new RegExp('#' + tag, 'g')
          let postMatch = posts[postId].body.match(regex)
          if (postMatch !== null) {
            parsedPosts.push({ ...posts[postId] })
          }
        } else {
          parsedPosts.push({ ...posts[postId] })

        }
      })
      const sortedPosts = PostAPI.sortObjectsDate(parsedPosts)
      if (sortedPosts.length > 6) {
        postBack.divided = true

      } else {
        postBack.divided = false
      }
      sortedPosts.forEach((post, index) => {

        let newPost: any = (
          <div key={`${post.id!}-stream-div`}>

            {index > 1 || (!postBack.divided && index > 0) ? <div style={{ height: '16px' }}></div> : ''}
            <PostComponent key={`${post.id!}-stream-div-post`} post={post} />

          </div>
        )

        if ((index % 2) === 1 && postBack.divided) {
          postBack.oddPostList.push(newPost)
        } else {
          postBack.evenPostList.push(newPost)
        }
      })
      return postBack
    }

  }

  scrollLoad = (page) => {
    const { loadStream } = this.props
    loadStream!(page, 10)
  }

  componentWillMount() {
    const { setHomeTitle } = this.props
    setHomeTitle!()
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render() {

    const { tag, displayWriting, hasMorePosts } = this.props
    const postList = this.postLoad()

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.scrollLoad}
        hasMore={hasMorePosts}
        useWindow={true}
        loader={<LoadMoreProgressComponent key='stream-load-more-progress' />}
      >
        <div className='grid grid__gutters grid__1of2 grid__space-around animate-top'>
          <div className='grid-cell animate-top' style={{ maxWidth: '530px', minWidth: '280px' }}>
            {displayWriting && !tag
              ? (<PostWriteComponent open={this.state.openPostWrite} onRequestClose={this.handleClosePostWrite} edit={false} >
                <Paper elevation={2}>

                  <ListItem button
                    style={this.styles.postWtireItem}
                    onClick={this.handleOpenPostWrite}
                  >
                    <UserAvatarComponent fullName={this.props.fullName!} fileName={this.props.avatar!} size={36} />
                    <ListItemText inset primary={<span style={this.styles.postWritePrimaryText as any}> {translate!('home.postWriteButtonText')}</span>} />
                    <ListItemIcon>
                      <SvgCamera />
                    </ListItemIcon>
                  </ListItem>

                </Paper>
                <div style={{ height: '16px' }}></div>
              </PostWriteComponent>)
              : ''}

            {postList.evenPostList}
            <div style={{ height: '16px' }}></div>
          </div>
          {postList.divided
            ? (<div className='grid-cell animate-top' style={{ maxWidth: '530px', minWidth: '280px' }}>
              <div className='blog__right-list'>
                {postList.oddPostList}
                <div style={{ height: '16px' }}></div>
              </div>
            </div>)
            : ''}

        </div>

      </InfiniteScroll>
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
    setHomeTitle: () => dispatch(globalActions.setHeaderTitle(ownProps.homeTitle || '')),
    showTopLoading: () => dispatch(globalActions.showTopLoading()),
    hideTopLoading: () => dispatch(globalActions.hideTopLoading())

  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
  const { post } = state
  return {
    avatar: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].avatar : '',
    fullName: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].fullName : ''
  }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StreamComponent))
