import React, { Component } from 'react'
import { connect } from 'react-redux'
import Auth0Lock from 'auth0-lock'
import { AUTH_CLIENT_ID, AUTH_DOMAIN } from '../../clientKeys'

import { actions as tempActions } from '../Redux/temp'

class Homepage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      temp: null,
    }

    this.lock = new Auth0Lock(AUTH_CLIENT_ID, AUTH_DOMAIN, {
      auth: {
        redirectUrl: 'http://localhost:3000/demon',
        responseType: 'token',
      },
    })
  }

  login() {
    this.lock.show()
  }

  render() {
    return (
      <div>
        Hello
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: state.temp.mounted,
})

const mapDispatchToProps = dispatch => ({
  dispatchMount: () => dispatch(tempActions.dispatchMountAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
