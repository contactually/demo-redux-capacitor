import PropTypes from 'prop-types'
import React, { Children } from 'react'

// top level component
export class Sagas extends React.Component {
  static propTypes = {
    // as returned from redux-saga:createSagaMiddleware
    middleware: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  static childContextTypes = {
    sagas: PropTypes.func.isRequired
  }

  getChildContext () {
    return {
      sagas: this.props.middleware
    }
  }

  render () {
    return Children.only(this.props.children)
  }
}
