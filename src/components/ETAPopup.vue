<template>
	<!-- Header -->
	<ion-header>
		<!-- Toolbar -->
		<ion-toolbar>
			<ion-title v-if="item.type == 'bus' || item.type == 'minibus'">
				{{ item.routeNo }}
				<span class="ion-margin-start">{{ item.destTC }}</span>
			</ion-title>
			<ion-title v-else>{{ item.routeNameTC }}</ion-title>
			<ion-buttons slot="start" class="top-buttons">
				<ion-button @click="closeModal"><ion-icon :icon="chevronBack"></ion-icon></ion-button>
			</ion-buttons>
			<ion-buttons slot="end" class="top-buttons">
				<ion-button @click="swapDirection">
					<ion-icon :icon="swapHorizontalOutline" />
				</ion-button>
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
	<ion-content class="ion-padding-bottom">
		<!-- Segment select -->
		<section slot="fixed" class="popup-segment">
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
					<StopItems v-for="stop in item.stops" :key="stop.id" :stop="stop" :options="itemOptions" :noEta="noEta"
						:class="{ nearest: nearestStop(stop.stopId) }" @getETA="getCTBETA"></StopItems>
				</ion-list>
			</section>
			<!-- Route Info -->
			<section v-if="popupView == 'info'">
				<RouteInfo :item="item"></RouteInfo>
			</section>
			<!-- Map View -->
			<section v-if="popupView == 'map'" class="max-size">
				<LeafletMap :routeLocations="item.stops" :currentLocation="currentLocation" />
			</section>
		</div>
	</ion-content>
</template>

