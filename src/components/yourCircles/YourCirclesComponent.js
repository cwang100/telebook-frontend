import React, { Component } from 'react'
import { connect } from 'react-redux'
import List from 'material-ui/List'

import CircleComponent from '../circle'

export class YourCirclesComponent extends Component {

  static propTypes = {

  }

  constructor (props) {
    super(props)

    this.state = {

    }
  }

  circleList = () => {
    let { circles,uid } = this.props
    let parsedCircles = []
    circles = circles.toJS()
    if (circles) {
      Object.keys(circles).map((key, index) => {
        parsedCircles.push(<CircleComponent key={key} circle={circles[key]} id={key} uid={uid} />)
      })
    }
    return parsedCircles
  }

  render () {
    let circleItems = this.circleList()
    return (

      <div style={{
        maxWidth: '800px',
        margin: '40px auto'
      }}>
      {(circleItems && circleItems.length !== 0 ) ? (<div>
        <div className='profile__title'>
          Your circles
                        </div>
        <List>
        {circleItems}
        </List>
        <div style={{ height: '24px' }}></div>
        </div>) : ''}
      </div>

    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const mapStateToProps = (state, ownProps) => {
  const {circle, authorize, server} = state
  const uid = state.authorize.get('uid')
  const circles = circle ? (circle.get('circleList') || {}) : {}
  return {
    uid,
    circles
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(YourCirclesComponent)
