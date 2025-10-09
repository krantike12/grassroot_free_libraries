import "./App.css";
import {
  MapContainer,
  Marker,
  Tooltip,
  Popup,
  TileLayer,
  Polygon,
} from "react-leaflet";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import LibraryData from "../src/libraryData.json.json";
import { createContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-leaflet";
import Footer from "./Footer";
import Legends from "./Legends";
import newData from "../src/newData.json";
import CustomIcon from "./CustomIcon";
import markerData from "../src/markerPopup.json";
import MapFlyto from "./MapFlyto";
import stateJson from "./states_coord.json";
import IndiaJson from "./india_state_geo.json";
import MapFlybyClick from "./MapFlybyClick";
import LibrariesData from "./libraries_data.json";

// import showNearby from "./ShowNearby";
// import ShowNearby from "./ShowNearby";
// import ShowNearbyLib from "./ShowNearbyLib";
import useNearbyLibraries from "./useNearbyLibrary";

export const SelectedContext = createContext();

function App() {
  console.log(stateJson);

  //useLibrary hook
  const { libraries, fetchLibraries } = useNearbyLibraries();
  const [map, setMap] = useState(null);

  //mapflyto trigger
  const [flytrigger, setFlyTrigger] = useState(0);

  const [nearbyclicked, setNearbyClicked] = useState(false);

  const [curPos, setCurPos] = useState({
    latitude: 21.769,
    longitude: 78.178,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [states, setStates] = useState([]);
  const [stateCount, setstateCount] = useState([]);
  const [clicked, setClicked] = useState({});
  const [distance, setDistance] = useState([]);

  // To seperate States from the array
  const getState = LibraryData.map((lbdata) => {
    const parts = lbdata.address.split(",").map((part) => part.trim());

    return parts[parts.length - 2];
  });
  const uniqueState = [...new Set(getState)];
  //setStates(uniqueState)

  //count occurence of eah state

  // const newData = LibraryData.map((lib) => ({...lib, type : "default"}))
  // console.log(newData)

  // const blob = new Blob([  JSON.stringify(newData, null, 2)], {type : 'application/json'})
  // const a = document.createElement('link')
  // const link = URL.createObjectURL(blob)
  // console.log(link)
  // a.href = link
  // a.download = 'newData.json'
  // a.style.zIndex = '1000'

  // a.click()

  //console.log(MapFlyto.lat)

  //navigation geolocation

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((data) => {
      if (!navigator.geolocation) {
        console.log(curPos);
        return;
      } else {
        console.log(data);
        setCurPos(data.coords);
        console.log(libraries);
      }
    });
  }, [libraries]);

  const counts = [];
  getState.forEach((state) => {
    if (state) {
      counts[state] = (counts[state] || 0) + 1;
    }
    //return console.log(counts);
  });

  //to combine two arrays and add a common key value pair to both the arrays

  const newArray = useMemo(() => {
    // return [...newData, ...markerData].map((item) => ({
    //   ...item,
    //   title: item.title || item.name,
    // }));
    return LibrariesData;
  }, []);

  //test libraries Data
  //console.log(LibrariesData)

  //For Library Filters like search by name, state
  const fetchedLibrary = () => {
    if (searchQuery) {
      const filterData = newArray.filter((data) =>
        data.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filterType = newArray.filter((dtype) =>
        dtype.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      //console.log(selectedLib.lat)
      //console.log(selectedLib.long)

      //setMessage(filterData.length)
      const filterDatabystate = newArray.filter((libstate) =>
        libstate.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(filterData.length);
      console.log(filterType);
      console.log(filterDatabystate.length);
      // used for merging 2 arrays so 2 different filters has been merged together
      return [
        ...new Set([
          ...filterData,
          ...filterDatabystate,
          ...filterType,
        ]).values(),
      ];
    }
    // setMessage(LibraryData.length)
    return newArray;
  };

  console.log(fetchedLibrary().length);

  useEffect(() => {
    if (curPos) {
      console.log(curPos);
    }
  }, [curPos]);

  //distance count

  //console.log("yaha tak chal rha hai")
  useEffect(() => {
    if (newArray.length === 0) {
      console.log("Data not ready yet");
    }

    //to calculate distance between two libraries
    const distanceArray = [];

    for (let i = 0; i < newArray.length; i++) {
      for (let j = i + 1; j < newArray.length; j++) {
        const lib1 = newArray[i];
        const lib2 = newArray[j];
        const distance = getDistancee({
          lat1: lib1.lat,
          long1: lib1.long,
          lat2: lib2.lat,
          long2: lib2.long,
        });

        distanceArray.push({
          from: lib1,
          to: lib2,
          distance: distance,
        });
      }
    }
    //console.log(distanceArray);

    //sort the distance array in ascending order

    const sortedDistance = distanceArray.sort(
      (a, b) => a.distance - b.distance
    );
    // console.log(sortedDistance);
    setDistance(sortedDistance);
  }, [newArray]);

  //get distance between two lat long points fixed points
  const getDistancee = ({ lat1, long1, lat2, long2 }) => {
    return (
      L.latLng(lat1, long1).distanceTo(L.latLng(lat2, long2)) / 1000
    ).toFixed(2);
  };

  useEffect(() => {
    if (distance) {
      // console.log(distance);
    }
  });

  //merging two arrays to get only desired key value pairs

  const keysTObeExtrated = ["lat", "lng", "population_2025"];
  const merged = stateJson.features.map((item1) => {
    const match = IndiaJson.features.find(
      (item2) => item2.properties.state === item1.properties.state
    );

    if (!match) return item1;

    // console.log(JSON.stringify(match))

    const selectedKey = {};
    keysTObeExtrated.forEach((key) => {
      if (key in match) {
        selectedKey[key] = match[key];
      }
    });
    const array = { ...item1, ...selectedKey };
    // console.log(JSON.stringify(array))

    return array;
  });

  useEffect(() => {
    const data = fetchedLibrary();
    //fetchedLibrary()
    setMessage(data.length);
    setStates(uniqueState);
    setstateCount(counts);
  }, [searchQuery]);

  // newArray = newArray.flat()
  //console.log(newArray);

  const getOpacityByPopulation = (population) => {
    const minPopulation = 1000; // Example minimum population
    const maxPopulation = 12000000; // Example maximum population
    return (
      ((population - minPopulation) / (maxPopulation - minPopulation)) * 0.9 +
      0.1
    );
  };

  //showmarker()

  // const showMarker =  () => {

  const showMarker = () => {
    console.log(clicked);
  };

  //alert(clicked.title)

  // const customIcon = L.icon({
  //   iconUrl: 'https://cdn-icons-png.flaticon.com/512/5241/5241603.png',
  //   iconSize: [38, 38], // Size of the icon
  //   iconAnchor: [19, 38], // Point where the icon should anchor (coordinates for centering the icon)
  //   popupAnchor: [0, -38], // Position of the popup relative to the icon
  // });

  //console.log(customIcon.options.iconUrl)

  //console.log(markerData);

  console.log(stateJson.name, stateJson.population_2025);
  //const colorOptions = {color : stateJson.population_2025 > 10000000 ? "green" : "pink"}

  //const stateRegex = /,\s*([A-Za-z\s]+),\s*\d{6}/
  useEffect(() => {
    if (map) {
      console.error("Error Occured", map);
      console.log("Map is ready", map);
    }
  }, [map]);

  useEffect(()=> {

  })

  return (
    <SelectedContext.Provider
      value={{
        searchQuery,
        fetchedLibrary,
        newArray,
        clicked,
        map,
        getDistancee,
        nearbyClicked: nearbyclicked,
        curPos
      }}
    >
      <div className="">
        {/*<li>{stateCount}</li>*/}
        {/* <<p>Total Count of Libraries : {message}</p>
    {Object.entries(stateCount).map(([state, count]) => (
     <li>{state ? state : "No State Found"} : {count} </li>
  
    ))}> */}

        {/* <p>{fetchedLibrary().map((searchlib) => (
 //<p>{searchlib.name}</p>
))}</p> */}

        <div>
          {curPos && (
            <MapContainer
              center={[curPos.latitude, curPos.longitude]}
              zoom={ 4.5}
              style={{ width: "99vw", height: "99vh", zIndex: 7 }}
              whenCreated={(mapInstance) => setMap(mapInstance)}
            >
              <Marker position={[curPos.latitude, curPos.longitude]}
              icon={CustomIcon.user}><Tooltip permanent={true} direction="top" offset={[0, -10]}>"You are here"</Tooltip></Marker>
              <input
                className="searchBar"
                type="text"
                style={{
                  position: "relative",
                  zIndex: 1000,
                  width: "200px",
                  border: "1px solid black",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a particular library"
              />
              <MapFlyto
                lat={fetchedLibrary.lat}
                long={fetchedLibrary.long}
                trigger={searchQuery? searchQuery : nearbyclicked}
              />
              <MapFlybyClick />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  detectRetina={true}

              />
              {fetchedLibrary().map((lib) => {
                const popupData = newArray.find(
                  (data) =>
                    String(data.title.toLowerCase()) ===
                    String(lib.title.toLowerCase())
                );
                //console.log(JSON.stringify(popupData))
                const stateJsonData = stateJson.features.find(
                  (sdata) =>
                    String(sdata.properties.st_nm.toLowerCase()) ===
                    String(searchQuery.toLowerCase())
                );

                // const combinedFilter = distance.find((state) => state.from === stateJsona.state)
                const nearbyLib = libraries.filter(
                  (nLib) =>
                    nLib.to.toLowerCase() === popupData.title.toLowerCase()
                );
                console.log(nearbyLib);

                return (
                  /* <Circle center={[lib.lat ,lib.long]} radius={lib.radius || 10000} opacity={getOpacityByPopulation(lib.population)} fillColor="blue" color="transparent" bindlabel={"test"}>
           <Tooltip>Population Size : {lib.population}</Tooltip> */
                  <>
                    {nearbyclicked ? (
                      libraries.map((lib) => (
                        <Marker
                          position={[lib.lat, lib.long]}
                          icon={
                            popupData.type === "default"
                              ? CustomIcon.default
                              : popupData.type === "kutumb"
                              ? CustomIcon.kutumb
                              : popupData.type === "parag"
                              ? CustomIcon.parag
                              : CustomIcon.default
                          }
                        >
                          <Popup>
                            <h1>{lib.to}</h1>
                            <br></br>
                            {popupData.address.split("<a href")[0]} <br></br>
                            <a href={lib.link}> Read More</a>
                          </Popup>
                          {stateJsonData &&
                            stateJsonData.geometry.type.toLowerCase() ===
                              "polygon" && (
                              <Polygon
                                positions={stateJsonData.geometry.coordinates.map(
                                  (ring) => ring.map(([lng, lat]) => [lat, lng])
                                )}
                                pathOptions={{
                                  color:
                                    stateJsonData.properties.population_2025 >
                                    10000000
                                      ? "green"
                                      : "blue",
                                }}
                              >
                                <Tooltip>
                                  {stateJsonData.properties.population_2025}
                                </Tooltip>
                              </Polygon>
                            )}
                          <p
                            style={{
                              position: "relative",
                              zIndex: 1200,
                              left: "40px",
                            }}
                          >
                            {popupData.length}
                          </p>
                        </Marker>
                      ))
                    ) : (
                      <Marker
                        position={[popupData.lat, popupData.long]}
                        icon={
                          popupData.type === "default"
                            ? CustomIcon.default
                            : popupData.type === "kutumb"
                            ? CustomIcon.kutumb
                            : popupData.type === "parag"
                            ? CustomIcon.parag
                            : CustomIcon.default
                        }
                      >
                        <Popup>
                          <h1>{popupData.title}</h1>
                          <br></br>
                          {popupData.address.split("<a href")[0]} <br></br>
                          <a href={popupData.Url}> Read More</a>
                        </Popup>
                        {stateJsonData &&
                          stateJsonData.geometry.type.toLowerCase() ===
                            "polygon" && (
                            <Polygon
                              positions={stateJsonData.geometry.coordinates.map(
                                (ring) => ring.map(([lng, lat]) => [lat, lng])
                              )}
                              pathOptions={{
                                color:
                                  stateJsonData.properties.population_2025 >
                                  10000000
                                    ? "green"
                                    : "blue",
                              }}
                            >
                              <Tooltip>
                                {stateJsonData.properties.population_2025}
                              </Tooltip>
                            </Polygon>
                          )}
                        <p
                          style={{
                            position: "relative",
                            zIndex: 1200,
                            left: "40px",
                          }}
                        >
                          {popupData.length}
                        </p>
                      </Marker>
                    )}
                  </>
                );
              })}
              <MapFlyto
                lat={curPos.latitude}
                long={curPos.longitude}
                zoom={4.5}
                trigger={searchQuery}
                preferCanvas={true}
  zoomAnimation={true}
  zoomAnimationThreshold={10}
  scrollWheelZoom={true}
                //trigger={flytrigger}
              />

              <Legends customIcon={CustomIcon} />
            </MapContainer>
          )}
          {/* details bar removed from map container */}
          <div className="detailsBar">
            {" "}
            <p>
              <strong>
                Total No. of Libraries :{" "}
                {nearbyclicked ? libraries.length : fetchedLibrary().length}
              </strong>
            </p>{" "}
            {nearbyclicked
              ? libraries.map((nearby) => <li><a href={nearby.link}>{nearby.to}</a></li>)
              : fetchedLibrary().map((data) => (
                  <div>
                    {" "}
                    <ol
                      className="ol_detail"
                      onClick={() => {
                        setClicked(data);
                      }}
                    >
                      {" "}
                      <a href={data.Url} target="blank">
                        {" "}
                        {data.title}{" "}
                      </a>{" "}
                    </ol>{" "}
                  </div>
                ))}{" "}
          </div>
          
          {/* <div className="nearbyBtn"> */}
          <button
            onClick={() => {
              fetchLibraries();
              setNearbyClicked(!nearbyclicked);
              setFlyTrigger(Date.now());
            }}
            style={{
              position: 'absolute',
    zIndex: '2000',
    top: '10px',
    left: '256px',
    background: 'white',
    padding: '7px',
    borderRadius: '5px',
    border:' 1px solid black',
            }}
          >
            {nearbyclicked
              ? "Show All Libraries"
              : "Show near you!"}
          </button>
          </div>
        {/* </div> */}
        <Footer />
      </div>
    </SelectedContext.Provider>
  );
}

export default App;
