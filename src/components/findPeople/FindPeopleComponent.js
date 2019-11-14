// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller'

import UserBoxList from '../userBoxList'
import LoadMoreProgressComponent from '../loadMoreProgress'

import * as userActions from '../../actions/userActions'

export class FindPeopleComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentWillMount () {
    this.scrollLoad(0)
  }

  scrollLoad = (page) => {
    const {loadPeople} = this.props
    loadPeople(page, 10)
  }

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
                <UserBoxList users={this.props.peopleInfo}/>
                <div style={{ height: '24px' }}></div>
                </div>) : (<div className='g__title-center'>
                {('Nothing to show here.')}
                </div>)}
                </div>
              </InfiniteScroll>
            </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadPeople: (page, limit) => dispatch(userActions.dbGetPeopleInfo(page, limit))
  }
}

const mapStateToProps = (state, ownProps) => {
  const people = state.user.get('people') || {}
  const info = state.user.get('info').toJS()
  return {
    peopleInfo: info,
    hasMorePeople: people.hasMoreData
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FindPeopleComponent)
