<template>
    <ion-select interface="action-sheet" placeholder="選擇放大的位置" v-model="zoomIndex">
        <ion-select-option v-for="(stop, index) in routeLocations" :value="index">{{ index + 1}} {{ stop.nameTC }}</ion-select-option>
        <ion-select-option value="gps">目前GPS 位置</ion-select-option>
    </ion-select>
    <div id="mapContainer"></div>
</template>

<script>
import { ref, watch, toRaw } from 'vue';
import { IonSelect, IonSelectOption } from '@ionic/vue';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
    name: "LeafletMap",
    props: ['routeLocations'],
    components: { IonSelect, IonSelectOption },
    data() {
        return {
            map: null
        };
    },
    methods:{
        setView(zoomIndex){
            if(zoomIndex == 'gps'){
               toRaw(this.map).locate({setView: true});
               this.map.on('locationfound', (e) => {
                   let navIcon = L.icon({
                       iconUrl: 'navigation.png',
                       iconSize:     [32, 32],
                       iconAnchor:   [16, 16],
                       popupAnchor:  [0, -32]
                   });
                   var radius = e.accuracy;
                   L.marker(e.latlng, {icon: navIcon}).addTo(toRaw(this.map));
                   L.circle(e.latlng, radius).addTo(toRaw(this.map));
               });
           } else {
               let lat = this.routeLocations[zoomIndex].coord[1];
               let long = this.routeLocations[zoomIndex].coord[0]
               toRaw(this.map).setView([lat, long], 18);
           }
        }
    },
    setup(props){
        const routeLocations = ref(props.routeLocations);
        const zoomIndex = ref('gps');
        return {
            routeLocations,
            zoomIndex
        }
    },
    mounted() {
        // Add leaflet marker group for showing locations of stops
        let markersGroup = L.featureGroup();
        // Define icons
        let startIcon = L.icon({
            iconUrl: 'location_start.png',
            iconSize:     [30, 30], // size of the icon
            iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
        });
        let nodeIcon = L.icon({
            iconUrl: 'location_node.png',
            iconSize:     [30, 30],
            iconAnchor:   [15, 30],
            popupAnchor:  [0, -30]
        });
        let endIcon = L.icon({
            iconUrl: 'location_end.png',
            iconSize:     [30, 30],
            iconAnchor:   [15, 30],
            popupAnchor:  [0, -30]
        });
        let navIcon = L.icon({
            iconUrl: 'navigation.png',
            iconSize:     [32, 32],
            iconAnchor:   [16, 16],
            popupAnchor:  [0, -32]
        });
        // Default showing hong kong with zome level 10
        this.map = L.map("mapContainer").setView([22.3745, 114.19849], 10);
        L.tileLayer("https://api.maptiler.com/maps/stage/{z}/{x}/{y}.png?key=WmzwDfSJItQdmlz1POs4", {
            attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(toRaw(this.map));
        // Invalidate size to avoid problems
        let self = this;
        setTimeout(function(){
            self.map.invalidateSize()
        }, 200);
        // Add markers to marker group
        for (let index in this.routeLocations){
            let marker
            if (index == 0){
                marker = L.marker([this.routeLocations[index].coord[1], this.routeLocations[index].coord[0]], {icon: startIcon});
            } else if (index == this.routeLocations.length - 1){
                marker = L.marker([this.routeLocations[index].coord[1], this.routeLocations[index].coord[0]], {icon: endIcon});
            } else {
                marker = L.marker([this.routeLocations[index].coord[1], this.routeLocations[index].coord[0]], {icon: nodeIcon});
            }
            marker.bindPopup(`${this.routeLocations[index].seq} ${this.routeLocations[index].nameTC}`);
            marker.addTo(markersGroup);
        }
        // Create array for stop geometries
        let stop_geometries = this.routeLocations.map(x => new L.LatLng(x.coord[1], x.coord[0]));
        // console.log(stop_geometries);
        let polyline = new L.Polyline(stop_geometries, {
            color: '#647fc0',
            weight: 3,
            opacity: 0.7
        });
        // Apply markers and polyline
        toRaw(this.map).addLayer(markersGroup);
        polyline.addTo(toRaw(this.map))
        //Zoom to fit boundaries ? function not working
        toRaw(this.map).fitBounds(markersGroup.getBounds().pad(0.05), false);
        // Set minimum zoom level to 10 to avoiding zooming out to world map
        toRaw(this.map).setMinZoom(10);
        // Try to get GPS location and set view
        toRaw(this.map).locate({setView: true});
        toRaw(this.map).on('locationfound', function(e){
            var radius = e.accuracy;
            L.marker(e.latlng, {icon: navIcon}).addTo(self.map);
            L.circle(e.latlng, radius).addTo(self.map);
        });
    },
    beforeUnmount() {
        if (this.map) {
            toRaw(this.map).remove();
        }
    },
    watch:{
        zoomIndex(newZoomIndex){
            this.setView(newZoomIndex);
        }
    }
};
</script>

<style scoped>
#mapContainer {
    width: 100%;
    height: 100%;
}
</style>
