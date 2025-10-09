import React, { useContext, useEffect, useRef } from 'react'
import {SelectedContext} from './App'
import { MapContainer, Popup, useMap } from 'react-leaflet'
import statesJson from "./states_coord.json"

function MapFlyto({ trigger }) {
        const map = useMap()
       // const popupRef = useRef(null)




    const {searchQuery, fetchedLibrary, newArray, nearbyClicked, curPos} = useContext(SelectedContext)
    //console.log(searchQuery)

   //console.log("curPos in MapFlyto:", curPos);


    //console.table(statesJson)

    //const libraries = fetchedLibrary()
    //console.log(newArray)
    
    const selectedLib = newArray.find(lib => lib?.title.toLowerCase() === searchQuery?.toLowerCase())
    //console.log(selectedLib)
    // console.log(Array.isArray(statesJson.features)) // should be true
    //console.log(statesJson.features[0]?.properties?.st_nm) // should log first state name
    
    const  normalise = str => String(str).trim().toLowerCase()
    const selectedState = statesJson.features.find(data => normalise(data?.properties.state) === normalise(searchQuery))
    //console.log(JSON.stringify(selectedState))

    //const updatedFilter = [selectedLib, selectedState].filter(Boolean)
    //console.log(updatedFilter)
    useEffect(()=>{
        if(nearbyClicked){
        map.flyTo([curPos.latitude, curPos.longitude], 13, {animate : true, duration : 1})

    }
    else{
        map.flyTo([23.5, 88.67], 4.7) 

    }

    }, [curPos, nearbyClicked])

      useEffect(() => {
        
    if(!searchQuery){
        return
    }
         if(selectedLib && selectedLib?.lat && selectedLib?.long) {
         //console.log(selectedLib.lat + selectedLib.long + trigger + selectedState.lat + selectedState.lng)
        map.flyTo([selectedLib.lat, selectedLib.long], 10)
       
        // setTimeout(() => {
        //     popupRef.current?.openOn(map)

        // }, 3000)
    }
 
    else if(selectedState && selectedState?.properties.lat && selectedState?.properties?.lng){
        
        map.flyTo([selectedState.properties.lat, selectedState.properties.lng], 10)
    }
    else{
        map.flyTo([23.5, 88.67], 4.7) 
    }

    }, [ map, searchQuery, selectedLib, selectedState, trigger, curPos, nearbyClicked ])
   

    return null



  


   
 
}

export default MapFlyto