import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getProfileInfo, getIdToken } from '../Services/AuthServices'
import { actions } from '../Redux/Login'

class Login extends Component {

  componentDidUpdate() {
    // push to the end of the async queue
    setTimeout(() => {
      const idToken = getIdToken()
      const profile = getProfileInfo()
      if (idToken) {
        this.props.history.push('/demon')
        this.props.dispatchUpdateProfile(profile, idToken)
      } else {
        this.props.history.push('/')
      }
    }, 0)
  }

  render() {
    return (
      <div>
        You are being redirected
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: state.temp.mounted,
})

const mapDispatchToProps = dispatch => ({
  dispatchUpdateProfile: (profile, idToken) => dispatch(actions.setLoginInfo(profile, idToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
