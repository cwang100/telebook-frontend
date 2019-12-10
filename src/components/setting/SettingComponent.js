// - Import external components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/Button'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import config from '../../config'

import {authorizeActions} from '../../actions'
import { Grid } from 'material-ui'
import logo from '../../assets/logo.jpg'

const styles = (theme) => ({
  textField: {
    minWidth: 280,
    marginTop: 20

  },
  contain: {
    margin: '12px',
    padding: '0px !important'
  },
  paper: {
    minHeight: 370,
    maxWidth: 450,
    minWidth: 337,
    textAlign: 'center',
    display: 'block',
    margin: 'auto'
  },
})

export class SettingComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
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
      case 'passwordInput':
        this.setState({
          passwordInputError: ''
        })
        break
      case 'confirmInput':
        this.setState({
          confirmInputError: '',
          passwordInputError: ''
        })

        break
      default:

    }
  }

  /**
   * Handle register form
   */
  handleForm = () => {
    const {translate} = this.props
    let error = false
    if (this.state.passwordInput === '') {
      this.setState({
        passwordInputError: ('Password is required.')
      })
      error = true

    } else if (this.state.confirmInput === '') {
      this.setState({
        confirmInputError: ('Confirm password is required.')
      })
      error = true

    } else if (this.state.confirmInput !== this.state.passwordInput) {
      this.setState({
        confirmInputError: ('Confirm password needs to equal to password.')
      })
      error = true

    }

    if (!error) {
      this.props.login(
        this.state.passwordInput,
        this.state.confirmInput
      )
    }

  }

  render () {

    const {classes} = this.props

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} className={classes.contain}>

        <div style={{background:'#fff', height: '60px', 'marginBottom': '10px'}}>
          <img src={logo} height="40px" />
        </div>
 
        <div className='animate-bottom'>
          <Paper className={classes.paper} elevation={1} >
            <div style={{ padding: '48px 40px 36px' }}>
              <div style={{
                paddingLeft: '40px',
                paddingRight: '40px'
              }}>

                <h2 style={{
                  textAlign: 'left',
                  paddingTop: '10px',
                  fontSize: '24px',
                  fontWeight: 400,
                  lineHeight: '32px',
                  margin: 0
                }} className='zoomOutLCorner animated g__paper-title'>{('Change Password')}</h2>
              </div>

              <TextField
              autoFocus
              className={classes.textField}
                onChange={this.handleInputChange}
                helperText={this.state.passwordInputError}
                name='passwordInput'
                label={('New Password')}
                type='password'
                error={this.state.passwordInputError.trim() !== ''}
              /><br />
              <TextField
              className={classes.textField}
                onChange={this.handleInputChange}
                helperText={this.state.confirmInputError}
                name='confirmInput'
                label={('Confirm Password')}
                type='password'
                error={this.state.confirmInputError.trim() !== ''}
              /><br />
              <br />
              <br />
              <div className='settings__button-box'>
                <div>
                  <Button onClick={this.props.homePage} > {('Home')} </Button>
                </div>
                <div>
                  <Button variant='raised' color='primary' onClick={this.handleForm}> {('Change Password')} </Button>

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

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    login: (password) => {
      dispatch(authorizeActions.dbUpdatePassword(password))
    },
    homePage: () => {
      dispatch(push('/'))
    }
  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
  return {
    // translate: getTranslate(state.locale)
  }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SettingComponent)))
