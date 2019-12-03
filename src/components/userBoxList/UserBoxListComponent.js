import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserBox from '../userBox'
import { withStyles } from 'material-ui/styles'

const styles = (theme) => ({
  track: { 
    display: "flex"
  },
  gridLayout: {
    display: "flex !important"
  }
})


export class UserBoxListComponent extends Component {
  constructor (props) {
    super(props)
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
    const {classes} = this.props
    return (
      <div className={'grid grid__1of4 grid__space-around' + " " + classes.gridLayout}>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserBoxListComponent))
