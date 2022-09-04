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
  const [error, setError] = useState<string | null>(null)

  const element = document.body.querySelector("#map") as HTMLElement

  return (
    <div>
      {data === null ? (
        <Import onDataSet={(data) => setData(data)} />
      ) : (
        <div style={{padding: 16}}>
          <Interface
            data={data}
            onDataChange={(data) => {
              setData(data)
              setError(null)
            }}
            selectedPoi={selectedPoi}
            onSelectedPoiChange={(text) => setSelectedPoi(text)}
            onUseCenterAndZoomClick={() => {
              setData({...data, center: center.current, zoom: zoom.current})
              setError(null)
              setHasSetCenterAndZoom(true)
            }}
            hasSetCenterAndZoom={hasSetCenterAndZoom}
          />
          <div>
            <a id="hidden-download-link" style={{display: "none"}}></a>
            <button
              onClick={() => {
                if (data.title.length === 0) {
                  setError("You must set a title")
                  return
                }

                if (!hasSetCenterAndZoom) {
                  setError("You must set center and zoom")
                  return
                }

                if (data.poi.length === 0) {
                  setError("You must set at least point of interest")
                  return
                }

                const dataStr =
                  "data:text/json;charset=utf-8," +
                  encodeURIComponent(JSON.stringify(data, null, 2))

                const downloadLink = document.getElementById(
                  "hidden-download-link",
                ) as HTMLElement

                downloadLink.setAttribute("href", dataStr)
                downloadLink.setAttribute("download", `${data.title}.json`)
                downloadLink.click()
                downloadLink.setAttribute("href", "")
              }}
            >
              Export
            </button>
            {error && <p style={{color: "red"}}>{error}</p>}
          </div>
        </div>
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
        disable={data === null}
      />
    </div>
  )
}
