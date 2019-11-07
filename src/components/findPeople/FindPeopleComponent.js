// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import InfiniteScroll from 'react-infinite-scroller'

// - Import app components
import UserBoxList from '../userBoxList'
import LoadMoreProgressComponent from '../loadMoreProgress'

import * as userActions from '../../actions/userActions'

/**
 * Create component class
 */
export class FindPeopleComponent extends Component {
  constructor (props) {
    super(props)

        // Defaul state
    this.state = {

    }

  }

  /**
   * Scroll loader
   */
  scrollLoad = (page) => {
    const {loadPeople} = this.props
    loadPeople(page, 10)
  }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
  render () {
    const {hasMorePeople} = this.props

    return (
            <div>
                <InfiniteScroll
                pageStart={0}
                loadMore={this.scrollLoad}
                hasMore={hasMorePeople}
                useWindow={true}
                loader={<LoadMoreProgressComponent key='find-people-load-more-progress' />}
                >

                <div className='tracks'>

                {this.props.peopleInfo && Object.keys(this.props.peopleInfo).length !== 0 ? (<div>
                <div className='profile__title'>
                    {('people.suggestionsForYouLabel')}
                </div>
                <UserBoxList users={this.props.peopleInfo}/>
                <div style={{ height: '24px' }}></div>
                </div>) : (<div className='g__title-center'>
                {('people.nothingToShowLabel')}
               </div>)}
                </div>
            </InfiniteScroll>
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
  return {
    loadPeople: (page, limit) => dispatch(userActions.dbGetPeopleInfo(page, limit))
  }
}

const mapStateToProps = (state, ownProps) => {
  const people = state.user.get('people') || {}
  const info = state.user.get('info') 
  return {
    peopleInfo: info,
    hasMorePeople: people.hasMoreData
  }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(FindPeopleComponent)
