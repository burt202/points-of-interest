import R from "ramda"
import * as React from "react"
import {useState} from "react"

import {PointOfInterest} from "./types"

interface ListProps {
  poi: Array<PointOfInterest>
  selectedPoi: string | null
  onItemSelect: (poi: string) => void
  onPoiChange: (poi: Array<PointOfInterest>) => void
  hasSetCenterAndZoom: boolean
}

export default function List({
  poi,
  selectedPoi,
  onItemSelect,
  onPoiChange,
  hasSetCenterAndZoom,
}: ListProps) {
  const [editedPoi, setEditedPoi] = useState<string | null>(null)
  const [editedPoiText, setEditedPoiText] = useState("")
  const [newPoiText, setNewPoiText] = useState("")

  return (
    <div style={{marginBottom: 64}}>
      <h3 style={{textDecoration: "underline"}}>Points</h3>
      {!hasSetCenterAndZoom ? (
        <p>Set the center/zoom first</p>
      ) : (
        <>
          {poi.length === 0 ? (
            <p>Click on the map to add a point of interest</p>
          ) : (
            poi.map((p, i) => {
              const isSelected = selectedPoi === p.text
              const isBeingEdited = editedPoi === p.text

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  {isBeingEdited ? (
                    <>
                      <input
                        style={{flexGrow: 1, padding: 4, height: 32}}
                        value={editedPoiText}
                        autoFocus
                        onChange={(e) => {
                          setEditedPoiText(e.target.value)
                        }}
                        onFocus={(e) => {
                          e.target.select()
                        }}
                      />
                      <img
                        src="save.svg"
                        style={{height: 24, cursor: "pointer", marginLeft: 4}}
                        onClick={() => {
                          const updated = R.update(
                            i,
                            {...p, text: editedPoiText},
                            poi,
                          )
                          onPoiChange(updated)
                          setEditedPoi(null)
                          setEditedPoiText("")
                        }}
                      />
                    </>
                  ) : (
                    <>
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
                          onItemSelect(p.text)
                        }}
                      >
                        {p.text}
                      </p>
                      <img
                        src="edit.svg"
                        style={{height: 24, cursor: "pointer", marginLeft: 4}}
                        onClick={() => {
                          setEditedPoi(p.text)
                          setEditedPoiText(p.text)
                        }}
                      />
                    </>
                  )}
                  <img
                    src="delete.svg"
                    style={{height: 24, cursor: "pointer", marginLeft: 4}}
                    onClick={() => {
                      if (confirm("Are you sure?")) {
                        const updated = R.remove(i, 1, poi)
                        onPoiChange(updated)
                      }
                    }}
                  />
                </div>
              )
            })
          )}
          <div style={{display: "flex", alignItems: "center"}}>
            <input
              placeholder="Add manually (lat, lng)"
              style={{padding: 4, height: 32, flexGrow: 1}}
              value={newPoiText}
              onChange={(e) => {
                setNewPoiText(e.target.value)
              }}
            />
            <img
              src="save.svg"
              style={{height: 24, cursor: "pointer", marginLeft: 4}}
              onClick={() => {
                onPoiChange([
                  ...poi,
                  {
                    text: newPoiText,
                    position: {
                      lat: parseFloat(newPoiText.split(",")[0].trim()),
                      lng: parseFloat(newPoiText.split(",")[1].trim()),
                    },
                  },
                ])
                setNewPoiText("")
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
