import {Loader} from "@googlemaps/js-api-loader"
import * as React from "react"
import {useEffect} from "react"

const API_KEY = "AIzaSyBe9ZEtNhRArJDvoWXtR1EbKViaICpQkQs"

interface MapProps {
  element: HTMLElement
  center: google.maps.LatLngLiteral
  zoom: number
  markers: Array<{
    position: google.maps.LatLngLiteral
    text: string
    selected: boolean
  }>
  onClick: (position: google.maps.LatLngLiteral) => void
  onChange?: (position: google.maps.LatLngLiteral, zoom: number) => void
}

export default function Map({
  element,
  center,
  zoom,
  markers,
  onClick,
  onChange,
}: MapProps) {
  let map = null as google.maps.Map | null

  useEffect(() => {
    const loader = new Loader({
      apiKey: API_KEY,
    })

    loader
      .load()
      .then(() => {
        map = new google.maps.Map(element, {
          center,
          zoom,
        })

        const _markers = [] as Array<google.maps.Marker>
        const _infowindows = [] as Array<google.maps.InfoWindow>

        markers.forEach((m) => {
          const colour = m.selected ? "yellow" : "red"

          _markers.push(
            new google.maps.Marker({
              position: {
                lat: m.position.lat,
                lng: m.position.lng,
              },
              icon: {
                url: `http://maps.google.com/mapfiles/ms/icons/${colour}-dot.png`,
              },
              map,
            }),
          )

          _infowindows.push(
            new google.maps.InfoWindow({
              content: m.text,
            }),
          )
        })

        _markers.forEach((marker, i) => {
          marker.addListener("click", () => {
            _infowindows[i].open(map, marker)
          })
        })

        map.addListener(
          "click",
          (mapsMouseEvent: google.maps.MapMouseEvent) => {
            if (!mapsMouseEvent.latLng) return
            const latLng = mapsMouseEvent.latLng.toJSON()

            onClick(latLng)
          },
        )

        map.addListener("drag", () => {
          if (map) {
            const center = map.getCenter()
            const zoom = map.getZoom()

            if (center && zoom && onChange) {
              onChange(center.toJSON(), zoom)
            }
          }
        })
      })
      .catch((e) => {
        console.log("e", e)
      })
  })

  return <div></div>
}
