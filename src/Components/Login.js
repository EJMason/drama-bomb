import React, { Component } from 'react'
import { connect } from 'react-redux'
import { go } from 'react-router-redux'

import { getProfileInfo, getIdToken } from '../Services/AuthServices'
import { actions } from '../Redux/Login'

class Login extends Component {

  componentDidUpdate() {
    const idToken = getIdToken()
    const profile = getProfileInfo()
    if (idToken) {
      this.props.history.push('/demon')
      this.props.dispatchUpdateProfile(profile, idToken)
    }
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
  hash: state.router.hash,
})

const mapDispatchToProps = dispatch => ({
  dispatchReplaceHistory: () => dispatch(go('/demon')),
  dispatchUpdateProfile: (profile, idToken) => dispatch(actions.setLoginInfo(profile, idToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
