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
					<ion-label>搜尋巴士: {{ busQuery }}</ion-label>
				</ion-list-header>
				<ion-list-header v-else>
					<ion-label>已標記的巴士</ion-label>
				</ion-list-header>
				<!-- Bus route display list here -->
				<div v-if="busDisplayArray.length > 0">
					<div v-for="(route, index) in busDisplayArray" :key="route.id">
						<ion-item button>
							<ion-grid>
								<ion-row class="open-modal" expand="block" @click="openBusModal(index)">
									<ion-col size-xs="3" size-md="1" class="route-no ion-align-items-center">
										<h3 v-if="route.routeNo.length < 10">{{ route.routeNo }}</h3>
										<h3 v-else>-</h3>
									</ion-col>
									<ion-col size-xs="9" size-md="11">
										<ion-badge v-if="route.company.includes('KMB')"
											class="kmb-badge ion-margin-start">九巴</ion-badge>
										<ion-badge v-if="route.company.includes('CTB')"
											class="ctb-badge ion-margin-start">城巴</ion-badge>
										<ion-badge v-if="route.company.includes('LWB')"
											class="lwb-badge ion-margin-start">龍運</ion-badge>
										<ion-badge v-if="route.company.includes('NWFB')"
											class="nwfb-badge ion-margin-start">新巴</ion-badge>
										<ion-badge v-if="route.company.includes('DB')"
											class="db-badge ion-margin-start">愉景</ion-badge>
										<ion-badge v-if="route.company.includes('NLB')"
											class="nlb-badge ion-margin-start">大嶼</ion-badge>
										<ion-badge v-if="route.company.includes('PI')"
											class="pi-badge ion-margin-start">馬灣</ion-badge>
										<ion-badge v-if="route.company.includes('XB')"
											class="xb-badge ion-margin-start">過境</ion-badge>
										<ion-badge v-if="route.company.includes('LRTFeeder')"
											class="ltr-badge ion-margin-start">港鐵</ion-badge>
										<ion-badge v-if="route.serviceMode.includes('N')"
											class="night-badge ion-margin-start">晚間</ion-badge>
										<ion-badge v-if="route.serviceMode == 'T'"
											class="special-badge ion-margin-start">特別</ion-badge>
										<h3 class="ion-no-margin ion-margin-start">{{ route.destTC }}</h3>
									</ion-col>
								</ion-row>
							</ion-grid>
						</ion-item>
					</div>
				</div>
				<div v-else class="no-content">
					<ion-text color="medium">
						<p>尚未有顯示的項目</p>
					</ion-text>
					<ion-text color="medium">
						<p>可於搜尋後標記星號以方便使用</p>
					</ion-text>
				</div>
			</ion-list>
		</ion-content>
		<!-- Modal for displaying bus details -->
		<ion-modal :is-open="busModalIsOpen" ref="modal" @WillDismiss="closeModal">
			<ETAPopup :item="busSelected" :busStarred="busStarred" @closeModal="closeModal" @addStar="addStar"
				@removeStar="removeStar" @saveData="saveBusData" />
		</ion-modal>
	</ion-page>
</template>

<script>
import { defineComponent, ref} from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonGrid, IonRow, IonCol, IonBadge } from '@ionic/vue';
import { loadData, setData } from '@/components/loadData.js'
import ETAPopup from '@/components/ETAPopup.vue'

export default defineComponent({
	name: 'Bus',
	components: { IonHeader, IonToolbar, IonContent, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonGrid, IonRow, IonCol, IonBadge, ETAPopup },
	setup() {
		// Create ref for loading and show map for ui control
		const busQuery = ref(''); // Reference for two way bind of search bar value
		const busDisplayArray = ref([]);// Reference for displaying search results
		const busSelected = ref({}); // Reference for selected bus on query
		const busModalIsOpen = ref(false);
		const bus = ref([]); // For storage of bus routes and stops
		const busStarred = ref([]);
		// Event listeners
		addEventListener('ionModalDidDismiss', function () {
			busModalIsOpen.value = false;
		})
		return {
			bus,
			busQuery,
			busDisplayArray,
			busSelected,
			busModalIsOpen,
			busStarred
		}
	},
	methods: {
		openBusModal(index) {
			this.busSelected = JSON.parse(JSON.stringify(this.busDisplayArray[index])); //Use Deep copy to prevent problems when clicked again
			console.log(this.busSelected)
			this.busModalIsOpen = true;
		},
		closeModal() {
			this.busModalIsOpen = false;
		},
		async addStar() {
			this.busStarred.push(this.busSelected);
			const busStarredClone = JSON.parse(JSON.stringify(this.busStarred));
			await setData('busStarred', busStarredClone);
		},
		async removeStar() {
			const removeIndex = this.busStarred.findIndex(this.currentSelectedBus)
			this.busStarred.splice(removeIndex, 1);
			const busStarredClone = JSON.parse(JSON.stringify(this.busStarred));
			await setData('busStarred', busStarredClone);
		},
		async saveBusData(data) {
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
		currentSelectedBus(x) { // For finding index of currently selected bus
			return x.routeId == this.busSelected.routeId && x.routeDirection == this.busSelected.routeDirection
		},
		updateQuery(newQuery) {
			if (newQuery === '') {
				this.busDisplayArray = this.busStarred; //Show starred bus if query is empty
			} else {
				// Limit small number query
				this.busDisplayArray = (newQuery) < 10 ? this.bus.filter(x => x.routeNo.length <= 2 && x.routeNo.indexOf(newQuery.toUpperCase()) == 0 || x.destTC.includes(newQuery)) :
					this.bus.filter(x => x.routeNo.indexOf(newQuery.toUpperCase()) == 0 || x.destTC.includes(newQuery)); // Filter by route numbers and destinations.
				this.busDisplayArray.sort(function (a, b) {
					a = Number(a.routeNo.replace(/[A-Z]/g, 0));
					b = Number(b.routeNo.replace(/[A-Z]/g, 0));
					return a - b;
				});
				this.busDisplayArray.splice(50);// Only show first 50 results
			}
		}
	},
	async mounted() {
		this.bus = await loadData('busData', false, true);
		this.busStarred = await loadData('busStarred', false, false);
		if (!this.busStarred) {
			this.busStarred = [];
		} else {
			this.busDisplayArray = this.busStarred;
		}
	},
	watch: {
		busQuery(newQuery) { //Update bus array upon change of bus query
			this.updateQuery(newQuery);
		}
	}
});
</script>
<style scoped>
.no-content {
	display: flex;
	flex-direction: column;
	height: 70vh;
	align-items: center;
	justify-content: center;
}

.kmb-badge {
	--background: #e51f28;
}

.lwb-badge {
	--background: #f05323;
}

.ctb-badge {
	--background: #0563ad;
}

.nwfb-badge {
	--background: #6e449d;
}

.nlb-badge {
	--background: #00897b;
}

.pi-badge {
	--background: #febc22;
}

.db-badge {
	--background: #e7222b;
}

.xb-badge {
	--background: #ff67de;
}

.night-badge {
	--background: #36454f;
}

.special-badge {
	--background: #663399;
}

.route-no {
	display: flex;
}
</style>
