import * as React from "react"
import {useState} from "react"

interface HeaderProps {
  title: string
  onTitleChange: (title: string) => void
}

export default function Header({title, onTitleChange}: HeaderProps) {
  const [titleText, setTitleText] = useState(title)

  return (
    <div style={{display: "flex", marginBottom: 16}}>
      <input
        value={titleText}
        style={{flexGrow: 1, padding: 4, height: 48, fontSize: 25}}
        placeholder="Add a title"
        onChange={(e) => setTitleText(e.target.value)}
      />
      <button
        style={{marginLeft: 4}}
        onClick={() => {
          onTitleChange(titleText)
        }}
      >
        Update
      </button>
    </div>
  )
}
