import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions } from '../Redux/Login'
import { emtr } from '../Services/AuthServices'
import { setDefaults } from '../Services/Api'

class Login extends Component {
  componentDidMount() {
    emtr.on('profile_updated', val => {
      setDefaults(val.idToken)
      this.props.dispBeginInit(val)
      // this.props.dispatchUpdateProfile(val.profile, val.idToken)
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
  dispBeginInit: idToken => dispatch(actions.beginInitSeq(idToken)),
  dispatchUpdateProfile: (profile, idToken) => dispatch(actions.setLoginInfo(profile, idToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
