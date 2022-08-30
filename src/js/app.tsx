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

const AnyReactComponent = (_props: {lat: number; lng: number}) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#000"
      viewBox="0 0 24 24"
      style={{height: 24, width: 24}}
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        stroke="#000"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 9a1 1 0 11-2 0 1 1 0 012 0z"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        stroke="#000"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.5 9.5c0 3.038-2 6.5-5.5 10.5-3.5-4-5.5-7.462-5.5-10.5a5.5 5.5 0 1111 0z"
      />
    </svg>
  </div>
)

interface Data {
  center: google.maps.LatLngLiteral | null
  poi: Array<google.maps.LatLngLiteral & {desc: string}>
}

export default function App() {
  const [zoom, setZoom] = useState(defaults.zoom)
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(
    defaults.center,
  )
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
        onClick={(value: ClickEventValue) =>
          setData({...data, center: {lat: value.lat, lng: value.lng}})
        }
      >
        {data.center && (
          <AnyReactComponent lat={data.center.lat} lng={data.center.lng} />
        )}
      </GoogleMapReact>
    </div>
  )
}
