import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions } from '../Redux/Login'
import { emtr } from '../Services/AuthServices'


class Login extends Component {
  componentDidMount() {
    emtr.on('profile_updated', val => {
      this.props.dispatchUpdateProfile(val.profile, val.idToken)
      this.props.history.push('/demon')
    })
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
