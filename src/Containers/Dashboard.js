import React, { Component } from 'react'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
    }
  }

  render() {
    return (
      <div>
        YOU HAVE ENTERED THE DASHBOARD!!!
      </div>
    )
  }
}

export default Dashboard
