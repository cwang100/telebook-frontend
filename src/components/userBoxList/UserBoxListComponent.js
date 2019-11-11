import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserBox from '../userBox'

export class UserBoxListComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {

    }

  }

  userList = () => {
    let { users, uid } = this.props

    if (users) {
      return Object.keys(users).map((key, index) => {
        if (uid !== key) {
          return <UserBox key={key} userId={key} user={users[key]}/>
        }
      })
    }
  }

  render () {

    const styles = {

    }

    return (

                <div className='grid grid__1of4 grid__space-around'>
                  {this.userList()}
                </div>

    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

const mapStateToProps = (state, ownProps) => {
  const uid = state.authorize.get('uid')
  return {
    uid
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserBoxListComponent)
