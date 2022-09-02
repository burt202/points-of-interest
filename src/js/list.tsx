import R from "ramda"
import * as React from "react"
import {useState} from "react"

import {PointOfInterest} from "./types"

interface ListProps {
  poi: Array<PointOfInterest>
  selectedPoi: string | null
  onItemSelect: (poi: string | null) => void
  onPoiChange: (poi: Array<PointOfInterest>) => void
}

export default function List({
  poi,
  selectedPoi,
  onItemSelect,
  onPoiChange,
}: ListProps) {
  const [editedPoi, setEditedPoi] = useState<string | null>(null)
  const [editedPoiText, setEditedPoiText] = useState("")

  return (
    <div>
      {poi.length === 0 ? (
        <p>Click on the map to add a point of interest</p>
      ) : (
        poi.map((p, i) => {
          const isSelected = selectedPoi === p.text
          const isBeingEdited = editedPoi === p.text

          return (
            <div
              key={i}
              style={{display: "flex", alignItems: "center", marginBottom: 8}}
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
                  />
                  <img
                    src="tick.svg"
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
                      if (isSelected) {
                        onItemSelect(null)
                      } else {
                        onItemSelect(p.text)
                      }
                    }}
                  >
                    {p.text}
                  </p>
                  <img
                    src="edit.svg"
                    style={{height: 24, cursor: "pointer", marginLeft: 4}}
                    onClick={() => {
                      setEditedPoi(p.text)
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
    </div>
  )
}
