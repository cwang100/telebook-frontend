// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment/moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment'

import { grey } from 'material-ui/colors'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SvgCamera from '@material-ui/icons/PhotoCamera'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Menu, { MenuList, MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import RaisedButton from 'material-ui/Button'
import EventListener, { withOptions } from 'react-event-listener'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'

import AppInput from '../appInput'

// - Import actions
import * as userActions from '../../actions/userActions'
import * as globalActions from '../../actions/globalActions'

const styles = (theme) => ({
  dialogTitle: {
    padding: 0
  },
  dialogContentRoot: {
    maxHeight: 400,
    minWidth: 330,
    [theme.breakpoints.down('xs')]: {
      maxHeight: '100%',
    }

  },
  fullPageXs: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      margin: 0
    }
  },
  fixedDownStickyXS: {
    [theme.breakpoints.down('xs')]: {
      position: 'fixed',
      bottom: 0,
      right: 0,
      background: 'white',
      width: '100%'
    }
  },
  bottomPaperSpace: {
    height: 16,
    [theme.breakpoints.down('xs')]: {
      height: 90
    }
  },
  box: {
    padding: '0px 24px 0px',
    display: 'flex'

  },
  bottomTextSpace: {
    marginBottom: 15
  },
  dayPicker: {
    width: '100%',
    padding: '13px 0px 8px'
  }
})

/**
 * Create component class
 */
