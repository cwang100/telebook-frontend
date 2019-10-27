// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { NavLink, withRouter } from 'react-router-dom'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/Button'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import config from '../../config'

import * as authorizeActions from '../../actions/authorizeActions'
import * as globalActions from '../../actions/globalActions'

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

export class SignupComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullNameInput: '',
      fullNameInputError: '',
      emailInput: '',
      emailInputError: '',
      passwordInput: '',
      passwordInputError: '',
      confirmInput: '',
      confirmInputError: ''
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

    switch (name) {
      case 'fullNameInput':
        this.setState({
          fullNameInputError: ''
        })
        break
      case 'emailInput':
        this.setState({
          emailInputError: ''
        })
        break
      case 'passwordInput':
        this.setState({
          confirmInputError: '',
          passwordInputError: ''
        })
        break
      case 'confirmInput':
        this.setState({
          confirmInputError: '',
          passwordInputError: ''
        })
        break
      case 'checkInput':
        this.setState({
          checkInputError: ''
        })
        break
      default:

    }
  }

  handleForm = () => {
    const { fullNameInput, emailInput, passwordInput, confirmInput } = this.state
    const { register, translate } = this.props

    let error = false

    let fullNameCheck = fullNameInput.trim().toLowerCase()

    if (fullNameCheck.indexOf('test') > -1
      || fullNameCheck.indexOf('demo') > -1
      || fullNameCheck.indexOf('asd') > -1
      || fullNameCheck.length < 4) {
      this.setState({
        fullNameInputError: 'signup.validNameError'
      })
      error = true
    }

    if (passwordInput === '') {
      this.setState({
        passwordInputError: 'signup.passwordRequiredError'
      })
      error = true

    }
    if (confirmInput === '') {
      this.setState({
        confirmInputError: 'signup.confirmRequiredError'
      })
      error = true

    } else if (confirmInput !== passwordInput) {
      this.setState({
        passwordInputError: 'signup.passwordEqualConfirmError',
        confirmInputError: 'signup.confirmEqualPasswordError'
      })
      error = true

    }
    if (!error) {
      register({
        email: emailInput,
        password: passwordInput,
        fullName: fullNameInput
      })
    }

  }

  render() {

    const { classes, translate } = this.props

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

                  <h2 className='zoomOutLCorner animated g__paper-title'>{'Sign Up'}</h2>
                </div>

                <TextField
                  className={classes.textField}
                  autoFocus
                  onChange={this.handleInputChange}
                  helperText={this.state.fullNameInputError}
                  error={this.state.fullNameInputError.trim() !== ''}
                  name='fullNameInput'
                  label={'Full Name'}
                  type='text'
                /><br />
                <TextField
                  className={classes.textField}
                  onChange={this.handleInputChange}
                  helperText={this.state.emailInputError}
                  error={this.state.emailInputError.trim() !== ''}
                  name='emailInput'
                  label={'E-mail'}
                  type='email'
                /><br />
                <TextField
                  className={classes.textField}
                  onChange={this.handleInputChange}
                  helperText={this.state.passwordInputError}
                  error={this.state.passwordInputError.trim() !== ''}
                  name='passwordInput'
                  label={'Password'}
                  type='password'
                /><br />
                <TextField
                  className={classes.textField}
                  onChange={this.handleInputChange}
                  helperText={this.state.confirmInputError}
                  error={this.state.confirmInputError.trim() !== ''}
                  name='confirmInput'
                  label={'Confirm Password'}
                  type='password'
                /><br />
                <br />
                <div className='signup__button-box'>
                  <div>
                    <Button onClick={this.props.loginPage}>{'Log In'}</Button>
                  </div>
                  <div>
                    <Button variant='raised' color='primary' onClick={this.handleForm}>{'Create Account'}</Button>

                  </div>
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
    showError: (message) => {
      dispatch(globalActions.showMessage(message))
    },
    register: (userRegister) => {
      dispatch(authorizeActions.dbSignup(userRegister))
    },
    loginPage: () => {
      dispatch(push('/login'))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignupComponent)))
