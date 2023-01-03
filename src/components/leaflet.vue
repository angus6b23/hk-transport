/* eslint-disable */
<template>
    <div id="mapContainer"></div>
</template>

<script>
import { ref } from 'vue';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
    name: "LeafletMap",
    props: ['route_locations'],
    data() {
        return {
            map: null
        };
    },
    setup(props){
        const route_locations = ref(props.route_locations);
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
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
            attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        // Invalidate size to avoid problems
        let inv = this;
        setTimeout(function(){
            inv.map.invalidateSize()
        }, 200);
        // Add markers to marker group
        for (let index in this.route_locations){
            let marker
            if (index == 0){
                marker = L.marker([this.route_locations[index].coord[1], this.route_locations[index].coord[0]], {icon: startIcon});
            } else if (index == this.route_locations.length - 1){
                marker = L.marker([this.route_locations[index].coord[1], this.route_locations[index].coord[0]], {icon: endIcon});
            } else {
                marker = L.marker([this.route_locations[index].coord[1], this.route_locations[index].coord[0]], {icon: nodeIcon});
            }
            marker.bindPopup(`${this.route_locations[index].seq} ${this.route_locations[index].name_tc}`);
            marker.addTo(markersGroup);
        }
        // Create array for stop geometries
        let stop_geometries = this.route_locations.map(x => new L.LatLng(x.coord[1], x.coord[0]));
        console.log(stop_geometries);
        let polyline = new L.Polyline(stop_geometries, {
            color: 'rebeccapurple',
            weight: 3,
            opacity: 0.7
        });
        // Apply markers and polyline
        this.map.addLayer(markersGroup);
        polyline.addTo(this.map)
        //Zoom to fit boundaries ? function not working
        this.map.fitBounds(markersGroup.getBounds().pad(0.05), false);
        // Set minimum zoom level to 10 to avoiding zooming out to world map
        this.map.setMinZoom(10);
        // Try to get GPS location and set view
        this.map.locate({setView: true});
        this.map.on('locationfound', function(e){
            var radius = e.accuracy;
            console.log
            L.marker(e.latlng, {icon: navIcon}).addTo(inv.map);
            L.circle(e.latlng, radius).addTo(inv.map);
        });
    },
    beforeUnmount() {
        if (this.map) {
            this.map.remove();
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