<script>
import { ref } from 'vue';
import { IonPage, IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/vue';
import { star, starOutline, chevronBack, swapHorizontalOutline } from 'ionicons/icons'
import { Geolocation } from '@capacitor/geolocation';
import { getDistance } from 'geolib';

import { fetchKMBETA, fetchCTBETA, fetchMtrBusEta } from '@/fetch/fetchETA.js';
import { fetchBusStopID, reconstructBusStops } from '@/fetch/fetchStopID.js';
import SkeletonItems from '@/components/SkeletonItems.vue'
import StopItems from '@/components/StopItems.vue';
import RouteInfo from '@/components/RouteInfo.vue';
import LeafletMap from '@/components/leaflet.vue';
import presentToast from '@/components/presentToast.js';

export default {
	name: "ETAPopup",
	components: { IonPage, IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar, LeafletMap, SkeletonItems, StopItems, RouteInfo },
	props: ['item', 'starred', 'noEta'],
	emits: ['closeModal', 'addStar', 'removeStar', 'saveData', 'swapDirection'],
	setup(props) {
		const popupLoading = ref(false);
		const item = ref(props.item);
		const popupView = ref('default');
		const starred = props.starred;
		const noEta = ref(props.noEta);
		const itemOptions = ref({ clickable: false });
		const currentLocation = ref();
		const nearestStop = ref();
		return {
			popupLoading,
			item,
			starred,
			popupView,
			itemOptions,
			currentLocation,
			nearestStop,
			noEta,
			chevronBack,
			starOutline,
			star,
			swapHorizontalOutline
		}
	},
	async mounted() {
		// Show Toast if no eta is avaliable
		if (this.noEta) {
			presentToast('info', '此路線未提供到站報時服務')
		}
		// Show loading for minibus
		if (this.item.type === 'minibus') {

		}
		// Fetch KMB ETAs
		if (this.item.type === 'bus' && this.item.company.length == 1 && (this.item.company.includes('KMB') || this.item.company.includes('LMB'))) {
			this.getKMB();
			this.interval = setInterval(() => this.getKMB(), 10000);
		}
		// Fetch CTB and NWFB bus stop ids
		if (this.item.type === 'bus' && (this.item.company.includes('CTB') || this.item.company.includes('NWFB'))) {
			await this.getStopID();
		}
		// Fetch MTR Buses ETAs
		if (this.item.type === 'bus' && this.item.company.includes('LRTFeeder')){
			this.getMtrBus();
			this.interval = setInterval(() => this.getMtrBus(), 10000);
		}
		// Get Coordinates
		try {
			this.currentLocation = await Geolocation.getCurrentPosition();
			const stopDistance = this.item.stops.map(stop => { //Create an array hold all stops id and distance between current coord
				const currentLat = this.currentLocation.coords.latitude;
				const currentLong = this.currentLocation.coords.longitude;
				const stopLat = stop.coord[1];
				const stopLong = stop.coord[0];
				return {
					id: stop.stopId,
					distance: getDistance({ latitude: currentLat, longitude: currentLong }, { latitude: stopLat, longitude: stopLong })
				}
			})
			this.nearestStop = stopDistance.reduce((acc, cur) => { // Reduce the distance array for nearest id and distance
				if (cur.distance < acc.distance) {
					return cur
				} else {
					return acc
				}
			});
			// console.log(this.nearestStop);
		} catch (err) {
			console.error(err);
		}
	},
	computed: {
		checkbusStar() { //Return true if route is in starred array.
			if (this.starred) {
				let starredClone = [...this.starred];
				if (starredClone.length == 0) {
					return false
				} else {
					let indexResult = starredClone.findIndex(x => x.routeId == this.item.routeId && x.direction == this.item.direction);
					if (indexResult == -1) {
						return false;
					} else {
						return true;
					}
				}
			}
		}
	},
	methods: {
		closeModal() {
			this.$emit('closeModal');
		},
		addStar() {
			this.$emit('addStar');
		},
		removeStar() {
			this.$emit('removeStar');
		},
		swapDirection() {
			this.$emit('swapDirection')
		},
		async getStopID() { //Fetch Stop ids of CTB and NWFB bus from api
			if (!('stopId' in this.item.stops[0])) {
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
				}
			}
			presentToast('done', '按一下巴士站名稱以取得到站時間');
			this.itemOptions.clickable = true;
		},
		async getKMB() { //Get KMB route etas from api
			const etaData = await fetchKMBETA(this.item);
			if (etaData.status == 'success') {
				etaData.data.forEach(element => {
					const index = this.item.stops.findIndex(x => x.seq == element.seq);
					if (index != -1) {
						this.item.stops[index].etaMessage = element.note;
						this.item.stops[index].etas = [...element.etas];
					}
				})
			}
		},
		async getCTBETA(seq) {
			const clickedIndex = this.item.stops.findIndex(x => x.seq == seq);
			this.item.stops[clickedIndex].etaMessage = 'loading';
			const etaData = await fetchCTBETA(this.item, this.item.stops[clickedIndex].stopId);
			if (etaData.status == 'success') {
				if (etaData.data.length > 0) {
					this.item.stops[clickedIndex].etas = [...etaData.data]
					this.item.stops[clickedIndex].etaMessage = '';
				} else {
					this.item.stops[clickedIndex].etaMessage = 'N/A'
				}
			}
			// console.log(this.item.stops[clickedIndex]);
		},
		async getMtrBus() {
			const etaData = await fetchMtrBusEta(this.item);
			console.log(etaData);
			if(etaData.status == 'success' && etaData.data.length > 0){
				etaData.data.forEach(etaItem => {
					const index = this.item.stops.findIndex(x => x.stopId == etaItem.stationId);
					if (index != -1) {
						this.item.stops[index].etaMessage = etaItem.note;
						this.item.stops[index].etas = [...etaItem.etas];
					}
				})
			}
		},
		nearestStop(stopId) {
			if (this.nearestStop && this.nearestStop.id === stopId && this.nearestStop.distance <= 1000) {
				return true
			} else {
				return false
			}
		}
	},
	beforeUnmount() {
		clearInterval(this.interval);
	}
};
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
