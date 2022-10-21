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
                                    <h5 class="ion-margin-start">{{ route.dest_tc }}</h5>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </div>
            </ion-list>
            <ion-modal :is-open="modalIsOpen" ref="modal" @WillDismiss="closeKmbModal">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>{{ kmb_selected.route }}  {{ kmb_selected.dest_tc }}</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="closeKmbModal">返回</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <ion-list v-for="(stop, index) in kmb_selected.stop">
                        <ion-item>
                            <h5 class="ion-margin-start">{{index+1}}</h5>
                            <h5 class="ion-margin-start">{{stop.name_tc}}</h5>
                        </ion-item>
                    </ion-list>
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal} from '@ionic/vue';
import { fetch_kmb } from '@/components/fetch.js';

export default defineComponent({
    name: 'KMB',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow, IonModal},
    setup(){
        const kmb = ref({});
        onMounted(async()=>{
            if(localStorage.getItem('kmb')){
                kmb.value = JSON.parse(localStorage.getItem('kmb'));
            } else{
                kmb.value = await fetch_kmb();
                localStorage.setItem("kmb", JSON.stringify(kmb.value));
            }
        });
        const kmb_query = ref('');
        const kmb_display_array = ref([]);
        const kmb_selected = ref({});
        const modalIsOpen = ref(false);
        addEventListener('ionModalDidDismiss', function(){
            console.log('modal dismiss')
            modalIsOpen.value = false;
        })
        watch(kmb_query, ()=>{
            if (kmb_query.value == ''){
                kmb_display_array.value = [];
            } else {
                kmb_display_array.value = kmb.value.route.filter(x => x.route.indexOf(kmb_query.value.toUpperCase()) == 0 ||
                x.dest_tc.includes(kmb_query.value));
                kmb_display_array.value.splice(50);
            }
        })
        return{
            kmb,
            kmb_query,
            kmb_display_array,
            kmb_selected,
            modalIsOpen
        }
    },
    methods:{
        openKmbModal(index){
            this.kmb_selected = JSON.parse(JSON.stringify(this.kmb_display_array[index])); //Use Deep copy to prevent problems when clicked again
            this.getKmbStations();
            this.modalIsOpen = true;
            // console.log(this.kmb_selected);
        },
        closeKmbModal(){
            this.modalIsOpen = false;
        },
        getKmbStations(){
            for (let i=0; i<this.kmb_selected.stop.length; i++){
                this.kmb_selected.stop[i] = this.kmb.stop.filter(x => x.stop == this.kmb_selected.stop[i])[0];
            }
        },
        async getKmbRouteTime(){
            if(this.kmb_selected && modalIsOpen){
                let route_response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${this.kmb_selected.route}/${this.kmb_selected.service_type}`);
                let route_eta = await route_response.json();
                route_eta = route_eta.filter(x => x.dir == this.kmb_selected.bound);

            }
        }
    }
});
</script>
<style scoped>
.route{
    text-align : left;
}
</style>
