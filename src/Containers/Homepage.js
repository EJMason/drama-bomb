import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions } from '../Redux/Duck.Login'
import { setDefaults } from '../Services/Api'
// import HomeTopBar from './HomeTopBar'

class Homepage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      temp: null,
    }
    setDefaults()
  }

  componentDidMount() {
    if (!this.props.mounted) {
      this.props.dispatch({ type: 'MOUNT' })
    }
  }

  componentDidUpdate() {
    if (this.props.mounted && !this.props.lockOpen) {
      this.props.dispatch(actions.lockOpen())
    }
  }

  render() {
    return (
      <div>
        {this.props.mounted ? 'I AM MOUNTED' : 'I AM NOT MOUNTED'}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mounted: state.login.mounted,
  lockOpen: state.login.lockOpen,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
