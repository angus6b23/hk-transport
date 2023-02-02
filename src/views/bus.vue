<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-searchbar autocorrect="off" v-model="busQuery" placeholder="請輸入路線或目的地"></ion-searchbar>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list>
                <!-- Change List Header according to bus search -->
                <ion-list-header v-if="busQuery.length > 0">
                    <ion-label>搜尋: {{ busQuery }}</ion-label>
                </ion-list-header>
                <ion-list-header v-else>
                    <ion-label>我的最愛</ion-label>
                </ion-list-header>
                <!-- Bus route display list here -->
                <div v-for="(route, index) in busDisplayArray" :key="route.id">
                    <ion-item button>
                        <ion-grid>
                            <ion-row class="open-modal" expand="block" @click="openBusModal(index)">
                                <ion-col size-xs="3" size-md="1" class="route-no ion-align-items-center">
                                    <h3 v-if="route.routeNo.length < 10">{{ route.routeNo }}</h3>
                                    <h3 v-else>-</h3>
                                </ion-col>
                                <ion-col size-xs="9" size-md="11">
                                    <ion-badge v-if="route.company.includes('KMB')" class="kmb-badge ion-margin-start">九巴</ion-badge>
                                    <ion-badge v-if="route.company.includes('CTB')" class="ctb-badge ion-margin-start">城巴</ion-badge>
                                    <ion-badge v-if="route.company.includes('LWB')" class="lwb-badge ion-margin-start">龍運</ion-badge>
                                    <ion-badge v-if="route.company.includes('NWFB')" class="nwfb-badge ion-margin-start">新巴</ion-badge>
                                    <ion-badge v-if="route.company.includes('DB')" class="db-badge ion-margin-start">愉景</ion-badge>
                                    <ion-badge v-if="route.company.includes('NLB')" class="nlb-badge ion-margin-start">大嶼</ion-badge>
                                    <ion-badge v-if="route.company.includes('PI')" class="pi-badge ion-margin-start">馬灣</ion-badge>
                                    <ion-badge v-if="route.company.includes('XB')" class="xb-badge ion-margin-start">過境</ion-badge>
                                    <ion-badge v-if="route.company.includes('LRTFeeder')" class="ltr-badge ion-margin-start">港鐵</ion-badge>
                                    <ion-badge v-if="route.serviceMode.includes('N')" class="night-badge ion-margin-start">晚間</ion-badge>
                                    <ion-badge v-if="route.serviceMode == 'T'" class="special-badge ion-margin-start">特別</ion-badge>
                                    <h3 class="ion-no-margin ion-margin-start">{{ route.destTC }}</h3>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
        <!-- Modal for displaying bus details -->
        <ion-modal :is-open="busModalIsOpen" ref="modal" @WillDismiss="closeModal">
            <ETAPopup :item="busSelected" :busStarred="busStarred" @closeModal="closeModal" @addStar="addStar" @removeStar="removeStar" @saveData="saveBusData" />
        </ion-modal>
    </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal, IonIcon, IonButton, IonButtons, IonBadge } from '@ionic/vue';
import { map, hourglass, chevronBack, starOutline, star } from 'ionicons/icons';
import { loadData, setData } from '@/components/loadData.js'
import ETAPopup from '@/components/ETAPopup.vue'
import LeafletMap from '@/components/leaflet.vue';

