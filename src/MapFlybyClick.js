import React, {useContext, useEffect, useState } from 'react'
import MapFlyto from './MapFlyto'
import { SelectedContext } from './App'
import { useMap } from 'react-leaflet'

const MapFlybyClick = () => {

    const {clicked} = useContext(SelectedContext)
    console.log(clicked)

    useEffect(() => {
        if(clicked){
            console.log("mapflyto called" + clicked.lat + clicked.long)
        }
    }, [clicked])

    return (
        <MapFlyto trigger={clicked} lat = {clicked.lat} long = {clicked.long}/>
    )

}

export default MapFlybyClick