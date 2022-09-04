import Ajv, {JSONSchemaType} from "ajv"
import * as React from "react"
import {useState} from "react"

import {defaults} from "./constants"
import {Data} from "./types"

interface ImportProps {
  onDataSet: (data: Data) => void
}

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }

  return true
}

const schema: JSONSchemaType<Data> = {
  type: "object",
  properties: {
    title: {type: "string"},
    center: {
      type: "object",
      properties: {
        lat: {type: "number"},
        lng: {type: "number"},
      },
      required: ["lat", "lng"],
      additionalProperties: false,
    },
    zoom: {type: "number"},
    poi: {
      type: "array",
      items: {
        type: "object",
        properties: {
          position: {
            type: "object",
            properties: {
              lat: {type: "number"},
              lng: {type: "number"},
            },
            required: ["lat", "lng"],
            additionalProperties: false,
          },
          text: {type: "string"},
        },
        required: ["position", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "center", "zoom", "poi"],
  additionalProperties: false,
}

export default function Import({onDataSet}: ImportProps) {
  const [error, setError] = useState<string | null>(null)

  const onFileUploadEnd = (e: ProgressEvent<FileReader>) => {
    if (!e.target?.result) return

    const contents = e.target?.result as string

    if (!isValidJSON(contents)) {
      setError("Not valid json")
      return
    }

    const ajv = new Ajv()
    const validate = ajv.compile(schema)

    const toValidate = JSON.parse(contents) as Data

    if (!validate(toValidate)) {
      setError("Json not in correct shape")
      return
    }

    onDataSet(toValidate)
  }

  return (
    <div style={{padding: 16}}>
      <h1 style={{marginTop: 0}}>Points of interest</h1>
      <button onClick={() => onDataSet(defaults)}>Create new</button>
      <p>OR</p>
      <div style={{display: "flex", flexDirection: "column"}}>
        <label htmlFor="file" id="file">
          <strong>Import from file</strong>
        </label>
        <input
          type="file"
          style={{marginTop: 8}}
          accept="application/json"
          onChange={(e) => {
            const reader = new FileReader()
            reader.onload = onFileUploadEnd

            if (e.target?.files) {
              reader.readAsText(e.target?.files[0])
            }
          }}
        />
        {error && <p style={{color: "red"}}>{error}</p>}
      </div>
    </div>
  )
}
