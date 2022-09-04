import * as React from "react"
import {useState, useRef} from "react"

import Interface from "./interface"
import Map from "./map"
import {Data} from "./types"

const defaults = {
  title: "",
  zoom: 3,
  center: {
    lat: 0,
    lng: 0,
  },
  poi: [],
} as Data

export default function App() {
  const zoom = useRef(defaults.zoom)
  const center = useRef<google.maps.LatLngLiteral>(defaults.center)

  const [hasSetCenterAndZoom, setHasSetCenterAndZoom] = useState(false)
  const [data, setData] = useState<Data>(defaults)
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null)

  const element = document.body.querySelector("#map") as HTMLElement

  return (
    <div>
      <Interface
        data={data}
        onDataChange={(data) => {
          setData(data)
        }}
        selectedPoi={selectedPoi}
        onSelectedPoiChange={(text) => setSelectedPoi(text)}
        onUseCenterAndZoomClick={() => {
          setData({...data, center: center.current, zoom: zoom.current})
          setHasSetCenterAndZoom(true)
        }}
      />
      <Map
        center={data.center}
        zoom={data.zoom}
        element={element}
        markers={data.poi.map((p) => {
          return {...p, selected: selectedPoi === p.text}
        })}
        onClick={(position) => {
          if (!hasSetCenterAndZoom) return

          setData({
            ...data,
            poi: [
              ...data.poi,
              {position, text: `${position.lat}, ${position.lng}`},
            ],
          })
          setSelectedPoi(null)
        }}
        onChange={(c, z) => {
          center.current = c
          zoom.current = z
        }}
      />
    </div>
  )
}
