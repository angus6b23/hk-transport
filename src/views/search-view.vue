<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-searchbar autocorrect="off" v-model="query" placeholder="請輸入路線或目的地"></ion-searchbar>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-list>
				<!-- Change List Header according to bus search -->
				<ion-list-header v-if="query.length > 0">
					<ion-label>搜尋巴士: {{ query }}</ion-label>
				</ion-list-header>
				<ion-list-header v-else>
					<ion-label>已標記的巴士</ion-label>
				</ion-list-header>
				<!-- Bus route display list here -->
				<div v-if="displayArray.length > 0">
					<div v-for="(route, index) in displayArray" :key="route.id">
						<ion-item button>
							<ion-grid>
								<ion-row class="open-modal" expand="block" @click="openModal(index)">
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
		<ion-modal :is-open="modalIsOpen" ref="modal" @WillDismiss="closeModal">
			<ETAPopup :item="itemSelected" :starred="starred" @closeModal="closeModal" @addStar="addStar"
				@removeStar="removeStar" @saveData="saveData" />
		</ion-modal>
	</ion-page>
</template>

<script>
import { defineComponent, ref} from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonText, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonGrid, IonRow, IonCol, IonBadge } from '@ionic/vue';
import { loadData, setData } from '@/components/loadData.js'
import ETAPopup from '@/components/ETAPopup.vue'

export default defineComponent({
	name: 'Bus',
	components: { IonHeader, IonToolbar, IonContent, IonText, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonGrid, IonRow, IonCol, IonBadge, ETAPopup },
	props: ['type'],
	setup() {
		// Create ref for loading and show map for ui control
		const query = ref(''); // Reference for two way bind of search bar value
		const displayArray = ref([]);// Reference for displaying search results
		const itemSelected = ref({}); // Reference for selected bus on query
		const modalIsOpen = ref(false);
		const data = ref([]); // For storage of bus routes and stops
		const starred = ref([]);
		const type = ref('bus');
		// Event listeners
		addEventListener('ionModalDidDismiss', function () {
			modalIsOpen.value = false;
		})
		return {
			data,
			query,
			displayArray,
			itemSelected,
			modalIsOpen,
			starred,
			type
		}
	},
	methods: {
		openModal(index) {
			this.itemSelected = JSON.parse(JSON.stringify(this.displayArray[index])); //Use Deep copy to prevent problems when clicked again
			console.log(this.itemSelected)
			this.modalIsOpen = true;
		},
		closeModal() {
			this.modalIsOpen = false;
		},
		async addStar() {
			this.starred.push(this.itemSelected);
			const starredClone = JSON.parse(JSON.stringify(this.starred));
			await setData('starred', starredClone);
		},
		async removeStar() {
			const removeIndex = this.starred.findIndex(this.currentSelectedItem)
			this.starred.splice(removeIndex, 1);
			const starredClone = JSON.parse(JSON.stringify(this.starred));
			await setData('starred', starredClone);
		},
		async saveData(data) {
			if (this.type == 'bus'){
				// Link to currently displayed bus
				const displayIndex = this.displayArray.findIndex(this.currentSelectedItem)
				this.displayArray[displayIndex] = data;
				// Link to global bus array
				const index = this.data.findIndex(this.currentSelectedItem);
				this.data[index] = JSON.parse(JSON.stringify(data));
				// console.log(index);
	
				// Save to localforage
				const key = 'busData-chunk' + Math.floor(index / 100);
				const chunkIndex = index % 100;
				let chunk = await loadData(key, false, false);
				chunk[chunkIndex] = JSON.parse(JSON.stringify(data));
				await setData(key, chunk);
			}
		},
		currentSelectedItem(x) { // For finding index of currently selected bus
			return x.routeId == this.itemSelected.routeId && x.routeDirection == this.itemSelected.routeDirection
		},
		updateQuery(newQuery) {
			if (newQuery === '') {
				this.displayArray = this.starred; //Show starred bus if query is empty
			} else {
				// Limit small number query
				this.displayArray = (newQuery) < 10 ? this.data.filter(x => x.routeNo.length <= 2 && x.routeNo.indexOf(newQuery.toUpperCase()) == 0 || x.destTC.includes(newQuery)) :
					this.data.filter(x => x.routeNo.indexOf(newQuery.toUpperCase()) == 0 || x.destTC.includes(newQuery)); // Filter by route numbers and destinations.
				this.displayArray.sort(function (a, b) {
					a = Number(a.routeNo.replace(/[A-Z]/g, 0));
					b = Number(b.routeNo.replace(/[A-Z]/g, 0));
					return a - b;
				});
				this.displayArray.splice(50);// Only show first 50 results
			}
		}
	},
	async mounted() {
		this.data = await loadData(`${this.type}Data`, false, true);
		this.starred = await loadData('starred', false, false);
		if (!this.starred) {
			this.starred = [];
		} else {
			this.starred = this.starred.map(route => {
				if (route.type === this.type){
					return route
				}
			})
			this.displayArray = this.starred;
		}
	},
	watch: {
		query(newQuery) { //Update bus array upon change of bus query
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
