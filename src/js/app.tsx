import * as React from "react"
import {useState, useRef} from "react"

import List from "./list"
import Map from "./map"

const defaults = {
  zoom: 3,
  center: {
    lat: 0,
    lng: 0,
  },
}

console.log("defaults", defaults)

interface PointOfInterest {
  position: google.maps.LatLngLiteral
  text: string
}

interface Data {
  center: {lat: number; lng: number}
  zoom: number
  poi: Array<PointOfInterest>
}

const mockData = {
  center: {lat: 52.36902658005985, lng: 4.891099607632397},
  zoom: 13,
  poi: [
    {
      position: {lat: 52.37547263668976, lng: 4.884749230451855},
      text: "Anne Frank House",
    },
    {
      position: {lat: 52.366768692771856, lng: 4.926359825639675},
      text: "IJ Brewery",
    },
  ],
} as Data
const name = "Amsterdam"

export default function App() {
  const zoom = useRef(mockData.zoom)
  const center = useRef<google.maps.LatLngLiteral>(mockData.center)

  const [data, setData] = useState<Data>(mockData)
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null)

  const element = document.body.querySelector("#map") as HTMLElement

  return (
    <div>
      <div style={{padding: 16}}>
        <List
          poi={data.poi}
          selectedPoi={selectedPoi}
          onItemSelect={(text) => setSelectedPoi(text)}
          onPoiChange={(poi) => setData({...data, poi})}
        />
        <button
          onClick={() =>
            setData({...data, center: center.current, zoom: zoom.current})
          }
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
              downloadLink.setAttribute("download", `${name}.json`)
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
