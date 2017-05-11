import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions } from '../Redux/Login'
// import { emtr } from '../Services/AuthServices'
// import { setDefaults } from '../Services/Api'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    console.log('COMPONENT DID MOUNT!!!!')
    console.log('Here are the props, ', this.props)
    // this.props.dispatch({ type: 'AUTH/POST_LOGIN_SUCCESS', payload: this.props.history })
    // emtr.on('profile_updated', val => {
    //   setDefaults(val.idToken)
    //   this.props.dispBeginInit(val)
    //   this.props.history.push('/demon')
    // })
  }

  componentDidUpdate() {
    if (this.props.loggedIn) {
      this.props.history.push('/dashboard')
    }
  }

  render() {
    return (
      <div>
        { this.props.loggedIn ? 'I am finished Logging in' : 'Not Yet finished' }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
})

const mapDispatchToProps = dispatch => ({
  dispatchBeginInit: idToken => dispatch(actions.beginInitSeq(idToken)),
  dispatchUpdateProfile: (profile, idToken) => dispatch(actions.setLoginInfo(profile, idToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
