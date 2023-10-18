<template>
    <!-- Header -->
    <ion-header>
        <!-- Toolbar -->
        <ion-toolbar>
            <ion-title v-if="item.type == 'bus' || item.type == 'minibus'">
                <span>{{ item.routeNo }}</span>
                <span
                    v-if="$i18next.language === 'zh'"
                    class="ion-margin-start"
                    >{{ item.destTC }}</span
                >
                <span v-else class="ion-margin-start">{{ item.destEN }}</span>
            </ion-title>
            <ion-title v-else-if="item.type == 'lightRail'">
                {{ item.routeNameEN }}
                <span v-if="$i18next.language === 'zh'" class="ion-margin-start"
                                                        >{{ item.originTC }} - {{ item.destTC }}</span
                                                    >
                                                    <span v-else class="ion-margin-start"
                                                                 >{{ item.originEN }} - {{ item.destEN }}</span
                                                             >
            </ion-title>
            <ion-title class="marquee" v-else>
                <span v-if="$i18next.language === 'zh'">{{
                    item.routeNameTC
                    }}</span>
                <span v-else>{{ item.routeNameEN }}</span>
            </ion-title>
            <ion-buttons slot="start" class="top-buttons">
                <ion-button @click="closeModal"
                    ><ion-icon :icon="chevronBack"></ion-icon
                    ></ion-button>
            </ion-buttons>
            <ion-buttons slot="end" class="top-buttons">
                <span v-if="altRoutes && altRoutes.length == 1">
                    <ion-button @click="swapDirection">
                        <ion-icon :icon="swapHorizontalOutline" />
                    </ion-button>
                </span>
                <span v-if="altRoutes && altRoutes.length > 1">
                    <ion-button @click="presentActionSheet">
                        <ion-icon :icon="swapHorizontalOutline" />
                    </ion-button>
                </span>
                <span v-if="starred != undefined">
                    <ion-button v-if="checkbusStar" @click="removeStar">
                        <ion-icon :icon="star" />
                    </ion-button>
                    <ion-button v-else @click="addStar">
                        <ion-icon :icon="starOutline" />
                    </ion-button>
                </span>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content ref="content" class="ion-padding-bottom">
        <!-- Segment select -->
        <section slot="fixed" class="popup-segment">
            <ion-segment v-model="popupView">
                <ion-segment-button value="default">
                    <ion-label>{{ $t('etaPopup.frame.upcoming') }}</ion-label>
                </ion-segment-button>
                <ion-segment-button v-if="item.type != 'mtr' && item.type != 'lightRail'" value="info">
                    <ion-label>{{ $t('etaPopup.frame.info') }}</ion-label>
                </ion-segment-button>
                <ion-segment-button v-if="item.type != 'mtr' && item.type != 'lightRail'" value="map">
                    <ion-label>{{ $t('etaPopup.frame.map') }}</ion-label>
                </ion-segment-button>
            </ion-segment>
        </section>
        <div class="segment-content">
            <!-- Segment for route etas -->
            <section v-if="popupView == 'default'">
                <!-- Skeleton view for loading -->
                <ion-list v-if="popupLoading">
                    <SkeletonItems />
                </ion-list>
                <!-- Show list view for stops and etas -->
                <ion-list v-else>
                    <StopItems
                        v-for="stop in item.stops"
                        :key="stop.id"
                        :stop="stop"
                        :noEta="noEta"
                        :class="{ nearest: isNearestStop(stop.stopId) }"
                        ref="stopItem"
                        ></StopItems>
                </ion-list>
            </section>
            <section v-if="popupView == 'info'">
                <RouteInfo :item="item"></RouteInfo>
                <!-- Route Info -->
            </section>
            <!-- Map View -->
            <section v-if="popupView == 'map'" class="max-size">
                <LeafletMap
                    :routeLocations="item.stops"
                    :currentLocation="currentLocation"
                    />
            </section>
        </div>
    </ion-content>
</template>

<script>
import { ref, inject } from 'vue'
import {
    IonHeader,
    IonTitle,
    IonContent,
    IonList,
    IonLabel,
    IonIcon,
    IonButton,
    IonButtons,
    IonSegment,
    IonSegmentButton,
    IonToolbar,
    actionSheetController,
} from '@ionic/vue'
import {
    star,
    starOutline,
    chevronBack,
    swapHorizontalOutline,
} from 'ionicons/icons'
import { Geolocation } from '@capacitor/geolocation'
import { getDistance } from 'geolib'

