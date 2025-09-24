import React, { useState } from 'react'
import { useEffect } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import CustomIcon from './CustomIcon'

function Legends() {

    const [clicked, setClicked] = useState(false)

    console.log(CustomIcon)

    const map = useMap()

     useEffect(()=> {
      const entries = Object.entries(CustomIcon)
      console.log(entries)
    }, [])
   
    
    useEffect(() => {

        const handleClick = () => {
          alert("clicked")
    }

   
     
      const legends = L.control({position : 'bottomright'})


    
    
      legends.onAdd = () => {
      const div = L.DomUtil.create('div', 'information-box')
        Object.entries(CustomIcon).forEach(([type, icon]) => {
                    div.innerHTML += `<div style="display : flex; align-items : center" data-type="${type}"> <img src="${icon.options.iconUrl}" width="30px" /> ${type.charAt(0).toUpperCase() + type.slice(1)} </div> `})
                    div.style.backgroundColor = "white"
                    div.style.display = "flex"
                    div.style.flexDirection = "column"
                    div.style.borderRadius = '10px'
                    
                    div.style.padding = '10px'
        

    
             return div

        

            
       }

      
    
      legends.addTo(map)

      return () => {
        map.removeControl(legends)
      }
    
    
    }, [map, ])
    
    
  return (
   <></>
  )
}

export default Legends