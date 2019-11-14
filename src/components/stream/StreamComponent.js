// - Import react components
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import { grey, teal } from 'material-ui/colors'
import SvgCamera from '@material-ui/icons/PhotoCamera'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import InfiniteScroll from 'react-infinite-scroller'

import PostComponent from '../post'
import PostWriteComponent from '../postWrite'
import LoadMoreProgressComponent from '../loadMoreProgress'

import * as globalActions from '../../actions/globalActions'

export class StreamComponent extends Component {

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

  postLoad = () => {
    let { posts, match } = this.props
    let { tag } = match.params
    if (posts === undefined || !(Object.keys(posts).length > 0)) {

      return (

        <h1>
          {"Nothing has shared."}
        </h1>

      )
    } else {
      let postBack = { postList: [] }
      let parsedPosts = []
      Object.keys(posts).forEach((postId) => {
        parsedPosts.push({ ...posts[postId] })
      })

      let sortedPosts = parsedPosts.sort((a, b) => {
        return b.creationDate - a.creationDate
      })

      sortedPosts.forEach((post, index) => {
        let newPost = (
          <div key={`${post.id}-stream-div`}>

            {index > 0 ? <div style={{ height: '16px' }}></div> : ''}
            <PostComponent key={`${post.id}-stream-div-post`} post={post} />

          </div>
        )

        postBack.postList.push(newPost)
      })
      return postBack
    }
  }

  scrollLoad = (page) => {
    const { loadStream } = this.props
    loadStream(page, 10)
  }

  componentWillMount() {
    const { setHomeTitle } = this.props
    setHomeTitle()
  }

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
            {displayWriting 
              ? (<PostWriteComponent open={this.state.openPostWrite} onRequestClose={this.handleClosePostWrite} edit={false} >
                <Paper elevation={2}>

                  <ListItem button
                    style={this.styles.postWtireItem}
                    onClick={this.handleOpenPostWrite}
                  >
                    <ListItemText inset primary={<span style={this.styles.postWritePrimaryText}> {'new post'}</span>} />
                  </ListItem>

                </Paper>
                <div style={{ height: '16px' }}></div>
              </PostWriteComponent>)
              : ''}

            {postList.postList}
            <div style={{ height: '16px' }}></div>
          </div>
        </div>

      </InfiniteScroll>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setHomeTitle: () => dispatch(globalActions.setHeaderTitle(ownProps.homeTitle || '')),
    showTopLoading: () => dispatch(globalActions.showTopLoading()),
    hideTopLoading: () => dispatch(globalActions.hideTopLoading())

  }
}

const mapStateToProps = (state, ownProps) => {
  const { post } = state
  return {
    avatar: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].avatar : '',
    fullName: state.user.get('info') && state.user.get('info')[state.authorize.get('uid')] ? state.user.get('info')[state.authorize.get('uid')].fullName : ''
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StreamComponent))
