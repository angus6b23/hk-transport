<template>
    <ion-select
        interface="action-sheet"
        placeholder="選擇放大的位置"
        v-model="zoomIndex"
    >
        <ion-select-option value="null">{{
            $t('etaPopup.map.selectStation')
        }}</ion-select-option>
        <ion-select-option
            v-for="(stop, index) in routeLocations"
            :value="index"
            :key="stop.stopId"
        >
            <span v-if="$i18next.language === 'zh'"
                >{{ index + 1 }} {{ stop.nameTC }}</span
            >
            <span v-else class="ion-text-captitalize"
                >{{ index + 1 }}. {{ stop.nameEN }}</span
            >
        </ion-select-option>
        <ion-select-option value="gps">{{
            $t('etaPopup.map.currentLocation')
        }}</ion-select-option>
    </ion-select>
    <div id="mapContainer"></div>
</template>

<script>
import { ref, toRaw } from 'vue'
import { IonSelect, IonSelectOption } from '@ionic/vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
    name: 'LeafletMap',
    props: ['routeLocations', 'currentLocation'],
    components: { IonSelect, IonSelectOption },
    data() {
        // Add leaflet marker group for showing locations of stops
        let markersGroup = L.featureGroup()
        // Define icons
        let startIcon = L.icon({
            iconUrl: 'location_start.png',
            iconSize: [30, 30], // size of the icon
            iconAnchor: [15, 30], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -30], // point from which the popup should open relative to the iconAnchor
        })
        let nodeIcon = L.icon({
            iconUrl: 'location_node.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        })
        let endIcon = L.icon({
            iconUrl: 'location_end.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        })
        let navIcon = L.icon({
            iconUrl: 'navigation.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -32],
        })
        return {
            map: null,
            markersGroup,
            startIcon,
            nodeIcon,
            endIcon,
            navIcon,
        }
    },
    methods: {
        setView(zoomIndex) {
            if (zoomIndex == 'gps') {
                toRaw(this.map).setView(this.gpsMarker.getLatLng(), 18)
            } else if (zoomIndex === 'null') {
                toRaw(this.map).fitBounds(
                    this.markersGroup.getBounds().pad(0.05),
                    false
                )
            } else {
                let lat = this.routeLocations[zoomIndex].coord[1]
                let long = this.routeLocations[zoomIndex].coord[0]
                toRaw(this.map).setView([lat, long], 18)
            }
        },
        async setLocation(location) {
            this.currentLocation = location
        },
    },
    setup(props) {
        const routeLocations = ref(props.routeLocations)
        const currentLocation = ref(props.currentLocation)
        const watchLocation = ''
        const locationFound = false
        const zoomIndex = ref('null')
        return {
            routeLocations,
            watchLocation,
            locationFound,
            currentLocation,
            zoomIndex,
        }
    },
    async mounted() {
        this.watchLocation = navigator.geolocation.watchPosition(
            (location) => this.setLocation(location),
            () => null,
            { enableHighAccuracy: true },
        )
        // Default showing hong kong with zome level 10
        this.map = L.map('mapContainer').setView([22.3745, 114.19849], 10)
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(toRaw(this.map))
        // Invalidate size to avoid problems
        let self = this
        setTimeout(function () {
            self.map.invalidateSize()
        }, 200)
        // Add markers to marker group
        for (let index in this.routeLocations) {
            let marker
            if (index == 0) {
                marker = L.marker(
                    [
                        this.routeLocations[index].coord[1],
                        this.routeLocations[index].coord[0],
                    ],
                    { icon: this.startIcon }
                )
            } else if (index == this.routeLocations.length - 1) {
                marker = L.marker(
                    [
                        this.routeLocations[index].coord[1],
                        this.routeLocations[index].coord[0],
                    ],
                    { icon: this.endIcon }
                )
            } else {
                marker = L.marker(
                    [
                        this.routeLocations[index].coord[1],
                        this.routeLocations[index].coord[0],
                    ],
                    { icon: this.nodeIcon }
                )
            }
            if (this.$i18next.language === 'zh') {
                marker.bindPopup(
                    `${this.routeLocations[index].seq} ${this.routeLocations[index].nameTC}`
                )
            } else {
                marker.bindPopup(
                    `${this.routeLocations[index].seq}. ${this.routeLocations[index].nameEN}`
                )
            }
            marker.addTo(this.markersGroup)
        }
        // Create array for stop geometries
        let stopGeometries = this.routeLocations.map(
            (x) => new L.LatLng(x.coord[1], x.coord[0])
        )
        // console.log(stopGeometries);
        let polyline = new L.Polyline(stopGeometries, {
            color: '#647fc0',
            weight: 3,
            opacity: 0.7,
        })
        // Apply markers and polyline
        toRaw(this.map).addLayer(this.markersGroup)
        polyline.addTo(toRaw(this.map))
        //Zoom to fit boundaries ? function not working
        toRaw(this.map).fitBounds(
            this.markersGroup.getBounds().pad(0.05),
            false
        )
        // Set minimum zoom level to 10 to avoiding zooming out to world map
        toRaw(this.map).setMinZoom(10)
        // Try to get GPS location and set view
        // Use passed currentlocation first
        if (this.currentLocation && this.currentLocation.coords) {
            // console.log(this.currentLocation);
            const radius = this.currentLocation.coords.accuracy
            const latlng = {
                lat: this.currentLocation.coords.latitude,
                lng: this.currentLocation.coords.longitude,
            }
            this.gpsMarker = L.marker(latlng, { icon: this.navIcon }).addTo(
                self.map
            )
            this.gpsCircle = L.circle(latlng, radius).addTo(self.map)
            //toRaw(this.map).setView(latlng, 18);
        }
    },
    beforeUnmount() {
        if (this.map) {
            toRaw(this.map).remove()
        }
        if (this.watchLocation) {
            navigator.geolocation.clearWatch(this.watch)
        }
    },
    watch: {
        zoomIndex(newZoomIndex) {
            this.setView(newZoomIndex)
        },
        currentLocation() {
            let self = this
            if (!this.gpsMarker) {
                let navIcon = L.icon({
                    iconUrl: 'navigation.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    popupAnchor: [0, -32],
                })
                const radius = this.currentLocation.coords.accuracy
                const latlng = {
                    lat: this.currentLocation.coords.latitude,
                    lng: this.currentLocation.coords.longitude,
                }
                this.gpsMarker = L.marker(latlng, { icon: navIcon }).addTo(
                    self.map
                )
                this.gpsCircle = L.circle(latlng, radius).addTo(self.map)
            } else {
                const radius = this.currentLocation.coords.accuracy
                const latlng = {
                    lat: this.currentLocation.coords.latitude,
                    lng: this.currentLocation.coords.longitude,
                }
                this.gpsMarker.setLatLng(latlng).update()
                this.gpsCircle.remove()
                this.gpsCircle = L.circle(latlng, radius).addTo(self.map)
            }
        },
    },
}
</script>

<style scoped>
#mapContainer {
    height: calc(100vh - 160px);
}

@media screen and (min-width: 770px) {
    #mapContainer {
        min-height: 350px;
        height: 40vh;
        max-height: 450px;
    }
}
</style>
