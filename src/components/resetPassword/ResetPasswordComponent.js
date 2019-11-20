// - Import external components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import config from '../../config'

// - Material UI
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/Button'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { Grid } from 'material-ui'

import * as authorizeActions from '../../actions/authorizeActions'

const styles = (theme) => ({
  textField: {
    minWidth: 280,
    marginTop: 20

  },
  caption: {
    marginTop: 30
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

export class ResetPasswordComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      emailInput: '',
      emailInputError: ''
    }
    this.handleForm = this.handleForm.bind(this)
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })

  }

  handleForm = () => {
    let error = false
    if (this.state.emailInput === '') {
      this.setState({
        emailInputError: ('Email Required')
      })

      return
    }

    this.props.resetPassword(this.state.emailInput)
  }

  render () {
    const {classes} = this.props

    return (
      <Grid container spacing={24}>
      <Grid item xs={12} className={classes.contain}>

        <h1 className='g__app-name'>{config.settings.appName}</h1>

        <div className='animate-bottom'>
          <Paper className={classes.paper} elevation={1}>
            <div style={{ padding: '48px 40px 36px' }}>
              <div style={{
                paddingLeft: '40px',
                paddingRight: '40px'
              }}>

                <h2 className='zoomOutLCorner animated g__paper-title'>{('Reset Password')}</h2>
              </div>

              <TextField
              className={classes.textField}
              autoFocus
                onChange={this.handleInputChange}
                helperText={this.state.emailInputError}
                error={this.state.emailInputError.trim() !== ''}
                name='emailInput'
                label={('E-mail')}
                type='email'
              /><br />
              <br />
              <br />
              <div className='settings__button-box'>
                <div>
                  <Button onClick={this.props.loginPage}>{('Cancel')}</Button>
                </div>
                <div>
                  <Button variant='raised' color='primary' onClick={this.handleForm}>{('Get E-mail')} </Button>
                </div>
              </div>
              <Typography className={classes.caption} variant='caption' component='p'>
              {('We will send you an e-mail to reset your password.')}
          </Typography>
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
    loginPage: () => {
      dispatch(push('/login'))
    },
    resetPassword: (emailAddress) => dispatch(authorizeActions.dbResetPassword(emailAddress))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ResetPasswordComponent)))
