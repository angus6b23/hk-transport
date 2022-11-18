<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-searchbar autocorrect="off" v-model="bus_query"></ion-searchbar>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list>
                <ion-list-header>Search: {{ bus_query }}</ion-list-header>
                <div v-for="(route, index) in bus_display_array">
                    <ion-item button>
                        <ion-grid>
                            <ion-row class="open-modal" expand="block" @click="open_bus_modal(index)">
                                <ion-col size-xs="3" size-md="1" class="route_no ion-align-items-center">
                                    <h3 v-if="route.route_no.length < 10">{{ route.route_no }}</h3>
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
                                    <ion-badge v-if="route.service_mode.includes('N')" class="night-badge ion-margin-start">晚間</ion-badge>
                                    <ion-badge v-if="route.service_mode == 'T'" class="special-badge ion-margin-start">特別</ion-badge>
                                    <h3 class="ion-no-margin ion-margin-start">{{ route.dest_tc }}</h3>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </div>
            </ion-list>
            <ion-modal :is-open="bus_modal_is_open" ref="modal" @WillDismiss="close_bus_modal">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>{{ bus_selected.route }}<span class="ion-margin-start">{{ bus_selected.dest_tc }}</span></ion-title>
                        <ion-buttons slot="start">
                            <ion-button @click="close_bus_modal">返回</ion-button>
                        </ion-buttons>
                        <ion-buttons slot="end">
                            <ion-button v-if="!show_map" @click="toggle_map"><ion-icon :icon="map"></ion-icon>地圖</ion-button>
                            <ion-button v-else @click="toggle_map"><ion-icon :icon="hourglass"></ion-icon>預報</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content v-if="!show_map">
                    <ion-list>
                        <ion-item v-for="(stop, index) in bus_selected.stops">
                            <ion-grid>
                                <ion-row class="ion-align-items-center">
                                    <ion-col size-xs="2" size-md="2">
                                        <h5 class="ion-margin-start">{{ index + 1 }}</h5>
                                    </ion-col>
                                    <ion-col size-xs="7" size-md="7">
                                        <h5 class="ion-margin-start">{{ stop.name_tc }}</h5>
                                    </ion-col>
                                    <ion-col size-xs="3" size-md="3">
                                        <p class="ion-no-margin ion-text-right">
                                            <div v-if="stop.eta_1 == null">暫無班次</div>
                                            <div v-else>
                                                <span v-if="stop.eta_1 != null">{{stop.eta_1}}</span>
                                                <span v-if="stop.eta_2 != null">, {{stop.eta_2}}</span>
                                                <span v-if="stop.eta_3 != null">, {{stop.eta_3}}</span>
                                                <span><br>分鐘</span>
                                            </div>
                                        </p>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                        <ion-item></ion-item>
                    </ion-list>
                </ion-content>
                <ion-content v-else>
                    <LeafletMap :route_locations="bus_selected.stop" />
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal, IonIcon, IonButton, IonButtons, IonBadge } from '@ionic/vue';
import { map, hourglass } from 'ionicons/icons';
import { fetch_bus, get_buses } from '@/components/fetch.js';
import LeafletMap from '@/components/leaflet.vue';

export default defineComponent({
    name: 'Bus',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal, IonIcon, IonButton, IonButtons, IonBadge, LeafletMap },
    setup(){
        // Create ref for loading and show map for ui control
        let interval; // For storing interval for reloading time
        const show_map = ref(false);
        const bus_query = ref(''); // Reference for two way bind of search bar value
        const bus_display_array = ref([]);// Reference for displaying search results
        const bus_selected = ref({}); // Reference for selected bus on query
        const bus_modal_is_open = ref(false);
        const bus = ref({}); // For storage of bus routes and stops
        /* Old Method
        onMounted(async()=>{
            loading.value = true;
            if(localStorage.getItem('bus')){
                bus.value = JSON.parse(localStorage.getItem('bus')); // Load localStorage if exists
            } else{
                bus.value = await get_buses(); // See components/fetch.js for bus fetching function
                localStorage.setItem("bus", JSON.stringify(bus.value)); // Save routes information into local storage
            }
            loading.value = false;
        });
        */
        // Event listeners
        addEventListener('ionModalDidDismiss', function(){
            bus_modal_is_open.value = false;
            clearInterval(this.interval);
        })

        watch(bus_query, async ()=>{ //Search for buses upon change in bus query
            if (bus_query.value == ''){
                bus_display_array.value = [];
            } else {
                bus_display_array.value = (bus_query.value) < 10 ? bus.value.filter(x => x.route_no.length <= 2 && x.route_no.indexOf(bus_query.value.toUpperCase()) == 0 || x.dest_tc.includes(bus_query.value)) :
                bus.value.filter(x => x.route_no.indexOf(bus_query.value.toUpperCase()) == 0 ||x.dest_tc.includes(bus_query.value)); // Filter by route numbers and destinations.
                await bus_display_array.value.sort(function(a, b){
                    a = Number(a.route_no.replace(/[A-Z]/g, 0));
                    b = Number(b.route_no.replace(/[A-Z]/g, 0));
                    return a - b;
                });
                bus_display_array.value.splice(50);// Only show first 50 results
            }
        })
        return{
            bus,
            bus_query,
            bus_display_array,
            bus_selected,
            bus_modal_is_open,
            map,
            show_map,
            hourglass
        }
    },
    methods:{
        open_bus_modal(index){
            this.bus_selected = JSON.parse(JSON.stringify(this.bus_display_array[index])); //Use Deep copy to prevent problems when clicked again
            console.log(this.bus_selected)
            this.bus_modal_is_open = true;
            this.getbusRouteTime();
            let inv = this
            this.interval = setInterval(function(){
                inv.getbusRouteTime();
            }, 10000)
        },
        close_bus_modal(){
            this.bus_modal_is_open = false;
            this.show_map = false;
        },
        async getbusRouteTime(){
            this.loading = true;
            let route_response = await fetch(`https://data.etabus.gov.hk/v1/transport/bus/route-eta/${this.bus_selected.route}/${this.bus_selected.service_type}`);
                let route_eta = await route_response.json();
                let eta;
                route_eta = route_eta.data.filter(x => x.dir == this.bus_selected.bound);
                for (let i = 0; i < route_eta.length; i++){
                    if (route_eta[i].eta != null){
                        let current_time = new Date(route_eta[i].data_timestamp);
                        let eta_time = new Date(route_eta[i].eta);
                        eta = Math.ceil((eta_time - current_time)/60000);
                        (eta < 0) ? eta = 0 : null ;
                    } else {
                        eta = null;
                    }
                ( route_eta[i].eta_seq == 1) ? this.bus_selected.stop[route_eta[i].seq - 1].eta_1 = eta :
                ( route_eta[i].eta_seq == 2) ? this.bus_selected.stop[route_eta[i].seq - 1].eta_2 = eta :
                this.bus_selected.stop[route_eta[i].seq - 1].eta_3 = eta;
                }
            this.loading = false;
        },
        toggle_map(){
            this.show_map = !this.show_map;
        }
    },
    async mounted(){
        this.bus = await this.localforage.getItem('bus_data');
        if(this.bus){
            console.log('loading finished')
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
.route_no{
    display: flex;
}
</style>
