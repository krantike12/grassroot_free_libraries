import { useState } from "react";

export default function ShowNearby() {

    const [coords, setCoords] = useState({})

    const getData = () => {
        alert("clicked")
    }

    return {
getData
    }

}