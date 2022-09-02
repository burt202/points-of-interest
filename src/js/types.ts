export interface PointOfInterest {
  position: google.maps.LatLngLiteral
  text: string
}

export interface Data {
  center: {lat: number; lng: number}
  zoom: number
  poi: Array<PointOfInterest>
}
