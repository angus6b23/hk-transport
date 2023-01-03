<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-searchbar autocorrect="off" v-model="minibus_query" placeholder="請輸入路線或目的地"></ion-searchbar>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list>
                <ion-list-header v-if="minibus_query.length > 0">搜尋: {{ minibus_query }}</ion-list-header>
                <ion-list-header v-else>我的最愛</ion-list-header>
                <div v-for="(route, index) in minibus_display_array">
                    <ion-item button>
                        <ion-grid>
                            <ion-row class="open-modal" expand="block" @click="open_minibus_modal(index)">
                                <ion-col size-xs="3" size-md="1" class="route_no ion-align-items-center">
                                    <h3 v-if="route.route_no.length < 10">{{ route.route_no }}</h3>
                                    <h3 v-else>-</h3>
                                </ion-col>
                                <ion-col size-xs="9" size-md="11">
                                    <ion-badge v-if="route.district.includes('HKI')" class="hki-badge ion-margin-start">港島</ion-badge>
                                    <ion-badge v-if="route.district.includes('KLN')" class="kln-badge ion-margin-start">九龍</ion-badge>
                                    <ion-badge v-if="route.district.includes('NT')" class="nt-badge ion-margin-start">新界</ion-badge>
                                    <ion-badge v-if="route.service_mode.includes('N')" class="night-badge ion-margin-start">晚間</ion-badge>
                                    <ion-badge v-if="route.service_mode == 'T'" class="special-badge ion-margin-start">特別</ion-badge>
                                    <h3 class="ion-no-margin ion-margin-start">{{ route.dest_tc }}</h3>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </div>
            </ion-list>
            <!-- Modal for displaying bus details -->
            <ion-modal :is-open="minibus_modal_is_open" ref="modal" @WillDismiss="close_minibus_modal">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>{{ minibus_selected.route_no }}<span class="ion-margin-start">{{ minibus_selected.dest_tc }}</span></ion-title>
                        <ion-buttons slot="start">
                            <ion-button @click="close_minibus_modal"><ion-icon :icon="chevronBack"></ion-icon></ion-button>
                        </ion-buttons>
                        <ion-buttons slot="end">
                            <ion-button  v-if="minibus_starred_check" @click="remove_starred">
                                <ion-icon :icon="star" />
                            </ion-button>
                            <ion-button v-else @click="add_starred">
                                <ion-icon :icon="starOutline" />
                            </ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                    <ion-segment v-model="popup_view">
                        <ion-segment-button value="default">
                            <ion-label>預報</ion-label>
                        </ion-segment-button>
                        <ion-segment-button value="info">
                            <ion-label>資訊</ion-label>
                        </ion-segment-button>
                        <ion-segment-button value="map">
                            <ion-label>地圖</ion-label>
                        </ion-segment-button>
                    </ion-segment>
                </ion-header>
                <!-- Segment for route etas -->
                <ion-content v-if="popup_view == 'default'">
                    <ion-list v-if="minibus_loading">
                        <ion-item v-for="(i) in [1,2,3,4,5,6,7]">
                            <ion-grid>
                                <ion-row class="ion-align-items-center">
                                    <ion-col size-xs="2" size-md="2">
                                        <h5 class="ion-margin-start"><ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text></h5>
                                    </ion-col>
                                    <ion-col size-xs="7" size-md="7">
                                        <h5 class="ion-margin-start"><ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text></h5>
                                    </ion-col>
                                    <ion-col size-xs="3" size-md="3">
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                    </ion-list>
                    <ion-list v-else>
                        <ion-item v-for="(stop, index) in minibus_selected.stops">
                            <ion-grid>
                                <ion-row class="ion-align-items-center">
                                    <ion-col size-xs="2" size-md="2">
                                        <h5 class="ion-margin-start">{{ index + 1 }}</h5>
                                    </ion-col>
                                    <ion-col size-xs="7" size-md="7">
                                        <h5 class="ion-margin-start">{{ stop.name_tc }}</h5>
                                    </ion-col>
                                    <ion-col size-xs="3" size-md="3">
                                        <!-- <p class="ion-no-margin ion-text-right">
                                            <div v-if="stop.eta_message == 'no_available_bus'">暫無班次</div>
                                            <div v-else>
                                                <span v-if="stop.etas[0] != null">{{stop.eta_display[0]}}</span>
                                                <span v-if="stop.etas[1] != null">, {{stop.eta_display[1]}}</span>
                                                <span v-if="stop.etas[2] != null">, {{stop.eta_display[2]}}</span>
                                                <span><br>分鐘</span>
                                            </div>
                                        </p> -->
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                        <ion-item></ion-item>
                        <ion-item></ion-item>
                    </ion-list>
                </ion-content>
                <!-- Segment for route information -->
                <ion-content v-else-if="popup_view == 'info'">
                    <ion-list>
                        <ion-item>
                            <ion-grid>
                                <ion-row>
                                    <ion-col size="6" class="ion-text-left">車程</ion-col>
                                    <ion-col size="6" class="ion-text-right">{{ this.minibus_selected.journey_time }} 分鐘</ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                        <ion-item>
                            <ion-grid>
                                <ion-row>
                                    <ion-col size="6" class="ion-text-left">全程收費</ion-col>
                                    <ion-col size="6" class="ion-text-right">${{ this.minibus_selected.full_fare }}</ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                    </ion-list>
                </ion-content>
                <!-- Segment for route map -->
                <ion-content v-else-if="popup_view == 'map'">
                    <LeafletMap :route_locations="minibus_selected.stops" />
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal, IonIcon, IonButton, IonButtons, IonBadge, IonSegment, IonSegmentButton, IonSkeletonText, } from '@ionic/vue';
import { map, hourglass, chevronBack, starOutline, star } from 'ionicons/icons';
import { get_minibuses } from '@/components/fetch.js';
import LeafletMap from '@/components/leaflet.vue';

