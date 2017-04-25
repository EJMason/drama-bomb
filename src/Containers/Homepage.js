import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions as tempActions } from '../Redux/temp'
import HomeTopBar from './HomeTopBar'

class Homepage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      temp: null,
    }
    console.log('THIS IS THE HOMEPAGE PROPS', this.props)
  }

  render() {
    return (
      <div>
        This is the top of the homepage
        <HomeTopBar />
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
