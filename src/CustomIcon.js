import React from 'react'
import L from 'leaflet'

    const CustomIcon = {
        default : L.icon({
          iconId : 1,
      iconUrl: 'https://www.fln.org.in/wp-content/uploads/2024/04/placeholder.png',
      iconSize: [38, 38], // Size of the icon
      iconAnchor: [19, 38], // Point where the icon should anchor (coordinates for centering the icon)
      popupAnchor: [0, -38], // Position of the popup relative to the icon
    }),

    kutumb : L.icon({
                iconId : 2,

      iconUrl: 'https://png.pngtree.com/png-vector/20230617/ourmid/pngtree-star-location-pin-in-yellow-gradation-color-vector-png-image_7153736.png',
      iconSize: [38, 38], // Size of the icon
      iconAnchor: [19, 38], // Point where the icon should anchor (coordinates for centering the icon)
      popupAnchor: [0, -38], // Position of the popup relative to the icon
    }),

    parag : L.icon({
                iconId : 3,

      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4890/4890457.png',
      iconSize: [38, 38], // Size of the icon
      iconAnchor: [19, 38], // Point where the icon should anchor (coordinates for centering the icon)
      popupAnchor: [0, -38], // Position of the popup relative to the icon
    }),

    user : L.icon({
      iconId : 4,
      iconUrl : "https://cdn-icons-png.freepik.com/512/61/61942.png",
      iconSize: [38, 38], // Size of the icon
      iconAnchor: [19, 38], // Point where the icon should anchor (coordinates for centering the icon)
      popupAnchor: [0, -38], // Position of the popup relative to the icon

    })
    }
export default CustomIcon