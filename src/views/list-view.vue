<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>所有{{ typeTC }}路線</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-list v-if="dataReady">
				<!-- Change List Header according to bus search -->
				<ion-list-header>
					<ion-label>請選擇路線以查看詳情</ion-label>
				</ion-list-header>
				<!-- Bus route display list here -->
				<div v-for="(route, index) in data" :key="route.id">
					<ion-item v-if="route.direction == 1" button>
						<ion-grid>
							<ion-row class="open-modal" expand="block" @click="openModal(index)">
								<ion-col v-if="route.type == 'mtr' || route.type == 'lightRail'" size-xs="3" size-md="1"
									class="route-no ion-align-items-center">
									<div v-if="route.type == 'mtr'" class="line-color-indicator"
										:style="{ 'background-color': '#' + route.color}"></div>
									<h3>{{ route.routeNo }}</h3>
								</ion-col>
								<ion-col size-xs="9" size-md="11">
									<!-- Badges for tram -->
									<h3 class="ion-no-margin ion-margin-start ion-padding-vertical">{{ route.routeNameTC
									}}</h3>
								</ion-col>
							</ion-row>
						</ion-grid>
					</ion-item>
				</div>
			</ion-list>
		</ion-content>
		<!-- Modal for displaying bus details -->
		<ion-modal :is-open="modalIsOpen" ref="modal" @WillDismiss="closeModal">
			<ETAPopup :item="itemSelected" :noEta="checkNoEta" @closeModal="closeModal" @swapDirection="swapDirection" />
		</ion-modal>
	</ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonText, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonGrid, IonRow, IonCol, IonBadge, IonTitle } from '@ionic/vue';
import { loadChunk } from '@/components/loadData.js'
import ETAPopup from '@/components/ETAPopup.vue';
import sleep from '@/components/sleep.js'

export default defineComponent({
	name: 'ListView',
	components: { IonHeader, IonToolbar, IonContent, IonText, IonPage, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonGrid, IonRow, IonCol, IonBadge, IonTitle, ETAPopup },
	props: ['dataType'],
	setup(props) {
		// Create ref for loading and show map for ui control
		const itemSelected = ref({}); // Reference for selected bus on query
		const modalIsOpen = ref(false);
		const data = ref([]); // For storage of routes and stops
		const type = ref(props.dataType);
		const dataReady = ref(false)
		const typeTC = ref(''); //For saving TC translation for type of transport
		// Event listeners
		addEventListener('ionModalDidDismiss', function () {
			modalIsOpen.value = false;
		})
		return {
			data,
			itemSelected,
			modalIsOpen,
			type,
			dataReady,
			typeTC
		}
	},
	methods: {
		openModal(index) {
			this.itemSelected = JSON.parse(JSON.stringify(this.data[index])); //Use Deep copy to prevent problems when clicked again
			console.log(this.itemSelected);
			this.modalIsOpen = true;
		},
		closeModal() {
			this.modalIsOpen = false;
		},
		currentSelectedItem(x) { // For finding index of currently selected bus
			return x.routeId == this.itemSelected.routeId && x.routeDirection == this.itemSelected.routeDirection
		},
		getTypeTranslate(type) {
			switch (type) {
				case 'tram':
					return '電車'
				case 'lightRail':
					return '輕鐵'
				case 'mtr':
					return '港鐵'
				default:
					return '未知'
			}
		},
		async swapDirection(){
			let swapFilter = this.data.filter(route => route.routeId == this.itemSelected.routeId && route.direction != this.itemSelected.direction);			
			if (swapFilter.length == 0){
				presentToast('error', '此路線未有對頭車')
			} else {
				this.modalIsOpen = false;
				await sleep(100);
				this.itemSelected = JSON.parse(JSON.stringify(swapFilter[0]));
				this.modalIsOpen = true;
			}
		}
	},
	async mounted() {
		this.data = await loadChunk(this.type)
		this.typeTC = this.getTypeTranslate(this.type);
		this.dataReady = true;
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
.direction1-badge {
	--background: #5E6FA1;
}

.direction2-badge {
	--background: #A1905E;
}

.line-color-indicator {
	height: 15px;
	width: 80%;
	border-radius: 10px;
}

.route-no {
	display: flex;
}</style>
