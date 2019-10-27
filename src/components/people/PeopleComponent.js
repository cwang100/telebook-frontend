// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Tabs, { Tab } from 'material-ui/Tabs'
import { grey, cyan } from 'material-ui/colors'
import { push } from 'react-router-redux'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'

// - Import app components
// import FindPeople from 'components/findPeople'
// import Following from 'components/following'
// import Followers from 'components/followers'
// import YourCircles from 'components/yourCircles'

// - Import API

// - Import actions
import * as circleActions from '../../actions/circleActions'
import * as globalActions from '../../actions/globalActions'

const TabContainer = (props) => {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

export class PeopleComponent extends Component {

  static propTypes = {

  }


  constructor (props) {
    super(props)
    const {tab} = this.props.match.params

    this.state = {
      tabIndex: this.getTabIndexByNav(tab)
    }
  }

  handleChangeTab = (event, value) => {
    const {circlesLoaded, goTo, setHeaderTitle} = this.props
    this.setState({ tabIndex: value })
    switch (value) {
      case 0:
        goTo('/people')
        setHeaderTitle('People')
        break
      case 1:
        goTo('/people/circles')
        setHeaderTitle('Circles')
        break
      case 2:
        goTo('/people/followers')
        setHeaderTitle('Followers')
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
      case 'circles':
        setHeaderTitle('Circles')
        break
      case 'followers':
        setHeaderTitle('Followers')
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

    const {circlesLoaded, goTo, setHeaderTitle, translate} = this.props
    const {tabIndex} = this.state
    return (
      <div style={styles.people}>
      <AppBar position='static' color='default'>
      <Tabs indicatorColor={grey[50]}
      onChange={this.handleChangeTab}
      value={tabIndex} centered
      textColor='primary'
       >
        <Tab label={'people.findPeopleTab'} />
        <Tab label={'people.followingTab'} />
        <Tab label={'people.followersTab'} />
      </Tabs>
      </AppBar>
      {/* //{tabIndex === 0 && <TabContainer>{circlesLoaded ? <FindPeople /> : ''}</TabContainer>}
      //{tabIndex === 1 && <TabContainer>
        //{circlesLoaded ? <Following/> : ''}
        //{circlesLoaded ? <YourCircles/> : ''}
      //</TabContainer>}
      //{tabIndex === 2 && <TabContainer>{circlesLoaded ? <Followers /> : ''}</TabContainer>} */}
      </div>
    )
  }

  getTabIndexByNav(navName) {
    let tabIndex = 0
    switch (navName) {
      case 'circles':
        return 1
      case 'followers':
        return 2
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
    circlesLoaded: state.circle.get('loaded')
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PeopleComponent))
