import { createContext, useContext, useEffect, useState } from "react";
// import { SelectedContext } from "./App";
// import LibraryArray from './libraries_data.json'
import L from 'leaflet'

export default function useNearbyLibraries() {
  const [libraries, setLibraries] = useState([]);
  const [coordinate, setcoordinate] = useState({})
  const [newArray, setNewArray] = useState([])
 // const {newArray} = useContext(SelectedContext)

 useEffect(() => { 
     // return [...newData, ...markerData].map((item) => ({
     //   ...item,
     //   title: item.title || item.name,
     // }));
     const fetchData = async () => {
      try {
         const response = await fetch("http://localhost:5000/api/libraries"); 
         const data = await response.json();
         console.log(data)
         setNewArray(data.library || []);
         return data.library;  
       } catch (error) {
         console.error("Error fetching data:", error);
       }
       finally {
         //console.log("Fetch attempt finished.");
       }
     }
 
     fetchData();
 
   },  []);
 
   useEffect(() => {
     console.log(newArray);
   }, [newArray]) 

  useEffect(() => {
   // console.log(newArray)
      if(coordinate){
       // console.log(coordinate.longitude, coordinate.latitude)
        
      }
     }, [coordinate])
  
  const fetchLibraries = () => {

        navigator.geolocation.getCurrentPosition((data)=>{
          if(data){
        console.log(data.coords)
        setcoordinate(data.coords)

          } 
          else{
            console.error("No data available")
          }
      

          //find distance in callback

         const nearbyDistance = []

    for(let i=0; i< newArray.length; i++){
        const lib1 = newArray[i]

       const distance = (
           L.latLng(data.coords.latitude, data.coords.longitude).distanceTo(L.latLng(lib1.lat, lib1.long)) / 1000
                      // L.latLng(8.492413072, 76.9560925).distanceTo(L.latLng(lib1.lat, lib1.long)) / 1000

      ).toFixed(2)


       nearbyDistance.push({
        distance : distance,
        from : "User",
        to : lib1.title,
        lat : lib1.lat,
        long : lib1.long,
        user_lat : data.coords.latitude,
        user_long : data.coords.longitude,
        link : lib1.Url,
        address : lib1.address
       })
        
    }          
    
   console.log(nearbyDistance)

   //get within 10km
   const within10Km = nearbyDistance.filter(dist => Number(dist.distance) <= Number(15))
    console.log(within10Km)
    setLibraries(within10Km)
        })

  

    //getnearbydistance
    


    
     


   

 
};

 


  return {libraries,  fetchLibraries };
}