export default defineComponent({
    name: 'Bus',
    components: { IonHeader, IonToolbar, IonContent, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal, IonIcon, IonButton, IonButtons, IonBadge, LeafletMap, ETAPopup },
    setup(){
        // Create ref for loading and show map for ui control
        const busQuery = ref(''); // Reference for two way bind of search bar value
        const busDisplayArray = ref([]);// Reference for displaying search results
        const busSelected = ref({}); // Reference for selected bus on query
        const busModalIsOpen = ref(false);
        const bus = ref([]); // For storage of bus routes and stops
        const busStarred = ref([]);
        // Event listeners
        addEventListener('ionModalDidDismiss', function(){
            busModalIsOpen.value = false;
        })
        watch(busQuery, async ()=>{ //Search for buses upon change in bus query
            if (busQuery.value == ''){
                busDisplayArray.value = busStarred.value;
            } else {
                busDisplayArray.value = (busQuery.value) < 10 ? bus.value.filter(x => x.routeNo.length <= 2 && x.routeNo.indexOf(busQuery.value.toUpperCase()) == 0 || x.destTC.includes(busQuery.value)) :
                bus.value.filter(x => x.routeNo.indexOf(busQuery.value.toUpperCase()) == 0 ||x.destTC.includes(busQuery.value)); // Filter by route numbers and destinations.
                await busDisplayArray.value.sort(function(a, b){
                    a = Number(a.routeNo.replace(/[A-Z]/g, 0));
                    b = Number(b.routeNo.replace(/[A-Z]/g, 0));
                    return a - b;
                });
                busDisplayArray.value.splice(50);// Only show first 50 results
            }
        })
        return{
            bus,
            busQuery,
            busDisplayArray,
            busSelected,
            busModalIsOpen,
            busStarred,
            map,
            hourglass,
            chevronBack,
            starOutline,
            star
        }
    },
    methods:{
        openBusModal(index){
            this.busSelected = JSON.parse(JSON.stringify(this.busDisplayArray[index])); //Use Deep copy to prevent problems when clicked again
            console.log(this.busSelected)
            this.busModalIsOpen = true;
        },
        closeModal(){
            this.busModalIsOpen = false;
        },
        /*async getbusRouteTime(){
            for (stop of this.busSelected.stops){
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
            
            if (this.busSelected.company.includes('KMB') || this.busSelected.company.includes('LWB')){
                try{
                    let service_type = (this.busSelected.serviceMode == 'R' ) ? 1 : 2; //Service type: R => 1, others => 2
                    let direction = ( this.busSelected.routeDirection == 1 ) ? 'O' : 'I'; //Direction 1 = outbound, 2 = inbound
                    let route_response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${this.busSelected.routeNo}/${service_type}`);
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
                        let index = this.busSelected.stops.findIndex(x => x.seq == route_eta[i].seq);
                        this.busSelected.stops[index].etas.push(eta);
                        this.busSelected.stops[index].eta_message = eta_message;
                    }
                    //console.log(this.busSelected.stops);
                } catch(err){
                    console.error(err);
                }
            }
            if (this.busSelected.company.includes('CTB') || this.busSelected.company.includes('NWFB') ||this.busSelected.company.includes('NLB')){
                let company =   (this.busSelected.company.includes('CTB')) ? 'CTB':
                                (this.busSelected.company.includes('NWFB')) ? 'NWFB':
                                (this.busSelected.company.includes('NLB')) ? 'NLB': null;
                let direction = ( this.busSelected.routeDirection == 1 ) ? 'outbound' : 'inbound'; //Direction 1 = outbound, 2 = inbound
                try{
                    if (this.busSelected.stops[0].stop_id == ''){
                        // Get Bus stop ids first
                        let route_response = await fetch(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route-stop/${company}/${this.busSelected.routeNo}/${direction}`);
                        let route_data = await route_response.json();
                        route_data = route_data.data;
                        // Insert the stop ids into bus object
                        for (stop of this.busSelected.stops){
                            let index = route_data.findIndex(x => x.seq == stop.seq);
                            stop.stop_id = route_data[index].stop;
                        }
                    }
                    // Get etas
                    direction = ( this.busSelected.routeDirection == 1 ) ? 'O' : 'I';
                    for (const stop of this.busSelected.stops){
                        let eta_response = await fetch(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${company}/${stop.stop_id}/${this.busSelected.routeNo}`);
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
            }
            for (stop of this.busSelected.stops){
                if (stop.etas.length == 0){
                    stop.eta_message = 'no_available_bus'
                } else {
                    stop.etas.sort((a,b) => a - b);
                    stop.eta_display = [...stop.etas];
                }
            }
        },*/
        async addStar(){
            this.busStarred.push(this.busSelected);
            const busStarredClone = JSON.parse(JSON.stringify(this.busStarred));
            await setData('busStarred', busStarredClone);
        },
        async removeStar(){
            const removeIndex = this.busStarred.findIndex(this.currentSelectedBus)
            this.busStarred.splice(removeIndex, 1);
            const busStarredClone = JSON.parse(JSON.stringify(this.busStarred));
            await setData('busStarred', busStarredClone);
        },
        async saveBusData(data){
            // Link to currently displayed bus
            const displayIndex = this.busDisplayArray.findIndex(this.currentSelectedBus)
            this.busDisplayArray[displayIndex] = data;
            // Link to global bus array
            const index = this.bus.findIndex(this.currentSelectedBus);
            this.bus[index] = JSON.parse(JSON.stringify(data));
            // console.log(index);

            // Save to localforage
            const key = 'busData-chunk' + Math.floor(index / 100);
            const chunkIndex = index % 100;
            let chunk = await loadData(key, false, false);
            chunk[chunkIndex] = JSON.parse(JSON.stringify(data));
            await setData(key, chunk);
        },
        currentSelectedBus(x){
            return x.routeId == this.busSelected.routeId && x.routeDirection == this.busSelected.routeDirection
        }
    },
    async mounted(){
        this.bus = await loadData('busData', false, true);
        this.busStarred = await loadData('busStarred', false, false);
        if (!this.busStarred){
            this.busStarred = [];
        } else {
            this.busDisplayArray = this.busStarred;
        }
    }
});
</script>
<style scoped>
.kmb-badge{
    --background: #e51f28;
}
.lwb-badge{
    --background: #f05323;
}
.ctb-badge{
    --background: #0563ad;
}
.nwfb-badge{
    --background: #6e449d;
}
.nlb-badge{
    --background: #00897b;
}
.pi-badge{
    --background: #febc22;
}
.db-badge{
    --background: #e7222b;
}
.xb-badge{
    --background: #ff67de;
}
.night-badge{
    --background: #36454f;
}
.special-badge{
    --background: #663399;
}
.route-no{
    display: flex;
}
</style>
