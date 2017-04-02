import React, { Component } from 'react'
import { connect } from 'react-redux'

import HomepageTopBar from '../Components/HomepageTopBar'
import AuthService from '../Services/AuthServices'
import { actions as tempActions } from '../Redux/temp'

const auth = new AuthService()

class Homepage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
    }
  }

  render() {
    return (
      <div>
        Hello
        <HomepageTopBar auth={auth} />
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
