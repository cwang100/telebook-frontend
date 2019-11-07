// - Import react components
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { grey } from 'material-ui/colors'
import SvgClose from 'material-ui-icons/Close'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import { TextField } from 'material-ui'

/**
 * Create component class
 */
export default class AppInputComponent extends Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }
  focus = () => {
    this.input.focus()
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render() {

    return (
      <TextField
        inputRef={el => (this.input = el)}
        fullWidth
        {...this.props}
      />
    )
  }
}
