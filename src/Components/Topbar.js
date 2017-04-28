import React from 'react'

import tweet from '../../public/tweet.svg'
import './Styles/css/Topbar.css'

const Topbar = ({ logout, picture, name, screen }) => {
  const biggerImage = picture.replace('_normal', '')
  const names = name.split(' ')
  const fName = names[0]
  const lName = names[1] ? names[1].charAt(0) : ''
  return (
    <div className="topbar-container">
      <img
        className="tweet-logo"
        src={tweet}
        alt="logo"
      />
      <div className="profile-container">
        <div className="profile-text-container">
          <div className="handle">@{screen}</div>
          <div className="username">{fName} {lName}</div>
        </div>
        <input
          type="image"
          src={biggerImage}
          className="userImage"
          onClick={logout}
        />
      </div>
      <div className="test" />
    </div>
  )
}

export default Topbar
