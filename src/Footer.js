import React from 'react'
import "./App.css"

const Footer = () => {
  return (
    <div className="footer" style={{color: 'black', position: 'fixed', width: '100%', zIndex: '200', bottom: '0'}}>
        <span style={{display: "flex" , alignItems: 'center', alignContent: "center", justifyContent: "center"}}>All rights reserve to <a style={{marginLeft: 5}} href='https://www.fln.org.in'>Free Libraries Network FLN</a> <img src="https://pbs.twimg.com/media/FKQlC5SaAAQHH6J.png" width="68px" height="41px"></img></span>

    </div>
  )
}

export default Footer