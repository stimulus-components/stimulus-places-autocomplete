import { Controller } from '@hotwired/stimulus'

interface Address {
  street_number: string
  route: string
  locality: string
  administrative_area_level_2: string
  administrative_area_level_1: string
  country: string
  postal_code: string
  formatted_address: string
  street_address: string
  locality: string
  sublocality: string
  neighborhood: string
  political: string

}

export default class extends Controller {
  autocomplete: google.maps.places.Autocomplete
  place: google.maps.places.PlaceResult

  addressTarget: HTMLInputElement
  streetNumberTarget: HTMLInputElement
  routeTarget: HTMLInputElement
  cityTarget: HTMLInputElement
  countyTarget: HTMLInputElement
  stateTarget: HTMLInputElement
  countryTarget: HTMLInputElement
  postalCodeTarget: HTMLInputElement
  formattedAddressTarget: HTMLInputElement
  streetAddressTarget: HTMLInputElement
  localityTarget: HTMLInputElement
  sublocalityTarget: HTMLInputElement
  neighborhoodTarget: HTMLInputElement
  politicalTarget: HTMLInputElement
  longitudeTarget: HTMLInputElement
  latitudeTarget: HTMLInputElement

  hasStreetNumberTarget: boolean
  hasRouteTarget: boolean
  hasCityTarget: boolean
  hasCountryTarget: boolean
  hasCountyTarget: boolean
  hasPostalCodeTarget: boolean
  hasStateTarget: boolean
  hasFormattedAddressTarget: boolean
  hasStreetAddressTarget: boolean
  hasLocalityTarget: boolean
  hasSublocalityTarget: boolean
  hasNeighborhoodTarget: boolean
  hasPoliticalTarget: boolean
  hasLongitudeTarget: boolean
  hasLatitudeTarget: boolean

  countryValue: Array<string>

  static targets = [
    'address',
    'city',
    'streetNumber',
    'route',
    'postalCode',
    'country',
    'county',
    'state',
    'formatted_address',
    'street_address',
    'locality',
    'sublocality',
    'neighborhood',
    'political'
    'longitude',
    'latitude',

  ]

  static values = {
    country: Array
  }

  initialize (): void {
    this.placeChanged = this.placeChanged.bind(this)
  }

  connect (): void {
    if (typeof google !== 'undefined') {
      this.initAutocomplete()
    }
  }

  initAutocomplete (): void {
    this.autocomplete = new google.maps.places.Autocomplete(this.addressTarget, this.autocompleteOptions)

    this.autocomplete.addListener('place_changed', this.placeChanged)
  }

  placeChanged (): void {
    this.place = this.autocomplete.getPlace()
    const addressComponents: google.maps.GeocoderAddressComponent[] = this.place.address_components

    if (addressComponents !== undefined) {
      const formattedAddress = this.formatAddressComponents(addressComponents) as Address

      this.setAddressComponents(formattedAddress)
    }

    if (this.place.geometry !== undefined) {
      this.setGeometry(this.place.geometry)
    }
  }

  setAddressComponents (address: Address): void {
    if (this.hasStreetNumberTarget) this.streetNumberTarget.value = address.street_number || ''
    if (this.hasRouteTarget) this.routeTarget.value = address.route || ''
    if (this.hasCityTarget) this.cityTarget.value = address.locality || ''
    if (this.hasCountyTarget) this.countyTarget.value = address.administrative_area_level_2 || ''
    if (this.hasStateTarget) this.stateTarget.value = address.administrative_area_level_1 || ''
    if (this.hasCountryTarget) this.countryTarget.value = address.country || ''
    if (this.hasPostalCodeTarget) this.postalCodeTarget.value = address.postal_code || ''
    if (this.hasFormattedAddressTarget) this.formattedAddressTarget.value = address.formatted_address || ''
    if (this.hasStreetAddressTarget) this.streetAddressTarget.value = address.street_address || ''
    if (this.hasLocalityTarget) this.localityTarget.value = address.locality || ''
    if (this.hasSublocalityTarget) this.sublocalityTarget.value = address.sublocality || ''
    if (this.hasNeighborhoodTarget) this.neighborhoodTarget.value = address.neighborhood || ''
    if (this.hasPoliticalTarget) this.politicalTarget.value = address.political || ''
  }

  setGeometry (geometry: google.maps.places.PlaceGeometry): void {
    if (this.hasLongitudeTarget) this.longitudeTarget.value = geometry.location.lng().toString()
    if (this.hasLatitudeTarget) this.latitudeTarget.value = geometry.location.lat().toString()
  }

  get autocompleteOptions (): google.maps.places.AutocompleteOptions {
    return {
      fields: ['address_components', 'geometry'],
      componentRestrictions: {
        country: this.countryValue
      }
    }
  }

  preventSubmit (event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      event.preventDefault()
    }
  }

  private formatAddressComponents (addressComponents: google.maps.GeocoderAddressComponent[]): Address {
    const data = {}

    addressComponents.forEach((component: google.maps.GeocoderAddressComponent) => {
      const type = component.types[0]

      data[type] = component.long_name
    })

    return data as Address
  }
}
