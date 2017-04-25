import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions } from '../Redux/Login'
import { logoutStorage } from '../Services/AuthServices'
import Topbar from '../Components/Topbar'
import Sidebar from '../Components/Sidebar'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
    }
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    if (!this.props.profile) {
      let prfl = localStorage.getItem('profile')
      const id = localStorage.getItem('id_token')
      if (prfl && id) {
        prfl = JSON.parse(prfl)
        this.props.updateProfile(prfl, id)
      } else {
        this.logout()
      }
    }
  }

  logout() {
    this.props.history.push('/')
    this.props.logoutRdx()
    logoutStorage()
  }


  render() {
    if (!this.props.profile) return null
    return (
      <div>
        <Topbar
          logout={this.logout}
          {...this.props.profile}
          screen={this.props.profile.screen_name}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: state.temp.mounted,
  router: state.router,
  profile: state.login.profile,
  state,
})

const mapDispatchToProps = dispatch => ({
  logoutRdx: () => dispatch(actions.logout()),
  updateProfile: (profile, idToken) => dispatch(actions.setLoginInfo(profile, idToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
