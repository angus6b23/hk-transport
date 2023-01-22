<template>
    <!-- Header -->
    <ion-header>
        <!-- Toolbar -->
        <ion-toolbar>
            <ion-title>{{ item.routeNo }}<span class="ion-margin-start">{{ item.destTC }}</span></ion-title>
            <ion-buttons slot="start">
                <ion-button @click="closeModal"><ion-icon :icon="chevronBack"></ion-icon></ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
                <ion-button  v-if="checkbusStar" @click="removeStar">
                    <ion-icon :icon="star" />
                </ion-button>
                <ion-button v-else @click="addStar">
                    <ion-icon :icon="starOutline" />
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
        <!-- Segment select -->
        <ion-segment v-model="popupView">
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
    <ion-content v-if="popupView == 'default'" class="tabs">
        <!-- Skeleton view for loading -->
        <ion-list v-if="popupLoading">
            <SkeletonItems />
        </ion-list>
        <ion-list v-else>
            <StopItems v-for="stop in item.stops" :key="stop.id" :stop="stop"></StopItems>
        </ion-list>
    </ion-content>
    <!-- Route Info -->
    <ion-content v-else-if="popupView == 'info'" class="tabs">
       <RouteInfo :item="item"></RouteInfo>
    </ion-content>
    <ion-content v-else-if="popupView == 'map'" class="tabs">
        <LeafletMap :routeLocations="item.stops" />
    </ion-content>
</template>

<script>
import { ref, computed } from 'vue';
import { IonPage, IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar} from '@ionic/vue';
import { star, starOutline, chevronBack } from 'ionicons/icons'
import { fetchKMBETA } from '@/components/fetchETA.js';
import { fetchBusStopID } from '@/components/fetchStopID.js';
import SkeletonItems from '@/components/SkeletonItems.vue'
import StopItems from '@/components/StopItems.vue';
import RouteInfo from '@/components/RouteInfo.vue';
import LeafletMap from '@/components/leaflet.vue';

export default {
    name: "ETAPopup",
    components: { IonPage, IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar, LeafletMap, SkeletonItems, StopItems, RouteInfo },
    props: ['item', 'busStarred'],
    emits: ['closeModal', 'addStar', 'removeStar', 'saveData'],
    setup(props){
        const popupLoading = ref(false);
        const item = ref(props.item);
        const popupView = ref('default');
        const busStarred = props.busStarred;
        let interval;
        return{
            popupLoading,
            item,
            busStarred,
            popupView,
            chevronBack,
            starOutline,
            star
        }
    },
    async mounted(){
        // Show loading for minibus
        if (this.item.type == 'minibus'){
            this.popupLoading = true;
        }
        // Fetch KMB ETAs
        if (this.item.type == 'bus' && this.item.company.length == 1 && (this.item.company.includes('KMB') || this.item.company.includes('LMB'))){
            this.getKMB();
            this.interval = setInterval(()=>this.getKMB(), 10000);
        }
        if (this.item.type == 'bus' && (this.item.company.includes('CTB') || this.item.company.includes('NWFB'))){
            await this.getStopID();
        }
    },
    computed:{
        checkbusStar(){ //Return true if bus is in busStarred array.
            let busStarredClone = [...this.busStarred];
            if (busStarredClone.length == 0){
                return false
            } else {
                let indexResult = busStarredClone.findIndex(x => x.routeNo == this.item.routeNo && x.infoLink == this.item.infoLink && x.routeDirection == this.item.routeDirection && x.serviceMode == this.item.serviceMode);
                if (indexResult == -1){
                    return false;
                } else {
                    return true;
                }
            }
        }
    },
    methods:{
        closeModal(){
            this.$emit('closeModal');
        },
        addStar(){
            this.$emit('addStar');
        },
        removeStar(){
            this.$emit('removeStar');
        },
        async getStopID(){
            // Break function if stops already saved
            if (!('stopId' in this.item.stops[0])){
                const stopData = await fetchBusStopID(this.item);
                if (stopData.status == 'success'){
                    stopData.data.forEach(element => {
                        const index = this.item.stops.findIndex(x => x.seq == element.seq);
                        if (index != -1){
                            this.item.stops[index].stopId = element.stop;
                        }
                    });
                    this.$emit('saveData', JSON.parse(JSON.stringify(this.item)));
                }
            }
        },
        async getKMB(){
            const etaData = await fetchKMBETA(this.item);
            if (etaData.status == 'success') {
                etaData.data.forEach(element => {
                    const index = this.item.stops.findIndex(x => x.seq == element.seq);
                    if(index != -1){
                        this.item.stops[index].etaMessage = element.note;
                        this.item.stops[index].etas = [...element.etas];
                    }
                })
            }
        }
    },
    beforeUnmount(){
        clearInterval(this.interval);
    }
};
</script>
<style scoped>
.tabs{
    --offset-bottom: -100px !important;
    height: 100vh;
}
@media only screen and (min-width: 768px) and (min-height: 600px){
    .tabs{
        --offset-bottom: -100px !important;
        height: 600px !important;
    }
}
</style>
