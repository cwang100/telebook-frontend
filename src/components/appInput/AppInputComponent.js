import React, { Component } from 'react'
import { TextField } from '@material-ui/core'

export default class AppInputComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  focus = () => {
    this.input.focus()
  }

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
