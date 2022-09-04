import * as React from "react"
import {useState} from "react"

interface HeaderProps {
  title: string
  onTitleChange: (title: string) => void
}

export default function Header({title, onTitleChange}: HeaderProps) {
  const [titleText, setTitleText] = useState(title)
  const [isBeingEdited, setIsBeingEdited] = useState(false)

  return (
    <div style={{display: "flex", alignItems: "center"}}>
      {isBeingEdited ? (
        <>
          <input
            value={titleText}
            style={{flexGrow: 1, padding: 4, height: 48, fontSize: 25}}
            placeholder="Where are you going? etc"
            autoFocus
            onChange={(e) => setTitleText(e.target.value)}
            onFocus={(e) => {
              e.target.select()
            }}
          />
          <img
            src="save.svg"
            style={{height: 24, cursor: "pointer", marginLeft: 4}}
            onClick={() => {
              if (titleText.length > 0) {
                onTitleChange(titleText)
              }
              setIsBeingEdited(false)
            }}
          />
        </>
      ) : (
        <>
          <h1
            style={{
              padding: "8px 0px",
              margin: 0,
              cursor: "pointer",
              flexGrow: 1,
            }}
            onClick={() => {
              setIsBeingEdited(!isBeingEdited)
            }}
          >
            {titleText || "Click to add a title"}
          </h1>
          <img
            src="edit.svg"
            style={{height: 24, cursor: "pointer", marginLeft: 4}}
            onClick={() => {
              setIsBeingEdited(!isBeingEdited)
            }}
          />
        </>
      )}
    </div>
  )
}
