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
  hasSetCenterAndZoom: boolean
}

export default function Interface({
  data,
  onDataChange,
  selectedPoi,
  onSelectedPoiChange,
  onUseCenterAndZoomClick,
  hasSetCenterAndZoom,
}: InterfaceProps) {
  return (
    <div>
      <Header
        title={data.title}
        onTitleChange={(title) => {
          onDataChange({...data, title})
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{display: "flex", alignItems: "center"}}>
          <p>Center/Zoom set</p>
          {hasSetCenterAndZoom ? (
            <img src="tick.svg" style={{height: 24, marginLeft: 4}} />
          ) : (
            <img src="cross.svg" style={{height: 24, marginLeft: 4}} />
          )}
        </div>
        <button
          style={{height: 24}}
          onClick={() => {
            onUseCenterAndZoomClick()
          }}
        >
          Use current
        </button>
      </div>
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
        hasSetCenterAndZoom={hasSetCenterAndZoom}
      />
    </div>
  )
}
