// - Import react components
import React, { Component } from 'react'
import SvgClose from 'material-ui-icons/Close'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'

export default class DialogTitleComponent extends Component {
  styles = {
    contain: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    title: {
      color: 'rgba(0,0,0,0.87)',
      flex: '1 1',
      font: '500 20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif'
    }
  }

  render () {

    const { buttonLabel, disabledButton, onClickButton, onRequestClose, title } = this.props

    return (
      <div className='g__dialog-title'>
        <div style={this.styles.contain}>
          <div style={{ paddingRight: '10px' }}>
            <SvgClose onClick={onRequestClose} style={{ cursor: 'pointer' }} />
          </div>
          <div style={this.styles.title}>
            {title || ''}
          </div>
        { buttonLabel ? (<div style={{ marginTop: '-9px' }}>
            <Button color='primary' disabled={disabledButton ? disabledButton : false} onClick={onClickButton || (x => x)}>
            {buttonLabel || ''}
            </Button>
          </div>) : ''}
        </div>
        <Divider />
      </div>
    )
  }
}
