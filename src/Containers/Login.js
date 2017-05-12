import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  componentDidMount() {
    if (this.props.error || !this.props.location.hash) {
      this.props.history.push('/')
    }
  }

  componentDidUpdate() {
    if (this.props.authStatus === 'complete') {
      this.props.history.push('/dashboard')
    }
  }

  render() {
    return (
      <div>
        { this.props.lockAuthenticated ? '---I am authenticated---' : 'Not Yet Authenticated' }
      </div>
    )
  }
}

Login.defaultProps = {
  error: null,
}

Login.propTypes = {
  lockAuthenticated: PropTypes.bool.isRequired,
  error: PropTypes.string,
  history: PropTypes.shape({
    action: PropTypes.string,
    block: PropTypes.func,
    go: PropTypes.func,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    length: PropTypes.number,
    location: PropTypes.object,
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
}

// ----------------- REDUX ----------------- //
const mapStateToProps = state => ({
  lockAuthenticated: state.login.lockAuthenticated,
  authStatus: state.login.authStatus,
  idToken: state.login.idToken,
  error: state.login.error,
})

export default connect(mapStateToProps, dispatch => ({ dispatch }))(Login)
