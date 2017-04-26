import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions } from '../Redux/Login'
import { logoutStorage } from '../Services/AuthServices'
import { setDefaults, get } from '../Services/Api'
import Topbar from '../Components/Topbar'
import Sidebar from '../Components/Sidebar'
import './Styles/css/Dashboard.css'


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
      this.checkLocalstorageForToken()
    }
  }

  cronCheck() {
    console.log('HERE WE ARE')
    get.friendsCronHaters()
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  checkLocalstorageForToken() {
    let profile = localStorage.getItem('profile')
    const idToken = localStorage.getItem('id_token')
    setDefaults(idToken)
    if (profile && idToken) {
      profile = JSON.parse(profile)
      this.props.dispBeginInit({ profile, idToken })
    } else {
      this.logout()
    }
  }

  logout() {
    this.props.history.push('/')
    this.props.logoutRdx()
    logoutStorage()
  }

  handleMouseDown = () => {
    this.cronCheck()
  }

  handleTouchStart = e => {
    e.preventDefault()
    this.handleMouseDown()
  }

  render() {
    if (!this.props.profile) return null
    return (
      <div className="dashboard-container">
        <div className="topbar-container-grd">
          <Topbar
            logout={this.logout}
            {...this.props.profile}
            screen={this.props.profile.screen_name}
          />
        </div>
        <div className="sidebar-container-grd">
          <Sidebar />
        </div>
        <div className="content-container-grd">

          <button
            onMouseDown={this.handleMouseDown}
            onTouchStart={this.handleTouchStart}
          >Cron Check Tester
          </button>

          {
            this.props.loggedIn ? 'I AM LOGGED IN!!!' : 'ERROR!!'
          }
        </div>
      </div>
    )
  }
}

// ------------------ REDUX -------------------- //

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  router: state.router,
  profile: state.login.profile,
  state,
})

const mapDispatchToProps = dispatch => ({
  logoutRdx: () => dispatch(actions.logout()),
  dispBeginInit: idToken => dispatch(actions.beginInitSeq(idToken)),
  updateProfile: (profile, idToken) => dispatch(actions.setLoginInfo(profile, idToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