export default defineComponent({
    name: 'Minibus',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal, IonIcon, IonButton, IonButtons, IonBadge, IonSegment, IonSegmentButton, IonSkeletonText, LeafletMap },
    setup(){
        // Create ref for loading and show map for ui control
        let interval; // For storing interval for reloading time
        const minibus = ref({}); // For storage of minibus routes and stops
        const minibus_query = ref(''); // Reference for two way bind of search bar value
        const minibus_display_array = ref([]);// Reference for displaying search results
        const minibus_selected = ref({}); // Reference for selected minibus on query
        const minibus_modal_is_open = ref(false);
        const minibus_starred = ref([]);
        const minibus_loading = ref(false);
        const popup_view = ref('default');
        // Event listeners
        addEventListener('ionModalDidDismiss', function(){
            minibus_modal_is_open.value = false;
            clearInterval(this.interval);
        })

        watch(minibus_query, async ()=>{ //Search for minibuses upon change in minibus query
            if (minibus_query.value == ''){
                minibus_display_array.value = minibus_starred.value;
            } else {
                minibus_display_array.value = (minibus_query.value) < 10 ? minibus.value.filter(x => x.route_no.length <= 2 && x.route_no.indexOf(minibus_query.value.toUpperCase()) == 0 || x.dest_tc.includes(minibus_query.value)) :
                minibus.value.filter(x => x.route_no.indexOf(minibus_query.value.toUpperCase()) == 0 ||x.dest_tc.includes(minibus_query.value)); // Filter by route numbers and destinations.
                await minibus_display_array.value.sort(function(a, b){
                    a = Number(a.route_no.replace(/[A-Z]/g, 0));
                    b = Number(b.route_no.replace(/[A-Z]/g, 0));
                    return a - b;
                });
                minibus_display_array.value.splice(50);// Only show first 50 results
            }
        })
        return{
            minibus,
            minibus_query,
            minibus_display_array,
            minibus_selected,
            minibus_modal_is_open,
            minibus_starred,
            minibus_loading,
            popup_view,
            map,
            hourglass,
            chevronBack,
            starOutline,
            star
        }
    },
    methods:{
        open_minibus_modal(index){
            this.minibus_selected = JSON.parse(JSON.stringify(this.minibus_display_array[index])); //Use Deep copy to prevent problems when clicked again
            console.log(this.minibus_selected)
            this.minibus_modal_is_open = true;
            this.minibus_loading = true;
            this.getminibusRoute();
            // this.getminibusRouteTime();
            // this.minibus_loading = false;
            let inv = this
            this.interval = setInterval(function(){
                inv.getminibusRouteTime();
            }, 10000)
        },
        close_minibus_modal(){
            this.minibus_modal_is_open = false;
            clearInterval(this.interval);
            this.popup_view = 'default';
        },
        async getminibusRoute(this_copy){
            try{
                let minibus_route_response = await fetch(`https://data.etagmb.gov.hk/route-stop/${this.minibus_selected.route_id}/${this.minibus_selected.route_direction}`);
                let minibus_route = await minibus_route_response.json();
                this.minibus_selected.stops = minibus_route.data.route_stops;
            } catch(err){
                console.error(err)
            } finally{
                this.minibus_loading = false;
            }
        },
        async getminibusRouteTime(){
            for (stop of this.minibus_selected.stops){
                stop.etas = [];
                stop.eta_message = ''
                if (!stop.stop_id){
                    stop.stop_id = ''
                }
                if (!stop.eta_display){
                    stop.eta_display = [];
                }
            }
            let eta;
            let eta_message;
            // Get bus etas for KMB
            /*
            if (this.bus_selected.company.includes('KMB') || this.bus_selected.company.includes('LWB')){
                try{
                    let service_type = (this.bus_selected.service_mode == 'R' ) ? 1 : 2; //Service type: R => 1, others => 2
                    let direction = ( this.bus_selected.route_direction == 1 ) ? 'O' : 'I'; //Direction 1 = outbound, 2 = inbound
                    let route_response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${this.bus_selected.route_no}/${service_type}`);
                    let route_eta = await route_response.json();
                    route_eta = route_eta.data.filter(x => x.dir == direction);
                    //console.log(route_eta);
                    for (let i = 0; i < route_eta.length; i++){
                        if (route_eta[i].eta != null){
                            let current_time = new Date(route_eta[i].data_timestamp);
                            let eta_time = new Date(route_eta[i].eta);
                            eta = Math.ceil((eta_time - current_time)/60000);
                            (eta < 0) ? eta = 0 : null ;
                        } else if (route_eta[i].eta_seq == 1 && route_eta[i].eta == ''){
                            eta_message = 'no_available_bus';
                        } else {
                            eta_message = 'no_available_bus';
                        }
                        let index = this.bus_selected.stops.findIndex(x => x.seq == route_eta[i].seq);
                        this.bus_selected.stops[index].etas.push(eta);
                        this.bus_selected.stops[index].eta_message = eta_message;
                    }
                    //console.log(this.bus_selected.stops);
                } catch(err){
                    console.error(err);
                }
            }
            if (this.bus_selected.company.includes('CTB') || this.bus_selected.company.includes('NWFB') ||this.bus_selected.company.includes('NLB')){
                let company =   (this.bus_selected.company.includes('CTB')) ? 'CTB':
                                (this.bus_selected.company.includes('NWFB')) ? 'NWFB':
                                (this.bus_selected.company.includes('NLB')) ? 'NLB': null;
                let direction = ( this.bus_selected.route_direction == 1 ) ? 'outbound' : 'inbound'; //Direction 1 = outbound, 2 = inbound
                try{
                    if (this.bus_selected.stops[0].stop_id == ''){
                        // Get Bus stop ids first
                        let route_response = await fetch(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${company}/${this.bus_selected.route_no}/${direction}`);
                        let route_data = await route_response.json();
                        route_data = route_data.data;
                        // Insert the stop ids into bus object
                        for (stop of this.bus_selected.stops){
                            let index = route_data.findIndex(x => x.seq == stop.seq);
                            stop.stop_id = route_data[index].stop;
                        }
                    }
                    // Get etas
                    direction = ( this.bus_selected.route_direction == 1 ) ? 'O' : 'I';
                    for (const stop of this.bus_selected.stops){
                        let eta_response = await fetch(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${company}/${stop.stop_id}/${this.bus_selected.route_no}`);
                        let eta_data = await eta_response.json();
                        eta_data = eta_data.data.filter((x) => x.dir == direction);
                        // console.log(eta_data);
                        for (const eta of eta_data){
                            if (eta.eta != ''){
                                let current_time = new Date(eta.data_timestamp);
                                let eta_time = new Date(eta.eta);
                                let eta_duration = Math.ceil((eta_time - current_time)/60000);
                                (eta_duration < 0) ? eta_duration = 0 : null ;
                                stop.etas.push(eta_duration)
                            }
                        }
                    }
                    // console.log(route_data);
                } catch(err){
                    console.error(err);
                }
            }*/
            for (stop of this.minibus_selected.stops){
                if (stop.etas.length == 0){
                    stop.eta_message = 'no_available_bus'
                } else {
                    stop.etas.sort((a,b) => a - b);
                    stop.eta_display = [...stop.etas];
                }
            }
        },
        async add_starred(){
            this.minibus_starred.push(this.minibus_selected);
            let minibus_starred_clone = JSON.parse(JSON.stringify(this.minibus_starred));
            let minibus_starred_promise = await this.localforage.setItem('minibus_starred', minibus_starred_clone);
        },
        async remove_starred(){
            let remove_index = this.minibus_starred.findIndex(x =>  x.route_no == this.minibus_selected.route_no && x.link == this.minibus_selected.link && x.route_direction == this.minibus_selected.route_direction && x.service_mode == this.minibus_selected.service_mode)
            this.minibus_starred.splice(remove_index, 1);
            let minibus_starred_clone = JSON.parse(JSON.stringify(this.minibus_starred));
            let minibus_starred_promise = await this.localforage.setItem('minibus_starred', minibus_starred_clone);
        }
    },
    computed:{
        minibus_starred_check(){
            let minibus_starred_array = [...this.minibus_starred];
            if (minibus_starred_array.length == 0) {
                return false;
            } else {
                let minibus_starred_filtered = minibus_starred_array.filter(x =>  x.route_no == this.minibus_selected.route_no && x.link == this.minibus_selected.link && x.route_direction == this.minibus_selected.route_direction && x.service_mode == this.minibus_selected.service_mode);
                return ( minibus_starred_filtered.length > 0 ) ? true : false;
            }
        }
    },
    async mounted(){
        this.minibus = await this.localforage.getItem('minibus_data');
        this.minibus_starred = await this.localforage.getItem('minibus_starred');
        if (!this.minibus_starred){
            this.minibus_starred = [];
        } else {
            this.minibus_display_array = this.minibus_starred;
        }
        console.log(this.minibus_starred);
    }
});
</script>
<style scoped>
.hki-badge{
    --background: #e66dca;
}
.kln-badge{
    --background: #6dcae6;
}
.nt-badge{
    --background: #cae66d;
}
.night-badge{
    --background: #36454f;
}
.special-badge{
    --background: #663399;
}
.route_no{
    display: flex;
}
</style>
