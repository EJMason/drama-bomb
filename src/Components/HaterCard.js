import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'

import './Styles/css/HaterCard.css'

class HaterCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  handleMouseDown = () => {
    this.setState({ open: !this.state.open })
  }

  handleTouchStart = e => {
    e.preventDefault()
    this.handleMouseDown()
  }

  render() {
    console.log('This props ', this.props)
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
                  src={this.props.hater.image}
                  alt="hater"
                  style={{
                    height: `${x}px`,
                  }}
                />
                <div className="textArea">
                  <div className="cardText card-name">{this.props.hater.first_name}</div>
                  <div className="cardText card-handle">@{this.props.hater.screen_name}</div>
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
