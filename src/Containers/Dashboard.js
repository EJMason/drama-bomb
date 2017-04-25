import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions } from '../Redux/Login'
import { logoutStorage } from '../Services/AuthServices'
import Topbar from '../Components/Topbar'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
    }
    this.logout = this.logout.bind(this)
    console.log(this.props)
  }

  logout() {
    console.log(this.props)
    this.props.history.push('/')
    this.props.logoutRdx()
    logoutStorage()
  }

  render() {
    return (
      <div>
        <Topbar logout={this.logout} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: state.temp.mounted,
  router: state.router,
})

const mapDispatchToProps = dispatch => ({
  logoutRdx: () => dispatch(actions.logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
