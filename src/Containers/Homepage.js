import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions as tempActions } from '../Redux/temp'
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
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        This is the top of the homepage
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: state.temp.mounted,
  auth: state.login.auth,
})

const mapDispatchToProps = dispatch => ({
  dispatchMount: () => dispatch(tempActions.dispatchMountAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
