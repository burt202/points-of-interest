import R from "ramda"
import * as React from "react"
import {useState, useRef} from "react"

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

export default function App() {
  const zoom = useRef(mockData.zoom)
  const center = useRef<google.maps.LatLngLiteral>(mockData.center)
  const [data, setData] = useState<Data>(mockData)
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null)

  const element = document.body.querySelector("#map") as HTMLElement

  return (
    <div>
      <div style={{padding: 16}}>
        {data.poi.map((p, i) => {
          const isSelected = selectedPoi === p.text

          return (
            <div
              style={{display: "flex", alignItems: "center", marginBottom: 8}}
            >
              <p
                key={i}
                style={{
                  background: isSelected ? "#fdfd96" : "#ccc",
                  padding: 8,
                  margin: 0,
                  cursor: "pointer",
                  flexGrow: 1,
                }}
                onClick={() => {
                  if (isSelected) {
                    setSelectedPoi(null)
                  } else {
                    setSelectedPoi(p.text)
                  }
                }}
              >
                {p.text}
              </p>
              <img
                src="delete.svg"
                style={{height: 24, cursor: "pointer", marginLeft: 4}}
                onClick={() => {
                  const updated = R.remove(i, 1, data.poi)
                  setData({...data, poi: updated})
                }}
              />
            </div>
          )
        })}
        <button
          onClick={() =>
            setData({...data, center: center.current, zoom: zoom.current})
          }
        >
          Use current center and zoom
        </button>
        <pre style={{background: "#eee", padding: 8}}>
          {JSON.stringify(data, null, 2)}
        </pre>
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
