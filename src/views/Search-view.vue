<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>
					{{ typeTC }}路線
				</ion-title>
				<ion-buttons slot="end">
					<ion-button @click="openOption">
						<ion-icon :icon="cog"></ion-icon>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
			<ion-toolbar>
				<ion-searchbar autocorrect="off" v-model="query" placeholder="請輸入路線號碼或目的地"></ion-searchbar>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-modal ref="modal" :is-open="optionIsOpen" @WillDismiss="closeOption">
				<Option @closeOption="closeOption" />
			</ion-modal>

			<ion-list v-if="dataReady">
				<!-- Change List Header according to bus search -->
				<ion-list-header v-if="query.length > 0">
					<ion-label>搜尋{{ typeTC }}: {{ query }}</ion-label>
					<ion-button fill="clear" @click="clearQuery">清除搜尋</ion-button>
				</ion-list-header>
				<ion-list-header v-else>
					<ion-label v-if="starred.length > 0">已標記的{{ typeTC }}</ion-label>
				</ion-list-header>
				<!-- Bus route display list here -->
				<div v-if="displayArray.length > 0">
					<div v-for="(route, index) in displayArray" :key="route.id">
						<ion-item button>
							<ion-grid>
								<ion-row class="open-modal" expand="block" @click="openModal(index)">
									<ion-col v-if="type != 'ferry'" size-xs="3" size-md="1"
										class="route-no ion-align-items-center">
										<h3 v-if="route.routeNo.length < 10">{{ route.routeNo }}</h3>
										<h3 v-else> </h3>
									</ion-col>
									<ion-col size-xs="9" size-md="11">
										<!-- Badges for bus -->
										<div v-if="route.type === 'bus'">
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
										</div>
										<div v-if="route.type === 'minibus'">
											<ion-badge v-if="route.district.includes('HKI')"
												class="hki-badge ion-margin-start">港島</ion-badge>
											<ion-badge v-if="route.district.includes('KLN')"
												class="kln-badge ion-margin-start">九龍</ion-badge>
											<ion-badge v-if="route.district.includes('NT')"
												class="nt-badge ion-margin-start">新界</ion-badge>
											<ion-badge v-if="route.serviceMode.includes('N')"
												class="night-badge ion-margin-start">晚間</ion-badge>
											<ion-badge v-if="route.serviceMode == 'T'"
												class="special-badge ion-margin-start">特別</ion-badge>
										</div>
										<div v-if="route.type === 'ferry'">
											<ion-badge v-if="route.district == 'KAITO'"
												class="hki-badge ion-margin-start">街渡</ion-badge>
											<ion-badge v-if="route.district == 'OUTLYING'"
												class="kln-badge ion-margin-start">離島</ion-badge>
											<ion-badge v-if="route.district == 'INNER'"
												class="nt-badge ion-margin-start">內陸</ion-badge>
											<ion-badge v-if="route.direction == 1"
												class="direction1-badge ion-margin-start">順行</ion-badge>
											<ion-badge v-if="route.direction == 2"
												class="direction2-badge ion-margin-start">逆行</ion-badge>
										</div>
										<h3 v-if="type == 'ferry'" class="ion-no-margin ion-margin-start">{{
											route.routeNameTC }}</h3>
										<h3 v-else class="ion-no-margin ion-margin-start">{{ route.destTC }}</h3>
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
					<ion-button v-if="type == 'ferry'" fill="clear" @click="listAll">顯示所有渡輪</ion-button>
				</div>
			</ion-list>
		</ion-content>
		<!-- Modal for displaying bus details -->
		<ion-modal :is-open="modalIsOpen" ref="modal" @WillDismiss="closeModal">
			<ETAPopup :item="itemSelected" :starred="starred" :noEta="checkNoEta" :altRoutes="altRoutes"
				@closeModal="closeModal" @addStar="addStar" @removeStar="removeStar" @saveData="saveData"
				@swapDirection="swapDirection" />
		</ion-modal>
	</ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonText, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonGrid, IonRow, IonCol, IonBadge, IonButton, IonIcon, IonTitle, IonButtons } from '@ionic/vue';
import { cog, chevronBack } from 'ionicons/icons'
import { loadChunk } from '@/components/loadData.js';
import ETAPopup from '@/components/ETAPopup.vue';
import Option from '@/views/Option.vue'
import sleep from '@/components/sleep.js'
import localforage from 'localforage';
import presentToast from '@/components/presentToast.js'

