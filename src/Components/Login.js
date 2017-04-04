import React, { Component } from 'react'
import { connect } from 'react-redux'
import { go } from 'react-router-redux'

class Login extends Component {

  componentDidUpdate() {
    if (!this.props.hash) {
      this.props.history.push('/demon')
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
