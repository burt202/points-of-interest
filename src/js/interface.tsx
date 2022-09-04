import * as React from "react"

import Header from "./header"
import List from "./list"
import {Data} from "./types"

interface InterfaceProps {
  data: Data
  onDataChange: (data: Data) => void
  selectedPoi: string | null
  onSelectedPoiChange: (poi: string | null) => void
  onUseCenterAndZoomClick: () => void
}

export default function Interface({
  data,
  onDataChange,
  selectedPoi,
  onSelectedPoiChange,
  onUseCenterAndZoomClick,
}: InterfaceProps) {
  return (
    <div style={{padding: 16}}>
      <Header
        title={data.title}
        onTitleChange={(title) => {
          onDataChange({...data, title})
        }}
      />
      <List
        poi={data.poi}
        selectedPoi={selectedPoi}
        onItemSelect={(text) => {
          if (selectedPoi === text) {
            onSelectedPoiChange(null)
          } else {
            onSelectedPoiChange(text)
          }
        }}
        onPoiChange={(poi) => onDataChange({...data, poi})}
      />
      <button
        onClick={() => {
          onUseCenterAndZoomClick()
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
            if (data.title.length === 0) {
              alert("You must set a title")
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
        </a>
      </p>
    </div>
  )
}
