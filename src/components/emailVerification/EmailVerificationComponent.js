// - Import external components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/Button'
import Button from 'material-ui/Button'
import config from '../../config'
import { withStyles } from 'material-ui/styles'

import * as authorizeActions from '../../actions/authorizeActions'
import { Grid } from 'material-ui'

const styles = (theme) => ({
  textField: {
    minWidth: 280,
    marginTop: 20

  },
  contain: {
    margin: '0 auto'
  },
  paper: {
    minHeight: 370,
    maxWidth: 450,
    minWidth: 337,
    textAlign: 'center',
    display: 'block',
    margin: 'auto'
  }
})

export class EmailVerificationComponent extends Component {

  styles = {
    message: {
      fontWeight: 400
    },
    buttons: {
      marginTop: 60
    },
    homeButton: {
      marginRight: 10
    },
    contain: {
      margin: '0 auto'
    },
    paper: {
      minHeight: 370,
      maxWidth: 450,
      minWidth: 337,
      textAlign: 'center',
      display: 'block',
      margin: 'auto'
    }

  }

  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} className={classes.contain}>

          <h1 className='g__app-name'>{config.settings.appName}</h1>

          <div className='animate-bottom'>
            <Paper className={classes.paper} elevation={1} >
              <div style={{ padding: '48px 40px 36px' }}>
                <div style={{
                  paddingLeft: '40px',
                  paddingRight: '40px'
                }}>

                  <h2 className='zoomOutLCorner animated g__paper-title'>{'emailVerification.title'}</h2>
                </div>
                <p style={this.styles.message}>
                  {'emailVerification.description'}
                </p>
                <div style={this.styles.buttons}>
                  <Button variant='raised' style={this.styles.homeButton} color='primary' onClick={() => this.props.homePage()}> {'emailVerification.homeButton'} </Button>
                  <Button variant='raised' color='primary' onClick={() => this.props.sendEmailVerification()}> {'emailVerification.sendButton'} </Button>
                </div>
                <div>
                </div>

              </div>
            </Paper>
          </div>
        </Grid>
      </Grid>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    homePage: () => {
      dispatch(push('/'))
    },
    sendEmailVerification: () => dispatch(authorizeActions.dbSendEmailVerfication())
  }
}


const mapStateToProps = (state, ownProps) => {
  return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EmailVerificationComponent)))
