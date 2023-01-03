<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-searchbar autocorrect="off" v-model="kmb_query"></ion-searchbar>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list>
                <ion-list-header>Search: {{ kmb_query }}</ion-list-header>
                <div v-for="(route, index) in kmb_display_array">
                    <ion-item button>
                        <ion-grid>
                            <ion-row class="open-modal" expand="block" @click="openKmbModal(index)">
                                <ion-col size-xs="3" size-md="1" class="route">
                                    <h3>{{ route.route }}</h3>
                                </ion-col>
                                <ion-col size-xs="9" size-md="11">
                                    <h3 class="ion-margin-start">{{ route.dest_tc }}</h3>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </div>
            </ion-list>
            <ion-modal :is-open="modalIsOpen" ref="modal" @WillDismiss="closeKmbModal">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>{{ kmb_selected.route }}<span class="ion-margin-start">{{ kmb_selected.dest_tc }}</span></ion-title>
                        <ion-buttons slot="start">
                            <ion-button @click="closeKmbModal">返回</ion-button>
                        </ion-buttons>
                        <ion-buttons slot="end">
                            <ion-button v-if="!show_map" @click="toggle_map"><ion-icon :icon="map"></ion-icon>地圖</ion-button>
                            <ion-button v-else @click="toggle_map"><ion-icon :icon="hourglass"></ion-icon>預報</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content v-if="!show_map">
                    <ion-list>
                        <ion-item v-for="(stop, index) in kmb_selected.stop">
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
                    <LeafletMap :route_locations="kmb_selected.stop" />
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal, IonIcon, IonButton, IonButtons  } from '@ionic/vue';
import { map, hourglass } from 'ionicons/icons';
import { fetch_kmb } from '@/components/fetch.js';
import LeafletMap from '@/components/leaflet.vue';

export default defineComponent({
    name: 'KMB',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal, IonIcon, IonButton, IonButtons, LeafletMap },
    setup(){
        let loading = false;
        const show_map = ref(false);
        let interval;
        const kmb = ref({}); // For storage of kmb routes and stops
        onMounted(async()=>{
            loading = true;
            if(localStorage.getItem('kmb')){
                kmb.value = JSON.parse(localStorage.getItem('kmb')); // Load localStorage if exists
            } else{
                kmb.value = await fetch_kmb(); // See components/fetch.js for kmb fetching function
                localStorage.setItem("kmb", JSON.stringify(kmb.value)); // Save routes information into local storage
            }
            loading = false;
        });
        const kmb_query = ref(''); // Reference for two way bind of search bar value
        const kmb_display_array = ref([]);// Reference for displaying search results
        const kmb_selected = ref({});//
        const modalIsOpen = ref(false);
        // Event listeners
        addEventListener('ionModalDidDismiss', function(){
            console.log('modal dismiss')
            modalIsOpen.value = false;
            clearInterval(this.interval);
        })
        watch(kmb_query, ()=>{
            if (kmb_query.value == ''){
                kmb_display_array.value = [];
            } else {
                kmb_display_array.value = kmb.value.route.filter(x => x.route.indexOf(kmb_query.value.toUpperCase()) == 0 ||
                x.dest_tc.includes(kmb_query.value)); // Filter by route numbers and destinations.
                kmb_display_array.value.splice(50);// Only show first 50 results
            }
        })
        return{
            kmb,
            kmb_query,
            kmb_display_array,
            kmb_selected,
            modalIsOpen,
            map,
            show_map,
            hourglass
        }
    },
    methods:{
        openKmbModal(index){
            this.kmb_selected = JSON.parse(JSON.stringify(this.kmb_display_array[index])); //Use Deep copy to prevent problems when clicked again
            this.modalIsOpen = true;
            this.getKmbStations();
            this.getKmbRouteTime();
            let inv = this
            this.interval = setInterval(function(){
                inv.getKmbRouteTime();
            }, 10000)
        },
        closeKmbModal(){
            this.modalIsOpen = false;
            this.show_map = false;
        },
        getKmbStations(){
            for (let i=0; i<this.kmb_selected.stop.length; i++){
                this.kmb_selected.stop[i] = this.kmb.stop.filter(x => x.stop == this.kmb_selected.stop[i])[0]; //
            }
        },
        async getKmbRouteTime(){
            this.loading = true;
            let route_response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${this.kmb_selected.route}/${this.kmb_selected.service_type}`);
                let route_eta = await route_response.json();
                let eta;
                route_eta = route_eta.data.filter(x => x.dir == this.kmb_selected.bound);
                for (let i = 0; i < route_eta.length; i++){
                    if (route_eta[i].eta != null){
                        let current_time = new Date(route_eta[i].data_timestamp);
                        let eta_time = new Date(route_eta[i].eta);
                        eta = Math.ceil((eta_time - current_time)/60000);
                        (eta < 0) ? eta = 0 : null ;
                    } else {
                        eta = null;
                    }
                ( route_eta[i].eta_seq == 1) ? this.kmb_selected.stop[route_eta[i].seq - 1].eta_1 = eta :
                ( route_eta[i].eta_seq == 2) ? this.kmb_selected.stop[route_eta[i].seq - 1].eta_2 = eta :
                this.kmb_selected.stop[route_eta[i].seq - 1].eta_3 = eta;
                }
            this.loading = false;
        },
        toggle_map(){
            this.show_map = !this.show_map;
        }
    }
});
</script>
<style scoped>
</style>
