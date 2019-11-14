import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Tabs, { Tab } from 'material-ui/Tabs'
import { grey, cyan } from 'material-ui/colors'
import { push } from 'connected-react-router'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'

import FindPeople from '../findPeople'
import Following from '../following'

import * as globalActions from '../../actions/globalActions'

const TabContainer = (props) => {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

export class PeopleComponent extends Component {
  constructor (props) {
    super(props)
    const {tab} = this.props.match.params

    this.state = {
      tabIndex: this.getTabIndexByNav(tab)
    }
  }

  handleChangeTab = (event, value) => {
    const {followLoaded, goTo, setHeaderTitle} = this.props
    this.setState({ tabIndex: value })
    switch (value) {
      case 0:
        goTo('/people')
        setHeaderTitle('People')
        break
      case 1:
        goTo('/people/following')
        setHeaderTitle('Following')
        break

      default:
        break
    }
  }

  componentWillMount () {
    const { setHeaderTitle} = this.props
    const {tab} = this.props.match.params
    switch (tab) {
      case undefined:
      case '':
        setHeaderTitle('People')
        break
      case 'following':
        setHeaderTitle('Following')
        break
      default:
        break
    }
  }


  render () {
    const styles = {
      people: {
        margin: '0 auto'
      },
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
      },
      slide: {
        padding: 10
      }
    }

    const {followLoaded, goTo, setHeaderTitle, translate} = this.props
    const {tabIndex} = this.state
    return (
      <div style={styles.people}>
      <AppBar position='static' color='default'>
      <Tabs 
        indicatorColor={grey[50]}
        onChange={this.handleChangeTab}
        value={tabIndex} centered
        textColor='primary'
       >
        <Tab label={'All People'} />
        <Tab label={'Following'} />
      </Tabs>
      </AppBar>
        {tabIndex === 0 && <TabContainer>{followLoaded ? <FindPeople /> : ''}</TabContainer>}
        {tabIndex === 1 && <TabContainer>{followLoaded ? <Following/> : ''}</TabContainer>}
      </div>
    )
  }

  getTabIndexByNav(navName) {
    let tabIndex = 0
    switch (navName) {
      case 'following':
        return 1
      default:
        return 0
    }
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    goTo: (url) => dispatch(push(url)),
    setHeaderTitle : (title) => dispatch(globalActions.setHeaderTitle(title))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    uid: state.authorize.get('uid'),
    followLoaded: !state.follow.get('followingLoadingStatus')
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PeopleComponent))
