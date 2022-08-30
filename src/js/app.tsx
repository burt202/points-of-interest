import GoogleMapReact, {
  ChangeEventValue,
  ClickEventValue,
} from "google-map-react"
import * as React from "react"
import {useState} from "react"

const defaults = {
  zoom: 3,
  center: {
    lat: 0,
    lng: 0,
  },
}

const Marker = ({
  size,
  colour,
}: {
  lat: number
  lng: number
  size: number
  colour: string
}) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={colour}
      viewBox="0 0 24 24"
      style={{height: size, width: size}}
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        stroke={colour}
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 9a1 1 0 11-2 0 1 1 0 012 0z"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        stroke={colour}
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.5 9.5c0 3.038-2 6.5-5.5 10.5-3.5-4-5.5-7.462-5.5-10.5a5.5 5.5 0 1111 0z"
      />
    </svg>
  </div>
)

interface Data {
  center: google.maps.LatLngLiteral | null
  poi: Array<google.maps.LatLngLiteral & {desc: string; selected?: boolean}>
}

export default function App() {
  const [zoom, setZoom] = useState(defaults.zoom)
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(
    defaults.center,
  )
  const [mode, setMode] = useState<"center" | "poi">("center")
  const [data, setData] = useState<Data>({center: null, poi: []})

  const onChange = (value: ChangeEventValue) => {
    setZoom(value.zoom)
    setCenter(value.center)
  }

  return (
    <div style={{width: "100%", height: "60vh"}}>
      <GoogleMapReact
        bootstrapURLKeys={{key: "AIzaSyBe9ZEtNhRArJDvoWXtR1EbKViaICpQkQs"}}
        defaultCenter={defaults.center}
        defaultZoom={defaults.zoom}
        center={center}
        zoom={zoom}
        onChange={onChange}
        onClick={(value: ClickEventValue) => {
          if (mode === "center") {
            setData({...data, center: {lat: value.lat, lng: value.lng}})
          } else {
            setData({
              ...data,
              poi: [
                ...data.poi,
                {lat: value.lat, lng: value.lng, desc: "fhfjkl"},
              ],
            })
          }
        }}
      >
        {data.center && (
          <Marker
            lat={data.center.lat}
            lng={data.center.lng}
            size={48}
            colour="red"
          />
        )}
        {data.poi.map((poi) => (
          <Marker lat={poi.lat} lng={poi.lng} size={36} colour="green" />
        ))}
      </GoogleMapReact>
      <input
        type="radio"
        id="center"
        name="mode"
        value="center"
        onChange={() => setMode("center")}
        checked={mode === "center"}
      />
      <label htmlFor="center">Set center</label>
      <input
        type="radio"
        id="poi"
        name="mode"
        value="poi"
        onChange={() => setMode("poi")}
        checked={mode === "poi"}
      />
      <label htmlFor="poi">Set POI</label>
    </div>
  )
}
