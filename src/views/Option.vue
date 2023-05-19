<template>
	<ion-header>
		<ion-toolbar>
			<ion-title>設定</ion-title>
			<ion-buttons slot="start">
				<ion-button @click="closeOption">
					<ion-icon :icon="chevronBack" />
				</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
	<ion-content>
		<ion-list-header>
			<ion-label>基本</ion-label>
		</ion-list-header>
		<ion-list>
			<ion-item button>
				<ion-label>
					<h5>資料來源</h5>
					<p>預設</p>
				</ion-label>
			</ion-item>
		</ion-list>
		<ion-list-header>
			<ion-label>資料管理</ion-label>
		</ion-list-header>
		<ion-list>
			<ion-item button>
				<ion-label>
					<h5>清除所有已標記的路線</h5>
				</ion-label>
			</ion-item>
			<ion-item button @click="confirmClearData">
				<ion-label>
					<h5>清除所有資料</h5>
				</ion-label>
			</ion-item>
		</ion-list>
	</ion-content>
</template>

<script>
import { ref } from 'vue';
import { Dialog } from '@capacitor/dialog'
import { IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/vue';
import { star, starOutline, chevronBack, swapHorizontalOutline } from 'ionicons/icons'
import presentToast from '@/components/presentToast.js';
import localforage from 'localforage';

export default {
	name: "Option",
	components: { IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem,  IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar },
	emits: ['closeOption'],
	setup() {
		return {
			chevronBack
		}
	},
	async mounted() {
	},
	methods: {
		closeOption() {
			this.$emit('closeOption');
		},
		async confirmClearData() {
			const { value } = await Dialog.confirm({
				title: '清除所有資料',
				message: '所有路線資料需再次下載，已標記的路線會被清除。\n你確定要清除所有資料嗎？'
			});
			if (value){
				let keys = await localforage.keys();
				for (let key of keys){
					await localforage.removeItem(key)
				}
				presentToast('info', '資料已被清除，將會在3秒後重新載入');
				setTimeout(()=>{ location.reload() }, 3000)
			}
		}
	}
};
</script>
<style></style>