import {
    fetchKMBETA,
    fetchMtrBusEta,
    fetchNLBEta,
    fetchMinibusEta,
    fetchMtrEta,
    fetchLightRailEta,
    fetchBulkCTBETA,
} from '@/fetch/fetchETA.js'
// import { fetchBusStopID, reconstructBusStops } from '@/fetch/fetchStopID.js';
import SkeletonItems from '@/components/SkeletonItems.vue'
import StopItems from '@/components/StopItems.vue'
import RouteInfo from '@/components/RouteInfo.vue'
import LeafletMap from '@/components/leaflet.vue'
import presentToast from '@/components/presentToast.js'

export default {
    name: 'ETAPopup',
    components: {
        IonHeader,
        IonTitle,
        IonContent,
        IonList,
        IonLabel,
        IonIcon,
        IonButton,
        IonButtons,
        IonSegment,
        IonSegmentButton,
        IonToolbar,
        LeafletMap,
        SkeletonItems,
        StopItems,
        RouteInfo,
    },
    props: ['item', 'starred', 'noEta', 'altRoutes'],
    emits: ['closeModal', 'addStar', 'removeStar', 'swapDirection'],
    setup(props) {
        const popupLoading = ref(false)
        const item = ref({ ...props.item })
        const popupView = ref('default')
        const starred = ref(props.starred)
        const altRoutes = ref(props.altRoutes)
        const noEta = ref(props.noEta)
        const currentLocation = ref()
        const nearestStop = ref()
        const stopItem = ref(null)
        const injectConfig = inject('globalConfig')
        return {
            popupLoading,
            item,
            starred,
            popupView,
            altRoutes,
            currentLocation,
            nearestStop,
            noEta,
            stopItem,
            chevronBack,
            starOutline,
            star,
            swapHorizontalOutline,
            injectConfig
        }
    },
    async mounted() {
        // Show Toast if no eta is avaliable
        if (this.noEta) {
            presentToast('info', this.$t('toast.noEta'))
        }
        // Fetch KMB ETAs
        if (
            this.item.type === 'bus' &&
            this.item.company.length == 1 &&
            (this.item.company.includes('KMB') ||
                this.item.company.includes('LWB'))
        ) {
            this.getKMB()
            this.interval = setInterval(async () => await this.getKMB(), 10000)
        }
        // Fetch CTB and NWFB bus stop ids
        else if (
            this.item.type === 'bus' &&
            this.item.company.length == 1 &&
            (this.item.company.includes('CTB') ||
                this.item.company.includes('NWFB'))
        ) {
            // Fetching stop id will not required now when using api
            // await this.getStopID();
            this.getCTB()
            this.interval = setInterval(async () => await this.getCTB(), 10000)
        }
        // Fetch Bus routes operated by multiple companies
        else if (this.item.type === 'bus' && this.item.company.length >= 2) {
            this.getMultiple()
            this.interval = setInterval(
                async () => await this.getMultiple(),
                10000
            )
        }
        // Fetch MTR Buses ETAs
        else if (
            this.item.type === 'bus' &&
            this.item.company.includes('LRTFeeder')
        ) {
            this.getMtrBus()
            this.interval = setInterval(
                async () => await this.getMtrBus(),
                10000
            )
        }
        // Fetch NLB Buses ETAs
        else if (
            this.item.type === 'bus' &&
            this.item.company.includes('NLB')
        ) {
            this.getNLB()
            this.interval = setInterval(async () => await this.getNLB(), 10000)
        } else if (this.item.type === 'minibus') {
            this.getMinibus()
            this.interval = setInterval(
                async () => await this.getMinibus(),
                10000
            )
        } else if (this.item.type === 'mtr') {
            this.getMtr()
            this.interval = setInterval(async () => await this.getMtr(), 10000)
        }
        if (this.item.type === 'lightRail'){
            this.getLightRail();
        }
        // Get Coordinates
        try {
            this.currentLocation = await Geolocation.getCurrentPosition()
            const stopDistance = this.item.stops.map((stop) => {
                //Create an array hold all stops id and distance between current coord
                if (stop.coord && stop.coord.length > 0) {
                    const currentLat = this.currentLocation.coords.latitude
                    const currentLong = this.currentLocation.coords.longitude
                    const stopLat = stop.coord[1]
                    const stopLong = stop.coord[0]
                    return {
                        id: stop.stopId,
                        distance: getDistance(
                            { latitude: currentLat, longitude: currentLong },
                            { latitude: stopLat, longitude: stopLong }
                        ),
                    }
                } else {
                    return {
                        distance: 9999999,
                    }
                }
            })
            this.nearestStop = stopDistance.reduce((acc, cur) => {
                // Reduce the distance array for nearest id and distance
                if (cur.distance < acc.distance) {
                    return cur
                } else {
                    return acc
                }
            })
            // Auto scroll to nearest station ETA if the distance is less than 1000
            if (this.nearestStop && this.nearestStop.distance < 1000) {
                let index = this.item.stops.findIndex(
                    (stop) => stop.stopId == this.nearestStop.id
                )
                if (index != -1 && this.$refs.stopItem) {
                    let height = this.$refs.stopItem[0].$el.clientHeight
                    this.$refs.content.$el.scrollToPoint(
                        0,
                        height * index - height / 2,
                        500
                    )
                }
            }
            //console.log(this.nearestStop);
        } catch (err) {
            console.error(err)
        }
    },
    computed: {
        checkbusStar() {
            //Return true if route is in starred array.
            if (this.starred) {
                let starredClone = [...this.starred]
                if (starredClone.length == 0) {
                    return false
                } else {
                    let indexResult = starredClone.findIndex(
                        (x) =>
                        x.routeId == this.item.routeId &&
                        x.direction == this.item.direction
                    )
                    if (indexResult == -1) {
                        return false
                    } else {
                        return true
                    }
                }
            }
            return false
        },
    },
    methods: {
        closeModal() {
            this.$emit('closeModal')
        },
        addStar() {
            this.$emit('addStar')
        },
        removeStar() {
            this.$emit('removeStar')
        },
        swapDirection() {
            this.$emit('swapDirection', this.altRoutes[0])
        },
        populateETABySeq(etaData) {
            if (etaData.status == 'success' && etaData.data.length > 0) {
                etaData.data.forEach((etaItem) => {
                    const index = this.item.stops.findIndex(
                        (x) => x.seq == etaItem.seq
                    )
                    if (index != -1) {
                        this.item.stops[index].etaMessage = etaItem.note
                        this.item.stops[index].etas = [...etaItem.etas]
                    }
                })
            }
        },
        populateETAById(etaData) {
            if (etaData.status == 'success' && etaData.data.length > 0) {
                etaData.data.forEach((etaItem) => {
                    let index
                    if (this.item.stops[0].altId) {
                        index = this.item.stops.findIndex(
                            (x) => x.altId === etaItem.stopId
                        )
                    } else {
                        index = this.item.stops.findIndex(
                            (x) =>
                            x.stopId == etaItem.stopId ||
                            x.stopId == etaItem.stationId
                        )
                    }
                    if (index != -1) {
                        this.item.stops[index].etaMessage = etaItem.note
                        this.item.stops[index].etas = [...etaItem.etas]
                    }
                })
            }
        },
        /*
        Old code, currently do not require feching data from CTB and NWFB
        async getStopID() { //Fetch Stop ids of CTB and NWFB bus from api
            if (this.item.stops.length > 0 && !('stopId' in this.item.stops[0])) {
                const stopData = await fetchBusStopID(this.item);
                // console.log(stopData);
                if (stopData.status == 'success') {
                    // Populate stop ids into current route
                    if (stopData.data.length == this.item.stops.length) {
                        stopData.data.forEach(element => {
                            const index = this.item.stops.findIndex(x => x.seq == element.seq);
                            if (index != -1) {
                                this.item.stops[index].stopId = element.stop;
                            }
                        });
                    } else {
                        // Reconstruct CTB bus stop array
                        presentToast('info', '正在更新路線資料')
                        const reconBusData = await reconstructBusStops(stopData);
// console.log(reconBusData);
                        if (reconBusData.status == 'success' && reconBusData.data.length > 0) {
                            this.item.stops = JSON.parse(JSON.stringify(reconBusData.data));
                        } else {
                            presentToast('error', '重新建立路線失敗')
                            return
                        }
                    }
                    // Emits save data to save data to local forage
                    this.$emit('saveData', JSON.parse(JSON.stringify(this.item)));
                    presentToast('done', '已更新巴士路線資料');
                }
            }
        }, */
                        async getKMB() {
                            //Get KMB route etas from api
                            const etaData = await fetchKMBETA(this.item)
                            this.populateETABySeq(etaData)
                        },
        async getCTB() {
            const etaData = await fetchBulkCTBETA(this.item)
            this.populateETAById(etaData)
        },
        async getLightRail(){
            const url = this.injectConfig.apiBaseUrl === '' ? undefined : this.injectConfig.apiBaseUrl
            const etaData = await fetchLightRailEta(this.item, url);
            this.populateETAById(etaData)
        },
        async getMultiple() {
            const kmbReq = fetchKMBETA(this.item)
            const ctbReq = fetchBulkCTBETA(this.item)
            let data = await Promise.all([kmbReq, ctbReq])
            let [kmbData, ctbData] = data
            let combinedList = []
            //combined item = { seq: number, data:[{tag: string, eta: number, note}]};
            if (kmbData.status === 'success') {
                for (let kmb of kmbData.data) {
                    let etaArray = kmb.etas.map((item) => {
                        return {
                            tag: 'KMB',
                            eta: item,
                            note: kmb.note,
                        }
                    })
                    combinedList.push({
                        seq: kmb.seq,
                        data: etaArray,
                    })
                }
            }
            if (ctbData.status === 'success') {
                const companyCode = this.item.company.includes('CTB')
                    ? 'CTB'
                    : 'NWFB'
                for (let ctb of ctbData.data) {
                    let index = this.item.stops.findIndex(
                        (stop) => stop.altId == ctb.stopId
                    )
                    if (index != -1) {
                        let seq = this.item.stops[index].seq
                        let combinedListIndex = combinedList.findIndex(
                            (item) => item.seq == seq
                        )
                        let etaArray = ctb.etas.map((item) => {
                            return {
                                tag: companyCode,
                                eta: item,
                                note: ctb.note,
                            }
                        })
                        if (combinedListIndex != -1) {
                            combinedList[combinedListIndex].data = [
                                ...combinedList[combinedListIndex].data,
                                ...etaArray,
                            ]
                        } else {
                            combinedList.push({
                                seq: seq,
                                data: etaArray,
                            })
                        }
                    }
                }
            }
            // Sort the etas inside every stop in combined list
            for (let stop of combinedList) {
                stop.data.sort((a, b) => a.eta - b.eta)
            }
            // Populate the combined List
            console.log(combinedList)
            for (let i = 0; i < combinedList.length; i++) {
                let targetItem = combinedList[i]
                let targetStopIndex = this.item.stops.findIndex(
                    (stop) => stop.seq == targetItem.seq
                )
                if (targetStopIndex != -1) {
                    let etaArray = targetItem.data.map((item) => item.eta)
                    if (etaArray.length > 0) {
                        this.item.stops[targetStopIndex].etas = etaArray.slice(
                            0,
                            3
                        )
                    } else {
                        this.item.stops[targetStopIndex].etaMessage = 'N/A'
                    }
                }
            }
        },
        async getMtrBus() {
            const etaData = await fetchMtrBusEta(this.item)
            this.populateETAById(etaData)
        },
        async getNLB() {
            const etaData = await fetchNLBEta(this.item)
            this.populateETAById(etaData)
        },
        async getMinibus() {
            const etaData = await fetchMinibusEta(this.item)
            this.populateETAById(etaData)
        },
        async getMtr() {
            const etaData = await fetchMtrEta(this.item)
            if (etaData.status == 'success' && etaData.data.length > 0) {
                etaData.data.forEach((etaItem) => {
                    const index = this.item.stops.findIndex(
                        (x) => x.code == etaItem.stopId
                    )
                    if (index != -1) {
                        this.item.stops[index].etaMessage = etaItem.note
                        this.item.stops[index].etas = [...etaItem.etas]
                    }
                })
            } else if (etaData.status == 'api-error') {
                presentToast('error', etaData.memo)
            }
        },
        async presentActionSheet() {
            const actionButtons = this.altRoutes.map((route) => {
                if (this.$i18next.language === 'zh') {
                    return {
                        text: `${route.originTC} →  ${route.destTC}`,
                        data: route,
                    }
                } else {
                    return {
                        text: `${route.originEN} →  ${route.destEN}`,
                        data: route,
                    }
                }
            })
            const actionSheet = await actionSheetController.create({
                header: this.$t('etaPopup.frame.otherDirection'),
                buttons: actionButtons,
            })
            await actionSheet.present()
            const { data: res } = await actionSheet.onDidDismiss()
            this.$emit('swapDirection', res)
        },
        isNearestStop(stopId) {
            if (
                this.nearestStop &&
                this.nearestStop.id === stopId &&
                this.nearestStop.distance <= 1000
            ) {
                return true
            } else {
                return false
            }
        },
    },
    beforeUnmount() {
        clearInterval(this.interval)
    },
}
</script>
<style>
.nearest h5 {
    color: var(--ion-color-primary);
}

.extended-padding-bottom {
    padding-bottom: 100vh;
}

.popup-segment {
    background-color: var(--background);
    width: 100%;
}

.segment-content {
    margin-top: 50px;
    margin-bottom: 50px;
}
</style>
