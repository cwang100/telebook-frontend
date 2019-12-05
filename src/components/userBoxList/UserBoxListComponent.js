import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserBox from '../userBox'
import { withStyles } from 'material-ui/styles'

const styles = (theme) => ({
  track: { 
    display: "flex"
  },
  gridLayout: {
    display: "flex !important",
    'flex-wrap': 'wrap',
    'justify-content': 'center',
  },
  user: {
    marginRight: 'auto'
  }
})


export class UserBoxListComponent extends Component {
  constructor (props) {
    super(props)
  }

  userList = () => {
    let { users, uid } = this.props
    const {classes} = this.props
    if (users) {
      return Object.keys(users).map((key, index) => {
        if (uid !== key) {
          return <UserBox className={classes.user} key={key} userId={key} user={users[key]}/>
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
