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
	<ion-content class="ion-padding-bottom">
		<ion-list-header>
			<ion-label>基本</ion-label>
		</ion-list-header>
		<ion-list>
			<ion-item button @click='presentLangAction'>
				<ion-icon :icon="languageOutline" slot="start" />
					<ion-label>
						<h5>語言 / Language</h5>
						<p v-if="config.lang == 'zh'">正體中文</p>
						<p v-else-if="config.lang == 'en'">English</p>
					</ion-label>
			</ion-item>
			<ion-item button @click='presentThemeAction'>
				<ion-icon :icon="colorPaletteOutline" slot="start" />
					<ion-label>
						<h5>主題</h5>
						<p v-if="config.theme == 'light'">亮色</p>
						<p v-else-if="config.theme == 'dark'">暗色</p>
						<p v-else-if="config.theme == 'system'">系統預設</p>
					</ion-label>
			</ion-item>
			<ion-item button @click='presentSourceAction'>
				<ion-icon :icon="serverOutline" slot="start" />
					<ion-label>
						<h5>資料來源</h5>
						<p v-if="config.fetchMethod == 'default'">預設</p>
						<p v-else-if="config.fetchMethod == 'hkgov'">來自 gov.hk</p>
						<p v-else-if="config.fetchMethod == 'self'">自行搭建來源</p>
					</ion-label>
			</ion-item>
			<ion-item v-if="config.fetchMethod == 'self'">
				<ion-label position="stacked">資料來源URL</ion-label>
				<ion-input placeholder="https://your.api" v-model='apiBaseUrl'></ion-input>
			</ion-item>
			<ion-item>
				<ion-icon :icon="returnDownForwardOutline" slot="start" />
					<ion-label>
						<h5>自動滾動至最近的車站</h5>
					</ion-label>
					<ion-checkbox slot="end" v-model="autoScroll"></ion-checkbox>
			</ion-item>
		</ion-list>
		<ion-list-header>
			<ion-label>管理資料</ion-label>
		</ion-list-header>
		<ion-list class="ion-padding-bottom ion-margin-bottom">
			<ion-item button @click="updateData">
				<ion-icon :icon="cloudDownloadOutline" slot="start" />
					<ion-label>
						<h5>更新路線資料</h5>
					</ion-label>
			</ion-item>
			<ion-item button @click="downloadData">
				<ion-icon :icon="reloadOutline" slot="start" />
					<ion-label>
						<h5>重新下載路線資料</h5>
					</ion-label>
			</ion-item>
			<ion-item button @click="clearStarred">
				<ion-icon :icon="starHalfOutline" slot="start" />
					<ion-label>
						<h5>清除所有已標記的路線</h5>
					</ion-label>
			</ion-item>
			<ion-item button @click="confirmClearData">
				<ion-icon :icon="trashOutline" slot="start" />
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
import { IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonButton, IonButtons, IonToolbar, IonInput, IonCheckbox, actionSheetController, loadingController } from '@ionic/vue';
import { chevronBack, languageOutline, serverOutline, cloudDownloadOutline, reloadOutline, starHalfOutline, trashOutline, colorPaletteOutline, returnDownForwardOutline} from 'ionicons/icons'
import fetchApiData from '@/fetch/fetchAPIData'
import presentToast from '@/components/presentToast.js';
import localforage from 'localforage';

