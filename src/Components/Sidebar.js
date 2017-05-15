import React from 'react'

import HaterCard from './HaterCard'
import './Styles/css/Sidebar.css'

const Sidebar = ({ haters }) => {
  return (
    <div className="container-all">
      <div>
        { haters.map(hater => <HaterCard key={hater.user_id} hater={hater} />) }
      </div>
    </div>
  )
}

export default Sidebar