export class EditProfileComponent extends Component {
  styles = {
    avatar: {
      border: '2px solid rgb(255, 255, 255)'
    },
    paper: {
      width: '90%',
      height: '100%',
      margin: '0 auto',
      display: 'block'
    },
    title: {
      padding: '24px 24px 20px 24px',
      font: '500 20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
      display: 'flex',
      wordWrap: 'break-word',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      flexGrow: 1
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '24px 24px 20px'
    },
    updateButton: {
      marginLeft: '10px'
    },
    dialogGallery: {
      width: '',
      maxWidth: '530px',
      borderRadius: '4px'
    },
    iconButtonSmall: {
    },
    iconButton: {
    }

  }

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor(props) {
    super(props)
    // Defaul state
    this.state = {
      /**
       * If it's true the winow is in small size
       */
      isSmall: false,
      /**
       * User tag line input value
       */
      tagLineInput: props.info.tagLine || '',
      /**
       * User full name input value
       */
      fullNameInput: props.info.fullName || '',
      /**
       * Error message of full name input
       */
      fullNameInputError: '',
      /**
       * Default birth day
       */
      defaultBirthday: (props.info && props.info.birthday) ? moment.unix(props.info.birthday).toDate() : '',
      /**
       * Seleted birth day
       */
      selectedBirthday: 0,
      /**
       * Web URL
       */
      webUrl: (props.info && props.info.webUrl) ? props.info.webUrl : '',
      /**
       * User company name
       */
      companyName: (props.info && props.info.companyName) ? props.info.companyName : '',
      /**
       * User twitter id
       */
      twitterId: (props.info && props.info.twitterId) ? props.info.twitterId : ''

    }

    // Binding functions to `this`
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  /**
   * Set banner image url
   */
  handleRequestSetBanner = (url) => {
    this.setState({
      banner: url
    })
  }


  handleUpdate = () => {
    const { fullNameInput, tagLineInput, selectedBirthday,companyName, webUrl, twitterId } = this.state
    const { info } = this.props

    if (this.state.fullNameInput.trim() === '') {
      this.setState({
        fullNameInputError: 'This field is required'
      })
    } else {
      this.setState({
        fullNameInputError: ''
      })

      this.props.update({
        fullName: fullNameInput,
        tagLine: tagLineInput,
        companyName: companyName,
        webUrl: webUrl,
        twitterId: twitterId,
        creationDate: this.props.info.creationDate,
        birthday: selectedBirthday > 0 ? selectedBirthday : ((info && info.birthday) ? info.birthday : 0)
      })
    }
  }

  /**
   * Handle data on input change
   * @param  {event} evt is an event of inputs of element on change
   */
  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  handleResize = (event) => {
    let width = window.innerWidth

    if (width > 900) {
      this.setState({
        isSmall: false
      })

    } else {
      this.setState({
        isSmall: true
      })
    }
  }

  handleBirthdayDateChange = (date) => {
    this.setState({ selectedBirthday: moment(date).unix() })
  }

  componentDidMount() {
    this.handleResize(null)
  }

  render() {

    const { classes, currentLanguage } = this.props
    const { defaultBirthday, webUrl, twitterId, companyName } = this.state
    const iconButtonElement = (
      <IconButton style={this.state.isSmall ? this.styles.iconButtonSmall : this.styles.iconButton}>
        <MoreVertIcon style={{ ...(this.state.isSmall ? this.styles.iconButtonSmall : this.styles.iconButton), color: grey[400] }} viewBox='10 0 24 24' />
      </IconButton>
    )

    const RightIconMenu = () => (
      <div>
        {iconButtonElement}
        <MenuItem style={{ fontSize: '14px' }}>Reply</MenuItem>
        <MenuItem style={{ fontSize: '14px' }}>Edit</MenuItem>
        <MenuItem style={{ fontSize: '14px' }}>Delete</MenuItem>
      </div>
    )

    return (

      <div>
        {/* Edit profile dialog */}
        <Dialog
          PaperProps={{ className: classes.fullPageXs }}
          key='Edit-Profile'
          open={this.props.open}
          onClose={this.props.onRequestClose}
          maxWidth='sm'
        >
          <DialogContent className={classes.dialogContentRoot}>
            {/* Banner */}
            <div className='profile__edit'>
              <EventListener
                target='window'
                onResize={this.handleResize}
              />
              <div className='left'>
                <div className='info'>
                  <div className='fullName'>
                    {this.props.fullName}
                  </div>

                </div>
              </div>

            </div>

            {/* Edit user information box*/}
            <Paper style={this.styles.paper} elevation={1}>
              <div style={this.styles.title}>{('profile.personalInformationLabel')}</div>
              <div className={classes.box}>
                <FormControl fullWidth aria-describedby='fullNameInputError'>
                  <InputLabel htmlFor='fullNameInput'>{('profile.fullName')}</InputLabel>
                  <Input id='fullNameInput'
                    onChange={this.handleInputChange}
                    name='fullNameInput'
                    value={this.state.fullNameInput}
                  />
                  <FormHelperText id='fullNameInputError'>{this.state.fullNameInputError}</FormHelperText>
                </FormControl>
              </div>
              <div className={classes.box}>
                <FormControl fullWidth aria-describedby='tagLineInputError'>
                  <InputLabel htmlFor='tagLineInput'>{('profile.tagline')}</InputLabel>
                  <Input id='tagLineInput'
                    onChange={this.handleInputChange}
                    name='tagLineInput'
                    value={this.state.tagLineInput}
                  />
                  <FormHelperText id='tagLineInputError'>{this.state.fullNameInputError}</FormHelperText>
                </FormControl>
              </div>
              <div className={classes.box}>
                <TextField
                  className={classes.bottomTextSpace}
                  onChange={this.handleInputChange}
                  name='companyName'
                  value={companyName}
                  label={('profile.companyName')}
                  fullWidth
                />
              </div>
              <div className={classes.box}>
                <TextField
                  className={classes.bottomTextSpace}
                  onChange={this.handleInputChange}
                  name='twitterId'
                  value={twitterId}
                  label={('profile.twitterId')}
                  fullWidth
                />
              </div>
              <div className={classes.box}>
                <TextField
                  className={classes.bottomTextSpace}
                  onChange={this.handleInputChange}
                  name='webUrl'
                  value={webUrl}
                  label={('profile.webUrl')}
                  fullWidth
                />
              </div>
              <div className={classes.box}>
              <DayPickerInput
              classNames={{ container: classes.dayPicker, overlay: '' }}
                value={defaultBirthday}
                onDayChange={this.handleBirthdayDateChange}
                formatDate={formatDate}
                parseDate={parseDate}
                component={AppInput}
                format='LL'
                placeholder={`${moment().format('LL')}`}
                dayPickerProps={{
                  locale: currentLanguage,
                  localeUtils: MomentLocaleUtils,
                }}
              />
              </div>
              <br />

            </Paper>
            <div className={classes.bottomPaperSpace}></div>
          </DialogContent>
          <DialogActions className={classes.fixedDownStickyXS}>
            <Button onClick={this.props.onRequestClose} > {('profile.cancelButton')} </Button>
            <Button variant='raised' color='primary' onClick={this.handleUpdate} style={this.styles.updateButton}> {('profile.updateButton')} </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    update: (info) => dispatch(userActions.dbUpdateUserInfo(info)),
    onRequestClose: () => dispatch(userActions.closeEditProfile())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.user.get('openEditProfile'),
    info: state.user.get('info').get(state.authorize.get('uid'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditProfileComponent))
