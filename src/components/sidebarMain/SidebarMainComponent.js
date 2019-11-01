// - Import react components
import React, { Component } from 'react'

export default class SidebarMainComponent extends Component {

  static qcName = 'SidebarMain'

  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className='home__main' style={this.props.cstyle} >
        <div style={{height: '80px', width: '100%'}}></div>
        {this.props.children}
        </div>
    )
  }
}
