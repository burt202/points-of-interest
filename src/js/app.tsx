import * as React from "react"
import {useState, useRef} from "react"

import List from "./list"
import Map from "./map"
import {Data} from "./types"

const defaults = {
  name: "Amsterdam", // TODO
  zoom: 3,
  center: {
    lat: 0,
    lng: 0,
  },
  poi: [],
}

export default function App() {
  const zoom = useRef(defaults.zoom)
  const center = useRef<google.maps.LatLngLiteral>(defaults.center)

  const [hasSetCenterAndZoom, setHasSetCenterAndZoom] = useState(false)
  const [data, setData] = useState<Data>(defaults)
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null)

  const element = document.body.querySelector("#map") as HTMLElement

  return (
    <div>
      <div style={{padding: 16}}>
        {hasSetCenterAndZoom && (
          <List
            poi={data.poi}
            selectedPoi={selectedPoi}
            onItemSelect={(text) => setSelectedPoi(text)}
            onPoiChange={(poi) => setData({...data, poi})}
          />
        )}
        <button
          onClick={() => {
            setData({...data, center: center.current, zoom: zoom.current})
            setHasSetCenterAndZoom(true)
          }}
        >
          Use current center and zoom
        </button>
        <p>
          <a id="hidden-download-link" style={{display: "none"}}></a>
          <a
            style={{
              color: "#336699",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(data, null, 2))

              const downloadLink = document.getElementById(
                "hidden-download-link",
              ) as HTMLElement

              downloadLink.setAttribute("href", dataStr)
              downloadLink.setAttribute("download", `${defaults.name}.json`)
              downloadLink.click()
              downloadLink.setAttribute("href", "")
            }}
          >
            Export
          </a>
        </p>
      </div>
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