export default {
	name: "Option-popup",
	components: { IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem,  IonIcon, IonButton, IonButtons, IonToolbar, IonInput, IonCheckbox},
	emits: ['closeOption', 'updateData', 'downloadData', 'changeLanguage'],
	setup() {
		const config = ref({})
		const apiBaseUrl = ref('');
		const autoScroll = ref(false);
		const body = document.body;
		return {
			chevronBack,
			languageOutline,
			serverOutline,
			cloudDownloadOutline,
			reloadOutline,
			starHalfOutline,
			trashOutline,
			colorPaletteOutline,
			returnDownForwardOutline,
			config,
			apiBaseUrl,
			body,
			autoScroll
		}
	},
	async mounted() {
		this.config = await localforage.getItem('config');
		this.apiBaseUrl = this.config.apiBaseUrl;
		this.autoScroll = this.config.autoScroll;
	},
	methods: {
		closeOption() {
			this.$emit('closeOption');
		},
		async updateApiUrl(){
			await localforage.setItem('config', JSON.parse(JSON.stringify(this.config)));
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
		async updateData(){
			const loading = await loadingController.create({ message: '正在更新資料<br><span id="loading-progress"><span>'});
			try{
				let res;
				loading.present();
				if (this.config.fetchMethod == 'self'){
					res = await fetchApiData(this.config.apiBaseUrl);
				} else {
					res = await fetchApiData();
				}
				if (res && !(res instanceof Error)){
					loading.dismiss();
					location.reload();
				} else {
					throw new Error(res.message);
				}
			} catch(err) {
				loading.dismiss();
				presentToast('error', '網絡出錯，請檢查資料來源url 和網絡');
			}
		},
		async downloadData(){
			const loading = await loadingController.create({
				message: '正在重新下載資料<br><span id="loading-progress"><span>',
			});
			loading.present();
			let keys = await localforage.keys();
			for (let key of keys){
				if (key !== 'config' && key != 'starred'){
					await localforage.removeItem(key);
				}
			}
			if (this.config.fetchMethod == 'self'){
				await fetchApiData(this.config.apiBaseUrl);
			} else {
				await fetchApiData();
			}
			loading.dismiss();
			location.reload();
		},
		async presentLangAction(){
			const langActions = [{
				text: '正體中文',
				data: { action: 'zh' }
			},
				{
					text: 'English',
					data: { action: 'en' }
				}];
			const langSheet = await actionSheetController.create({
				header: '請選擇語言 / Select Language ',
				buttons: langActions
			});
			await langSheet.present();
			const res = await langSheet.onDidDismiss();
			if (res.data){
				if (this.config.lang != res.data.action){
					this.config.lang = res.data.action
					this.$i18next.changeLanguage(this.config.lang);
					await localforage.setItem('config', JSON.parse(JSON.stringify(this.config)));
				}
			}
		},
		async presentSourceAction(){
			const sourceActions = [{
				text: '預設',
				data: { action: 'default' }
			},
				{
					text: '來自gov.hk',
					data: {action: 'hkgov'}
				},
				{
					text: '自行搭建來源',
					data: {action: 'self'}
				}];
			const sourceSheet = await actionSheetController.create({
				header: '請選擇資料來源',
				buttons: sourceActions
			});
			await sourceSheet.present();
			const res = await sourceSheet.onDidDismiss();
			if (res.data && this.config.fetchMethod != res.data.action){
				this.config.fetchMethod = res.data.action;
				await localforage.setItem('config', JSON.parse(JSON.stringify(this.config)));
				await presentToast('info', '請按管理資料 > 重新下載路線資料 以反映設定')
			}
		},
		async presentThemeAction(){
			const themeActions = [{
				text: '系統預設',
				data: { action: 'system' }
			},
				{
					text: '亮色',
					data: {action: 'light'}
				},
				{
					text: '暗色',
					data: {action: 'dark'}
				}];
			const themeSheet = await actionSheetController.create({
				header: '請選擇資料來源',
				buttons: themeActions
			});
			await themeSheet.present();
			const res = await themeSheet.onDidDismiss();
			if (res.data){
				this.config.theme = res.data.action;
				await localforage.setItem('config', JSON.parse(JSON.stringify(this.config)));
				if (res.data.action == 'dark'){
					this.body.classList.toggle('dark', true);
				} else if (res.data.action == 'light') {
					this.body.classList.toggle('dark', false);
				} else if (window.matchMedia("(prefers-color-scheme: dark)").matches){
					this.body.classList.toggle('dark', true);
				} else {
					this.body.classList.toggle('dark', false);
				}
			}
		},
	},
	watch:{
		async apiBaseUrl(){
			this.config = {
				...this.config,
				apiBaseUrl: this.apiBaseUrl
			}
			await localforage.setItem('config', JSON.parse(JSON.stringify(this.config)));	
		},
		async autoScroll(){
			this.config = {
				...this.config,
				autoScroll: this.autoScroll
			}
			await localforage.setItem('config', JSON.parse(JSON.stringify(this.config)));	
		}
	}
};
</script>
<style></style>
