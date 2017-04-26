import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'

import './Styles/css/HaterCard.css'

class HaterCard extends Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  handleMouseDown = () => {
    this.setState({ open: !this.state.open })
  }

  handleTouchStart = e => {
    e.preventDefault()
    this.handleMouseDown()
  }

  render() {
    return (
      <div>
        <button
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}
        >
          Toggle
        </button>
        <Motion
          style={{
            x: spring(this.state.open ? 80 : 50, { stiffness: 130, damping: 13 }),
            y: spring(this.state.open ? 0 : 3),
            z: spring(this.state.open ? 105 : 70, { stiffness: 130, damping: 13 }),
          }}
        >
          {({ x, y, z }) =>
            <div
              className="card-container"
              style={{
                height: `${z}px`,
              }}
            >
              {x}
              <div
                className="button-container"
              >
                <div
                  className="button-row"
                >
                  <img
                    className="emoji" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1212929/demon.svg"
                    alt="hater-button"
                  />
                  <img
                    className="emoji" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1212929/apology.png"
                    alt="hater-button"
                  />
                  <img
                    className="emoji" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1212929/aggressive.svg"
                    alt="hater-button"
                  />
                  <img
                    className="emoji" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1212929/passive.svg"
                    alt="hater-button"
                  />
                </div>
              </div>
              <div
                className="color-container"
                style={{
                  borderRadius: `3px 3px ${y}px ${y}px`,
                }}
              >
                <img
                  className="profile-image"
                  src="http://staging1.dima.co.nz/wp-content/uploads/2016/07/4.jpg"
                  alt="hater"
                  style={{
                    height: `${x}px`,
                  }}
                />
                <div className="textArea">
                  <div className="cardText card-name">Bob Jones</div>
                  <div className="cardText card-handle">@bobIsTheCoolest</div>
                </div>
              </div>
            </div>
          }
        </Motion>
      </div>
    )
  }
}

export default HaterCard
