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
        let markersGroup = L.featureGroup();
        this.map = L.map("mapContainer").setView([22.3745, 114.19849], 10);
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
            attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        let inv = this;
        setTimeout(function(){
            inv.map.invalidateSize()
        }, 200);
        for (let i = 0; i < this.route_locations.length; i++){
            let marker = L.marker([this.route_locations[i].lat, this.route_locations[i].long]);
            marker.bindPopup(`${i + 1} ${this.route_locations[i].name_tc}`);
            marker.addTo(markersGroup);
        }
        this.map.addLayer(markersGroup);
        // this.map.fitBounds(markersGroup.getBounds().pad(0.05)); //Zoom to fit boundaries ? fit bounds not working
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
