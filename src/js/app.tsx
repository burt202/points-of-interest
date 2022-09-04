import * as React from "react"
import {useState, useRef} from "react"

import {defaults} from "./constants"
import Import from "./import"
import Interface from "./interface"
import Map from "./map"
import {Data} from "./types"

export default function App() {
  const zoom = useRef(defaults.zoom)
  const center = useRef<google.maps.LatLngLiteral>(defaults.center)

  const [hasSetCenterAndZoom, setHasSetCenterAndZoom] = useState(false)
  const [data, setData] = useState<Data | null>(null)
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null)

  const element = document.body.querySelector("#map") as HTMLElement

  return (
    <div>
      {data === null ? (
        <Import onDataSet={(data) => setData(data)} />
      ) : (
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
      )}
      <Map
        center={data?.center ?? center.current}
        zoom={data?.zoom ?? zoom.current}
        element={element}
        markers={(data?.poi || []).map((p) => {
          return {...p, selected: selectedPoi === p.text}
        })}
        onClick={(position) => {
          if (!hasSetCenterAndZoom || !data) return

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
