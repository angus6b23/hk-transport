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
                <StopItems v-for="stop in item.stops" :key="stop.id" :stop="stop" :options="itemOptions" @getETA="getCTBETA"></StopItems>
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
import { fetchKMBETA, fetchCTBETA } from '@/components/fetchETA.js';
import { fetchBusStopID, reconstructBusStops } from '@/components/fetchStopID.js';
import SkeletonItems from '@/components/SkeletonItems.vue'
import StopItems from '@/components/StopItems.vue';
import RouteInfo from '@/components/RouteInfo.vue';
import LeafletMap from '@/components/leaflet.vue';
import presentToast from '@/components/presentToast.js';

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
        const itemOptions = ref({clickable: false}); 
        return{
            popupLoading,
            item,
            busStarred,
            popupView,
            chevronBack,
            starOutline,
            star,
            itemOptions
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
        // Fetch CTB and NWFB bus stop ids
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
                let indexResult = busStarredClone.findIndex(x => x.routeId == this.item.routeId && x.routeDirection == this.item.routeDirection);
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
        async getStopID(){ //Fetch Stop ids of CTB and NWFB bus from api
            if (!('stopId' in this.item.stops[0])){
                const stopData = await fetchBusStopID(this.item);
                console.log(stopData);
                if (stopData.status == 'success'){
                    // Populate stop ids into current route
                    if (stopData.data.length == this.item.stops.length)
                    {
                        stopData.data.forEach(element => {
                            const index = this.item.stops.findIndex(x => x.seq == element.seq);
                            if (index != -1){
                                this.item.stops[index].stopId = element.stop;
                            }
                        });
                    } else {
                        // Reconstruct CTB bus stop array
                        presentToast('info', '正在更新路線資料')
                        const reconBusData = await reconstructBusStops(stopData);
                        if (reconBusData.status == 'success' && reconBusData.data.length > 0){
                            this.item.stops = JSON.parse(JSON.stringify(reconBusData.data));
                        } else {
                            presentToast('error', '重新建立路線失敗')
                            return
                        }
                    }
                    // Emits save data to save data to local forage
                    this.$emit('saveData', JSON.parse(JSON.stringify(this.item)));
                }
            }
            presentToast('done', '按一下巴士站名稱以取得到站時間');
            this.itemOptions.clickable = true;
        },
        async getKMB(){ //Get KMB route etas from api
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
        },
        async getCTBETA(seq){
            const clickedIndex = this.item.stops.findIndex(x => x.seq == seq);
            this.item.stops[clickedIndex].etaMessage = 'loading';
            const etaData = await fetchCTBETA(this.item, this.item.stops[clickedIndex].stopId);
            if (etaData.status == 'success'){
                if (etaData.data.length > 0){
                    this.item.stops[clickedIndex].etas = [...etaData.data]
                    this.item.stops[clickedIndex].etaMessage = '';
                } else {
                    this.item.stops[clickedIndex].etaMessage = 'N/A'
                }
            }
            // console.log(this.item.stops[clickedIndex]);
        }
    },
    beforeUnmount(){
        clearInterval(this.interval);
    }
};
</script>
<style scoped>
.tabs{
    height: calc(100vh - 100px);
}
@media only screen and (min-width: 768px) and (min-height: 600px){
    .tabs{
        --offset-bottom: -100px !important;
        height: 600px !important;
    }
}
</style>