export default defineComponent({
	name: 'SearchView',
	components: { IonHeader, IonToolbar, IonContent, IonText, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonGrid, IonRow, IonCol, IonBadge, IonButton, IonIcon, IonTitle, IonButtons, ETAPopup, Option },
	props: ['dataType'],
	setup(props) {
		// Create ref for loading and show map for ui control
		const query = ref(''); // Reference for two way bind of search bar value
		const displayArray = ref([]);// Reference for displaying search results
		const itemSelected = ref({}); // Reference for selected bus on query
		const altRoutes = ref([]);
		const modalIsOpen = ref(false);
		const optionIsOpen = ref(false);
		const data = ref([]); // For storage of bus routes and stops
		const starred = ref([]);
		const type = ref(props.dataType);
		const typeTC = ref('');
		const dataReady = ref(false)
		// Event listeners
		addEventListener('ionModalDidDismiss', function () {
			modalIsOpen.value = false;
		})
		return {
			data,
			query,
			displayArray,
			itemSelected,
			altRoutes,
			modalIsOpen,
			optionIsOpen,
			starred,
			type,
			dataReady,
			typeTC,
			cog,
			chevronBack
		}
	},
	methods: {
		openModal(index) {
			this.itemSelected = JSON.parse(JSON.stringify(this.displayArray[index])); //Use Deep copy to prevent problems when clicked again
			console.log(this.itemSelected)
			this.getAltRoutes();
			this.modalIsOpen = true;
		},
		closeModal() {
			this.modalIsOpen = false;
		},
		openOption() {
			this.optionIsOpen = true;
		},
		closeOption() {
			this.optionIsOpen = false;
		},
		async addStar() {
			this.starred.push(this.itemSelected);
			const starredOriginal = await localforage.getItem('starred');
			const starredClone = {
				...starredOriginal,
				[this.type]: JSON.parse(JSON.stringify(this.starred))
			};
			await localforage.setItem('starred', starredClone);
		},
		async removeStar() {
			const removeIndex = this.starred.findIndex(route => route.routeId != this.itemSelected.routeId && route.direction != this.itemSelected.direction)
			this.starred.splice(removeIndex, 1);
			const starredOriginal = await localforage.getItem('starred');
			const starredClone = {
				...starredOriginal,
				[this.type]: JSON.parse(JSON.stringify(this.starred))
			};
			await localforage.setItem('starred', starredClone);
		},
		async saveData(data) {
			if (this.type == 'bus') {
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
				if (this.type == 'ferry') {
					this.displayArray = this.data.filter(x => x.routeNameTC.includes(newQuery) || x.routeNameEN.includes(newQuery));
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
		getTypeTranslate(type) {
			switch (type) {
				case 'bus':
					return '巴士'
				case 'minibus':
					return '專線小巴'
				case 'ferry':
					return '渡輪'
				default:
					return '未知'
			}
		},
		listAll() {
			this.query = ' '
		},
		clearQuery() {
			this.query = ''
		},
		async swapDirection(route = undefined) {
			if (route) {
				this.modalIsOpen = false;
				await sleep(100);
				this.itemSelected = JSON.parse(JSON.stringify(route));
				this.getAltRoutes();
				this.modalIsOpen = true;
				console.log(this.itemSelected);
			} else {
					presentToast('error', '此路線未有對頭車')
			}
		},
		getAltRoutes() {
			if (this.itemSelected.type == 'bus' && this.itemSelected.company.includes('KMB')) { //Filter for KMB: Same company, same routeNo (different direction / servicemode / specialtype)
				this.altRoutes = this.data.filter(altRoute => altRoute.routeNo == this.itemSelected.routeNo && altRoute.company.join('') == this.itemSelected.company.join('') && (altRoute.direction != this.itemSelected.direction || altRoute.serviceMode != this.itemSelected.serviceMode || altRoute.specialType != this.itemSelected.specialType));
			} else if (this.itemSelected.type == 'bus' && this.itemSelected.company.includes('NLB')) { // Filter for NLB: Same routeNo with different routeId
				this.altRoutes = this.data.filter(altRoute => altRoute.company.includes('NLB') && altRoute.routeNo == this.itemSelected.routeNo && altRoute.routeId != this.itemSelected.routeId)
			} else if (this.itemSelected.type == 'bus'){
				this.altRoutes = this.data.filter(altRoute => altRoute.company.join('') == this.itemSelected.company.join('') && altRoute.routeNo == this.itemSelected.routeNo && (altRoute.routeId != this.itemSelected.routeId || altRoute.direction != this.itemSelected.direction));
			}
			else if (this.itemSelected.type == 'minibus'){ // Filter for minibus: Same district, same routeNo, different routeId / direction
				this.altRoutes = this.data.filter(altRoute => altRoute.routeNo == this.itemSelected.routeNo && altRoute.district == this.itemSelected.district && (altRoute.routeId != this.itemSelected.routeId || altRoute.direction != this.itemSelected.direction))
			} else {
				this.altRoutes = this.data.filter(altRoute => altRoute.routeId == this.itemSelected.routeId && altRoute.direction != this.itemSelected.direction);
			}
			console.log(this.altRoutes);
		}
	},
	async mounted() {
		this.data = await loadChunk(this.type)
		this.typeTC = this.getTypeTranslate(this.type);
		let starStorage = await localforage.getItem('starred');
		if (!starStorage || !starStorage[this.type]) {
			this.starred = []
		} else {
			this.starred = starStorage[this.type];
		}
		this.displayArray = this.starred
		this.dataReady = true;
	}
	,
	watch: {
		query(newQuery) { //Update bus array upon change of bus query
			this.updateQuery(newQuery);
		}
	},
	computed: {
		checkNoEta() {
			if (this.type == 'ferry' || this.type == 'tram') {
				return true
			} else {
				return false
			}
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

.small-padding {
	padding-top: 10px;
	padding-bottom: 10px;
}

/* Bus Badges color */
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

/* Minibus Badges */
.hki-badge {
	--background: #e66dca;
}

.kln-badge {
	--background: #6dcae6;
}

.nt-badge {
	--background: #cae66d;
}

/* Common Badges */
.night-badge {
	--background: #36454f;
}

.special-badge {
	--background: #663399;
}

.direction1-badge {
	--background: #5E6FA1;
}

.direction2-badge {
	--background: #A1905E;
}

.route-no {
	display: flex;
}
</style>
