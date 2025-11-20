import "./App.css";
import {
  MapContainer,
  Marker,
  Tooltip,
  Popup,
  TileLayer,
  Polygon, } from "react-leaflet";
import {CookieConsent} from 'react-cookie-consent'
import { Route, Routes } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LibraryData from "../src/libraryData.json.json";
import { createContext, useEffect, useState } from "react";
import Footer from "./Footer";
import Legends from "./Legends";
import CustomIcon from "./CustomIcon";
import MapFlyto from "./MapFlyto";
import stateJson from "./states_coord.json";
import IndiaJson from "./india_state_geo.json";
import MapFlybyClick from "./MapFlybyClick";
import { ToastContainer } from "react-toastify";
import useNearbyLibraries from "./useNearbyLibrary";
import AddLibraries from "./AddLibraries";
import ShowLibraries from "./ShowLibraries";
import React from "react";

export const SelectedContext = createContext();

function App() {

  //for AI chatbot (Gemini based)

  const [chatMessage, setChatMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isThinking, setisThinking] = useState(false);
  const [clickedAi, setClickedAi] = useState(false);
  const [aiQuery, setAiQuery] = useState("");



  //console.log("AI Questions:", chatMessage);


  //function for chat agent
  function checkText(event) {
    event.preventDefault();
    if (!aiQuery || aiQuery.trim() === "") {
      alert("Please Add some input first");
      return;
    }
  }

  //useLibrary hook for nearbyLibraries
  const { libraries, fetchLibraries } = useNearbyLibraries();
  const [map, setMap] = useState(null);

  //const [flytrigger, setFlyTrigger] = useState(0);

  const [nearbyclicked, setNearbyClicked] = useState(false);
  const [curPos, setCurPos] = useState({
    latitude: 21.769,
    longitude: 78.178,
  });
  const [clicked, setClicked] = useState({});
  const [newArray, setNewArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

    const [distance, setDistance] = useState([]);


  // const [states, setStates] = useState([]);
  // const [stateCount, setstateCount] = useState([]);

  // To seperate States from the array
  const getState = LibraryData.map((lbdata) => {
    const parts = lbdata.address.split(",").map((part) => part.trim());
    return parts[parts.length - 2];
  });
  const uniqueState = [...new Set(getState)];


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


  //navigation geolocation

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((data) => {
      if (!navigator.geolocation) {
        return;
      } else {
        setCurPos(data.coords);
      }
    });
  }, [libraries]);


  //Count States
  const counts = [];
  getState.forEach((state) => {
    if (state) {
      counts[state] = (counts[state] || 0) + 1;
    }
    //return console.log(counts);
  });

  //to combine two arrays and add a common key value pair to both the arrays

  useEffect(() => {
    // return [...newData, ...markerData].map((item) => ({
    //   ...item,
    //   title: item.title || item.name,
    // }));
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/libraries");
        const data = await response.json();
        // have to change this when switch to normal setNewArray(data.libraries || []);
        console.log(data.library)
        setNewArray(data.library || []);
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        //console.log("Fetch attempt finished.");
      }
    };

    fetchData();

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
      // console.log(filterData.length);
      // console.log(filterType);
      // console.log(filterDatabystate.length);
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
        console.log(newArray);

    return newArray;
  };

  //console.log(fetchedLibrary().length);

  useEffect(() => {
    if (curPos) {
      // console.log(curPos);
    }
  }, [curPos]);

  //distance count

  //console.log("yaha tak chal rha hai")
  useEffect(() => {
    if (newArray.length === 0) {
      // console.log("Data not ready yet");
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

  // useEffect(() => {
  //   if (distance) {
  //     // console.log(distance);
  //   }
  // });

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

  // useEffect(() => {
  //   const data = fetchedLibrary();
  //   //fetchedLibrary()
  //   setStates(uniqueState);
  //   setstateCount(counts);
  // }, [searchQuery]);

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

  // const showMarker = () => {
  //   //console.log(clicked);
  // };

  //alert(clicked.title)

  // const customIcon = L.icon({
  //   iconUrl: 'https://cdn-icons-png.flaticon.com/512/5241/5241603.png',
  //   iconSize: [38, 38], // Size of the icon
  //   iconAnchor: [19, 38], // Point where the icon should anchor (coordinates for centering the icon)
  //   popupAnchor: [0, -38], // Position of the popup relative to the icon
  // });

  //console.log(customIcon.options.iconUrl)

  //console.log(markerData);

  //console.log(stateJson.name, stateJson.population_2025);
  //const colorOptions = {color : stateJson.population_2025 > 10000000 ? "green" : "pink"}

  //const stateRegex = /,\s*([A-Za-z\s]+),\s*\d{6}/
  // useEffect(() => {
  //   if (map) {
  //     console.error("Error Occured", map);
  //     // console.log("Map is ready", map);
  //   }
  // }, [map]);


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
        curPos,
        setNewArray,
      }}
    >
      <Routes>
        <Route
          exact
          path="/"
          element={
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
                    zoom={4.5}
                    style={{ width: "100vw", height: "96.3vh", zIndex: 7 }}
                    whenCreated={(mapInstance) => setMap(mapInstance)}
                  >
                    <Marker
                      position={[curPos.latitude, curPos.longitude]}
                      icon={CustomIcon.user}
                    >
                      <Tooltip
                        permanent={true}
                        direction="top"
                        offset={[0, -10]}
                      >
                        "You are here"
                      </Tooltip>
                    </Marker>
                    <div
                      className="searchBarDiv"
                      style={{
                        display: "flex",
                        position: "absolute",
                        width: "220px",
                        height: "40px",
                        zIndex: 1200,
                        
                      }}
                    >
                      <input
                        className="searchBar"
                        type="text"
                        style={{
                          width: "180px",
                        }}
                        value={clickedAi ? aiQuery : searchQuery}
                        onChange={(e) => {
                          clickedAi
                            ? setAiQuery(e.target.value)
                            : setSearchQuery(e.target.value);
                        }}
                        placeholder={
                          clickedAi
                            ? "Ask any question"
                            : "Search for a particular library"
                        }
                      />

                      <img 
                        className = "drop-shadow-sm"
                        style={{ cursor: "pointer" }}
                        title="Click to use Ai"
                        onClick={() => {
                          setClickedAi(!clickedAi);
                        }}
                        alt="loader"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Google_Bard_logo.svg/1200px-Google_Bard_logo.svg.png"
                      ></img>
                    </div>
                    <MapFlyto
                      lat={fetchedLibrary.lat}
                      long={fetchedLibrary.long}
                      trigger={searchQuery ? searchQuery : nearbyclicked}
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
                          nLib.to.toLowerCase() ===
                          popupData.title.toLowerCase()
                      );
                      // console.log(nearbyLib);

                      return (
                        /* <Circle center={[lib.lat ,lib.long]} radius={lib.radius || 10000} opacity={getOpacityByPopulation(lib.population)} fillColor="blue" color="transparent" bindlabel={"test"}>
           <Tooltip>Population Size : {lib.population}</Tooltip> */
                        <>
                          {nearbyclicked ? (
                            libraries.map((lib) => (
                              <Marker
                                position={[lib.lat, lib.long]}
                                icon={
                                  // popupData.type === "default"
                                  //   ? CustomIcon.default
                                  //   : popupData.type === "kutumb"
                                  //   ? CustomIcon.kutumb
                                  //   : popupData.type === "parag"
                                  //   ? CustomIcon.parag
                                  //   : CustomIcon.default
                                  CustomIcon.default
                                }
                              >
                                <Popup>
                                  <h1>{lib.to}</h1>
                                  <br></br>
                                  {lib.address.split("<a href")[0]} <br></br>
                                  Distance from you : {lib.distance} km{" "}
                                  <br></br>
                                  <a href={lib.link}> Read More</a>
                               
                                </Popup>
                                {stateJsonData &&
                                  stateJsonData.geometry.type.toLowerCase() ===
                                    "polygon" && (
                                    <Polygon
                                      positions={stateJsonData.geometry.coordinates.map(
                                        (ring) =>
                                          ring.map(([lng, lat]) => [lat, lng])
                                      )}
                                      pathOptions={{
                                        color:
                                          stateJsonData.properties
                                            .population_2025 > 10000000
                                            ? "green"
                                            : "blue",
                                      }}
                                    >
                                      <Tooltip>
                                        {
                                          stateJsonData.properties
                                            .population_2025
                                        }
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
                                <div className="font-mono">
                                <h1>{popupData.title}</h1>
                                <br></br>
                                {popupData.address.split("<a href")[0]}{" "}
                                <br></br>
                                <div className="">
                                <a href={popupData.Url}> Read More</a>
                                <br></br>
                                   <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/place/${popupData.lat}+${popupData.long}/@25.6300048,45.6304251,17z/data=!3m1!4b1!4m4!3m3!8m2!3d25.63!4d45.633?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D`}>Get Directions</a>
                                   </div>
                                   </div>
                              </Popup>
                              {stateJsonData &&
                                stateJsonData.geometry.type.toLowerCase() ===
                                  "polygon" && (
                                  <Polygon
                                    positions={stateJsonData.geometry.coordinates.map(
                                      (ring) =>
                                        ring.map(([lng, lat]) => [lat, lng])
                                    )}
                                    pathOptions={{
                                      color:
                                        stateJsonData.properties
                                          .population_2025 > 10000000
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
                <div
                  className="detailsBar" 
                  style={clickedAi ? { width: "350px", boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)' } : { width: "230px" } }
                >
                  {clickedAi ? (
                    <div className="aiResponse" style={{display: 'flex', flexDirection : 'column'}}>
                      {chatMessage.map((mssg, index) => (
                        <React.Fragment key={index}>
                        <div className="chatContainer" style={mssg.role ==="user" ? { alignSelf : 'end'} : {display : 'flex', float : 'left'}  }>
                          <p className="chatMessage"
                            style={
                              mssg.role === "user"
                                ? { textAlign: "right" }
                                : { textAlign: "left" } }
                            id={index}
                          >
                            {" "}
                            {mssg.role === "user" ? "You : " : "AI : "}{" "}
                            {mssg.content}{" "}
                          </p>
                          <div className="loadingText">
                            {mssg.role ==="user" && index === chatMessage.length - 1 && loading && isThinking && <p className="loading">thinking...</p>}
                          </div>
                        </div>

                      </React.Fragment>

                      ))}
                    </div>
                  ) : (
                    <>
                      <p>

                        <strong>
                          Total No. of Libraries :{" "}
                          {nearbyclicked
                            ? libraries.length
                            : fetchedLibrary().length}
                        </strong>
                      </p>{" "}
                      {nearbyclicked
                        ? libraries.map((nearby) => (
                            <ol className="nearbyClickedLib">
                              <a href={nearby.link}>{nearby.to}</a>
                            </ol>
                          ))
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
                    </>
                  )}
                </div>

                {/* <div className="nearbyBtn"> */}
                {clickedAi ? (
                  <button className="searchAibtn" disabled={loading}
                    style={
                      
                      loading ? {cursor : 'not-allowed', opacity: 0.5} : {cursor : 'pointer'}
                    }
                    onClick={(e) => {
                      checkText(e);
                      //aiFunction(aiQuery)
                      setChatMessage((prev) => [
                        ...prev,
                        { role: "user", content: aiQuery },
                      ]);
                      setisThinking(true);
                      setLoading(true);

                      fetch("http://localhost:5000/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user: aiQuery }),
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          const aiData = typeof data === "string" ? data : data?.statusText || "Server Not responding";
                          console.log(aiData);
                          console.log(JSON.stringify({ user: aiQuery }))
                          setAiQuery('')
                          setisThinking(false);
                          setLoading(false);
                          setChatMessage((prev) => [
                            ...prev,
                            { role: "ai", content: aiData },
                          ]);
                        });
                    }}
                  >
                    {" "}
                    Search{" "}
                  </button>
                ) : (
                  <button 
                   className="bg-blue-400 border  border-white hover:bg-black text-white"
                    title={
                      nearbyclicked
                        ? "list of free and grassroot libraries"
                        : "nearby libraries upto 15km"
                    }
                    onClick={() => {
                      fetchLibraries();
                      setNearbyClicked(!nearbyclicked);
                      //setFlyTrigger(Date.now());
                    }}
                    style={{
                      position: "absolute",
                      zIndex: "2000",
                      top: "11.5px",
                      left: "270px",
                      padding: "7px",
                      borderRadius: "5px",
                    }}
                  >
                    {nearbyclicked ? "Show All Libraries" : "Show near you!"}
                  </button>
                )}
              </div>
              {/* </div> */}
              <Footer />
            </div>
          }
        />
        <Route path="/add" element={<AddLibraries />} />
        <Route path="/show" element={<ShowLibraries />}></Route>
      </Routes>

      <CookieConsent
  location="bottom"
  buttonText="Sure man!!"
  cookieName="myAwesomeCookieName2"
  style={{ background: "#2B373B" }}
  buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
  expires={150}
>
  This website uses cookies to enhance the user experience.{" "}
  <span style={{ fontSize: "10px" }}></span>
</CookieConsent>

      <ToastContainer autoClose={3000} theme="colored" position="top-right" />
    </SelectedContext.Provider>
  );
}

export default App;
