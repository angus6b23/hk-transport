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
			<ion-item button @click='presentLangAction'>
				<ion-label>
					<h5>語言 / Language</h5>
					<p v-if="config.lang == 'zh'">正體中文</p>
					<p v-else-if="config.lang == 'en'">English</p>
				</ion-label>
			</ion-item>
			<ion-item button>
				<ion-label>
					<h5>資料來源</h5>
					<p v-if="config.fetchMethod == 'default'">預設</p>
					<p v-else-if="config.fetchMethod == 'hkgov'">來自 gov.hk</p>
					<p v-else-if="config.fetchMethod == 'self'">自行搭建來源: {{ config.apiBaseUrl }}</p>
				</ion-label>
			</ion-item>
		</ion-list>
		<ion-list-header>
			<ion-label>資料管理</ion-label>
		</ion-list-header>
		<ion-list>
			<ion-item button @click="clearStarred">
				<ion-label>
					<h5>清除所有已標記的路線</h5>
				</ion-label>
			</ion-item>
			<ion-item button @click="confirmClearData">
				<ion-label>
					<h5>重設所有設定</h5>
				</ion-label>
			</ion-item>
		</ion-list>
	</ion-content>
</template>

<script>
import { ref } from 'vue';
import { Dialog } from '@capacitor/dialog'
import { IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar, actionSheetController} from '@ionic/vue';
import { star, starOutline, chevronBack, swapHorizontalOutline } from 'ionicons/icons'
import presentToast from '@/components/presentToast.js';
import localforage from 'localforage';

export default {
	name: "Option",
	components: { IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem,  IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar },
	emits: ['closeOption'],
	setup() {
		const config = ref({})
		return {
			chevronBack,
			config
		}
	},
	async mounted() {
		this.config = await localforage.getItem('config');
	},
	methods: {
		closeOption() {
			this.$emit('closeOption');
		},
		async clearStarred() {
			const {value} = await Dialog.confirm({
				title: '清除所有已標記的路線',
				message: '你確定要清除所有已標記的路線嗎？'
			});
			if (value){
				await localforage.setItem('starred', []);
				presentToast('info', '已清除所有已標記的路線')
			}
		},
		async confirmClearData() {
			const { value } = await Dialog.confirm({
				title: '重設所有資料',
				message: '所有路線資料需再次下載，已標記的路線亦會被清除。\n你確定要重設所有資料嗎？'
			});
			if (value){
				let keys = await localforage.keys();
				for (let key of keys){
					await localforage.removeItem(key)
				}
				presentToast('info', '已重設所有設定，將會在3秒後重新載入');
				setTimeout(()=>{ location.reload() }, 3000)
			}
		},
		async presentLangAction(){
			const langActions = [{
				text: '正體中文',
				data: { action: 'lang-zh' }
			},
			{
				text: 'English',
				data: { action: 'lang-en' }
			}];
			const langSheet = await actionSheetController.create({
				header: 'Select Language / 請選擇語言',
				buttons: langActions
			});
			await langSheet.present();
			const res = await langSheet.onDidDismiss();
			console.log(res.data.action);
		}
	}
};
</script>
<style></style>
