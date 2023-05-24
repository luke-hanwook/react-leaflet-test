import React, { useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  useMapEvent
} from "react-leaflet";
import icon from "./constants";
import "./styles.css";
import { point, bearing, distance, destination } from "@turf/turf";
const nums = [0, 1, 2, 3, 4];

function MyComponent({ mcenter }) {
  const initialMarkersState = nums.map((n) => [51.505, -0.08 + 0.01 * n]);
  const [markers, setMarkers] = useState(initialMarkersState);
  const [center, setCenter] = useState(mcenter);

  const map = useMapEvent("move", () => {
    const { lat, lng } = map.getCenter();
    setCenter([lat, lng]);
    const start = point(center);
    const end = point([lat, lng]);
    const centerBearing = bearing(start, end);
    const centerDistance = distance(start, end);

    setMarkers((prevState) => {
      const newState = [...prevState];
      nums.forEach((n) => {
        newState[n] = destination(
          point(prevState[n]),
          centerDistance,
          centerBearing
        ).geometry.coordinates;
      });
      return newState;
    });
  });

  return (
    <>
      {markers.map((position, i) => (
        <Marker position={position} key={i} icon={icon}></Marker>
      ))}
    </>
  );
}

function Simple() {
  const markerRef = useRef();
  const [marker, setMarker] = useState([51.505, -0.09]);
  const initialMarkersState = nums.map((n) => [51.505, -0.08 + 0.01 * n]);
  const [markers, setMarkers] = useState(initialMarkersState);

  const handleMarkerDrag = (e) => {
    setMarker(e.latlng);
    const lat = e.target.getLatLng().lat;
    const lng = e.target.getLatLng().lng + 0.01;
    setMarkers((prevState) => {
      const newState = [...prevState];
      nums.forEach((n) => {
        newState[n] = [lat, lng + 0.01 * n];
      });
      return newState;
    });
  };

  const handleClick = (e) => {
    const { current: cmarker = {} } = markerRef;
    cmarker.setLatLng([51.505, -0.1]);
  };

  return (
    <div>
      <LeafletMap center={[51.505, -0.09]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker
          ref={markerRef}
          position={marker}
          draggable
          ondrag={handleMarkerDrag}
          icon={icon}
        />
        {markers.map((position, i) => (
          <Marker position={position} key={i} icon={icon}></Marker>
        ))}
        <MyComponent mcenter={[51.505, -0.09]} />
      </LeafletMap>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

// const arr = [];
// for (let i = 0; i < 100; i++) arr.push(i);
// return <Simple nums={[0, 1, 2, 3, 4]} />;

export default function App() {
  return <Simple />;
}
